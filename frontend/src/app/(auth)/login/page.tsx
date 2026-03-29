import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Login - NEXUS OS",
  description: "Sign in to your NEXUS OS account",
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Welcome back
        </h1>
        <p className="text-sm text-text-muted">
          Enter your email to sign in to your account
        </p>
      </div>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="you@example.com" 
            type="email" 
            autoCapitalize="none" 
            autoComplete="email" 
            autoCorrect="off" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••"
            autoComplete="current-password" 
            required
          />
        </div>
        
        <Button className="w-full mt-2" type="submit">
          Sign In
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-text-muted">Don&apos;t have an account? </span>
        <Link 
          href="/register" 
          className="font-medium text-accent hover:text-accent-hover hover:underline shadow-none"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
