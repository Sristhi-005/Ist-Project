"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeInput, type AnalysisReport } from "@/lib/analyzer";

const features = [
  {
    title: "Instant website audit",
    text: "Paste a URL or raw HTML, CSS, JS, React, PHP, or Python and get a full AI report in minutes.",
  },
  {
    title: "Actionable remediation",
    text: "Every issue includes plain-English explanations, severity levels, highlighted code, and corrected examples.",
  },
  {
    title: "AI chat advisor",
    text: "Ask follow-up questions and get guidance on security, SEO, performance, accessibility, and code quality.",
  },
];

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("https://example.com\nPaste HTML, CSS, JS, React, PHP, or Python here to inspect it.");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("web-doctor-user");
    const premiumFlag = window.localStorage.getItem("web-doctor-premium");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    setUser(storedUser);
    setIsPremium(premiumFlag === "true");
  }, [router]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (response.ok) {
        const data = (await response.json()) as AnalysisReport;
        setReport(data);
      } else {
        setReport(analyzeInput(input));
      }
    } catch {
      setReport(analyzeInput(input));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportPdf = () => {
    if (!report) return;
    window.print();
  };

  const logout = () => {
    window.localStorage.removeItem("web-doctor-user");
    setUser(null);
    router.push("/login");
  };

  const activatePremium = () => {
    window.localStorage.setItem("web-doctor-premium", "true");
    setIsPremium(true);
  };

  const premiumPlans = [
    {
      name: "Starter",
      price: "$19",
      highlight: false,
      features: ["3 scans per day", "Basic remediation", "Email support"],
    },
    {
      name: "Pro",
      price: "$49",
      highlight: true,
      features: ["Unlimited scans", "Priority AI insights", "Advanced security flags"],
    },
    {
      name: "Agency",
      price: "$99",
      highlight: false,
      features: ["Team workspaces", "Export-ready reports", "Priority onboarding"],
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-lg font-semibold text-cyan-300">
              WD
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200">WEB DOCTOR AI</p>
              <p className="text-xs text-slate-300">AI website analyzer</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              Welcome, {user}
            </span>
            {isPremium ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">
                Premium member
              </span>
            ) : (
              <button
                onClick={activatePremium}
                className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
              >
                Upgrade to Premium
              </button>
            )}
            <button
              onClick={logout}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              Lighthouse + GTmetrix + SonarQube, reimagined with AI
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Paste a website URL or code and let AI explain exactly what is wrong.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Web Doctor AI scans speed, SEO, accessibility, security, and code quality while translating each issue into simple guidance and practical fixes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#launch"
                className="rounded-full bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Start analyzing
              </a>
              <a
                href="#features"
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/15"
              >
                Explore features
              </a>
            </div>
          </div>

          <div id="launch" className="rounded-[32px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/90 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-cyan-200">Analysis workspace</p>
                  <p className="text-xs text-slate-400">URL, HTML, CSS, JS, React, PHP, or Python</p>
                </div>
                <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live demo
                </div>
              </div>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none"
                placeholder="Paste a URL or source code here"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={runAnalysis}
                  className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90"
                >
                  {isAnalyzing ? "Scanning..." : "Run AI scan"}
                </button>
                <button
                  onClick={exportPdf}
                  disabled={!report}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Export PDF
                </button>
              </div>

              {!isPremium && (
                <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-slate-100">
                  Upgrade to Premium to unlock advanced remediation, detailed security risk flags, and prioritized AI guidance.
                </div>
              )}

              {report ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-cyan-200">Overall score</p>
                      <p className="text-2xl font-semibold text-white">{report.score}/100</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{report.summary}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                    <p className="text-sm font-semibold text-white">Health breakdown</p>
                    <div className="mt-4 space-y-3">
                      {[
                        { label: "SEO", value: report.breakdown.seo },
                        { label: "Speed", value: report.breakdown.speed },
                        { label: "Accessibility", value: report.breakdown.accessibility },
                        { label: "Security", value: report.breakdown.security },
                        { label: "Code Quality", value: report.breakdown.quality },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex justify-between text-sm text-slate-300">
                            <span>{item.label}</span>
                            <span>{item.value}/100</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800">
                            <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {report.issues.map((issue) => (
                      <div key={issue.title} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-100">{issue.title}</p>
                          <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-300">
                            {issue.severity}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">{issue.detail}</p>
                        <p className="mt-2 text-sm text-cyan-200">Fix: {issue.fix}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                    <p className="text-sm font-semibold text-white">Recommended next steps</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                      {report.recommendations.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-cyan-300">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  The analyzer will highlight SEO, speed, accessibility, security, and code quality issues once you run a scan.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[28px] border border-amber-400/15 bg-amber-400/5 p-6 shadow-2xl shadow-amber-950/10 mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">Premium tier</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white">Unlock Premium insights</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Premium members receive deeper AI guidance, release-ready remediation, and advanced risk scoring for stronger audits.
              </p>
            </div>
            {!isPremium ? (
              <button
                onClick={activatePremium}
                className="self-start rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 md:self-center"
              >
                Activate Premium
              </button>
            ) : (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200">
                Premium activated
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {premiumPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[24px] border p-6 ${plan.highlight ? "border-amber-400/40 bg-amber-400/10" : "border-white/10 bg-white/8"}`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">{plan.name}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{plan.price}</p>
              <p className="mt-2 text-sm text-slate-300">per month</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {plan.features.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-cyan-300">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={activatePremium}
                className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition ${plan.highlight ? "bg-amber-400 text-slate-950 hover:bg-amber-300" : "border border-white/15 bg-white/10 text-white hover:bg-white/15"}`}
              >
                {isPremium ? "Active plan" : "Choose plan"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Product vision</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              A combination of Lighthouse, GTmetrix, SonarQube, and an AI co-pilot.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              The platform explains each issue in simple language, shows severity, highlights the problem, and gives corrected code so teams can fix things faster.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
