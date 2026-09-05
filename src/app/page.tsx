"use client";

import { useState } from "react";

const ideas = [
  ["World News", "The 60-second story everyone will be talking about", "High"],
  ["AI & Tech", "The AI breakthrough that could change everyday life", "High"],
  ["Mystery", "Scientists found something strange hiding in plain sight", "Hot"],
  ["Interesting Facts", "7 facts that sound fake—but are actually true", "Rising"],
  ["History", "The forgotten event that changed the modern world", "Rising"],
  ["Viral Stories", "The internet cannot stop talking about this", "Hot"]
];

export default function Home() {
  const [generating, setGenerating] = useState(false);
  const generate = () => { setGenerating(true); setTimeout(() => setGenerating(false), 900); };
  return <div className="app">
    <aside className="sidebar"><div className="brand">NOYA<span>.</span>AI</div><nav className="nav">
      <a className="active" href="#">Overview</a><a href="#ideas">Ideas</a><a href="#pipeline">Content Pipeline</a><a href="#schedule">Schedule</a><a href="#analytics">Analytics</a><a href="#integrations">Integrations</a><a href="#settings">Settings</a>
    </nav></aside>
    <main className="main">
      <header className="top"><div><div className="eyebrow">Saturday, September 5 · Automation online</div><h1 className="title">YouTube Automation</h1><div className="muted">Create, produce and publish Shorts without touching an editor.</div></div><button className="button" onClick={generate}>{generating ? "Generating…" : "Generate viral ideas"}</button></header>
      <section className="grid"><div className="card"><div className="muted">Ideas today</div><div className="metric">42</div></div><div className="card"><div className="muted">In production</div><div className="metric">7</div></div><div className="card"><div className="muted">Scheduled</div><div className="metric">3</div></div><div className="card"><div className="muted">Avg. retention</div><div className="metric positive">71.8%</div></div></section>
      <section id="pipeline" className="section"><div className="section-title">Automation pipeline</div><div className="pipeline"><div className="step"><strong>1 · Research</strong><span className="muted">Sources + fact check</span></div><div className="step"><strong>2 · Script</strong><span className="muted">Original 60-sec copy</span></div><div className="step"><strong>3 · Voice</strong><span className="muted">Professional male AI</span></div><div className="step"><strong>4 · Video</strong><span className="muted">9:16 + subtitles</span></div><div className="step"><strong>5 · Publish</strong><span className="muted">YouTube at 8 PM</span></div></div></section>
      <section id="ideas" className="section"><div className="row"><div className="section-title">Viral idea engine</div><span className="status">Live research</span></div><div className="ideas">{ideas.map(([tag,title,heat])=><article className="idea" key={title}><span className="tag">{tag}</span><div className="row"><strong>{title}</strong><span className="muted">{heat}</span></div><p className="muted">AI score · 8.{Math.floor(Math.random()*9)} / 10</p><button className="button secondary">Create draft</button></article>)}</div></section>
      <section id="schedule" className="section"><div className="section-title">Upcoming publishing</div><div className="card"><table className="table"><thead><tr><th>Short</th><th>Status</th><th>Publish</th><th>Views</th></tr></thead><tbody><tr><td>AI breakthrough explained</td><td><span className="status">Ready</span></td><td>Today · 8:00 PM</td><td>—</td></tr><tr><td>7 facts that sound fake</td><td><span className="status">Scheduled</span></td><td>Tomorrow · 8:00 PM</td><td>—</td></tr><tr><td>Forgotten event in history</td><td><span className="status">Published</span></td><td>Yesterday</td><td>128K</td></tr></tbody></table></div></section>
      <section id="integrations" className="section"><div className="section-title">Integrations</div><div className="grid"><div className="card"><strong>YouTube</strong><p className="muted">OAuth upload + analytics</p><span className="status">Architecture ready</span></div><div className="card"><strong>WordPress</strong><p className="muted">Dashboard + content sync</p><span className="status">Architecture ready</span></div><div className="card"><strong>AI Providers</strong><p className="muted">Research, voice & video adapters</p><span className="status">Environment based</span></div><div className="card"><strong>Scheduler</strong><p className="muted">Daily 20:00 workflow</p><span className="status">Configured</span></div></div></section>
    </main><nav className="mobile-nav"><a href="#">Overview</a><a href="#ideas">Ideas</a><a href="#schedule">Schedule</a><a href="#analytics">Analytics</a></nav>
  </div>;
}
