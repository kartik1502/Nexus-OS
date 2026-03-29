import { ProjectAnalysis, IssueDetail, FeatureInsight, FeatureIdea } from "./types";

export function parseMarkdownReport(rawMarkdown: string): ProjectAnalysis {
  let healthScore = 0;
  let criticalIssues = 0;
  let majorIssues = 0;
  let minorIssues = 0;
  const topFixes: string[] = [];
  let executiveSummary = "";
  const detailedIssues: IssueDetail[] = [];
  const featureInsights: FeatureInsight[] = [];
  const featureIdeas: FeatureIdea[] = [];

  // Extract Health Score
  const scoreMatch = rawMarkdown.match(/Overall Health Score:\s*([\d.]+)/i);
  if (scoreMatch) {
    healthScore = parseFloat(scoreMatch[1]);
  }

  // Extract issue counts
  const criticalCountMatch = rawMarkdown.match(/Critical\s*\|\s*(\d+)/i);
  if (criticalCountMatch) criticalIssues = parseInt(criticalCountMatch[1], 10);

  const majorCountMatch = rawMarkdown.match(/Major\s*\|\s*(\d+)/i);
  if (majorCountMatch) majorIssues = parseInt(majorCountMatch[1], 10);

  const minorCountMatch = rawMarkdown.match(/Minor\s*\|\s*(\d+)/i);
  if (minorCountMatch) minorIssues = parseInt(minorCountMatch[1], 10);

  // Extract Executive Summary
  const executiveSectionRegex = /## Executive Summary([\s\S]*?)---/i;
  const executiveMatch = rawMarkdown.match(executiveSectionRegex);
  if (executiveMatch) {
    const section = executiveMatch[1];
    const summaryMatch = section.match(/\n\s*\n([\s\S]*?)\n\s*\n\*\*Top/i);
    if (summaryMatch) {
      executiveSummary = summaryMatch[1].trim();
    }
  }

  // Extract Top Fixes
  const urgentFixesRegex = /\*\*Top\s*\d+\s*(?:Most\s+)?Urgent Fixes:\*\*([\s\S]*?)(?:\n\s*\n|---)/i;
  const fixesMatch = rawMarkdown.match(urgentFixesRegex);
  if (fixesMatch && fixesMatch[1]) {
    const lines = fixesMatch[1].split("\n").filter((line) => line.trim().length > 0);
    lines.forEach((line) => {
      if (/^(\d+\.|-|\*)\s/.test(line.trim())) {
        let cleaned = line.trim().replace(/^(\d+\.|-|\*)\s+/, "").replace(/\*\*/g, "").trim();
        if (cleaned) topFixes.push(cleaned);
      }
    });
  }

  // Helper to parse detailed issues
  const parseIssuesBySeverity = (severity: "CRITICAL" | "MAJOR" | "MINOR", sectionLabel: string) => {
    const sectionRegex = new RegExp(`## (?:🔴 |🟡 |🟢 )?${sectionLabel} Issues[\\s\\S]*?---`, "i");
    const sectionMatch = rawMarkdown.match(sectionRegex);
    if (sectionMatch) {
      const issues = sectionMatch[0].split("###").slice(1);
      issues.forEach((issueBlock) => {
        const titleMatch = issueBlock.match(/\[(.*?)\] (.*(?:\n|$))/);
        if (titleMatch) {
          const id = titleMatch[1];
          const title = titleMatch[2].trim();
          
          const dimension = (issueBlock.match(/\*\*Dimension:\*\*\s*(.*)/i)?.[1] || "").trim();
          const location = (issueBlock.match(/\*\*Location:\*\*\s*(.*)/i)?.[1] || "").trim();
          const descriptionMatch = issueBlock.match(/\*\*Description:\*\*\s*([\s\S]*?)(?=\*\*Impact:|$)/i);
          const impactMatch = issueBlock.match(/\*\*Impact:\*\*\s*([\s\S]*?)(?=\*\*Fix:|$)/i);
          const fixMatch = issueBlock.match(/\*\*Fix:\*\*\s*([\s\S]*?)(?=\n---|\n#|$)/i);

          detailedIssues.push({
            id,
            title,
            severity,
            dimension,
            location,
            description: descriptionMatch ? descriptionMatch[1].trim() : "",
            impact: impactMatch ? impactMatch[1].trim() : "",
            fix: fixMatch ? fixMatch[1].trim() : "",
          });
        }
      });
    }
  };

  parseIssuesBySeverity("CRITICAL", "Critical");
  parseIssuesBySeverity("MAJOR", "Major");
  parseIssuesBySeverity("MINOR", "Minor");

  // Extract Feature Insights
  const insightsSectionRegex = /## Existing Feature Improvement Insights([\s\S]*?)---/gi;
  let insightMatch;
  const insightsContent = rawMarkdown.match(/## Existing Feature Improvement Insights([\s\S]*?)##/i);
  if (insightsContent) {
    const featureBlocks = insightsContent[1].split(/\*\*Feature:\*\* /).slice(1);
    featureBlocks.forEach(block => {
      const name = block.split("\n")[0].trim();
      const currentState = (block.match(/\*\*Current State:\*\*\s*(.*)/i)?.[1] || "").trim();
      const improvement = (block.match(/\*\*Improvement:\*\*\s*(.*)/i)?.[1] || "").trim();
      if (name) featureInsights.push({ name, currentState, improvement });
    });
  }

  // Extract Feature Ideas
  const ideasContent = rawMarkdown.match(/## 💡 Good-to-Have Feature Ideas([\s\S]*?)## Metrics Dashboard/i);
  if (ideasContent) {
    const featureBlocks = ideasContent[1].split(/\*\*Feature:\*\* /).slice(1);
    featureBlocks.forEach(block => {
      const name = block.split("\n")[0].trim();
      const value = (block.match(/\*\*Value:\*\*\s*(.*)/i)?.[1] || "").trim();
      const implementationHint = (block.match(/\*\*Implementation Hint:\*\*\s*(.*)/i)?.[1] || "").trim();
      const complexity = (block.match(/\*\*Complexity:\*\*\s*(Low|Medium|High)/i)?.[1] || "Medium") as any;
      const priority = (block.match(/\*\*Priority:\*\*\s*(Low|Medium|High)/i)?.[1] || "Medium") as any;
      if (name) featureIdeas.push({ name, value, implementationHint, complexity, priority });
    });
  }

  return {
    healthScore,
    criticalIssues,
    majorIssues,
    minorIssues,
    executiveSummary,
    topFixes,
    detailedIssues,
    featureInsights,
    featureIdeas,
    rawMarkdown,
  };
}
