import { useEffect, useState } from "react";
import { Activity, BrainCircuit, ExternalLink, Radio, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const DEMO_AGENT_ID =
  localStorage.getItem("novaAgentId") ||
  "agent-292522b0-0aa3-42f0-93d7-74dd2eef3fbd";

export default function App() {
  const [agentId, setAgentId] = useState(DEMO_AGENT_ID || "");
  const [feed, setFeed] = useState([]);
  const [status, setStatus] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(Boolean(DEMO_AGENT_ID));

  async function initialize() {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/agent/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: {
            name: "NOVA",
            domain: "AI Systems"
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Initialization failed");

      localStorage.setItem("novaAgentId", data.agentId);
      setAgentId(data.agentId);
      setInitialized(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    if (!agentId) return;

    const [feedResponse, statusResponse, decisionResponse] = await Promise.all([
      fetch(`${API}/api/agent/feed?agentId=${encodeURIComponent(agentId)}`),
      fetch(`${API}/api/agent/${encodeURIComponent(agentId)}/status`),
      fetch(`${API}/api/agent/${encodeURIComponent(agentId)}/decisions`)
    ]);

    const feedData = await feedResponse.json();
    const statusData = await statusResponse.json();
    const decisionData = await decisionResponse.json();

    if (feedResponse.ok) setFeed(feedData.posts || []);
    if (statusResponse.ok) setStatus(statusData);
    if (decisionResponse.ok) setDecisions(decisionData.decisions || []);
  }

  useEffect(() => {
    if (!agentId) return;
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => clearInterval(timer);
  }, [agentId]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo"><Sparkles size={20} /></div>
          <div>
            <strong>NOVA</strong>
            <span>Autonomous AI Creator</span>
          </div>
        </div>
        <div className="live">
          <span className="dot" /> AUTONOMOUS
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">AI SYSTEMS WATCHDOG</p>
            <h1>An AI persona that<br /><span>keeps thinking.</span></h1>
            <p className="subtitle">
              NOVA discovers live technology stories, evaluates their significance,
              remembers previous coverage, and publishes only when a story earns it.
            </p>
            {!initialized && (
              <button className="primary" onClick={initialize} disabled={loading}>
                {loading ? "Initializing..." : "Initialize NOVA"}
              </button>
            )}
          </div>

          <div className="hero-card">
            <div className="signal"><Radio size={18} /> LIVE AGENT LOOP</div>
            <div className="loop">
              <span>DISCOVER</span>
              <span>→</span>
              <span>JUDGE</span>
              <span>→</span>
              <span>REMEMBER</span>
              <span>→</span>
              <span>PUBLISH</span>
            </div>
            <p>No prompt required after initialization.</p>
          </div>
        </section>

        {initialized && (
          <>
            <section className="stats">
              <Stat icon={<Activity />} label="STATUS" value={status?.agent?.status?.toUpperCase() || "STARTING"} />
              <Stat icon={<Radio />} label="PUBLISHED" value={status?.stats?.published ?? "—"} />
              <Stat icon={<ShieldCheck />} label="REJECTED" value={status?.stats?.rejected ?? "—"} />
              <Stat icon={<BrainCircuit />} label="MEMORY" value="MongoDB" />
            </section>

            <section className="grid">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">AUTONOMOUS FEED</p>
                    <h2>Latest publications</h2>
                  </div>
                  <button className="icon-btn" onClick={refresh}><RefreshCw size={17} /></button>
                </div>

                {feed.length === 0 ? (
                  <div className="empty">
                    <Sparkles size={28} />
                    <h3>Waiting for the first decision</h3>
                    <p>NOVA is discovering live topics and evaluating them.</p>
                  </div>
                ) : (
                  <div className="posts">
                    {feed.map((post) => (
                      <article className="post" key={post.id}>
                        <div className="post-meta">
                          <span>NOVA</span>
                          <span>{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="post-text">{post.text}</p>
                        <div className="rationale">
                          <strong>Why this was published</strong>
                          <p>{post.rationale}</p>
                        </div>
                        <div className="sources">
                          {post.sources.map((source) => (
                            <a href={source} target="_blank" rel="noreferrer" key={source}>
                              Source <ExternalLink size={13} />
                            </a>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <aside className="panel">
                <p className="eyebrow">EDITORIAL MEMORY</p>
                <h2>Recent decisions</h2>
                <div className="decisions">
                  {decisions.length === 0 ? (
                    <p className="muted">No decisions yet.</p>
                  ) : decisions.slice(0, 12).map((item, index) => (
                    <div className="decision" key={`${item.topic}-${index}`}>
                      <div className={`badge ${item.decision}`}>
                        {item.decision.toUpperCase()}
                      </div>
                      <strong>{item.topic}</strong>
                      <div className="score">Score {item.score}/100</div>
                      <p>{item.reason}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
