"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Shield,
  Loader2,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Star,
  Search,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Calendar,
  MapPin,
  Truck,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { StarRating } from "@/components/star-rating";

import { cn, formatCurrency, formatDate, timeAgo, truncateId } from "@/lib/utils";
import {
  SERVICE_LABELS,
  HOME_SIZE_LABELS,
  STATUS_LABELS,
  STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
  REVIEW_SOURCE_LABELS,
} from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-bookings";
import { usePayments } from "@/hooks/use-payments";
import { useQuoteRequests } from "@/hooks/use-quote-requests";
import { useReviews } from "@/hooks/use-reviews";
import type { Booking, Payment, QuoteRequest, Review } from "@/types";
import {
  MOCK_BOOKINGS,
  MOCK_PAYMENTS,
  MOCK_QUOTE_REQUESTS,
  MOCK_REVIEWS,
} from "@/lib/mock-data";

const revenueData = [
  { month: "Feb", revenue: 28000 },
  { month: "Mar", revenue: 32000 },
  { month: "Apr", revenue: 35000 },
  { month: "May", revenue: 41000 },
  { month: "Jun", revenue: 38000 },
  { month: "Jul", revenue: 45000 },
];

const PIE_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#6b7280", "#ef4444"];

export default function AdminPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const { bookings: hookBookings, loading: bookingsLoading } = useBookings();
  const { payments: hookPayments, loading: paymentsLoading } = usePayments();
  const { quotes: hookQuotes, loading: quotesLoading } = useQuoteRequests();
  const { reviews: hookReviews, loading: reviewsLoading } = useReviews();

  // Fall back to mock data when hooks return empty (e.g. no session in dev).
  const bookings = hookBookings.length > 0 ? hookBookings : MOCK_BOOKINGS;
  const payments = hookPayments.length > 0 ? hookPayments : MOCK_PAYMENTS;
  const quotes = hookQuotes.length > 0 ? hookQuotes : MOCK_QUOTE_REQUESTS;
  const reviews = hookReviews.length > 0 ? hookReviews : MOCK_REVIEWS;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ----- KPI calculations -----
  const kpis = useMemo(() => {
    const completedPayments = payments.filter((p) => p.status === "completed");
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    const activeJobs = bookings.filter(
      (b) => b.status !== "completed" && b.status !== "cancelled",
    ).length;

    const pendingQuotes = quotes.filter((q) => q.status === "new").length;

    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalBookings = bookings.length;
    const completionRate =
      totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0;

    const avgRating = 4.9;

    return { totalRevenue, activeJobs, pendingQuotes, completionRate, avgRating };
  }, [bookings, payments, quotes]);

  // ----- Booking status distribution (pie) -----
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of bookings) {
      counts[b.status] = (counts[b.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({
      name: STATUS_LABELS[name] ?? name,
      value,
    }));
  }, [bookings]);

  // ----- Filtered jobs -----
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        !search ||
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.origin_address.toLowerCase().includes(search.toLowerCase()) ||
        b.destination_address.toLowerCase().includes(search.toLowerCase()) ||
        (SERVICE_LABELS[b.service_type] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // ----- Payments summary -----
  const paymentSummary = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const completed = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    const byMethod: Record<string, { count: number; amount: number }> = {};
    for (const p of payments) {
      const key = p.method;
      if (!byMethod[key]) byMethod[key] = { count: 0, amount: 0 };
      byMethod[key].count += 1;
      byMethod[key].amount += p.amount;
    }

    return { total, completed, pending, byMethod };
  }, [payments]);

  // ===================== Render guards =====================
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Shield className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Admin Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in as an administrator to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile && !profile.is_admin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have administrator privileges to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===================== Admin CRM =====================
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Admin CRM
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage jobs, quotes, payments, and reviews.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            ) : null}
            <AvatarFallback>
              {profile?.full_name?.charAt(0)?.toUpperCase() ?? "A"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight">
              {profile?.full_name ?? "Administrator"}
            </p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <KpiCard
          label="Active Jobs"
          value={String(kpis.activeJobs)}
          icon={<Package className="h-5 w-5" />}
          accent="bg-blue-500/10 text-blue-600"
        />
        <KpiCard
          label="Pending Quotes"
          value={String(kpis.pendingQuotes)}
          icon={<Clock className="h-5 w-5" />}
          accent="bg-amber-500/10 text-amber-600"
        />
        <KpiCard
          label="Completion Rate"
          value={`${kpis.completionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="bg-purple-500/10 text-purple-600"
        />
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Avg Rating</CardDescription>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Star className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold">
                {kpis.avgRating.toFixed(1)}
              </span>
              <StarRating rating={kpis.avgRating} size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
            <CardDescription>Last 6 months of completed payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(v: number) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Status</CardTitle>
            <CardDescription>Distribution of current jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {statusDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                  <span className="font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="jobs">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Jobs</CardTitle>
                  <CardDescription>
                    {filteredBookings.length} of {bookings.length} bookings
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 sm:w-[220px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="sm:w-[160px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">ID</th>
                      <th className="pb-2 pr-4 font-medium">Service</th>
                      <th className="pb-2 pr-4 font-medium">From</th>
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 pr-4 font-medium text-right">Cost</th>
                      <th className="pb-2 pr-4 font-medium text-center">Crew</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="cursor-pointer border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                          {truncateId(b.id)}
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          {SERVICE_LABELS[b.service_type] ?? b.service_type}
                        </td>
                        <td className="py-3 pr-4 max-w-[180px] truncate text-muted-foreground">
                          {b.origin_address}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {formatDate(b.moving_date)}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={STATUS_VARIANTS[b.status] ?? "default"}>
                            {STATUS_LABELS[b.status] ?? b.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-right font-medium">
                          {formatCurrency(b.estimated_cost)}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {b.crew_size}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No jobs match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quote Requests Tab */}
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Requests</CardTitle>
              <CardDescription>
                {quotes.length} quote requests received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Contact</th>
                      <th className="pb-2 pr-4 font-medium">Service</th>
                      <th className="pb-2 pr-4 font-medium">Move Date</th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 pr-4 font-medium">Submitted</th>
                      <th className="pb-2 pr-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((q: QuoteRequest) => (
                      <tr key={q.id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium">{q.contact_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {q.contact_email}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          {SERVICE_LABELS[q.service_type] ?? q.service_type}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {formatDate(q.moving_date)}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={STATUS_VARIANTS[q.status] ?? "default"}>
                            {STATUS_LABELS[q.status] ?? q.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">
                          {timeAgo(q.created_at)}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <Button
                            size="sm"
                            variant={q.status === "new" ? "default" : "outline"}
                            disabled={q.status !== "new"}
                            onClick={() =>
                              toast.success(`Quote ${truncateId(q.id)} advanced`, {
                                description: `Marked as responded for ${q.contact_name}.`,
                              })
                            }
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Advance
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {quotes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No quote requests yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-2xl font-bold">
                    {formatCurrency(paymentSummary.total)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-2xl font-bold text-emerald-600">
                    {formatCurrency(paymentSummary.completed)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-2xl font-bold text-amber-600">
                    {formatCurrency(paymentSummary.pending)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Method breakdown + table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payments</CardTitle>
                <CardDescription>
                  {payments.length} transactions recorded
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Method breakdown */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(paymentSummary.byMethod).map(([method, info]) => (
                    <Badge key={method} variant="secondary" className="gap-1.5">
                      {PAYMENT_METHOD_LABELS[method] ?? method}
                      <span className="text-muted-foreground">
                        {info.count} · {formatCurrency(info.amount)}
                      </span>
                    </Badge>
                  ))}
                </div>

                <Separator />

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 pr-4 font-medium">ID</th>
                        <th className="pb-2 pr-4 font-medium">Amount</th>
                        <th className="pb-2 pr-4 font-medium">Method</th>
                        <th className="pb-2 pr-4 font-medium">Status</th>
                        <th className="pb-2 pr-4 font-medium">Booking</th>
                        <th className="pb-2 pr-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p: Payment) => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                            {truncateId(p.id)}
                          </td>
                          <td className="py-3 pr-4 font-medium">
                            {formatCurrency(p.amount)}
                          </td>
                          <td className="py-3 pr-4">
                            {PAYMENT_METHOD_LABELS[p.method] ?? p.method}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant={
                                p.status === "completed"
                                  ? "success"
                                  : p.status === "pending"
                                    ? "warning"
                                    : p.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                              }
                              className="capitalize"
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                            {p.booking_id ? truncateId(p.booking_id) : "—"}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                            {formatDate(p.created_at)}
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No payments recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reviews</CardTitle>
              <CardDescription>
                {reviews.length} reviews across all sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviews.map((r: Review) => (
                <div
                  key={r.id}
                  className="flex gap-3 rounded-lg border p-4"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    {r.author_avatar ? (
                      <AvatarImage src={r.author_avatar} alt={r.author_name} />
                    ) : null}
                    <AvatarFallback>
                      {r.author_name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium leading-tight">{r.author_name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <StarRating rating={r.rating} size="sm" />
                          <Badge variant="outline" className="text-xs">
                            {REVIEW_SOURCE_LABELS[r.source] ?? r.source}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(r.created_at)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            toast.error(`Review deleted`, {
                              description: `Removed review by ${r.author_name}.`,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No reviews yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking detail dialog */}
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking
                ? `ID: ${selectedBooking.id}`
                : "Booking information"}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={STATUS_VARIANTS[selectedBooking.status] ?? "default"}>
                  {STATUS_LABELS[selectedBooking.status] ?? selectedBooking.status}
                </Badge>
                <span className="font-display text-2xl font-bold">
                  {formatCurrency(selectedBooking.estimated_cost)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailItem
                  icon={<Package className="h-4 w-4" />}
                  label="Service"
                  value={SERVICE_LABELS[selectedBooking.service_type] ?? selectedBooking.service_type}
                />
                <DetailItem
                  icon={<Users className="h-4 w-4" />}
                  label="Crew Size"
                  value={`${selectedBooking.crew_size} movers`}
                />
                <DetailItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Move Date"
                  value={formatDate(selectedBooking.moving_date)}
                />
                <DetailItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Time Window"
                  value={selectedBooking.time_window}
                />
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p>{selectedBooking.origin_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p>{selectedBooking.destination_address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-sm">
                <p className="text-xs text-muted-foreground">Home Size</p>
                <p>
                  {HOME_SIZE_LABELS[selectedBooking.home_size] ?? selectedBooking.home_size}
                </p>
              </div>

              {selectedBooking.notes && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="mt-1">{selectedBooking.notes}</p>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                Booked {timeAgo(selectedBooking.created_at)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------- Helper components ----------------

function KpiCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{label}</CardDescription>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", accent)}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-display text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
