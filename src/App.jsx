import { useState, useEffect, useRef } from "react";

const CYAN = "#00f5ff";
const GREEN = "#39ff14";
const AMBER = "#ffb800";
const RED = "#ff3131";
const BG = "#050505";
const CARD_BG = "rgba(0,245,255,0.02)";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${BG}; color: #fff; font-family: 'JetBrains Mono', monospace; cursor: crosshair; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: ${CYAN}; }
    @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
    .crt-overlay { pointer-events: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03)); background-size: 100% 3px, 3px 100%; }
    .scanline { width: 100%; height: 100px; background: linear-gradient(0deg, transparent, rgba(0, 245, 255, 0.05), transparent); position: fixed; top: 0; left: 0; animation: scanline 8s linear infinite; pointer-events: none; z-index: 1001; }
    .nav-link { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 11px; letter-spacing: 2px; }
    .nav-link:hover { color: ${CYAN}; text-shadow: 0 0 10px ${CYAN}; }
    * { cursor: none !important; }
    #custom-cursor { pointer-events: none; position: fixed; z-index: 9999; top: 0; left: 0; }
  `}</style>
);

const TechyCursor = () => {
  const cursorRef = useRef(null);
  const trailRef = useRef([]);
  const pos = useRef({ x: 0, y: 0 });
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const click = (e) => {
      const id = Date.now();
      setClicks(prev => [...prev, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 600);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("click", click); };
  }, []);

  return (
    <>
      <div id="custom-cursor" ref={cursorRef} style={{ willChange: "transform" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", marginLeft: -4, marginTop: -4 }}>
          {/* crosshair ring */}
          <circle cx="16" cy="16" r="10" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.7" />
          <circle cx="16" cy="16" r="2" fill={CYAN} />
          {/* tick marks */}
          <line x1="16" y1="4" x2="16" y2="8" stroke={CYAN} strokeWidth="1.5" />
          <line x1="16" y1="24" x2="16" y2="28" stroke={CYAN} strokeWidth="1.5" />
          <line x1="4" y1="16" x2="8" y2="16" stroke={CYAN} strokeWidth="1.5" />
          <line x1="24" y1="16" x2="28" y2="16" stroke={CYAN} strokeWidth="1.5" />
          {/* corner brackets */}
          <path d="M6 10 L6 6 L10 6" fill="none" stroke={GREEN} strokeWidth="1" />
          <path d="M22 6 L26 6 L26 10" fill="none" stroke={GREEN} strokeWidth="1" />
          <path d="M6 22 L6 26 L10 26" fill="none" stroke={GREEN} strokeWidth="1" />
          <path d="M22 26 L26 26 L26 22" fill="none" stroke={GREEN} strokeWidth="1" />
        </svg>
      </div>
      {clicks.map(c => (
        <div key={c.id} style={{
          position: "fixed", left: c.x, top: c.y, pointerEvents: "none", zIndex: 9998,
          transform: "translate(-50%,-50%)",
          animation: "clickRipple .6s ease-out forwards",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: CYAN, letterSpacing: 2, whiteSpace: "nowrap",
        }}>
          <style>{`@keyframes clickRipple { from { opacity:1; transform:translate(-50%,-50%) scale(.8); } to { opacity:0; transform:translate(-50%,-60px) scale(1.2); } }`}</style>
          EXECUTE
        </div>
      ))}
    </>
  );
};

const COMMANDS = [
  { cmd: "whoami", output: ["> Sidhdhant // SidJai24", "> B.Tech CSE '29 @ KIET", "> Core: Matrix-Math ML | Computer Vision | Neural Networks"] },
  { cmd: "system --status", output: ["> All modules functional.", "> Current Focus: ML | SSB | DSA (Java)", "> Status: Refining preprocessing pipelines."] },
  { cmd: "ls projects/", output: ["> mip_v2.0 (R²: 0.8653)", "> ahe_final (R²: 0.8667)", "> titanic_pipeline.py", "> image_filter_engine.py"] }
];

const Terminal = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (text.length < COMMANDS[idx].cmd.length) {
        timeout = setTimeout(() => setText(COMMANDS[idx].cmd.slice(0, text.length + 1)), 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeout = setTimeout(() => {
        setText("");
        setIdx((prev) => (prev + 1) % COMMANDS.length);
        setIsTyping(true);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [text, isTyping, idx]);

  return (
    <div style={{ background: "rgba(0,0,0,0.8)", border: `1px solid ${CYAN}33`, padding: 20, borderRadius: 4, minHeight: 160 }}>
      <div style={{ color: GREEN, marginBottom: 10 }}>sidhdhant@system:~$ <span style={{ color: "#fff" }}>{text}</span></div>
      {!isTyping && COMMANDS[idx].output.map((line, i) => (
        <div key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginLeft: 15 }}>{line}</div>
      ))}
    </div>
  );
};

const AttrBar = ({ label, value, color }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
      <span>{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
    </div>
  </div>
);

export default function Portfolio() {
  return (
    <div style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <FontLoader />
      <TechyCursor />
      <div className="crt-overlay" />
      <div className="scanline" />

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 30, marginBottom: 80, justifyContent: 'center' }}>
        <a href="#hero" className="nav-link">SYSTEM</a>
        <a href="#projects" className="nav-link">RESEARCH</a>
        <a href="#dna" className="nav-link">DNA</a>
      </nav>

      {/* Hero */}
      <section id="hero" style={{ marginBottom: 120 }}>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 800, color: '#fff' }}>
          SIDHDHANT JAISWAL<br /><span style={{ color: CYAN }}>[SIDJAI24]</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '20px 0 40px', fontSize: 12, letterSpacing: 3 }}>
          B.TECH CSE '29 // MACHINE LEARNING RESEARCHER // SSB ASPIRANT
        </p>
        <Terminal />
      </section>

      {/* Projects */}
      <section id="projects" style={{ marginBottom: 120 }}>
        <h2 style={{ fontSize: 20, marginBottom: 40, color: CYAN }}>// ML_RESEARCH_LOG</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 25 }}>
          <div style={{ background: CARD_BG, padding: 30, border: `1px solid ${CYAN}33` }}>
            <span style={{ color: CYAN, fontSize: 10 }}>[R²: 0.8653]</span>
            <h3 style={{ margin: '10px 0' }}>Medical Insurance Predictor</h3>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Matrix-based regression utilizing Interaction Terms (BMI × Smoker) to solve complex risk variance.</p>
          </div>
          <div style={{ background: CARD_BG, padding: 30, border: `1px solid ${GREEN}33` }}>
            <span style={{ color: GREEN, fontSize: 10 }}>[R²: 0.8667]</span>
            <h3 style={{ margin: '10px 0' }}>Ames Housing Engine</h3>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Log-linear regression model optimized for right-skewed pricing distributions with 80+ features.</p>
          </div>
          <div style={{ background: CARD_BG, padding: 30, border: `1px solid ${AMBER}33` }}>
            <span style={{ color: AMBER, fontSize: 10 }}>[LIBRARY_INDEPENDENT]</span>
            <h3 style={{ margin: '10px 0' }}>Image Filter Engine</h3>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Pure NumPy implementation of convolution kernels, edge detection, and luminosity transformations.</p>
          </div>
        </div>
      </section>

      {/* DNA */}
      <section id="dna" style={{ marginBottom: 120 }}>
        <h2 style={{ fontSize: 20, marginBottom: 40, color: RED }}>// ATTRIBUTE_MATRIX</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
          <div>
            <AttrBar label="Matrix Mathematics" value={92} color={CYAN} />
            <AttrBar label="Feature Engineering" value={88} color={GREEN} />
            <AttrBar label="Data Preprocessing" value={85} color={AMBER} />
            <AttrBar label="Competitive Programming" value={82} color={RED} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 30, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: RED, fontSize: 11, letterSpacing: 2, marginBottom: 15 }}>// DISCIPLINE_LOG</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              Active SSB Candidate (Navy Tech Bhopal, March 27). Discipline forged through Air Pistol Shooting and competitive Basketball, applying systematic rigor to ML model development.
            </p>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
        SYSTEM_ID: SIDJAI24 // MURADNAGAR_UP_IN // STATUS: OPTIMIZING
      </footer>
    </div>
  );
}