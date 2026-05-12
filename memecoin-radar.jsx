import { useState, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #050508; --bg2: #0a0a10; --bg3: #0f0f18;
    --border: rgba(255,255,255,0.07);
    --green: #00ff88; --green-dim: rgba(0,255,136,0.12);
    --amber: #ffb800; --amber-dim: rgba(255,184,0,0.10);
    --red: #ff3c5a; --red-dim: rgba(255,60,90,0.10);
    --blue: #4d9fff;
    --text: #e8e8f0; --muted: rgba(232,232,240,0.42);
    --mono: 'Space Mono', monospace;
    --sans: 'Syne', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--mono); }
  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,255,136,0.035) 0%, transparent 70%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.012) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.012) 40px);
    padding-bottom: 80px;
  }
  .header {
    border-bottom: 1px solid var(--border);
    padding: 18px 32px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(5,5,8,0.95);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100;
  }
  .logo { font-family: var(--sans); font-weight: 800; font-size: 20px; display: flex; align-items: center; gap: 10px; }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 12px var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  .logo-accent { color: var(--green); }
  .header-tag { font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .search-section { max-width: 780px; margin: 48px auto 0; padding: 0 24px; }
  .search-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .search-row { display: flex; gap: 8px; }
  .chain-select {
    background: var(--bg3); border: 1px solid var(--border);
    color: var(--text); font-family: var(--mono); font-size: 12px;
    padding: 0 14px; border-radius: 8px; cursor: pointer; outline: none;
    min-width: 110px; transition: border-color .2s;
  }
  .chain-select:hover,.chain-select:focus { border-color: var(--green); }
  .chain-select option { background: #111; }
  .search-input {
    flex: 1; background: var(--bg3); border: 1px solid var(--border);
    color: var(--text); font-family: var(--mono); font-size: 12px;
    padding: 14px 16px; border-radius: 8px; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .search-input::placeholder { color: var(--muted); }
  .search-input:focus { border-color: var(--green); box-shadow: 0 0 20px rgba(0,255,136,0.07); }
  .search-btn {
    background: var(--green); color: #000; border: none;
    font-family: var(--mono); font-weight: 700; font-size: 12px;
    padding: 0 22px; border-radius: 8px; cursor: pointer;
    letter-spacing: 1px; transition: all .2s; white-space: nowrap;
  }
  .search-btn:hover { background: #00e07a; transform: translateY(-1px); }
  .search-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .example-row { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .ex-label { font-size: 11px; color: var(--muted); }
  .ex-chip {
    font-size: 10px; padding: 3px 10px; border-radius: 20px;
    border: 1px solid var(--border); color: var(--muted);
    cursor: pointer; font-family: var(--mono); background: transparent;
    transition: all .15s; letter-spacing: .3px;
  }
  .ex-chip:hover { border-color: var(--green); color: var(--green); }
  .loading-wrap { text-align: center; padding: 70px 20px; }
  .ld-grid { display: inline-grid; grid-template-columns: repeat(4,8px); gap: 4px; margin-bottom: 18px; }
  .ld-cell { width: 8px; height: 8px; border-radius: 2px; background: var(--green); animation: blink 1.2s infinite; }
  .ld-cell:nth-child(2){animation-delay:.1s} .ld-cell:nth-child(3){animation-delay:.2s}
  .ld-cell:nth-child(4){animation-delay:.3s} .ld-cell:nth-child(5){animation-delay:.4s}
  .ld-cell:nth-child(6){animation-delay:.5s} .ld-cell:nth-child(7){animation-delay:.6s}
  .ld-cell:nth-child(8){animation-delay:.7s}
  @keyframes blink { 0%,100%{opacity:.15} 50%{opacity:1} }
  .ld-text { font-size: 11px; color: var(--muted); letter-spacing: 2px; }
  .ld-step { font-size: 11px; color: var(--muted); margin-top: 10px; }
  .ld-step.active { color: var(--amber); }
  .ld-step.done { color: var(--green); }
  .err-box { max-width:600px; margin:40px auto; padding:18px 24px; border:1px solid var(--red); border-radius:10px; background:var(--red-dim); font-size:12px; color:var(--red); text-align:center; line-height:1.7; }
  .dash { max-width: 1080px; margin: 36px auto 0; padding: 0 24px; display: flex; flex-direction: column; gap: 18px; }
  .hero {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 14px; padding: 28px 30px;
    display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: start;
    position: relative; overflow: hidden;
  }
  .hero::before { content:''; position:absolute; top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,var(--green),transparent); opacity:.5; }
  .hero-sym { font-family:var(--sans); font-weight:800; font-size:30px; letter-spacing:-1px; }
  .hero-name { font-size:13px; color:var(--muted); margin-left:6px; }
  .hero-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:6px; }
  .chain-pill { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; padding:3px 9px; border-radius:20px; border:1px solid; font-weight:700; }
  .pill-sol { border-color:rgba(153,69,255,.5); color:#9945ff; background:rgba(153,69,255,.1); }
  .pill-bsc { border-color:rgba(255,184,0,.5); color:var(--amber); background:var(--amber-dim); }
  .hero-addr { font-size:10px; color:var(--muted); word-break:break-all; margin-top:6px; }
  .hero-dex { font-size:11px; color:var(--muted); margin-top:4px; }
  .price-block { text-align:right; }
  .price-main { font-family:var(--sans); font-size:34px; font-weight:700; letter-spacing:-1px; line-height:1; }
  .price-chg { font-size:14px; font-weight:700; margin-top:6px; display:flex; align-items:center; justify-content:flex-end; gap:4px; }
  .up{color:var(--green)} .down{color:var(--red)} .neutral{color:var(--muted)}
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  @media(max-width:680px){.stats-row{grid-template-columns:repeat(2,1fr)}}
  .stat { background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:16px 18px; transition:border-color .2s; }
  .stat:hover { border-color:rgba(255,255,255,.14); }
  .stat-lbl { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:7px; }
  .stat-val { font-family:var(--sans); font-size:20px; font-weight:700; letter-spacing:-.5px; }
  .stat-sub { font-size:11px; color:var(--muted); margin-top:3px; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  @media(max-width:680px){.two-col{grid-template-columns:1fr}}
  .card { background:var(--bg2); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .card-head { padding:14px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .card-title { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; font-weight:700; display:flex; align-items:center; gap:8px; }
  .card-dot { width:6px; height:6px; border-radius:50%; }
  .card-src { font-size:10px; color:var(--muted); letter-spacing:1px; }
  .card-body { padding:20px 22px; }
  .score-row { display:flex; align-items:center; gap:16px; margin-bottom:16px; }
  .score-circle { width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--sans); font-size:20px; font-weight:800; flex-shrink:0; border:2px solid; }
  .sc-safe{border-color:var(--green);color:var(--green);background:var(--green-dim)}
  .sc-warn{border-color:var(--amber);color:var(--amber);background:var(--amber-dim)}
  .sc-danger{border-color:var(--red);color:var(--red);background:var(--red-dim)}
  .sc-uk{border-color:var(--muted);color:var(--muted);background:rgba(255,255,255,.03)}
  .score-label { font-size:13px; font-weight:700; }
  .score-sub { font-size:11px; color:var(--muted); margin-top:2px; }
  .sec-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
  .sec-item { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-radius:7px; border:1px solid var(--border); background:var(--bg3); font-size:11px; }
  .sec-lbl { color:var(--muted); }
  .badge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:4px; letter-spacing:.5px; }
  .b-safe{background:var(--green-dim);color:var(--green)}
  .b-danger{background:var(--red-dim);color:var(--red)}
  .b-warn{background:var(--amber-dim);color:var(--amber)}
  .b-uk{background:rgba(255,255,255,.05);color:var(--muted)}
  .info-row { display:flex; flex-direction:column; gap:8px; }
  .info-item { display:flex; justify-content:space-between; align-items:center; padding:9px 12px; border-radius:7px; border:1px solid var(--border); background:var(--bg3); font-size:12px; }
  .info-lbl { font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
  .info-val { font-weight:700; }
  .links-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
  .ext-link { display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:8px; border:1px solid var(--border); background:var(--bg3); text-decoration:none; color:var(--text); transition:all .15s; }
  .ext-link:hover { border-color:rgba(255,255,255,.18); background:rgba(255,255,255,.04); transform:translateY(-1px); }
  .ext-link-nm { font-size:11px; font-weight:700; }
  .ext-link-cat { font-size:10px; color:var(--muted); }
  .sources-note { font-size:10px; color:var(--muted); text-align:center; letter-spacing:1px; padding-top:4px; }
  .empty { max-width:580px; margin:80px auto 0; text-align:center; padding:0 24px; }
  .empty-title { font-family:var(--sans); font-size:18px; font-weight:700; color:var(--muted); margin-bottom:10px; }
  .empty-sub { font-size:11px; color:var(--muted); line-height:1.8; }
  .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:30px; text-align:left; }
  .feat { padding:14px 16px; border:1px solid var(--border); border-radius:10px; background:var(--bg2); }
  .feat-title { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .feat-dot { width:5px; height:5px; border-radius:50%; }
  .feat-list { font-size:10px; color:var(--muted); line-height:2; }
`;

function fmt(n) {
  if (n == null || n === "" || isNaN(Number(n))) return "—";
  const v = Number(n);
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return "$" + (v / 1e3).toFixed(2) + "K";
  if (v < 0.000001) return "$" + v.toExponential(3);
  if (v < 0.01) return "$" + v.toFixed(8);
  return "$" + v.toFixed(4);
}
function fmtPct(n) {
  if (n == null || n === "" || isNaN(Number(n))) return "—";
  const v = Number(n);
  return (v > 0 ? "+" : "") + v.toFixed(2) + "%";
}
function fmtNum(n) {
  if (n == null || n === "") return "—";
  const v = Number(n);
  if (isNaN(v)) return String(n);
  if (v >= 1e12) return (v / 1e12).toFixed(2) + "T";
  if (v >= 1e9)  return (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6)  return (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3)  return (v / 1e3).toFixed(2) + "K";
  return v.toLocaleString();
}
function detectChain(addr, hint) {
  if (hint && hint !== "auto") return hint;
  return addr.startsWith("0x") ? "bsc" : "solana";
}
function getLinks(addr, chain) {
  const s = chain === "solana";
  return [
    { name: "RugCheck",      cat: "Rug check",         icon: "🔍", href: `https://rugcheck.xyz/tokens/${addr}` },
    { name: "Bubblemaps",    cat: "Whale distribution", icon: "🫧", href: `https://app.bubblemaps.io/${s?"sol":"bsc"}/token/${addr}` },
    { name: "DEXScreener",   cat: "Price & chart",      icon: "📊", href: `https://dexscreener.com/search?q=${addr}` },
    { name: "GeckoTerminal", cat: "On-chain data",      icon: "🦎", href: `https://www.geckoterminal.com/${s?"solana":"bsc"}/pools/${addr}` },
    { name: "Birdeye",       cat: "Token analytics",    icon: "🦅", href: `https://birdeye.so/token/${addr}${s?"?chain=solana":"?chain=bsc"}` },
    { name: "GMGN",          cat: "Sniper analytics",   icon: "🎯", href: `https://gmgn.ai/${s?"sol":"bsc"}/token/${addr}` },
  ];
}

const SYSTEM_PROMPT = `You are a crypto data assistant. When given a token contract address and chain, search the web for its current data from DEXScreener, GeckoTerminal, and GoPlus Security.

Return ONLY a valid JSON object — no markdown, no explanation, no backticks. Schema:

{
  "name": "string or null",
  "symbol": "string or null",
  "chain": "solana or bsc",
  "price_usd": "numeric string or null",
  "change_1h": "numeric string or null",
  "change_6h": "numeric string or null",
  "change_24h": "numeric string or null",
  "liquidity_usd": "numeric string or null",
  "volume_24h": "numeric string or null",
  "market_cap": "numeric string or null",
  "fdv": "numeric string or null",
  "total_supply": "numeric string or null",
  "circulating_supply": "numeric string or null",
  "holder_count": "numeric string or null",
  "dex_name": "string or null",
  "description": "1-sentence description or null",
  "security": {
    "is_honeypot": "0 or 1 or unknown",
    "is_open_source": "0 or 1 or unknown",
    "is_mintable": "0 or 1 or unknown",
    "ownership_renounced": "0 or 1 or unknown",
    "hidden_owner": "0 or 1 or unknown",
    "buy_tax": "numeric string or null",
    "sell_tax": "numeric string or null",
    "transfer_pausable": "0 or 1 or unknown",
    "score": "integer 0-100"
  },
  "top_pairs": [
    { "dex": "string", "pair": "string", "price": "numeric string", "liquidity": "numeric string", "volume_24h": "numeric string", "change_24h": "numeric string" }
  ],
  "data_sources": ["array of source names used"]
}`;

async function fetchTokenData(addr, chain, onStep) {
  onStep("🔍 Searching the web for token data...", "active");
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Token address: ${addr}\nChain: ${chain}\n\nSearch DEXScreener, GeckoTerminal, and GoPlus Security for this token's live data. Return only the JSON object.`
      }]
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${resp.status}`);
  }
  onStep("📊 Parsing results...", "active");
  const data = await resp.json();
  const textBlocks = (data.content || []).filter(b => b.type === "text");
  const raw = textBlocks.map(b => b.text).join("");
  const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = clean.indexOf("{");
  const end   = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Could not parse response. Check the token address and chain.");
  return JSON.parse(clean.slice(start, end + 1));
}

function SecBadge({ val, danger = false }) {
  if (val === "1" || val === 1) return <span className={`badge ${danger ? "b-danger" : "b-safe"}`}>{danger ? "YES ⚠" : "YES ✓"}</span>;
  if (val === "0" || val === 0) return <span className={`badge ${danger ? "b-safe" : "b-danger"}`}>{danger ? "NO ✓" : "NO"}</span>;
  return <span className="badge b-uk">—</span>;
}
function TaxBadge({ val }) {
  if (val == null || val === "") return <span className="badge b-uk">—</span>;
  const v = parseFloat(val);
  if (isNaN(v)) return <span className="badge b-uk">—</span>;
  return <span className={`badge ${v > 10 ? "b-danger" : v > 5 ? "b-warn" : "b-safe"}`}>{v.toFixed(1)}%</span>;
}

export default function App() {
  const [input,   setInput]   = useState("");
  const [chain,   setChain]   = useState("auto");
  const [loading, setLoading] = useState(false);
  const [stepMsg, setStepMsg] = useState("");
  const [stepCls, setStepCls] = useState("");
  const [error,   setError]   = useState(null);
  const [result,  setResult]  = useState(null);

  const EXAMPLES = [
    { label: "BONK (SOL)", addr: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", chain: "solana" },
    { label: "WIF (SOL)",  addr: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", chain: "solana" },
    { label: "FLOKI (BSC)",addr: "0xfb5b838b6cfeedc2873ab27866079ac55363d37E", chain: "bsc" },
  ];

  const onStep = (msg, cls) => { setStepMsg(msg); setStepCls(cls); };

  const doSearch = useCallback(async (address, chainHint) => {
    const addr = (address || input).trim();
    if (!addr) return;
    const ch = detectChain(addr, chainHint || chain);
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await fetchTokenData(addr, ch, onStep);
      onStep("✓ Done", "done");
      setResult({ ...data, _addr: addr, _chain: ch });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [input, chain]);

  const r = result;
  const change24   = r ? parseFloat(r.change_24h) : null;
  const scoreNum   = r?.security?.score != null ? parseInt(r.security.score) : null;
  const scoreLevel = scoreNum == null ? "uk" : scoreNum >= 70 ? "safe" : scoreNum >= 40 ? "warn" : "danger";
  const scoreTxt   = { safe: "SAFE", warn: "CAUTION", danger: "DANGEROUS", uk: "—" }[scoreLevel];
  const scoreColor = { safe: "var(--green)", warn: "var(--amber)", danger: "var(--red)", uk: "var(--muted)" }[scoreLevel];
  const links      = r ? getLinks(r._addr, r._chain) : [];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <header className="header">
          <div className="logo">
            <div className="logo-dot" />
            MEME<span className="logo-accent">RADAR</span>
          </div>
          <span className="header-tag">Solana · BSC · Real-time</span>
        </header>

        <div className="search-section">
          <div className="search-label">Token contract address</div>
          <div className="search-row">
            <select className="chain-select" value={chain} onChange={e => setChain(e.target.value)}>
              <option value="auto">🔎 Auto-detect</option>
              <option value="solana">◎ Solana</option>
              <option value="bsc">⬡ BSC</option>
            </select>
            <input className="search-input"
              placeholder="Paste token contract address..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doSearch()}
            />
            <button className="search-btn" disabled={loading || !input.trim()} onClick={() => doSearch()}>
              {loading ? "●●●" : "SCAN →"}
            </button>
          </div>
          <div className="example-row">
            <span className="ex-label">Examples:</span>
            {EXAMPLES.map(ex => (
              <button key={ex.label} className="ex-chip"
                onClick={() => { setInput(ex.addr); setChain(ex.chain); doSearch(ex.addr, ex.chain); }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="loading-wrap">
            <div className="ld-grid">{Array.from({length:8}).map((_,i)=><div key={i} className="ld-cell"/>)}</div>
            <div className="ld-text">FETCHING DATA</div>
            <div className={`ld-step ${stepCls}`}>{stepMsg}</div>
          </div>
        )}

        {error && !loading && <div className="err-box">⚠ {error}</div>}

        {!loading && !error && !r && (
          <div className="empty">
            <div className="empty-title">Paste a token address to analyze</div>
            <div className="empty-sub">Aggregates DEXScreener · GeckoTerminal · GoPlus Security<br/>into a single dashboard in seconds.</div>
            <div className="feat-grid">
              {[
                { color:"#00ff88", title:"Price & Market", items:["Live price","24h volume","Liquidity","FDV / Mcap"] },
                { color:"#ff3c5a", title:"Security",       items:["Honeypot check","Mint authority","Tax rates","Ownership"] },
                { color:"#4d9fff", title:"On-chain",       items:["Top pairs","Holder count","Supply info","DEX list"] },
              ].map(f => (
                <div key={f.title} className="feat">
                  <div className="feat-title"><div className="feat-dot" style={{background:f.color}}/>{f.title}</div>
                  <div className="feat-list">{f.items.map(i=><div key={i}>{i}</div>)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {r && !loading && (
          <div className="dash">

            <div className="hero">
              <div>
                <div className="hero-row">
                  <span className="hero-sym">{r.symbol || "???"}</span>
                  <span className="hero-name">{r.name || ""}</span>
                  <span className={`chain-pill ${r._chain==="solana"?"pill-sol":"pill-bsc"}`}>
                    {r._chain === "solana" ? "SOLANA" : "BSC"}
                  </span>
                </div>
                {r.description && <div style={{fontSize:11,color:"var(--muted)",marginTop:4,maxWidth:520,lineHeight:1.6}}>{r.description}</div>}
                <div className="hero-addr">{r._addr}</div>
                {r.dex_name && <div className="hero-dex">via {r.dex_name}</div>}
              </div>
              <div className="price-block">
                <div className="price-main" style={{color:change24>0?"var(--green)":change24<0?"var(--red)":"var(--text)"}}>
                  {fmt(r.price_usd)}
                </div>
                {r.change_24h != null && (
                  <div className={`price-chg ${change24>0?"up":change24<0?"down":"neutral"}`}>
                    {change24>0?"▲":change24<0?"▼":"—"} {fmtPct(r.change_24h)}
                    <span style={{fontWeight:400,fontSize:11}}>(24h)</span>
                  </div>
                )}
                <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:6}}>
                  {r.change_1h!=null && <span style={{fontSize:10,color:"var(--muted)"}}>1h: <span style={{color:parseFloat(r.change_1h)>=0?"var(--green)":"var(--red)"}}>{fmtPct(r.change_1h)}</span></span>}
                  {r.change_6h!=null && <span style={{fontSize:10,color:"var(--muted)"}}>6h: <span style={{color:parseFloat(r.change_6h)>=0?"var(--green)":"var(--red)"}}>{fmtPct(r.change_6h)}</span></span>}
                </div>
              </div>
            </div>

            <div className="stats-row">
              {[
                { lbl:"Liquidity",   val:fmt(r.liquidity_usd), sub:null },
                { lbl:"Volume 24h",  val:fmt(r.volume_24h),    sub:null },
                { lbl:"FDV",         val:fmt(r.fdv),           sub:null },
                { lbl:"Market Cap",  val:fmt(r.market_cap),    sub:r.holder_count?fmtNum(r.holder_count)+" holders":null },
              ].map(s=>(
                <div key={s.lbl} className="stat">
                  <div className="stat-lbl">{s.lbl}</div>
                  <div className="stat-val">{s.val}</div>
                  {s.sub && <div className="stat-sub">{s.sub}</div>}
                </div>
              ))}
            </div>

            <div className="two-col">
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><div className="card-dot" style={{background:scoreColor}}/>Security Analysis</div>
                  <span className="card-src">GoPlus</span>
                </div>
                <div className="card-body">
                  {r.security ? (
                    <>
                      <div className="score-row">
                        <div className={`score-circle sc-${scoreLevel}`}>{scoreNum ?? "?"}</div>
                        <div>
                          <div className="score-label" style={{color:scoreColor}}>{scoreTxt}</div>
                          <div className="score-sub">out of 100</div>
                        </div>
                      </div>
                      <div className="sec-grid">
                        <div className="sec-item"><span className="sec-lbl">Honeypot</span><SecBadge val={r.security.is_honeypot} danger/></div>
                        <div className="sec-item"><span className="sec-lbl">Open Source</span><SecBadge val={r.security.is_open_source}/></div>
                        <div className="sec-item"><span className="sec-lbl">Mintable</span><SecBadge val={r.security.is_mintable} danger/></div>
                        <div className="sec-item"><span className="sec-lbl">Ownership Renounced</span><SecBadge val={r.security.ownership_renounced}/></div>
                        <div className="sec-item"><span className="sec-lbl">Hidden Owner</span><SecBadge val={r.security.hidden_owner} danger/></div>
                        <div className="sec-item"><span className="sec-lbl">Transfer Pausable</span><SecBadge val={r.security.transfer_pausable} danger/></div>
                        <div className="sec-item"><span className="sec-lbl">Buy Tax</span><TaxBadge val={r.security.buy_tax}/></div>
                        <div className="sec-item"><span className="sec-lbl">Sell Tax</span><TaxBadge val={r.security.sell_tax}/></div>
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",padding:"20px 0"}}>Security data unavailable</div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div className="card-title"><div className="card-dot" style={{background:"var(--blue)"}}/>On-Chain Data</div>
                  <span className="card-src">GeckoTerminal</span>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    {[
                      { lbl:"Total Supply",       val: fmtNum(r.total_supply) },
                      { lbl:"Circulating Supply", val: fmtNum(r.circulating_supply) },
                      { lbl:"Holder Count",        val: r.holder_count ? parseInt(r.holder_count).toLocaleString() : "—" },
                      { lbl:"Market Cap",          val: fmt(r.market_cap) },
                      { lbl:"FDV",                 val: fmt(r.fdv) },
                      { lbl:"Vol / Liquidity",     val: (r.volume_24h && r.liquidity_usd && parseFloat(r.liquidity_usd)>0)
                          ? (parseFloat(r.volume_24h)/parseFloat(r.liquidity_usd)).toFixed(2)+"x" : "—" },
                    ].map(item=>(
                      <div key={item.lbl} className="info-item">
                        <span className="info-lbl">{item.lbl}</span>
                        <span className="info-val">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {r.top_pairs?.length > 0 && (
              <div className="card">
                <div className="card-head">
                  <div className="card-title"><div className="card-dot" style={{background:"var(--amber)"}}/>DEX Pairs</div>
                  <span className="card-src">DEXScreener</span>
                </div>
                <div className="card-body" style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr>{["Pair","DEX","Price","Volume 24h","Liquidity","Change"].map(h=>(
                        <th key={h} style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",padding:"0 0 12px",textAlign:h==="Change"?"right":"left",fontWeight:400}}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {r.top_pairs.map((p,i)=>{
                        const ch = parseFloat(p.change_24h);
                        return (
                          <tr key={i}>
                            <td style={{padding:"8px 0",fontSize:12,borderTop:"1px solid var(--border)",fontWeight:700}}>{p.pair||"—"}</td>
                            <td style={{padding:"8px 0",fontSize:10,borderTop:"1px solid var(--border)",color:"var(--muted)"}}>{p.dex||"—"}</td>
                            <td style={{padding:"8px 0",fontSize:12,borderTop:"1px solid var(--border)"}}>{p.price?fmt(p.price):"—"}</td>
                            <td style={{padding:"8px 0",fontSize:12,borderTop:"1px solid var(--border)"}}>{fmt(p.volume_24h)}</td>
                            <td style={{padding:"8px 0",fontSize:12,borderTop:"1px solid var(--border)"}}>{fmt(p.liquidity)}</td>
                            <td style={{padding:"8px 0",fontSize:12,borderTop:"1px solid var(--border)",textAlign:"right",color:ch>0?"var(--green)":ch<0?"var(--red)":"var(--muted)"}}>{fmtPct(p.change_24h)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-head">
                <div className="card-title"><div className="card-dot" style={{background:"var(--muted)"}}/>Deep Analysis Tools</div>
              </div>
              <div className="card-body">
                <div className="links-grid">
                  {links.map(l=>(
                    <a key={l.name} className="ext-link" href={l.href} target="_blank" rel="noopener noreferrer">
                      <span style={{fontSize:16}}>{l.icon}</span>
                      <div><div className="ext-link-nm">{l.name}</div><div className="ext-link-cat">{l.cat}</div></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {r.data_sources?.length > 0 && (
              <div className="sources-note">Sources: {r.data_sources.join(" · ")}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
