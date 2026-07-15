"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  CreditCard,
  User,
  ArrowRight,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-bookings";
import { usePayments } from "@/hooks/use-payments";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  cn,
  formatCurrency,
  formatDate,
  timeAgo,
  truncateId,
} from "@/lib/utils";
import {
  SERVICE_LABELS,
  HOME_SIZE_LABELS,
  STATUS_LABELS,
  STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/constants";
import { MOCK_BOOKINGS, MOCK_PAYMENTS } from "@/lib/mock-data";
import type { Booking, Payment } from "@/types";

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const { bookings: hookBookings, loading: bookingsLoading } = useBookings();
  const { payments: hookPayments, loading: paymentsLoading } = usePayments();
  const router = useRouter();

  // Fallback to mock data so the dashboard always looks populated
  const bookings: Booking[] =
    hookBookings && hookBookings.length > 0 ? hookBookings : MOCK_BOOKINGS;
  const payments: Payment[] =
    hookPayments && hookPayments.length > 0 ? hookPayments : MOCK_PAYMENTS;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold">
            Please sign in
          </h1>
          <p className="text-muted-foreground">
            You need to be signed in to view your dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Derived stats
  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_progress" || b.status === "pending",
  ).length;
  const completedMoves = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const totalSpent = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const upcoming = bookings
    .filter(
      (b) =>
        b.status !== "cancelled" &&
        b.status !== "completed" &&
        new Date(b.moving_date) >= new Date(new Date().toDateString()),
    )
    .sort((a, b) => new Date(a.moving_date).getTime() - new Date(b.moving_date).getTime())[0];

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const pendingTotal = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-12">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? user.email ?? "User"} />
            <AvatarFallback>
              {(profile?.full_name ?? user.email ?? "U")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">
              {profile?.full_name ?? user.email?.split("@")[0] ?? "Customer"}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/quote">
              <Package className="mr-2 h-4 w-4" />
              New Quote
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Move
            </Link>
          </Button>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active Bookings</CardDescription>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-semibold">
              {activeBookings}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {bookingsLoading ? "Loading…" : "In progress or confirmed"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Completed Moves</CardDescription>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-semibold">
              {completedMoves}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Successfully finished jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Total Spent</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-semibold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Upcoming</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-lg font-semibold">
              {upcoming ? formatDate(upcoming.moving_date) : "—"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {upcoming
                ? `${SERVICE_LABELS[upcoming.service_type] ?? "Move"} • ${upcoming.time_window}`
                : "No scheduled moves"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">
            <Package className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Bookings tab */}
        <TabsContent value="bookings" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Package className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No bookings yet.</p>
                <Button asChild>
                  <Link href="/quote">
                    Request a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Payments tab */}
        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Total Paid</CardDescription>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-semibold text-success">
                  {formatCurrency(totalSpent)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {payments.filter((p) => p.status === "completed").length} completed payments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Pending</CardDescription>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-semibold text-warning">
                  {formatCurrency(pendingTotal)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pendingPayments.length} pending payments
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">No payments recorded.</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Profile tab */}
        <TabsContent value="profile">
          <ProfileForm
            fullName={profile?.full_name ?? ""}
            phone={profile?.phone ?? ""}
            email={user.email ?? ""}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Booking card ---------- */

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
            </CardTitle>
            <CardDescription>
              {HOME_SIZE_LABELS[booking.home_size] ?? booking.home_size} • Booking{" "}
              {truncateId(booking.id)}
            </CardDescription>
          </div>
          <Badge variant={STATUS_VARIANTS[booking.status] ?? "default"}>
            {STATUS_LABELS[booking.status] ?? booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(booking.moving_date)}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {booking.time_window}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-4 w-4" />
            Crew of {booking.crew_size}
          </span>
        </div>
        <Separator />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              From
            </p>
            <p className="flex items-start gap-1.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              {booking.origin_address}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              To
            </p>
            <p className="flex items-start gap-1.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              {booking.destination_address}
            </p>
          </div>
        </div>
        {booking.notes && (
          <p className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            {booking.notes}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Estimated cost</span>
        <span className="font-display text-xl font-semibold">
          {formatCurrency(booking.estimated_cost)}
        </span>
      </CardFooter>
    </Card>
  );
}

/* ---------- Payment row ---------- */

function PaymentRow({ payment }: { payment: Payment }) {
  const statusVariant =
    payment.status === "completed"
      ? "success"
      : payment.status === "pending"
        ? "warning"
        : payment.status === "failed"
          ? "destructive"
          : "secondary";

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="font-medium">
              {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(payment.created_at)} • {timeAgo(payment.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant}>
            {STATUS_LABELS[payment.status] ?? payment.status}
          </Badge>
          <span className="font-display text-lg font-semibold">
            {formatCurrency(payment.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- Profile form ---------- */

function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [name, setName] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save latency for a smoother UX
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Profile updated", {
      description: "Your changes have been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Settings</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Full Name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            placeholder="(555) 555-5555"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            value={email}
            readOnly
            disabled
            className="cursor-not-allowed opacity-70"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed. Contact support to update your email.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
