"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Truck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { SITE } from "@/lib/constants";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: FormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): string | null => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.password) return "Please enter a password.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(form.email, form.password, form.fullName, form.phone);
      if (error) {
        setError(error);
        toast.error(error);
        return;
      }
      toast.success("Account created! Redirecting to your dashboard…");
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Redirecting to Google sign in…");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign up failed. Please try again.";
      setError(message);
      toast.error(message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="animate-fade-in grid min-h-screen w-full md:grid-cols-2">
      {/* Left form panel */}
      <div className="order-2 flex items-center justify-center bg-slate-50 p-6 sm:p-10 md:order-1">
        <Card className="w-full max-w-md border-teal-100 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <Truck className="h-6 w-6 text-teal-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Create your account</CardTitle>
            <CardDescription>Get started with {SITE.name} in minutes</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700">
                  Full name
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={update("fullName")}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update("email")}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(217) 555-0123"
                    value={form.phone}
                    onChange={update("phone")}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={update("password")}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Must be at least 8 characters.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-teal-700 text-white hover:bg-teal-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={loading || googleLoading}
              className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Sign up with Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right branded panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-teal-700 p-10 text-white md:order-2 md:flex">
        <img
          src="https://images.pexels.com/photos/4245838/pexels-photo-4245838.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Movers carefully carrying furniture"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative z-10 flex items-center gap-2 text-lg font-semibold">
          <Truck className="h-7 w-7 text-amber-400" />
          <span>{SITE.name}</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-bold leading-tight">Your move, handled with care.</h1>
          <p className="max-w-md text-teal-50/90">
            Join thousands of happy customers who moved with {SITE.name}. Get instant quotes, book
            online, and relax while we do the heavy lifting.
          </p>
          <ul className="space-y-2 pt-2 text-sm text-teal-50/90">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> Free, no-obligation quotes
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> Friendly, background-checked crews
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> {SITE.phone}
            </li>
          </ul>
        </div>
        <div className="relative z-10 text-xs text-teal-100/70">{SITE.license}</div>
      </div>
    </div>
  );
}
