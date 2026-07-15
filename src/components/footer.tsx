import Link from "next/link";
import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container mx-auto py-12 px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Truck className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold">Summit Movers</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional moving services for residential and commercial clients. Local and long distance. Licensed, bonded, and insured.
            </p>
            <div className="flex gap-3 pt-2">
              <a href={SITE.social.facebook} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SITE.social.instagram} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SITE.social.twitter} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-primary transition-colors">Residential Moving</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Commercial Moving</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Long Distance</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Packing Services</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Storage Solutions</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Get a Quote</Link></li>
              <li><Link href="/schedule" className="hover:text-primary transition-colors">Schedule a Move</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Customer Login</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{SITE.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{SITE.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved. Licensed & Insured ({SITE.license})
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
