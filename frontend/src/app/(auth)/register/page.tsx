import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Create Account - NEXUS OS",
  description: "Create your new NEXUS OS account",
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Create an account
        </h1>
        <p className="text-sm text-text-muted">
          Enter your details to get started with NEXUS
        </p>
      </div>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            type="text" 
            autoComplete="name" 
            required
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Create a strong password"
            autoComplete="new-password" 
            required
          />
          <p className="text-[12px] text-text-muted pt-1">
            Must be at least 8 characters long.
          </p>
        </div>
        
        <Button className="w-full mt-2" type="submit">
          Create Account
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-text-muted">Already have an account? </span>
        <Link 
          href="/login" 
          className="font-medium text-accent hover:text-accent-hover hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
