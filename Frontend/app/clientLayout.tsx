"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Bell, Shield, User } from "lucide-react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="hidden font-bold sm:inline-block">FraudGuard</span>
                  </Link>
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                      href="/"
                      className={cn(
                        "transition-colors hover:text-foreground/80 relative",
                        pathname === "/" ? "text-foreground" : "text-foreground/60",
                      )}
                    >
                      {pathname === "/" && (
                        <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                      )}
                      Dashboard
                    </Link>
                    <Link
                      href="/rules"
                      className={cn(
                        "transition-colors hover:text-foreground/80 relative",
                        pathname === "/rules" ? "text-foreground" : "text-foreground/60",
                      )}
                    >
                      {pathname === "/rules" && (
                        <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                      )}
                      Rules Configuration
                    </Link>
                  </nav>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <button className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-pulse-slow">
                      3
                    </span>
                  </button>
                  <ModeToggle />
                  <button className="rounded-full border border-border p-1 hover:bg-muted/50 transition-colors">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">User menu</span>
                  </button>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

