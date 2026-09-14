"use client";

import { useMemo, useState } from "react";

type Idea = {
  category: string;
  title: string;
  hook: string;
  score: number;
  reason: string;
};

const categoryLabels: Record<string, string> = {
  "world-news": "World News",
  viral: "Viral Stories",
  "ai-tech": "AI & Tech",
  facts: "Interesting Facts",
  mystery: "Mystery",
  history: "History",
};

const initialIdeas: Idea[] = [
  { category: "ai-tech", title: "The AI change you may notice sooner than expected", hook: "AI is changing one everyday task faster than most people realize.", score: 8.8, reason: "Strong curiosity and everyday relevance" },
  { category: "facts", title: "A true fact that sounds completely made up", hook: "This sounds fake, but scientists can actually explain it.", score: 8.6, reason: "High curiosity and easy 60-second storytelling" },
  { category: "history", title: "The forgotten event that changed a modern habit", hook: "One overlooked moment helped shape something we use today.", score: 8.4, reason: "History + unexpected modern connection" },
];

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [generating, setGenerating] = useState(false);
  const [category, setCategory] = useState("all");
  const [message, setMessage] = useState("Ready to generate");

  const visibleIdeas = useMemo(() => {
    if (category === "all") return ideas;
    return ideas.filter((idea) => idea.category === category);
  }, [category, ideas]);

  async function generate() {
    setGenerating(true);
    setMessage("Researching and scoring ideas…");
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setIdeas(Array.isArray(data.ideas) ? data.ideas : []);
      setMessage(data.configured ? "Live AI ideas generated" : "Demo candidates loaded — add OPENAI_API_KEY for live AI research");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand">NOYA<span>.</span>AI</div>
      <nav className="nav">
        <a className="active" href="#">Overview</a><a href="#ideas">Ideas</a><a href="#pipeline">Content Pipeline</a><a href="#schedule">Schedule</a><a href="#analytics">Analytics</a><a href="#integrations">Integrations</a><a href="#settings">Settings</a>
      </nav>
    </aside>
    <main className="main">
      <header className="top">
        <div><div className="eyebrow">Noya AI · Automation control center</div><h1 className="title">YouTube Automation</h1><div className="muted">Research, score and prepare original Shorts from one dashboard.</div></div>
        <button className="button" onClick={generate} disabled={generating}>{generating ? "Generating…" : "Generate viral ideas"}</button>
      </header>

      <section className="grid">
        <div className="card"><div className="muted">Ideas loaded</div><div className="metric">{ideas.length}</div></div>
        <div className="card"><div className="muted">Top score</div><div className="metric positive">{ideas.length ? Math.max(...ideas.map((x) => x.score)).toFixed(1) : "—"}</div></div>
        <div className="card"><div className="muted">Target</div><div className="metric">1/day</div></div>
        <div className="card"><div className="muted">Publish target</div><div className="metric">8 PM</div></div>
      </section>

      <section id="pipeline" className="section"><div className="section-title">Automation pipeline</div><div className="pipeline">
        <div className="step"><strong>1 · Research</strong><span className="muted">Sources + discovery</span></div><div className="step"><strong>2 · Fact Check</strong><span className="muted">Evidence validation</span></div><div className="step"><strong>3 · Script</strong><span className="muted">Original 60-sec copy</span></div><div className="step"><strong>4 · Voice/Video</strong><span className="muted">9:16 + subtitles</span></div><div className="step"><strong>5 · Publish</strong><span className="muted">YouTube at 8 PM</span></div>
      </div></section>

      <section id="ideas" className="section">
        <div className="row"><div className="section-title">Viral idea engine</div><span className="status">{message}</span></div>
        <div className="row" style={{ marginBottom: 16 }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Idea category">
            <option value="all">All categories</option><option value="world-news">World News</option><option value="viral">Viral Stories</option><option value="ai-tech">AI & Tech</option><option value="facts">Interesting Facts</option><option value="mystery">Mystery</option><option value="history">History</option>
          </select>
        </div>
        <div className="ideas">{visibleIdeas.map((idea) => <article className="idea" key={`${idea.category}-${idea.title}`}>
          <span className="tag">{categoryLabels[idea.category] ?? idea.category}</span>
          <div className="row"><strong>{idea.title}</strong><span className="muted">{idea.score.toFixed(1)}/10</span></div>
          <p className="muted">{idea.hook}</p><p className="muted">Why it scores: {idea.reason}</p>
          <button className="button secondary" onClick={() => setMessage(`Draft queued: ${idea.title}`)}>Create draft</button>
        </article>)}</div>
      </section>

      <section id="schedule" className="section"><div className="section-title">Publishing policy</div><div className="card"><div className="row"><strong>Daily Shorts</strong><span className="status">Configured</span></div><p className="muted">One original English Short per day, target publish time 20:00 Qatar. The scheduler should only publish videos that pass review and have valid YouTube credentials.</p></div></section>

      <section id="integrations" className="section"><div className="section-title">Integrations</div><div className="grid">
        <div className="card"><strong>YouTube</strong><p className="muted">OAuth upload + analytics</p><span className="status">Code boundary ready</span></div>
        <div className="card"><strong>WordPress</strong><p className="muted">Dashboard + content sync</p><span className="status">Code boundary ready</span></div>
        <div className="card"><strong>AI</strong><p className="muted">Topic generation endpoint</p><span className="status">Live when key is configured</span></div>
        <div className="card"><strong>Scheduler</strong><p className="muted">Daily 20:00 Qatar workflow</p><span className="status">Cron configured</span></div>
      </div></section>
    </main>
    <nav className="mobile-nav"><a href="#">Overview</a><a href="#ideas">Ideas</a><a href="#schedule">Schedule</a><a href="#analytics">Analytics</a></nav>
  </div>;
}
