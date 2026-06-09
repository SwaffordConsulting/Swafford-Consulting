import { useState } from "react";

const BRAND = {
  emerald:     "#046A38",
  emeraldLight:"#057a41",
  copper:      "#B87333",
  ivory:       "#F5F0E8",
  dark:        "#0a1a0f",
  mid:         "#1a2e1f",
  muted:       "#4a6b52",
  border:      "#d4cfc6",
};

const AIRTABLE_TOKEN = "patZNTStI8thqUWe7.72a149c13c617ebb99ec0e485ce7e86a4704633dc1781cd873296fe09296508c";
const AIRTABLE_BASE  = "appKEeClXYe8gT7JC";
const AIRTABLE_TABLE = "Leads";
const CALENDLY_URL   = "https://calendly.com/gregory-cultureofcleanliness/ai-consulting-discovery-call";

async function submitToAirtable(form) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        "Name":           form.name,
        "Email":          form.email,
        "Organization":   form.org,
        "Org Type":       form.orgType,
        "Service":        form.service,
        "Challenge":      form.challenge,
        "Source":         form.source,
        "Status":         "New",
        "Submitted At":   new Date().toISOString().split("T")[0],
      }
    })
  });
  if (!res.ok) throw new Error("Airtable submission failed");
  return res.json();
}

// ─── INTAKE FORM ─────────────────────────────────────────────────────────────

function IntakeForm() {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState({ name:"", email:"", org:"", orgType:"", service:"", challenge:"", source:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitToAirtable(form);
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign:"center", padding:"2.5rem 1rem" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
        <h2 style={{ color:BRAND.emerald, fontFamily:"Georgia, serif", fontSize:"1.8rem", marginBottom:"0.75rem" }}>
          You're In.
        </h2>
        <p style={{ color:BRAND.muted, fontSize:"1rem", lineHeight:1.7, maxWidth:400, margin:"0 auto 1.75rem" }}>
          Gregory will personally review your submission. Skip the wait — book your discovery call right now.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            display:"inline-block", background:BRAND.emerald, color:"#fff",
            padding:"1rem 2.25rem", borderRadius:10, fontSize:"1rem",
            fontWeight:700, letterSpacing:"0.04em", textDecoration:"none",
            boxShadow:`0 4px 20px ${BRAND.emerald}60`, marginBottom:"1.25rem"
          }}
        >
          Book My Discovery Call →
        </a>
        <p style={{ fontSize:"0.78rem", color:BRAND.muted, margin:"0 0 1.75rem" }}>30 min · Free · No obligation</p>
        <div style={{ background:BRAND.ivory, border:`1px solid ${BRAND.border}`, borderRadius:12, padding:"1.25rem 1.5rem", maxWidth:360, margin:"0 auto", textAlign:"left" }}>
          <p style={{ margin:"0 0 0.5rem", fontSize:"0.8rem", color:BRAND.muted, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>What to expect</p>
          {["Review your challenge details","30-min discovery call","Tailored AI readiness assessment"].map(t => (
            <div key={t} style={{ display:"flex", gap:"0.6rem", alignItems:"flex-start", marginBottom:"0.4rem" }}>
              <span style={{ color:BRAND.emerald, fontWeight:700 }}>—</span>
              <span style={{ fontSize:"0.88rem", color:BRAND.dark, lineHeight:1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const inputStyle = {
    width:"100%", padding:"0.75rem 1rem", borderRadius:8,
    border:`1.5px solid ${BRAND.border}`, fontSize:"0.95rem",
    fontFamily:"inherit", background:"#fff", color:BRAND.dark,
    outline:"none", boxSizing:"border-box",
  };

  const labelStyle = {
    display:"block", fontSize:"0.8rem", fontWeight:700,
    letterSpacing:"0.07em", textTransform:"uppercase",
    color:BRAND.muted, marginBottom:"0.4rem",
  };

  const btnStyle = (primary) => ({
    padding: primary ? "0.85rem 2rem" : "0.7rem 1.4rem",
    borderRadius:8, border:"none", cursor:"pointer",
    fontSize:"0.95rem", fontWeight:700, letterSpacing:"0.04em",
    background: primary ? BRAND.emerald : "transparent",
    color: primary ? "#fff" : BRAND.muted,
  });

  return (
    <div>
      {/* Progress */}
      <div style={{ display:"flex", gap:6, marginBottom:"2rem" }}>
        {[1,2,3].map(s => (
          <div key={s} style={{ flex:1, height:4, borderRadius:4, background: s<=step ? BRAND.emerald : BRAND.border, transition:"background 0.3s" }} />
        ))}
      </div>

      {step === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <p style={{ margin:"0 0 0.25rem", color:BRAND.muted, fontSize:"0.95rem" }}>Let's start with the basics.</p>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@organization.org" />
          </div>
          <div>
            <label style={labelStyle}>Organization</label>
            <input style={inputStyle} value={form.org} onChange={e=>update("org",e.target.value)} placeholder="Organization or agency name" />
          </div>
          <div>
            <label style={labelStyle}>Organization Type</label>
            <select style={inputStyle} value={form.orgType} onChange={e=>update("orgType",e.target.value)}>
              <option value="">Select one...</option>
              {["Nonprofit / Community Organization","Foundation","Government / Public Agency","Small Business","Academic / Research Institution","Individual Consultant","Other"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:"0.5rem" }}>
            <button style={{ ...btnStyle(true), opacity:(!form.name||!form.email)?0.5:1 }}
              onClick={()=>{ if(form.name&&form.email) setStep(2); }}>Continue →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <p style={{ margin:"0 0 0.25rem", color:BRAND.muted, fontSize:"0.95rem" }}>Tell me about your needs.</p>
          <div>
            <label style={labelStyle}>Service Area</label>
            <select style={inputStyle} value={form.service} onChange={e=>update("service",e.target.value)}>
              <option value="">Select one...</option>
              {["Automating Your Nonprofit","AI for Grant Management","Equitable AI Policies","AI for Environmental Justice","General AI Strategy","Not Sure — Need Guidance"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Describe Your Challenge</label>
            <textarea style={{ ...inputStyle, minHeight:110, resize:"vertical" }}
              value={form.challenge} onChange={e=>update("challenge",e.target.value)}
              placeholder="What problem are you trying to solve? What does success look like?" />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"0.5rem" }}>
            <button style={btnStyle(false)} onClick={()=>setStep(1)}>← Back</button>
            <button style={{ ...btnStyle(true), opacity:!form.service?0.5:1 }}
              onClick={()=>{ if(form.service) setStep(3); }}>Continue →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <p style={{ margin:"0 0 0.25rem", color:BRAND.muted, fontSize:"0.95rem" }}>One last thing.</p>
          <div>
            <label style={labelStyle}>How did you find us?</label>
            <select style={inputStyle} value={form.source} onChange={e=>update("source",e.target.value)}>
              <option value="">Select one...</option>
              {["LinkedIn","Instagram","X (Twitter)","TikTok","Facebook","Referral / Word of Mouth","Conference or Event","Other"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ background:BRAND.ivory, borderRadius:10, padding:"1rem 1.25rem", border:`1px solid ${BRAND.border}` }}>
            <p style={{ margin:"0 0 0.5rem", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:BRAND.muted }}>Review Your Submission</p>
            <p style={{ margin:"0.2rem 0", fontSize:"0.9rem", color:BRAND.dark }}><strong>{form.name}</strong> · {form.email}</p>
            <p style={{ margin:"0.2rem 0", fontSize:"0.9rem", color:BRAND.dark }}>{form.org}{form.orgType?` · ${form.orgType}`:""}</p>
            <p style={{ margin:"0.2rem 0", fontSize:"0.9rem", color:BRAND.dark }}>{form.service}</p>
          </div>
          {error && <p style={{ color:"#c0392b", fontSize:"0.88rem", margin:0 }}>{error}</p>}
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"0.5rem" }}>
            <button style={btnStyle(false)} onClick={()=>setStep(2)}>← Back</button>
            <button style={{ ...btnStyle(true), background:loading?BRAND.muted:BRAND.emerald }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Request Consultation ✓"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LEADS DASHBOARD ─────────────────────────────────────────────────────────

const STATUS_COLORS = {
  "New":       { bg:"#e8f5ee", text:BRAND.emerald },
  "Contacted": { bg:"#fef3e2", text:"#b45309" },
  "Scheduled": { bg:"#e0f2fe", text:"#0369a1" },
  "Closed":    { bg:"#f0fdf4", text:"#166534" },
  "Not a Fit": { bg:"#fef2f2", text:"#991b1b" },
};

function Dashboard({ onBack }) {
  const [leads, setLeads]   = useState([]);
  const [filter, setFilter] = useState("All");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?sort[0][field]=Submitted At&sort[0][direction]=desc`,
        { headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` } }
      );
      const data = await res.json();
      setLeads(data.records || []);
      setLoaded(true);
    } catch {
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return (
      <div style={{ textAlign:"center", padding:"3rem 1rem" }}>
        <button onClick={fetchLeads} disabled={loading}
          style={{ background:BRAND.emerald, color:"#fff", border:"none", padding:"0.85rem 2rem", borderRadius:8, fontSize:"0.95rem", fontWeight:700, cursor:"pointer" }}>
          {loading ? "Loading leads..." : "Load Leads from Airtable"}
        </button>
        <p style={{ marginTop:"0.75rem", fontSize:"0.78rem", color:BRAND.muted }}>Pulls live from your Airtable base</p>
        <div style={{ marginTop:"1.5rem" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:BRAND.muted, cursor:"pointer", fontSize:"0.85rem" }}>← Back</button>
        </div>
      </div>
    );
  }

  const statuses = ["New","Contacted","Scheduled","Closed","Not a Fit"];
  const visible  = filter === "All" ? leads : leads.filter(l => l.fields?.Status === filter);
  const counts   = statuses.reduce((a,s) => ({ ...a, [s]: leads.filter(l=>l.fields?.Status===s).length }), {});

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:BRAND.muted, fontSize:"0.85rem", padding:0 }}>← Back</button>
        <h2 style={{ margin:0, fontFamily:"Georgia, serif", fontSize:"1.4rem", color:BRAND.dark }}>Lead Dashboard</h2>
        <button onClick={fetchLeads} style={{ marginLeft:"auto", background:"none", border:`1px solid ${BRAND.border}`, borderRadius:6, padding:"0.3rem 0.75rem", fontSize:"0.75rem", color:BRAND.muted, cursor:"pointer" }}>Refresh</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))", gap:8, marginBottom:"1.5rem" }}>
        {statuses.map(s => (
          <div key={s} style={{ background:STATUS_COLORS[s].bg, borderRadius:8, padding:"0.6rem 0.75rem", textAlign:"center" }}>
            <div style={{ fontSize:"1.5rem", fontWeight:700, color:STATUS_COLORS[s].text }}>{counts[s]}</div>
            <div style={{ fontSize:"0.7rem", color:STATUS_COLORS[s].text, fontWeight:600 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
        {["All",...statuses].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"0.35rem 0.85rem", borderRadius:20, border:"none", cursor:"pointer",
            fontSize:"0.8rem", fontWeight:600,
            background: filter===f ? BRAND.emerald : BRAND.ivory,
            color: filter===f ? "#fff" : BRAND.muted,
          }}>{f}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign:"center", padding:"3rem 1rem", color:BRAND.muted }}>
          <p style={{ fontSize:"2rem", margin:"0 0 0.5rem" }}>📭</p>
          <p style={{ fontSize:"0.88rem" }}>No leads yet. Share your consultation link to start collecting inquiries.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {visible.map(record => {
            const f = record.fields || {};
            return (
              <div key={record.id} style={{ background:"#fff", border:`1px solid ${BRAND.border}`, borderRadius:10, padding:"1rem 1.25rem" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.75rem", flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ fontWeight:700, color:BRAND.dark, fontSize:"0.95rem" }}>{f.Name}</div>
                    <div style={{ fontSize:"0.82rem", color:BRAND.muted }}>{f.Email}</div>
                    <div style={{ fontSize:"0.82rem", color:BRAND.muted }}>{f.Organization}{f["Org Type"]?` · ${f["Org Type"]}`:""}</div>
                    <div style={{ fontSize:"0.8rem", color:BRAND.copper, marginTop:"0.25rem", fontWeight:600 }}>{f.Service}</div>
                    {f.Challenge && (
                      <div style={{ fontSize:"0.82rem", color:BRAND.muted, marginTop:"0.35rem", fontStyle:"italic", lineHeight:1.5 }}>
                        "{f.Challenge.length>100?f.Challenge.slice(0,100)+"…":f.Challenge}"
                      </div>
                    )}
                    <div style={{ fontSize:"0.75rem", color:BRAND.border, marginTop:"0.4rem" }}>
                      via {f.Source||"Unknown"} · {f["Submitted At"]||""}
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
                    <span style={{ padding:"0.25rem 0.65rem", borderRadius:20, fontSize:"0.72rem", fontWeight:700,
                      background:STATUS_COLORS[f.Status]?.bg||BRAND.ivory,
                      color:STATUS_COLORS[f.Status]?.text||BRAND.muted }}>
                      {f.Status||"New"}
                    </span>
                    <a href={`mailto:${f.Email}`} style={{ fontSize:"0.78rem", color:BRAND.emerald, fontWeight:600, textDecoration:"none" }}>Email →</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("landing");

  return (
    <div style={{ minHeight:"100vh", background:BRAND.dark, fontFamily:"'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background:BRAND.mid, borderBottom:`1px solid ${BRAND.muted}30`, padding:"0.75rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:BRAND.copper, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:900, color:"#fff" }}>SC</div>
          <span style={{ color:BRAND.ivory, fontWeight:700, fontSize:"0.9rem", letterSpacing:"0.04em" }}>Swafford Consulting</span>
        </div>
        <button onClick={()=>setView("dashboard")} style={{ background:"none", border:"none", color:BRAND.muted, fontSize:"0.78rem", cursor:"pointer", letterSpacing:"0.04em" }}>
          Admin →
        </button>
      </div>

      <div style={{ maxWidth:560, margin:"0 auto", padding:"2rem 1.25rem" }}>

        {view === "dashboard" && (
          <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem" }}>
            <Dashboard onBack={()=>setView("landing")} />
          </div>
        )}

        {view === "form" && (
          <div style={{ background:"#fff", borderRadius:16, padding:"2rem 1.5rem", boxShadow:"0 8px 32px #00000040" }}>
            <button onClick={()=>setView("landing")} style={{ background:"none", border:"none", color:BRAND.muted, cursor:"pointer", fontSize:"0.85rem", padding:"0 0 1rem", display:"block" }}>← Back</button>
            <h2 style={{ margin:"0 0 0.4rem", fontFamily:"Georgia, serif", color:BRAND.dark, fontSize:"1.6rem" }}>
              Request a Consultation
            </h2>
            <p style={{ margin:"0 0 1.75rem", color:BRAND.muted, fontSize:"0.9rem", lineHeight:1.6 }}>
              AI strategy for foundations, nonprofits, and governments — grounded in mission, values, and community trust.
            </p>
            <IntakeForm />
          </div>
        )}

        {view === "landing" && (
          <>
            {/* Hero */}
            <div style={{ textAlign:"center", padding:"2.5rem 0 2rem" }}>
              <div style={{ display:"inline-block", background:`${BRAND.copper}22`, border:`1px solid ${BRAND.copper}44`, borderRadius:20, padding:"0.35rem 1rem", fontSize:"0.75rem", fontWeight:700, color:BRAND.copper, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1.25rem" }}>
                AI Consulting
              </div>
              <h1 style={{ margin:"0 0 1rem", fontFamily:"Georgia, serif", fontSize:"clamp(2rem,6vw,2.8rem)", color:BRAND.ivory, lineHeight:1.2 }}>
                Gregory helps foundations, nonprofits, and governments ethically harness AI.
              </h1>
              <p style={{ color:"#a8c4b0", fontSize:"1rem", lineHeight:1.7, maxWidth:440, margin:"0 auto 2rem" }}>
                Without losing their mission, their values, or their community trust.
              </p>
              <button onClick={()=>setView("form")}
                style={{ background:BRAND.emerald, color:"#fff", border:"none", padding:"1rem 2.5rem", borderRadius:10, fontSize:"1rem", fontWeight:700, cursor:"pointer", letterSpacing:"0.04em", boxShadow:`0 4px 20px ${BRAND.emerald}60` }}>
                Request a Consultation
              </button>
              <p style={{ marginTop:"0.75rem", fontSize:"0.78rem", color:BRAND.muted }}>30-min discovery call · No obligation</p>
            </div>

            {/* Services 2×2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"2rem" }}>
              {[
                { icon:"⚙️", title:"Automating Your Nonprofit",   desc:"Free your staff from repetitive tasks. Build AI-assisted workflows that scale your impact, not your overhead." },
                { icon:"📋", title:"AI for Grant Management",      desc:"From prospect research to reporting, use AI to strengthen your entire development function." },
                { icon:"⚖️", title:"Equitable AI Policies",        desc:"Develop and adopt AI policies that center equity, transparency, and community accountability." },
                { icon:"🌿", title:"AI for Environmental Justice", desc:"Data, mapping, and storytelling tools that amplify frontline voices and hold polluters accountable." },
              ].map(s => (
                <div key={s.title} style={{ background:BRAND.mid, borderRadius:12, padding:"1rem", border:`1px solid ${BRAND.muted}30` }}>
                  <div style={{ fontSize:"1.5rem", marginBottom:"0.5rem" }}>{s.icon}</div>
                  <div style={{ fontSize:"0.85rem", fontWeight:700, color:BRAND.ivory, marginBottom:"0.3rem", lineHeight:1.3 }}>{s.title}</div>
                  <div style={{ fontSize:"0.78rem", color:"#7a9e85", lineHeight:1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Credibility strip */}
            <div style={{ background:BRAND.mid, borderRadius:12, padding:"1.25rem 1.5rem", border:`1px solid ${BRAND.muted}30`, marginBottom:"1.5rem" }}>
              <p style={{ margin:"0 0 0.75rem", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:BRAND.muted }}>Why Gregory</p>
              <p style={{ margin:0, color:"#a8c4b0", fontSize:"0.88rem", lineHeight:1.85 }}>
                For six years Gregory has actively built Culture of Cleanliness from a grassroots Environmental Justice movement into a capital-raising, systems-driven nonprofit organization. He is actively integrating AI tools into his own work to consistently build efficiency gains — saving time, energy, and money.
              </p>
            </div>

            <div style={{ textAlign:"center" }}>
              <button onClick={()=>setView("form")}
                style={{ background:"transparent", color:BRAND.copper, border:`1.5px solid ${BRAND.copper}`, padding:"0.75rem 2rem", borderRadius:8, fontSize:"0.9rem", fontWeight:700, cursor:"pointer" }}>
                Start the Conversation →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
