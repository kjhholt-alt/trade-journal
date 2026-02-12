from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
import io
import os
from datetime import datetime
from typing import Optional

from models import Trade, init_db, get_db

app = FastAPI(title="TradeJournal API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        os.environ.get("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "trade-journal-api"}


@app.post("/trades/upload")
async def upload_trades(
    file: UploadFile = File(...),
    broker: Optional[str] = "auto",
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    # Column mapping based on broker
    column_maps = {
        "td_ameritrade": {
            "Symbol": "ticker",
            "Buy/Sell": "side",
            "Price": "entry_price",
            "Quantity": "quantity",
            "Date/Time": "entry_time",
            "Net Amount": "pnl",
            "Commission": "fees",
        },
        "robinhood": {
            "Instrument": "ticker",
            "Side": "side",
            "Average Price": "entry_price",
            "Quantity": "quantity",
            "Date": "entry_time",
            "Total P&L": "pnl",
            "Fees": "fees",
        },
    }

    if broker and broker in column_maps:
        mapping = column_maps[broker]
        existing_cols = {k: v for k, v in mapping.items() if k in df.columns}
        df = df.rename(columns=existing_cols)

    # Normalize column names to lowercase
    df.columns = [c.lower().strip().replace(" ", "_") for c in df.columns]

    # Required columns
    required = ["ticker"]
    for col in required:
        if col not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required column: {col}. Available: {list(df.columns)}",
            )

    trades_added = 0
    for _, row in df.iterrows():
        try:
            entry_time = datetime.utcnow()
            if "entry_time" in row and pd.notna(row.get("entry_time")):
                try:
                    entry_time = pd.to_datetime(str(row["entry_time"]))
                except (ValueError, TypeError):
                    pass

            exit_time = None
            if "exit_time" in row and pd.notna(row.get("exit_time")):
                try:
                    exit_time = pd.to_datetime(str(row["exit_time"]))
                except (ValueError, TypeError):
                    pass

            side_val = str(row.get("side", "long")).lower().strip()
            if side_val in ("buy", "b"):
                side_val = "long"
            elif side_val in ("sell", "s"):
                side_val = "short"

            trade = Trade(
                ticker=str(row.get("ticker", "")).upper().strip(),
                side=side_val if side_val in ("long", "short") else "long",
                entry_price=float(row.get("entry_price", 0) or 0),
                exit_price=float(row.get("exit_price", 0) or 0) if "exit_price" in row else None,
                quantity=int(float(row.get("quantity", 0) or 0)),
                entry_time=entry_time,
                exit_time=exit_time,
                pnl=float(row.get("pnl", 0) or 0) if "pnl" in row else None,
                fees=float(row.get("fees", 0) or 0) if "fees" in row else 0.0,
                notes=str(row.get("notes", "")) if "notes" in row else None,
            )
            db.add(trade)
            trades_added += 1
        except (ValueError, TypeError):
            continue

    db.commit()
    return {"success": True, "trades_count": trades_added}


@app.get("/trades/analysis")
def get_analysis(db: Session = Depends(get_db)):
    trades = db.query(Trade).all()

    if not trades:
        return {
            "total_trades": 0,
            "win_rate": 0,
            "total_pnl": 0,
            "avg_rr": 0,
            "by_ticker": [],
            "by_hour": [],
            "by_day_of_week": [],
        }

    trade_list = [t.to_dict() for t in trades]
    wins = [t for t in trade_list if (t["pnl"] or 0) > 0]
    losses = [t for t in trade_list if (t["pnl"] or 0) <= 0]

    total_pnl = sum(t["pnl"] or 0 for t in trade_list)
    win_rate = (len(wins) / len(trade_list)) * 100 if trade_list else 0

    avg_win = sum(t["pnl"] or 0 for t in wins) / len(wins) if wins else 0
    avg_loss = abs(sum(t["pnl"] or 0 for t in losses) / len(losses)) if losses else 0
    avg_rr = round(avg_win / avg_loss, 2) if avg_loss > 0 else 0

    # Group by ticker
    by_ticker: dict[str, dict] = {}
    for t in trade_list:
        ticker = t["ticker"]
        if ticker not in by_ticker:
            by_ticker[ticker] = {"wins": 0, "total": 0, "pnl": 0}
        by_ticker[ticker]["total"] += 1
        by_ticker[ticker]["pnl"] += t["pnl"] or 0
        if (t["pnl"] or 0) > 0:
            by_ticker[ticker]["wins"] += 1

    ticker_stats = [
        {
            "ticker": k,
            "win_rate": round((v["wins"] / v["total"]) * 100, 1),
            "total_pnl": round(v["pnl"], 2),
            "trades": v["total"],
        }
        for k, v in by_ticker.items()
    ]

    # Group by hour
    by_hour: dict[int, dict] = {}
    for t in trade_list:
        if t["entry_time"]:
            try:
                hour = datetime.fromisoformat(t["entry_time"]).hour
            except (ValueError, TypeError):
                continue
            if hour not in by_hour:
                by_hour[hour] = {"pnl": 0, "count": 0}
            by_hour[hour]["pnl"] += t["pnl"] or 0
            by_hour[hour]["count"] += 1

    hour_stats = [
        {"hour": h, "pnl": round(v["pnl"], 2), "trades": v["count"]}
        for h, v in sorted(by_hour.items())
    ]

    # Group by day of week
    by_dow: dict[int, dict] = {}
    for t in trade_list:
        if t["entry_time"]:
            try:
                dow = datetime.fromisoformat(t["entry_time"]).weekday()
            except (ValueError, TypeError):
                continue
            if dow not in by_dow:
                by_dow[dow] = {"pnl": 0, "count": 0}
            by_dow[dow]["pnl"] += t["pnl"] or 0
            by_dow[dow]["count"] += 1

    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    dow_stats = [
        {"day": day_names[d], "pnl": round(v["pnl"], 2), "trades": v["count"]}
        for d, v in sorted(by_dow.items())
    ]

    return {
        "total_trades": len(trade_list),
        "win_rate": round(win_rate, 1),
        "total_pnl": round(total_pnl, 2),
        "avg_rr": avg_rr,
        "by_ticker": ticker_stats,
        "by_hour": hour_stats,
        "by_day_of_week": dow_stats,
    }


@app.post("/ai/review")
def ai_review(db: Session = Depends(get_db)):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured",
        )

    trades = db.query(Trade).order_by(Trade.entry_time.desc()).limit(30).all()

    if not trades:
        raise HTTPException(status_code=400, detail="No trades found. Upload trades first.")

    trade_summary = []
    for t in trades:
        trade_summary.append(
            f"- {t.ticker} {t.side} | Entry: ${t.entry_price:.2f} Exit: ${t.exit_price:.2f if t.exit_price else 0:.2f} "
            f"| Qty: {t.quantity} | P&L: ${t.pnl:.2f if t.pnl else 0:.2f} | {t.notes or 'No notes'}"
        )

    prompt = f"""You are an expert trading coach. Analyze the following 30 most recent trades and provide structured feedback.

Trades:
{chr(10).join(trade_summary)}

Provide your analysis in the following JSON format (return ONLY valid JSON, no markdown):
{{
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3", "weakness 4"],
  "patterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"]
}}

Be specific. Reference actual tickers, times, and patterns you see in the data. Each item should be a complete, actionable sentence."""

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )

        import json

        content = message.content[0].text
        # Try to parse the JSON response
        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON from the response
            start = content.find("{")
            end = content.rfind("}") + 1
            if start != -1 and end > start:
                result = json.loads(content[start:end])
            else:
                raise HTTPException(status_code=500, detail="AI returned invalid format")

        return result

    except ImportError:
        raise HTTPException(status_code=500, detail="anthropic package not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
