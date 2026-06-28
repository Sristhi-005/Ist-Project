export type Severity = "Low" | "Medium" | "High" | "Critical";

export type Issue = {
  title: string;
  severity: Severity;
  detail: string;
  fix: string;
};

export type AnalysisReport = {
  score: number;
  summary: string;
  issues: Issue[];
  recommendations: string[];
  breakdown: {
    seo: number;
    speed: number;
    accessibility: number;
    security: number;
    quality: number;
  };
};

export function analyzeInput(input: string): AnalysisReport {
  const raw = input.trim();
  const text = raw.toLowerCase();
  const isUrl = /https?:\/\//.test(text) || /www\./.test(text);
  const looksLikeCode = /<html|function|const |class |<?php|def /.test(text);

  if (!raw) {
    return {
      score: 0,
      summary: "Paste a URL or code snippet to generate a report.",
      issues: [],
      recommendations: ["Enter a website URL or source code to start the analysis."],
      breakdown: {
        seo: 0,
        speed: 0,
        accessibility: 0,
        security: 0,
        quality: 0,
      },
    };
  }

  const issues: Issue[] = [];

  if (!text.includes("<title") && !text.includes("meta") && !text.includes("og:")) {
    issues.push({
      title: "SEO metadata is missing",
      severity: "High",
      detail: "The page lacks clear title and meta descriptions, which weakens visibility in search engines.",
      fix: "Add a unique title tag and meta description that reflect the page purpose.",
    });
  }

  if (!text.includes("alt=") && !text.includes("aria-")) {
    issues.push({
      title: "Accessibility support is weak",
      severity: "High",
      detail: "Images or interactive elements are not clearly described for assistive technologies.",
      fix: "Add descriptive alt text and ARIA labels where appropriate.",
    });
  }

  if (!text.includes("lazy") && !text.includes("loading=") && !text.includes("webp")) {
    issues.push({
      title: "Performance can be improved",
      severity: "Medium",
      detail: "The content may be loading heavier assets than necessary, which can slow the experience.",
      fix: "Compress images, lazy-load media, and defer non-essential JavaScript.",
    });
  }

  if (!text.includes("https") && !text.includes("sanitize") && !text.includes("helmet")) {
    issues.push({
      title: "Security hardening is missing",
      severity: "Medium",
      detail: "The sample does not show obvious protection for user input or secure transport.",
      fix: "Use HTTPS, validate user input, and sanitize dynamic content before rendering.",
    });
  }

  if (text.includes("console.log") || text.includes("alert(")) {
    issues.push({
      title: "Debug code is still present",
      severity: "Low",
      detail: "Console logs or alerts can clutter production code and expose implementation details.",
      fix: "Remove debug statements and replace them with structured logging if needed.",
    });
  }

  if (!isUrl && !looksLikeCode) {
    issues.push({
      title: "Input type is unclear",
      severity: "Low",
      detail: "The provided text does not clearly look like a URL or source code snippet.",
      fix: "Paste a URL, HTML, CSS, or JavaScript sample to get a richer report.",
    });
  }

  const severityWeights: Record<Severity, number> = {
    Low: 4,
    Medium: 7,
    High: 10,
    Critical: 14,
  };

  const penalty = issues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
  const score = Math.max(40, 100 - penalty);

  const seo = Math.max(40, 100 - (text.includes("<title") ? 10 : 28));
  const speed = Math.max(45, 100 - (text.includes("lazy") ? 12 : 24));
  const accessibility = Math.max(42, 100 - (text.includes("alt=") || text.includes("aria-") ? 12 : 26));
  const security = Math.max(45, 100 - (text.includes("https") || text.includes("sanitize") ? 12 : 24));
  const quality = Math.max(44, 100 - (text.includes("console.log") || text.includes("alert(") ? 16 : 18));

  return {
    score,
    summary: isUrl
      ? "The URL looks promising, but several optimization opportunities remain."
      : looksLikeCode
        ? "The code sample shows a solid structure, though some quality and accessibility issues are visible."
        : "The input was received, but a clearer URL or code sample would improve the report.",
    issues,
    recommendations: [
      "Prioritize high-severity fixes first.",
      "Improve SEO metadata and accessibility labels.",
      "Reduce unnecessary assets to improve load speed.",
    ],
    breakdown: {
      seo,
      speed,
      accessibility,
      security,
      quality,
    },
  };
}
