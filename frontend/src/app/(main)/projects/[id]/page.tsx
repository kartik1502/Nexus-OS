"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  FolderGit2, 
  GitBranch, 
  UploadCloud, 
  ChevronLeft, 
  FileText, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  LayoutGrid, 
  Download,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
  Zap,
  Plus,
  Trash2,
  X
} from "lucide-react";

import { getProjectById, saveProjectAnalysis, addRepoToProject, deleteRepoFromProject } from "@/lib/api";
import { Project, ProjectAnalysis, IssueDetail, FeatureInsight, FeatureIdea, Repo } from "@/lib/types";
import { parseMarkdownReport } from "@/lib/report-parser";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";
import { AddServiceDialog } from "@/components/ui/add-service-dialog";
import { ConfirmActionDialog } from "@/components/ui/confirm-action-dialog";

// Collapsible Issue Card
function DetailedIssueCard({ issue }: { issue: IssueDetail }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className={cn("rounded-[var(--radius-lg)] border bg-bg-surface transition-all duration-200", isOpen ? "border-border-active shadow-md" : "border-border hover:border-border-hover shadow-sm")}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
          <Badge variant={issue.severity === "CRITICAL" ? "danger" : issue.severity === "MAJOR" ? "warning" : "success"} className="h-6">
            {issue.id}
          </Badge>
          <div>
            <h4 className="font-semibold text-text-primary">{issue.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {issue.dimension}</span>
              <span className="flex items-center gap-1">• {issue.location}</span>
            </div>
          </div>
        </div>
        {isOpen ? <ChevronDown className="h-5 w-5 text-text-muted" /> : <ChevronRight className="h-5 w-5 text-text-muted" />}
      </button>
      
      {isOpen && (
        <div className="border-t border-border px-4 py-4 space-y-4 animate-fade-in bg-bg-primary/30">
          <div>
            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-text-primary/70 mb-1">Description</h5>
            <p className="text-[13px] text-text-primary font-medium leading-relaxed">{issue.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-danger/20 bg-danger/[0.04]">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-danger mb-1 brightness-150">Impact</h5>
              <p className="text-[12px] text-text-primary font-medium leading-relaxed">{issue.impact}</p>
            </div>
            <div className="p-3 rounded-lg border border-success/20 bg-success/[0.04]">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-success mb-1 brightness-150">Recommended Fix</h5>
              <div className="prose prose-sm prose-p:my-0 prose-code:text-accent prose-code:bg-accent/10 prose-code:rounded prose-code:px-1 font-medium text-text-primary text-xs max-w-none mt-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.fix}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const [activeRepoId, setActiveRepoId] = React.useState<string | null>(null);
  
  // Repo Management states
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [repoToDelete, setRepoToDelete] = React.useState<string | null>(null);
  
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (params.id) {
      const data = getProjectById(params.id as string);
      if (data) {
        setProject(data);
        if (data.isMicroservice && data.repos.length > 0) {
          setActiveRepoId(data.repos[0].id);
        }
      } else {
        router.push("/projects");
      }
      setLoading(false);
    }
  }, [params.id, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target?.result as string;
      const parsedData = parseMarkdownReport(rawText);
      
      if (project) {
        if (project.isMicroservice && activeRepoId) {
          saveProjectAnalysis(project.id, parsedData, activeRepoId);
          setProject(prev => {
            if (!prev) return prev;
            const updatedRepos = prev.repos.map(r => 
              r.id === activeRepoId ? { ...r, analysisReport: parsedData } : r
            );
            return { ...prev, repos: updatedRepos };
          });
        } else {
          saveProjectAnalysis(project.id, parsedData);
          setProject({ ...project, analysisReport: parsedData });
        }
      }
      setIsUploading(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const handleAddRepo = (name: string, url: string) => {
    if (!project) return;

    const newRepo = addRepoToProject(project.id, name, url);
    if (newRepo) {
      setProject({ ...project, repos: [...project.repos, newRepo] });
      setActiveRepoId(newRepo.id);
      setIsAddDialogOpen(false);
    }
  };

  const confirmDeleteRepo = (repoId: string) => {
    setRepoToDelete(repoId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteRepo = () => {
    if (!project || !repoToDelete) return;

    const success = deleteRepoFromProject(project.id, repoToDelete);
    if (success) {
      const remainingRepos = project.repos.filter(r => r.id !== repoToDelete);
      setProject({ ...project, repos: remainingRepos });
      if (activeRepoId === repoToDelete) {
        setActiveRepoId(remainingRepos.length > 0 ? remainingRepos[0].id : null);
      }
    }
    setRepoToDelete(null);
  };

  if (loading || !project) return <div className="p-8 text-center text-text-muted">Loading...</div>;

  const currentAnalysis = project.isMicroservice
    ? project.repos.find(r => r.id === activeRepoId)?.analysisReport
    : project.analysisReport;

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/projects" className="hover:text-text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" /> Projects
        </Link>
        <span>/</span>
        <span className="text-text-primary font-medium">{project.name}</span>
        {project.isMicroservice && (
          <Badge variant="info" className="ml-2 text-[10px] tracking-widest px-1.5 py-0">MICROSERVICES</Badge>
        )}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between rounded-[var(--radius-lg)] border border-border bg-bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-accent/10 text-accent">
            {project.isMicroservice ? <LayoutGrid className="h-7 w-7" /> : <FolderGit2 className="h-7 w-7" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">{project.name}</h1>
            <p className="mt-1 text-sm text-text-secondary max-w-xl">{project.description}</p>
            
            {/* Display monolithic repos on header only if NOT microservice so it's not redundant */}
            {!project.isMicroservice && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {project.repos.map((repo, i) => (
                  <a 
                    key={i} 
                    href={repo.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent transition-colors bg-bg-primary px-2.5 py-1.5 rounded-md border border-border"
                  >
                    <GitBranch className="h-3.5 w-3.5" />
                    {repo.name || repo.url.replace('https://github.com/', '')}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Only monolith projects upload at the header level. Microservices upload at the repo level. */}
        {!project.isMicroservice && (
          <div className="flex flex-col gap-3 shrink-0">
            <input 
              type="file" 
              accept=".md,text/markdown" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              className="w-full md:w-auto gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Analysis
            </Button>
            {currentAnalysis && (
              <p className="text-[11px] text-text-muted text-right">Report generated recently</p>
            )}
          </div>
        )}
      </div>

      {project.isMicroservice && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {project.repos.map((repo) => {
              const isActive = activeRepoId === repo.id;
              const hasReport = !!repo.analysisReport;
              return (
                <button
                  key={repo.id}
                  onClick={() => setActiveRepoId(repo.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap text-sm font-medium",
                    isActive 
                      ? "bg-accent/10 text-accent border-accent/20" 
                      : "bg-bg-surface border-border hover:border-text-muted text-text-primary hover:text-accent"
                  )}
                >
                  {repo.name}
                  {hasReport && (
                    <div className={cn("h-1.5 w-1.5 rounded-full shrink-0",
                      repo.analysisReport!.healthScore >= 7 ? "bg-success" : 
                      repo.analysisReport!.healthScore >= 5 ? "bg-warning" : "bg-danger"
                    )} />
                  )}
                </button>
              )
            })}
            {/* Add Service Button */}
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-dashed border-border hover:border-accent hover:text-accent transition-all text-sm font-medium text-text-muted bg-bg-surface"
            >
              <Plus className="h-4 w-4" /> Add Service
            </button>
          </div>
          
          <div className="w-full">
            {/* The active repository's header/uploader */}
            <div className="flex items-center justify-between bg-bg-surface border border-border rounded-t-[var(--radius-lg)] p-4 border-b-0 space-y-0">
              <div className="flex flex-col">
                 <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-text-primary">
                      {project.repos.find(r => r.id === activeRepoId)?.name || "No Service Selected"} Ecosystem
                    </h2>
                    {activeRepoId && (
                      <button 
                        onClick={() => confirmDeleteRepo(activeRepoId)}
                        className="text-text-muted hover:text-danger transition-colors p-1"
                        title="Delete this service"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                 </div>
                 {activeRepoId && (
                   <a 
                     href={project.repos.find(r => r.id === activeRepoId)?.url}
                     target="_blank"  
                     className="text-xs text-text-secondary font-medium hover:text-accent flex items-center gap-1 mt-1 transition-colors"
                   >
                     <GitBranch className="h-3 w-3" /> View Source
                   </a>
                 )}
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <input 
                  type="file" 
                  accept=".md,text/markdown" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={isUploading}
                  variant="outline"
                  className="gap-2 h-9 text-xs"
                  disabled={!activeRepoId}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  {activeRepoId ? "Upload Spec (.md)" : "Select Service first"}
                </Button>
              </div>
            </div>

            {/* Microservice Insights Dashboard - Stacked Layout */}
            <div className="bg-bg-surface border border-border p-6 rounded-b-[var(--radius-lg)] space-y-8">
              {currentAnalysis ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      label="Health Score" 
                      value={`${currentAnalysis.healthScore} / 10`}
                      icon={currentAnalysis.healthScore >= 7 ? CheckCircle2 : currentAnalysis.healthScore >= 5 ? AlertTriangle : AlertCircle}
                      accentColor={currentAnalysis.healthScore >= 7 ? "text-success" : currentAnalysis.healthScore >= 5 ? "text-warning" : "text-danger"}
                    />
                    <StatCard 
                      label="Critical" 
                      value={currentAnalysis.criticalIssues}
                      icon={AlertCircle}
                      accentColor="text-danger"
                    />
                    <StatCard 
                      label="Major" 
                      value={currentAnalysis.majorIssues}
                      icon={AlertTriangle}
                      accentColor="text-warning"
                    />
                    <StatCard 
                      label="Minor" 
                      value={currentAnalysis.minorIssues}
                      icon={CheckCircle2}
                      accentColor="text-success"
                    />
                  </div>

                  {/* Executive Summary & Top Fixes */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-border">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" /> Executive Summary
                      </h3>
                      <p className="text-sm text-text-primary font-medium leading-relaxed bg-bg-primary/50 p-4 rounded-xl border border-border">
                        {currentAnalysis.executiveSummary || "No executive summary available for this report module."}
                      </p>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border bg-bg-surface">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <Download className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">Source Document</p>
                            <p className="text-xs text-text-muted">Original markdown analysis report</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(currentAnalysis.rawMarkdown, `${project.repos.find(r => r.id === activeRepoId)?.name}-analysis.md`)}
                        >
                          Download .md
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Zap className="h-5 w-5 text-danger" /> Urgent Fixes
                      </h3>
                      <div className="space-y-3">
                        {currentAnalysis.topFixes.map((fix, idx) => (
                           <div key={idx} className="flex gap-3 p-3 rounded-lg border border-border bg-bg-surface hover:border-danger/30 transition-colors group">
                             <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded bg-danger/10 text-xs font-bold text-danger">
                               {idx + 1}
                             </span>
                             <div className="prose prose-sm prose-p:my-0 prose-code:text-accent prose-code:bg-accent/10 prose-code:rounded prose-code:px-1 font-medium text-text-secondary text-xs max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{fix}</ReactMarkdown>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Issue Deep Dive Stack */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-accent" /> Issue Deep Dive
                    </h3>
                    <div className="space-y-3">
                      {currentAnalysis.detailedIssues?.length > 0 ? (
                        currentAnalysis.detailedIssues.map((issue, idx) => (
                          <DetailedIssueCard key={issue.id + idx} issue={issue} />
                        ))
                      ) : (
                        <p className="text-sm text-text-muted p-8 text-center border border-dashed border-border rounded-xl">
                          No detailed issues extracted from this report.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Feature Insights & Ideas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-border">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-warning" /> Feature Insights
                      </h3>
                      <div className="space-y-4">
                        {currentAnalysis.featureInsights?.map((insight, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-bg-primary/30 space-y-2">
                            <h4 className="text-sm font-bold text-text-primary">{insight.name}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase text-text-primary/60 brightness-150">Current State</span>
                                <p className="text-[13px] text-text-primary font-medium leading-normal mt-0.5">{insight.currentState}</p>
                              </div>
                              <div className="pt-2 border-t border-border/10">
                                <span className="text-[10px] font-extrabold uppercase text-accent brightness-150">Improvement</span>
                                <p className="text-[13px] text-text-primary font-medium leading-normal mt-0.5">{insight.improvement}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <FolderGit2 className="h-5 w-5 text-success" /> Future Roadmap
                      </h3>
                      <div className="space-y-4">
                        {currentAnalysis.featureIdeas?.map((idea, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-bg-surface shadow-sm space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-bold text-text-primary">{idea.name}</h4>
                              <div className="flex gap-1">
                                <Badge variant="muted" className="text-[9px] px-1.5 py-0 border-border/50 text-text-primary">[{idea.priority}]</Badge>
                                <Badge variant="muted" className="text-[9px] px-1.5 py-0 border-border/50 text-text-primary">[{idea.complexity}]</Badge>
                              </div>
                            </div>
                            <p className="text-[13px] text-text-primary font-bold bg-success/10 p-3 rounded-lg border border-success/20 italic leading-snug">
                             "{idea.value}"
                            </p>
                            <div>
                               <span className="text-[10px] font-extrabold uppercase text-text-primary/60 brightness-150">Implementation Hint</span>
                               <p className="text-[13px] text-text-primary font-medium leading-relaxed mt-1 opacity-90">{idea.implementationHint}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center items-center flex flex-col opacity-60">
                   <FileText className="h-12 w-12 text-text-muted mb-4" />
                   <p className="text-base font-semibold text-text-primary">Awaiting Analysis Report</p>
                   <p className="text-sm text-text-secondary max-w-xs mt-2">
                     Select an exported repo scanner report to initialize the complete insights stack.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Monolithic Insights Dashboard */}
      {!project.isMicroservice && (
        currentAnalysis ? (
          <div className="bg-bg-surface border border-border p-6 rounded-[var(--radius-lg)] space-y-8 animate-fade-in shadow-sm">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <LayoutGrid className="h-6 w-6 text-accent" /> Project Insights
                </h2>
                <div className="flex items-center gap-3">
                   <input 
                    type="file" 
                    accept=".md,text/markdown" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="h-4 w-4" /> Update Spec
                  </Button>
                </div>
             </div>

             {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="Health Score" 
                value={`${currentAnalysis.healthScore} / 10`}
                icon={currentAnalysis.healthScore >= 7 ? CheckCircle2 : currentAnalysis.healthScore >= 5 ? AlertTriangle : AlertCircle}
                accentColor={currentAnalysis.healthScore >= 7 ? "text-success" : currentAnalysis.healthScore >= 5 ? "text-warning" : "text-danger"}
              />
              <StatCard 
                label="Critical" 
                value={currentAnalysis.criticalIssues}
                icon={AlertCircle}
                accentColor="text-danger"
              />
              <StatCard 
                label="Major" 
                value={currentAnalysis.majorIssues}
                icon={AlertTriangle}
                accentColor="text-warning"
              />
              <StatCard 
                label="Minor" 
                value={currentAnalysis.minorIssues}
                icon={CheckCircle2}
                accentColor="text-success"
              />
            </div>

            {/* Executive Summary & Top Fixes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-border">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" /> Executive Summary
                </h3>
                <p className="text-sm text-text-primary font-medium leading-relaxed bg-bg-primary/50 p-4 rounded-xl border border-border">
                  {currentAnalysis.executiveSummary || "No executive summary available for this report module."}
                </p>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border bg-bg-surface">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Source Document</p>
                      <p className="text-xs text-text-muted">Original markdown analysis report</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(currentAnalysis.rawMarkdown, `${project.name.toLowerCase().replace(/\s+/g, '-')}-analysis.md`)}
                  >
                    Download .md
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Zap className="h-5 w-5 text-danger" /> Urgent Fixes
                </h3>
                <div className="space-y-3">
                  {currentAnalysis.topFixes.map((fix, idx) => (
                     <div key={idx} className="flex gap-3 p-3 rounded-lg border border-border bg-bg-surface hover:border-danger/30 transition-colors group">
                       <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded bg-danger/10 text-xs font-bold text-danger">
                         {idx + 1}
                       </span>
                       <div className="prose prose-sm prose-p:my-0 prose-code:text-accent prose-code:bg-accent/10 prose-code:rounded prose-code:px-1 font-medium text-text-secondary text-xs max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{fix}</ReactMarkdown>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Issue Deep Dive Stack */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" /> Issue Deep Dive
              </h3>
              <div className="space-y-3">
                {currentAnalysis.detailedIssues?.length > 0 ? (
                  currentAnalysis.detailedIssues.map((issue, idx) => (
                    <DetailedIssueCard key={issue.id + idx} issue={issue} />
                  ))
                ) : (
                  <p className="text-sm text-text-muted p-8 text-center border border-dashed border-border rounded-xl">
                    No detailed issues extracted from this report.
                  </p>
                )}
              </div>
            </div>

            {/* Feature Insights & Ideas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-border">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" /> Feature Insights
                </h3>
                <div className="space-y-4">
                  {currentAnalysis.featureInsights?.map((insight, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-bg-primary/30 space-y-2">
                      <h4 className="text-sm font-bold text-text-primary">{insight.name}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-text-primary/60 brightness-150">Current State</span>
                          <p className="text-[13px] text-text-primary font-medium leading-normal mt-0.5">{insight.currentState}</p>
                        </div>
                        <div className="pt-2 border-t border-border/10">
                          <span className="text-[10px] font-extrabold uppercase text-accent brightness-150">Improvement</span>
                          <p className="text-[13px] text-text-primary font-medium leading-normal mt-0.5">{insight.improvement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-success" /> Future Roadmap
                </h3>
                <div className="space-y-4">
                  {currentAnalysis.featureIdeas?.map((idea, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-bg-surface shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-text-primary">{idea.name}</h4>
                        <div className="flex gap-1">
                          <Badge variant="muted" className="text-[9px] px-1.5 py-0 border-border/50 text-text-primary">[{idea.priority}]</Badge>
                          <Badge variant="muted" className="text-[9px] px-1.5 py-0 border-border/50 text-text-primary">[{idea.complexity}]</Badge>
                        </div>
                      </div>
                      <p className="text-[13px] text-text-primary font-bold bg-success/10 p-3 rounded-lg border border-success/20 italic leading-snug">
                       "{idea.value}"
                      </p>
                      <div>
                         <span className="text-[10px] font-extrabold uppercase text-text-primary/60 brightness-150">Implementation Hint</span>
                         <p className="text-[13px] text-text-primary font-medium leading-relaxed mt-1 opacity-90">{idea.implementationHint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-bg-surface/50 py-16 text-center animate-fade-in mt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-text-muted mb-4">
              {project.isMicroservice && project.repos.length === 0 ? <Plus className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              {project.isMicroservice && project.repos.length === 0 ? "No Services Registered" : "No Analysis Report"}
            </h3>
            <p className="mt-2 text-sm text-text-secondary max-w-sm">
              {project.isMicroservice && project.repos.length === 0 
                ? "This is a microservices project. You must add at least one service/repository before you can upload and view analysis reports."
                : "Upload a markdown file containing the repository structural and security analysis to view extracted insights here."}
            </p>
            {project.isMicroservice && project.repos.length === 0 ? (
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-6 gap-2"
              >
                <Plus className="h-4 w-4" /> Add First Service
              </Button>
            ) : (
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline" 
                className="mt-6"
              >
                Select .md File
              </Button>
            )}
          </div>
        )
      )}
      <AddServiceDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddRepo}
      />

      <ConfirmActionDialog 
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteRepo}
        title="Remove Service"
        description="Are you sure you want to remove this service from the project? This action will disconnect the repository logic and scorecards from this workspace."
        confirmText="Remove Service"
        variant="danger"
      />
    </div>
  );
}
