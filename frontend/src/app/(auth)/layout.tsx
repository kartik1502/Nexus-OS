import * as React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-subtle/40 via-bg-primary to-bg-primary"></div>
      
      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-glow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            NEXUS <span className="text-accent">OS</span>
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Personal Productivity Ecosystem
          </p>
        </div>
        
        <div className="rounded-xl border border-border bg-bg-surface p-8 shadow-elevated">
          {children}
        </div>
      </div>
    </div>
  )
}
