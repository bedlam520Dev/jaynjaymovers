"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Truck, Menu, X, LayoutDashboard, LogOut, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Truck className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Summit Movers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent-foreground",
                pathname === link.href && "text-primary bg-primary/5",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              {profile?.is_admin && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
                  <Shield className="h-4 w-4" /> Admin
                </Button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 hover:bg-accent/10 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{profile?.full_name?.split(" ")[0] || "Account"}</span>
              </button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-fade-in">
          <div className="container mx-auto py-4 px-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/10 flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                {profile?.is_admin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent/10 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Admin CRM
                  </Link>
                )}
                <button onClick={handleSignOut} className="rounded-md px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2 text-left">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
