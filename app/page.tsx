"use client";

import { useState, useEffect } from "react";
import { Review, MOCK_REVIEWS, BUSINESSES } from "@/lib/mockData";

const STARS = (n: number, size = 14) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < n ? "#fbbf24" : "#3f3f46", fontSize: size }}>★</span>
  ));

const AVATAR_COLORS = [
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#fccb90,#d57eeb)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [selectedBiz, setSelectedBiz] = useState<string>("all");
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [posted, setPosted] = useState<Record<string, boolean>>({});
  const [brandTone, setBrandTone] = useState<"professional" | "friendly" | "casual">("friendly");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "posted">("pending");

  useEffect(() => {
    // Check if API key is configured
    fetch("/api/reviews").then(r => r.json()).then(() => {}).catch(() => {});
  }, []);

  const filtered = reviews.filter(r => {
    const bizMatch = selectedBiz === "all" || r.business === selectedBiz;
    const statusMatch = r.status === activeTab;
    return bizMatch && statusMatch;
  });

  const pendingCount = reviews.filter(r => r.status === "pending").length;
  const approvedCount = reviews.filter(r => r.status === "approved").length;
  const postedCount = reviews.filter(r => r.status === "posted").length;

  async function handleGenerate(review: Review) {
    setGenerating(g => ({ ...g, [review.id]: true }));
    try {
      const res = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText: review.text,
          rating: review.rating,
          reviewerName: review.reviewer,
          businessName: review.business,
          businessCategory: review.category,
          brandTone,
        }),
      });
      const data = await res.json();
      setIsDemoMode(data.provider === "demo" || data.provider === "fallback");
      setReviews(prev =>
        prev.map(r => r.id === review.id ? { ...r, generatedReply: data.reply } : r)
      );
    } catch {
      setReviews(prev =>
        prev.map(r => r.id === review.id ? { ...r, generatedReply: "Failed to generate. Please try again." } : r)
      );
    } finally {
      setGenerating(g => ({ ...g, [review.id]: false }));
    }
  }

  function handleApprove(id: string) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  }

  function handlePost(id: string) {
    setPosted(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "posted" } : r));
    }, 1200);
  }

  function handleEditReply(id: string, value: string) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, generatedReply: value } : r));
  }

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 240, background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", padding: "0", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto"
      }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, letterSpacing: -0.5 }}>
            Reply<span style={{ color: "var(--accent)" }}>IQ</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>AI Review Management</div>
        </div>

        {/* AMD Badge */}
        <div style={{
          margin: "12px 12px 0",
          background: "rgba(227,17,17,0.08)",
          border: "1px solid rgba(227,17,17,0.2)",
          borderRadius: 8, padding: "8px 10px",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <div style={{
            background: "var(--amd-red)", color: "#fff",
            fontSize: 9, fontWeight: 800, letterSpacing: 1,
            padding: "2px 5px", borderRadius: 3
          }}>AMD</div>
          <div style={{ fontSize: 11, color: "#f87171", lineHeight: 1.3 }}>
            Powered by Gemma 3 on AMD GPU via Fireworks AI
          </div>
        </div>

        <nav style={{ padding: "12px 8px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", padding: "4px 8px 8px" }}>Locations</div>
          {[{ id: "all", name: "All Locations", count: reviews.filter(r => r.status === "pending").length }, ...BUSINESSES.map(b => ({ id: b.name, name: b.name, count: b.pendingCount }))].map(b => (
            <button key={b.id} onClick={() => setSelectedBiz(b.id)} style={{
              width: "100%", textAlign: "left", padding: "8px 10px",
              borderRadius: 6, border: "none",
              background: selectedBiz === b.id ? "rgba(163,230,53,0.1)" : "transparent",
              color: selectedBiz === b.id ? "var(--accent)" : "var(--muted2)",
              fontSize: 13, fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", marginBottom: 2, transition: "all 0.15s"
            }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{b.name}</span>
              {b.count > 0 && (
                <span style={{
                  background: "var(--accent)", color: "#09090b",
                  fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
                  borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px"
                }}>{b.count}</span>
              )}
            </button>
          ))}

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", padding: "16px 8px 8px" }}>Settings</div>
          <div style={{ padding: "0 8px" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Brand Tone</div>
            {(["professional", "friendly", "casual"] as const).map(t => (
              <button key={t} onClick={() => setBrandTone(t)} style={{
                width: "100%", textAlign: "left", padding: "6px 10px",
                borderRadius: 6, border: "1px solid",
                borderColor: brandTone === t ? "var(--accent-border)" : "transparent",
                background: brandTone === t ? "var(--accent-dim)" : "transparent",
                color: brandTone === t ? "var(--accent)" : "var(--muted2)",
                fontSize: 12, fontWeight: 500, cursor: "pointer", marginBottom: 2,
                textTransform: "capitalize", transition: "all 0.15s"
              }}>{t}</button>
            ))}
          </div>
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)" }}>
          {isDemoMode ? (
            <div style={{ background: "var(--yellow-dim)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 6, padding: "8px 10px", color: "#fbbf24" }}>
              ⚡ Demo Mode — add FIREWORKS_API_KEY for live AI
            </div>
          ) : (
            <div style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: 6, padding: "8px 10px", color: "var(--accent)" }}>
              ✓ Live — Gemma 3 on AMD GPU
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* TOPBAR */}
        <header style={{
          padding: "16px 28px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--surface)", position: "sticky", top: 0, zIndex: 10
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, fontFamily: "'Instrument Serif',serif", letterSpacing: -0.5 }}>
              {selectedBiz === "all" ? "All Locations" : selectedBiz}
            </h1>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {pendingCount} pending · {BUSINESSES.length} locations connected
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <StatPill label="Avg Rating" value={avgRating} color="var(--yellow)" />
            <StatPill label="Replied" value={`${Math.round((postedCount / reviews.length) * 100)}%`} color="var(--accent)" />
            <StatPill label="Total" value={reviews.length.toString()} color="var(--blue)" />
          </div>
        </header>

        {/* TABS */}
        <div style={{ padding: "0 28px", borderBottom: "1px solid var(--border)", display: "flex", gap: 0, background: "var(--surface)" }}>
          {([
            { key: "pending", label: "Pending", count: pendingCount },
            { key: "approved", label: "Approved", count: approvedCount },
            { key: "posted", label: "Posted", count: postedCount },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "12px 16px", border: "none", background: "transparent",
              color: activeTab === tab.key ? "var(--accent)" : "var(--muted)",
              borderBottom: `2px solid ${activeTab === tab.key ? "var(--accent)" : "transparent"}`,
              fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", gap: 6, alignItems: "center",
              transition: "all 0.15s"
            }}>
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? "var(--accent-dim)" : "var(--surface2)",
                color: activeTab === tab.key ? "var(--accent)" : "var(--muted)",
                fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* REVIEW LIST */}
        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            filtered.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                generating={!!generating[review.id]}
                isPosting={!!posted[review.id]}
                onGenerate={() => handleGenerate(review)}
                onApprove={() => handleApprove(review.id)}
                onPost={() => handlePost(review.id)}
                onEditReply={(v) => handleEditReply(review.id, v)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: "var(--surface2)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "6px 12px", textAlign: "center"
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: "'Instrument Serif', serif" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

function EmptyState({ tab }: { tab: string }) {
  const msgs: Record<string, { icon: string; title: string; sub: string }> = {
    pending: { icon: "✓", title: "All caught up!", sub: "No pending reviews. Nice work." },
    approved: { icon: "📋", title: "Nothing approved yet", sub: "Generate and approve replies from the Pending tab." },
    posted: { icon: "🚀", title: "No replies posted yet", sub: "Approve replies then post them to Google." },
  };
  const m = msgs[tab];
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{m.icon}</div>
      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{m.title}</div>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{m.sub}</div>
    </div>
  );
}

function ReviewCard({
  review, generating, isPosting, onGenerate, onApprove, onPost, onEditReply
}: {
  review: Review;
  generating: boolean;
  isPosting: boolean;
  onGenerate: () => void;
  onApprove: () => void;
  onPost: () => void;
  onEditReply: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const ratingColor = review.rating >= 4 ? "var(--accent)" : review.rating === 3 ? "var(--yellow)" : "var(--red)";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Review Header */}
      <div style={{ padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: getAvatarColor(review.reviewer),
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff"
        }}>{review.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{review.reviewer}</span>
              <span style={{ display: "flex", gap: 1 }}>{STARS(review.rating)}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
                background: review.rating >= 4 ? "rgba(163,230,53,0.1)" : review.rating === 3 ? "var(--yellow-dim)" : "var(--red-dim)",
                color: ratingColor
              }}>{review.rating}.0</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>{review.date}</div>
          </div>
          <p style={{ fontSize: 13, color: "#d4d4d8", lineHeight: 1.7 }}>{review.text}</p>
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
            📍 {review.business} · Google Review
          </div>
        </div>
      </div>

      {/* AI Reply Section */}
      {review.generatedReply ? (
        <div style={{
          margin: "0 16px 16px",
          background: "rgba(163,230,53,0.04)",
          border: "1px solid var(--accent-border)",
          borderRadius: 8, overflow: "hidden"
        }}>
          <div style={{
            padding: "8px 14px", borderBottom: "1px solid var(--accent-border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(163,230,53,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                background: "var(--accent)", color: "#09090b",
                fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", padding: "2px 7px", borderRadius: 4
              }}>Gemma 3 · AMD</span>
              <span style={{ fontSize: 11, color: "var(--accent)" }}>Reply Draft</span>
            </div>
            <button onClick={() => setEditing(!editing)} style={{
              fontSize: 11, color: "var(--muted)", background: "none", border: "none",
              cursor: "pointer", padding: "2px 6px"
            }}>{editing ? "Done" : "Edit"}</button>
          </div>
          <div style={{ padding: 14 }}>
            {editing ? (
              <textarea
                value={review.generatedReply}
                onChange={e => onEditReply(e.target.value)}
                style={{
                  width: "100%", background: "var(--surface2)", border: "1px solid var(--border2)",
                  borderRadius: 6, padding: "10px 12px", color: "var(--text)",
                  fontSize: 13, lineHeight: 1.7, resize: "vertical", minHeight: 80, outline: "none"
                }}
              />
            ) : (
              <p style={{ fontSize: 13, color: "#d4d4d8", lineHeight: 1.7 }}>{review.generatedReply}</p>
            )}
          </div>
          {review.status === "pending" && (
            <div style={{
              padding: "10px 14px", borderTop: "1px solid var(--accent-border)",
              display: "flex", gap: 8, justifyContent: "flex-end"
            }}>
              <button onClick={onGenerate} style={{
                background: "none", border: "1px solid var(--border2)", color: "var(--muted2)",
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500
              }}>↺ Regenerate</button>
              <button onClick={onApprove} style={{
                background: "var(--accent)", border: "none", color: "#09090b",
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700
              }}>✓ Approve Reply</button>
            </div>
          )}
          {review.status === "approved" && (
            <div style={{
              padding: "10px 14px", borderTop: "1px solid var(--accent-border)",
              display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{ fontSize: 11, color: "var(--accent)" }}>✓ Approved — ready to post</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={onGenerate} style={{
                  background: "none", border: "1px solid var(--border2)", color: "var(--muted2)",
                  padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500
                }}>↺ Regenerate</button>
                <button onClick={onPost} disabled={isPosting} style={{
                  background: isPosting ? "var(--border2)" : "#1d4ed8", border: "none",
                  color: "#fff", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                  opacity: isPosting ? 0.7 : 1, transition: "all 0.2s"
                }}>
                  {isPosting ? "Posting..." : "📤 Post to Google"}
                </button>
              </div>
            </div>
          )}
          {review.status === "posted" && (
            <div style={{ padding: "10px 14px", borderTop: "1px solid var(--accent-border)" }}>
              <span style={{ fontSize: 11, color: "var(--blue)" }}>✓ Posted to Google Business · {review.date}</span>
            </div>
          )}
        </div>
      ) : review.status === "pending" ? (
        <div style={{ padding: "0 16px 16px" }}>
          <button onClick={onGenerate} disabled={generating} style={{
            width: "100%", padding: "10px", borderRadius: 8,
            border: "1px dashed var(--border2)", background: generating ? "var(--surface2)" : "transparent",
            color: generating ? "var(--muted)" : "var(--muted2)",
            fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s", cursor: generating ? "not-allowed" : "pointer"
          }}>
            {generating ? (
              <>
                <SpinnerIcon />
                Gemma 3 generating reply on AMD GPU...
              </>
            ) : (
              <>✨ Generate AI Reply with Gemma 3</>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30 60" />
    </svg>
  );
}
