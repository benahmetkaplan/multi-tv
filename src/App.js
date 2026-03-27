import { useState, useEffect, useRef } from "react";

const DEFAULT_STREAMS = [
  { slug: "pqq5c6k70kk", title: "NTV" },
  { slug: "6N8_r2uwLEc", title: "CNN Türk" },
  { slug: "ztmY_cCtUl0", title: "Sözcü TV" },
  { slug: "RNVNlJSUFoE", title: "Habertürk" },
  { slug: "8uNelFh0oz4", title: "Halk TV" },
  { slug: "EqoCJ8BPxtE", title: "Haber Global" }
];

const GRID_OPTIONS = [
  { count: 4, cols: 2, rows: 2, label: "2×2" },
  { count: 6, cols: 3, rows: 2, label: "3×2" },
  { count: 9, cols: 3, rows: 3, label: "3×3" },
  { count: 12, cols: 4, rows: 3, label: "4×3" },
];

function GridSVG({ cols, rows, size = 22 }) {
  const gap = 2.5;
  const cellW = (size - gap * (cols - 1)) / cols;
  const cellH = (size - gap * (rows - 1)) / rows;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        return <rect key={i} x={c*(cellW+gap)} y={r*(cellH+gap)} width={cellW} height={cellH} rx={1} fill="currentColor" />;
      })}
    </svg>
  );
}

function encodeState(streams, gridCount) {
  try {
    const d = { g: gridCount, s: streams.map(s => ({ k: s.slug, t: s.title })) };
    return btoa(unescape(encodeURIComponent(JSON.stringify(d))));
  } catch { return ""; }
}

function decodeState(enc) {
  try {
    const d = JSON.parse(decodeURIComponent(escape(atob(enc))));
    return { gridCount: d.g, streams: d.s.map(s => ({ slug: s.k, title: s.t })) };
  } catch { return null; }
}

export default function App() {
  const [gridOption, setGridOption] = useState(GRID_OPTIONS[1]);
  const [streams, setStreams] = useState(DEFAULT_STREAMS);
  const [showSettings, setShowSettings] = useState(false);
  const [editStreams, setEditStreams] = useState(() => DEFAULT_STREAMS.map(s => ({ ...s })));
  const [editGridCount, setEditGridCount] = useState(GRID_OPTIONS[1].count);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [activeTab, setActiveTab] = useState("streams");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cfg = params.get("cfg");
    if (cfg) {
      const decoded = decodeState(cfg);
      if (decoded) {
        const opt = GRID_OPTIONS.find(o => o.count === decoded.gridCount) || GRID_OPTIONS[0];
        setGridOption(opt);
        const padded = [...decoded.streams];
        while (padded.length < 12) padded.push({ slug: "", title: "" });
        setStreams(padded);
        setEditStreams(padded.map(s => ({ ...s })));
        setEditGridCount(decoded.gridCount);
      }
    }
  }, []);

  const activeStreams = streams.slice(0, gridOption.count);

  const openSettings = () => {
    const padded = [...streams];
    while (padded.length < 12) padded.push({ slug: "", title: "" });
    setEditStreams(padded);
    setEditGridCount(gridOption.count);
    setShareUrl("");
    setCopied(false);
    setActiveTab("streams");
    setShowSettings(true);
  };

  const handleSave = () => {
    const opt = GRID_OPTIONS.find(o => o.count === editGridCount) || GRID_OPTIONS[0];
    setGridOption(opt);
    setStreams(editStreams.map(s => ({ slug: s.slug.trim(), title: s.title.trim() })));
    setShowSettings(false);
    setFocusedIdx(null);
  };

  const handleShare = () => {
    const validStreams = editStreams.slice(0, editGridCount);
    const url = window.location.href.split("?")[0] + "?cfg=" + encodeState(validStreams, editGridCount);
    setShareUrl(url);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const updateField = (idx, field, val) => {
    const next = [...editStreams];
    next[idx] = { ...next[idx], [field]: val };
    setEditStreams(next);
  };

  return (
    <div style={{ height:"100vh", width:"100vw", background:"#07070d", color:"#e0e0ea", fontFamily:"'Inter',system-ui,sans-serif", display:"flex", flexDirection:"column", overflow:"hidden" }}>

      <header style={{ height:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", background:"rgba(8,8,14,0.97)", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0, zIndex:50, gap:12 }}>

        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ position:"relative", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#e53e1e", animation:"ripple 1.8s ease-out infinite" }} />
          </div>
          <span style={{ fontSize:13, fontWeight:700, letterSpacing:"-0.01em", color:"#fff" }}>MultiTV</span>
        </div>

        <div style={{ display:"flex", gap:3, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:3 }}>
          {GRID_OPTIONS.map(opt => {
            const active = gridOption.count === opt.count;
            return (
              <button key={opt.count} onClick={() => { setGridOption(opt); setFocusedIdx(null); }}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", background: active?"rgba(255,255,255,0.1)":"transparent", border:"none", borderRadius:6, color: active?"#fff":"#555", cursor:"pointer", fontSize:11.5, fontFamily:"inherit", fontWeight: active?600:400, transition:"all 0.13s" }}>
                <GridSVG cols={opt.cols} rows={opt.rows} size={18} />
                {opt.label}
              </button>
            );
          })}
        </div>

        <button onClick={openSettings}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, color:"#bbb", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:500, transition:"all 0.13s" }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="#bbb"; }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Ayarlar
        </button>
      </header>

      <main style={{ flex:1, minHeight:0, display:"grid", gridTemplateColumns:`repeat(${gridOption.cols},1fr)`, gap:3, padding:3 }}>
        {activeStreams.map((stream, idx) => (
          <div key={`${stream.slug}-${idx}`}
            onClick={() => setFocusedIdx(focusedIdx === idx ? null : idx)}
            style={{ position:"relative", background:"#0b0b13", borderRadius:7, overflow:"hidden", border: focusedIdx===idx ? "1.5px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.055)", transition:"border-color 0.15s", cursor:"pointer" }}>

            {stream.slug ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${stream.slug}?autoplay=1&mute=1`}
                style={{ width:"100%", height:"100%", border:"none", display:"block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen title={stream.title || `Stream ${idx+1}`}
              />
            ) : (
              <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, color:"#2a2a38" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
                <span style={{ fontSize:10.5, letterSpacing:"0.07em" }}>boş slot</span>
              </div>
            )}

            {stream.title && (
              <div className="title-overlay" style={{ position:"absolute", bottom:0, left:0, right:0, padding:"18px 9px 7px", background:"linear-gradient(transparent,rgba(0,0,0,0.78))", pointerEvents:"none", opacity:0, transition:"opacity 0.2s" }}>
                <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.85)", fontWeight:500 }}>{stream.title}</span>
              </div>
            )}

            <div style={{ position:"absolute", top:6, left:6, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)", borderRadius:5, padding:"2px 7px", fontSize:9.5, color:"rgba(255,255,255,0.4)", fontWeight:600, letterSpacing:"0.09em", pointerEvents:"none" }}>
              {String(idx+1).padStart(2,"0")}
            </div>

            {focusedIdx === idx && (
              <div style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.14)", backdropFilter:"blur(4px)", borderRadius:5, padding:"2px 8px", fontSize:9.5, color:"#fff", fontWeight:600, letterSpacing:"0.07em", pointerEvents:"none" }}>
                ● SEÇİLİ
              </div>
            )}
          </div>
        ))}
      </main>

      {showSettings && (
        <div onClick={e => e.target === e.currentTarget && setShowSettings(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(12px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>

          <div style={{ background:"#0e0e18", border:"1px solid rgba(255,255,255,0.09)", borderRadius:16, width:"min(740px,100%)", maxHeight:"88vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.03)" }}>

            <div style={{ padding:"18px 22px 0", flexShrink:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>Ayarlar</div>
                  <div style={{ fontSize:11.5, color:"#444", marginTop:3 }}>Grid ve yayın konfigürasyonu</div>
                </div>
                <button onClick={() => setShowSettings(false)}
                  style={{ width:30, height:30, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, color:"#666", cursor:"pointer", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
              </div>

              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                {[{id:"streams",label:"Yayınlar"},{id:"grid",label:"Grid"},{id:"share",label:"Paylaş"}].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding:"9px 18px", background:"none", border:"none", borderBottom: activeTab===tab.id?"2px solid #fff":"2px solid transparent", color: activeTab===tab.id?"#fff":"#4a4a5a", cursor:"pointer", fontSize:12.5, fontFamily:"inherit", fontWeight: activeTab===tab.id?600:400, marginBottom:-1, transition:"all 0.13s" }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex:1, overflow:"auto", padding:"20px 22px" }}>

              {activeTab === "streams" && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:9, padding:"10px 14px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:11.5, color:"#555", flexShrink:0 }}>Aktif slot:</span>
                    <div style={{ display:"flex", gap:5 }}>
                      {GRID_OPTIONS.map(opt => (
                        <button key={opt.count} onClick={() => setEditGridCount(opt.count)}
                          style={{ padding:"3px 13px", background: editGridCount===opt.count?"rgba(255,255,255,0.13)":"rgba(255,255,255,0.04)", border: editGridCount===opt.count?"1px solid rgba(255,255,255,0.22)":"1px solid rgba(255,255,255,0.06)", borderRadius:6, color: editGridCount===opt.count?"#fff":"#555", cursor:"pointer", fontSize:11.5, fontFamily:"inherit", fontWeight:500, transition:"all 0.13s" }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize:11, color:"#333", marginLeft:"auto" }}>İlk {editGridCount} slot aktif</span>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"26px 1fr 1fr", gap:8, padding:"0 1px" }}>
                    {["#","Video Slug / ID","Başlık"].map((h,i) => (
                      <span key={i} style={{ fontSize:10, color:"#3a3a4a", fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase" }}>{h}</span>
                    ))}
                  </div>

                  {Array.from({length:12}).map((_,idx) => {
                    const dim = idx >= editGridCount;
                    return (
                      <div key={idx} style={{ display:"grid", gridTemplateColumns:"26px 1fr 1fr", gap:8, alignItems:"center", opacity: dim?0.28:1, transition:"opacity 0.15s" }}>
                        <div style={{ width:26, height:26, borderRadius:6, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9.5, color:"#555", fontWeight:700 }}>
                          {String(idx+1).padStart(2,"0")}
                        </div>
                        <input
                          value={editStreams[idx]?.slug || ""}
                          onChange={e => updateField(idx,"slug",e.target.value)}
                          placeholder="iik25wqIuFo"
                          disabled={dim}
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, padding:"7px 11px", color:"#ddd", fontSize:12, fontFamily:"'DM Mono','Fira Mono',monospace", outline:"none", width:"100%", transition:"border-color 0.13s" }}
                          onFocus={e => e.target.style.borderColor="rgba(255,255,255,0.22)"}
                          onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"}
                        />
                        <input
                          value={editStreams[idx]?.title || ""}
                          onChange={e => updateField(idx,"title",e.target.value)}
                          placeholder="Yayın adı..."
                          disabled={dim}
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, padding:"7px 11px", color:"#ddd", fontSize:12, fontFamily:"inherit", outline:"none", width:"100%", transition:"border-color 0.13s" }}
                          onFocus={e => e.target.style.borderColor="rgba(255,255,255,0.22)"}
                          onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"}
                        />
                      </div>
                    );
                  })}

                  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:8, padding:"9px 13px", fontSize:11, color:"#3e3e52", lineHeight:1.75 }}>
                    <span style={{ color:"#555", fontWeight:600 }}>Slug nasıl bulunur?</span>
                    {" "}youtube.com/watch?v=<span style={{ color:"#777", fontFamily:"monospace" }}>iik25wqIuFo</span> — bu kısmı girin.
                    <br />Embed adresi: <span style={{ fontFamily:"monospace", color:"#555" }}>youtube-nocookie.com/embed/{"{slug}"}</span>
                  </div>
                </div>
              )}

              {activeTab === "grid" && (
                <div>
                  <p style={{ fontSize:12, color:"#444", marginBottom:18 }}>Eş zamanlı kaç yayın izlemek istiyorsun?</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {GRID_OPTIONS.map(opt => {
                      const active = editGridCount === opt.count;
                      return (
                        <button key={opt.count} onClick={() => setEditGridCount(opt.count)}
                          style={{ padding:"22px 16px", background: active?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.025)", border: active?"1px solid rgba(255,255,255,0.2)":"1px solid rgba(255,255,255,0.06)", borderRadius:12, cursor:"pointer", color: active?"#fff":"#555", display:"flex", flexDirection:"column", alignItems:"center", gap:14, fontFamily:"inherit", transition:"all 0.14s" }}>
                          <GridSVG cols={opt.cols} rows={opt.rows} size={50} />
                          <div style={{ textAlign:"center" }}>
                            <div style={{ fontSize:15, fontWeight:700 }}>{opt.label}</div>
                            <div style={{ fontSize:11, marginTop:3, opacity:0.4 }}>{opt.count} yayın</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "share" && (
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  <p style={{ fontSize:12.5, color:"#555", lineHeight:1.75 }}>
                    Mevcut grid yapısı ve tüm yayın adresleri URL'e kodlanır. Bu linki paylaşan herkes aynı konfigürasyonu görür.
                  </p>

                  <button onClick={handleShare}
                    style={{ padding:"12px 20px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:10, color:"#fff", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:9, transition:"all 0.14s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Paylaşım URL'si Oluştur
                  </button>

                  {shareUrl && (
                    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"14px 15px", display:"flex", flexDirection:"column", gap:10 }}>
                      <div style={{ fontSize:11, color:"#444", fontFamily:"monospace", wordBreak:"break-all", lineHeight:1.65 }}>{shareUrl}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11.5, color: copied?"#6ee7b7":"#555" }}>
                        {copied ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Panoya kopyalandı!</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Otomatik kopyalandı</>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ background:"rgba(255,210,0,0.03)", border:"1px solid rgba(255,210,0,0.09)", borderRadius:8, padding:"9px 13px", fontSize:11, color:"#665f44", lineHeight:1.7 }}>
                    💡 URL, <strong style={{color:"#887a52"}}>modal içindeki mevcut ayarları</strong> yansıtır — henüz kaydedilmemiş olsa bile.
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding:"14px 22px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"flex-end", gap:8, flexShrink:0 }}>
              <button onClick={() => setShowSettings(false)}
                style={{ padding:"8px 18px", background:"none", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, color:"#555", cursor:"pointer", fontSize:12.5, fontFamily:"inherit", transition:"all 0.13s" }}>
                İptal
              </button>
              <button onClick={handleSave}
                style={{ padding:"8px 22px", background:"#fff", border:"none", borderRadius:7, color:"#08080f", cursor:"pointer", fontSize:12.5, fontFamily:"inherit", fontWeight:700, boxShadow:"0 2px 14px rgba(255,255,255,0.12)", transition:"all 0.13s" }}
                onMouseEnter={e => e.currentTarget.style.background="#e8e8f0"}
                onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes ripple {
          0%   { box-shadow: 0 0 0 0 rgba(229,62,30,0.7); }
          70%  { box-shadow: 0 0 0 8px rgba(229,62,30,0); }
          100% { box-shadow: 0 0 0 0 rgba(229,62,30,0); }
        }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.09); border-radius:4px; }
        div:hover > .title-overlay { opacity:1 !important; }
      `}</style>
    </div>
  );
}