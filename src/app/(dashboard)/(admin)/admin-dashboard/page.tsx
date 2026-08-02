'use client';

import { Container, Grid } from '@/components/layout';
import { StarRating } from '@/components/star-rating';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TruckIcon } from '@/components/ui/truck';
import { useAuth } from '@/hooks/use-auth';
import { useBookings } from '@/hooks/use-bookings';
import { usePayments } from '@/hooks/use-payments';
import { useQuoteRequests } from '@/hooks/use-quote-requests';
import { useReviews } from '@/hooks/use-reviews';
import {
  SERVICE_LABELS,
  HOME_SIZE_LABELS,
  STATUS_LABELS,
  STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
  REVIEW_SOURCE_LABELS,
  revenueData,
  PIE_COLORS,
} from '@/lib/constants';
import { cn, formatCurrency, formatDate, timeAgo, truncateId } from '@/lib/utils';
import type { Booking, Payment, QuoteRequest, Review } from '@/types';
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
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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
} from 'recharts';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const { bookings: hookBookings /*, loading: bookingsLoading */ } = useBookings();
  const { payments: hookPayments /*, loading: paymentsLoading */ } = usePayments();
  const { quotes: hookQuotes /*, loading: quotesLoading */ } = useQuoteRequests();
  const { reviews: hookReviews /*, loading: reviewsLoading */ } = useReviews();
  const bookings = hookBookings;
  const payments = hookPayments;
  const quotes = hookQuotes;
  const reviews = hookReviews;
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ----- KPI calculations -----
  const kpis = useMemo(() => {
    const completedPayments = payments.filter((p) => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    const activeJobs = bookings.filter(
      (b) => b.status !== 'completed' && b.status !== 'cancelled'
    ).length;

    const pendingQuotes = quotes.filter((q) => q.status === 'new').length;

    const completed = bookings.filter((b) => b.status === 'completed').length;
    const totalBookings = bookings.length;
    const completionRate =
      totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0;

    const avgRating = 4.9;

    return { totalRevenue, activeJobs, pendingQuotes, completionRate, avgRating };
  }, [bookings, payments, quotes]);

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

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        !search ||
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.origin_address.toLowerCase().includes(search.toLowerCase()) ||
        b.destination_address.toLowerCase().includes(search.toLowerCase()) ||
        (SERVICE_LABELS[b.service_type] ?? '')
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [bookings, search]);

  const paymentSummary = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const completed = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments
      .filter((p) => p.status === 'pending')
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

  const ICONS = useMemo(
    () => ({
      dollar: <DollarSign className='h-5 w-5' />,
      package: <Package className='h-5 w-5' />,
      clock: <Clock className='h-5 w-5' />,
      trending: <TrendingUp className='h-5 w-5' />,
      star: <Star className='text-accent h-5 w-5' />,
      usersSmall: <Users className='h-3.5 w-3.5' />,
      calendarSmall: <Calendar className='h-4 w-4' />,
      mapPinSmall: <MapPin className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />,
    }),
    []
  );

  const BAR_RADIUS = useMemo(
    () => [6, 6, 0, 0] as [number, number, number, number],
    []
  );

  if (loading) {
    return (
      <Container
        size='md'
        className='flex min-h-[60vh] items-center justify-center font-sans'
      >
        <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container
        size='md'
        className='flex min-h-[60vh] items-center justify-center font-sans'
      >
        <Card className='w-full max-w-md text-center'>
          <CardHeader>
            <div className='bg-muted mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full'>
              <Shield className='text-muted-foreground h-6 w-6' />
            </div>
            <CardTitle>Admin Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in as an administrator to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className='w-full'
              render={<Link href='/auth/login' />}
              nativeButton={false}
            >
              Sign In
              <ArrowRight className='h-4 w-4' />
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (profile && !profile.is_admin) {
    return (
      <Container
        size='md'
        className='flex min-h-[60vh] items-center justify-center font-sans'
      >
        <Card className='w-full max-w-md text-center'>
          <CardHeader>
            <div className='bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full'>
              <Shield className='text-destructive h-6 w-6' />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have administrator privileges to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant='outline'
              className='w-full'
              render={<Link href='/dashboard' />}
              nativeButton={false}
            >
              Go to Dashboard
              <ArrowRight className='h-4 w-4' />
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      size='xl'
      className='animate-fade-in space-y-8 mb-6 font-sans '
    >
      <div className='flex flex-col gap-6 mb-12 sm:flex-row sm:items-center sm:justify-between'>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-6 bg-background/30 border-4 border-inset border-primary/40 rounded-xl px-4 py-3  shadow-glow sm:px-6 sm:py-4 shadow-sm'>
            <div className='bg-transparent flex h-18 w-18 border-5 border-inset border-primary/70 rounded-2xl p-2 items-center justify-center'>
              <Shield className='text-primary h-15 w-15' />
            </div>
            <div>
              <h1 className='font-heading shadow-glow-strong text-[3rem] font-bold'>
                Admin CRM
              </h1>
              <p className='text-foreground/70 text-md'>Manage your moving business</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-6 bg-background/30 border-4 border-inset border-primary/40 rounded-xl px-5 py-4 shadow-glow sm:px-7 sm:py-5 shadow-sm'>
          <Avatar className='h-20 w-20 border-5 border-inset border-primary/70'>
            {profile?.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.full_name}
              />
            ) : null}
            <AvatarFallback>
              {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'A'}
            </AvatarFallback>
          </Avatar>
          <div className='hidden sm:block'>
            <p className='text-2xl leading-tight font-bold'>
              {profile?.full_name ?? 'Administrator'}
            </p>
            <p className='text-foreground/70 text-xl'>Administrator</p>
          </div>
          <Button
            variant='destructive'
            size='lg'
            className='p-3 border-2 border-inset border-primary/70 sm:px-4 sm:py-3'
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <Grid
        cols={{ base: 1, sm: 2, md: 3, lg: 5 }}
        gap='lg'
      >
        <KpiCard
          label='Total Revenue'
          value={formatCurrency(kpis.totalRevenue)}
          icon={ICONS.dollar}
          accent='bg-success-subtle text-success'
          className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'
        />
        <KpiCard
          label='Active Jobs'
          value={String(kpis.activeJobs)}
          icon={ICONS.package}
          accent='bg-info-subtle text-info'
          className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'
        />
        <KpiCard
          label='Pending Quotes'
          value={String(kpis.pendingQuotes)}
          icon={ICONS.clock}
          accent='bg-warning-subtle text-warning'
          className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'
        />
        <KpiCard
          label='Completion Rate'
          value={`${kpis.completionRate}%`}
          icon={ICONS.trending}
          accent='bg-accent/10 text-accent'
          className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'
        />
        <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader className='pb-6 mb-6 border-b border-muted-foreground/10'>
            <div className='flex items-center justify-between'>
              <CardDescription>Avg Rating</CardDescription>
              <div className='bg-accent/10 flex h-9 w-9 items-center justify-center rounded-lg'>
                <Star className='text-accent h-5 w-5' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <span className='font-display text-2xl font-bold'>
                {kpis.avgRating.toFixed(1)}
              </span>
              <StarRating
                rating={kpis.avgRating}
                size='sm'
              />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        cols={{ base: 1, lg: 2 }}
        gap='lg'
      >
        <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader>
            <CardTitle className='text-lg'>Revenue Trend</CardTitle>
            <CardDescription>Last 6 months of completed payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[200px] w-full sm:h-[260px]'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <BarChart
                  data={revenueData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    className='stroke-muted'
                  />
                  <XAxis
                    dataKey='month'
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
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    formatter={(v: unknown) => [
                      formatCurrency(Number(v ?? 0)),
                      'Revenue',
                    ]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey='revenue'
                    fill='hsl(var(--primary))'
                    radius={BAR_RADIUS}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader>
            <CardTitle className='text-lg'>Booking Status</CardTitle>
            <CardDescription>Distribution of current jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[200px] w-full sm:h-[260px]'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='mt-3 flex flex-wrap justify-center gap-3'>
              {statusDistribution.map((entry, index) => (
                <div
                  key={entry.name}
                  className='flex items-center gap-1.5 text-xs'
                >
                  <span
                    className='h-2.5 w-2.5 rounded-full'
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className='text-muted-foreground'>{entry.name}</span>
                  <span className='font-medium'>{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Tabs defaultValue='jobs'>
        <TabsList className='w-full justify-start overflow-x-auto overflow-y-hidden border-b text-primary/80'>
          <TabsTrigger value='jobs'>Jobs</TabsTrigger>
          <TabsTrigger value='quotes'>Quote Requests</TabsTrigger>
          <TabsTrigger value='payments'>Payments</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value='jobs'>
          <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
            <CardHeader>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle className='text-lg'>Jobs</CardTitle>
                  <CardDescription>
                    {filteredBookings.length} of {bookings.length} bookings
                  </CardDescription>
                </div>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                    <Input
                      placeholder='Search jobs...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='pl-9 sm:w-[220px]'
                    />
                  </div>
                  <Select defaultValue='all'>
                    <SelectTrigger className='sm:w-[160px]'>
                      <SelectValue placeholder='Filter status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Statuses</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='confirmed'>Confirmed</SelectItem>
                      <SelectItem value='in_progress'>In Progress</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='text-muted-foreground border-b text-left'>
                      <th className='pr-4 pb-2 font-medium'>ID</th>
                      <th className='pr-4 pb-2 font-medium'>Service</th>
                      <th className='pr-4 pb-2 font-medium'>From</th>
                      <th className='pr-4 pb-2 font-medium'>Date</th>
                      <th className='pr-4 pb-2 font-medium'>Status</th>
                      <th className='pr-4 pb-2 text-right font-medium'>Cost</th>
                      <th className='pr-4 pb-2 text-center font-medium'>Crew</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className='hover:bg-muted/50 cursor-pointer border-b transition-colors last:border-0'
                      >
                        <td className='text-muted-foreground py-3 pr-4 font-mono text-xs'>
                          {truncateId(b.id)}
                        </td>
                        <td className='py-3 pr-4 font-medium'>
                          {SERVICE_LABELS[b.service_type] ?? b.service_type}
                        </td>
                        <td className='text-muted-foreground max-w-60 truncate py-3 pr-4'>
                          {b.origin_address}
                        </td>
                        <td className='py-3 pr-4 whitespace-nowrap'>
                          {formatDate(b.moving_date)}
                        </td>
                        <td className='py-3 pr-4'>
                          <Badge variant={STATUS_VARIANTS[b.status] ?? 'default'}>
                            {STATUS_LABELS[b.status] ?? b.status}
                          </Badge>
                        </td>
                        <td className='py-3 pr-4 text-right font-medium'>
                          {formatCurrency(b.estimated_cost)}
                        </td>
                        <td className='py-3 pr-4 text-center'>
                          <span className='text-muted-foreground inline-flex items-center gap-1'>
                            <Users className='h-3.5 w-3.5' />
                            {b.crew_size}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className='text-muted-foreground py-8 text-center'
                        >
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

        <TabsContent value='quotes'>
          <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
            <CardHeader>
              <CardTitle className='text-lg'>Quote Requests</CardTitle>
              <CardDescription>{quotes.length} quote requests received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='text-muted-foreground border-b text-left'>
                      <th className='pr-4 pb-2 font-medium'>Contact</th>
                      <th className='pr-4 pb-2 font-medium'>Service</th>
                      <th className='pr-4 pb-2 font-medium'>Move Date</th>
                      <th className='pr-4 pb-2 font-medium'>Status</th>
                      <th className='pr-4 pb-2 font-medium'>Submitted</th>
                      <th className='pr-4 pb-2 text-right font-medium'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((q: QuoteRequest) => (
                      <tr
                        key={q.id}
                        className='border-b last:border-0'
                      >
                        <td className='py-3 pr-4'>
                          <div className='font-medium'>{q.contact_name}</div>
                          <div className='text-muted-foreground text-xs'>
                            {q.contact_email}
                          </div>
                        </td>
                        <td className='py-3 pr-4'>
                          {SERVICE_LABELS[q.service_type] ?? q.service_type}
                        </td>
                        <td className='py-3 pr-4 whitespace-nowrap'>
                          {formatDate(q.moving_date)}
                        </td>
                        <td className='py-3 pr-4'>
                          <Badge variant={STATUS_VARIANTS[q.status] ?? 'default'}>
                            {STATUS_LABELS[q.status] ?? q.status}
                          </Badge>
                        </td>
                        <td className='text-muted-foreground py-3 pr-4 text-xs'>
                          {timeAgo(q.created_at)}
                        </td>
                        <td className='py-3 pr-4 text-right'>
                          <Button
                            size='sm'
                            variant={q.status === 'new' ? 'default' : 'outline'}
                            disabled={q.status !== 'new'}
                            onClick={() =>
                              toast.success(`Quote ${truncateId(q.id)} advanced`, {
                                description: `Marked as responded for ${q.contact_name}.`,
                              })
                            }
                          >
                            <CheckCircle2 className='h-4 w-4' />
                            Advance
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {quotes.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className='text-muted-foreground py-8 text-center'
                        >
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

        <TabsContent value='payments'>
          <div className='space-y-4'>
            <Grid
              cols={{ base: 1, sm: 2, lg: 3 }}
              gap='lg'
            >
              <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
                <CardHeader className='pb-2'>
                  <CardDescription>Total Processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='font-display text-2xl font-bold'>
                    {formatCurrency(paymentSummary.total)}
                  </p>
                </CardContent>
              </Card>
              <Card className='text-bold text-accent/90 text-sm sm:text-base'>
                <CardHeader className='pb-2'>
                  <CardDescription>Completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='font-display text-2xl font-bold text-success'>
                    {formatCurrency(paymentSummary.completed)}
                  </p>
                </CardContent>
              </Card>
              <Card className='text-bold text-accent/90 text-sm sm:text-base'>
                <CardHeader className='pb-2'>
                  <CardDescription>Pending</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='font-display text-2xl font-bold text-warning'>
                    {formatCurrency(paymentSummary.pending)}
                  </p>
                </CardContent>
              </Card>
            </Grid>

            <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
              <CardHeader>
                <CardTitle className='text-lg'>Payments</CardTitle>
                <CardDescription>
                  {payments.length} transactions recorded
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Method breakdown */}
                <div className='flex flex-wrap gap-2'>
                  {Object.entries(paymentSummary.byMethod).map(([method, info]) => (
                    <Badge
                      key={method}
                      variant='secondary'
                      className='gap-1.5'
                    >
                      {PAYMENT_METHOD_LABELS[method] ?? method}
                      <span className='text-muted-foreground'>
                        {info.count} · {formatCurrency(info.amount)}
                      </span>
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='text-muted-foreground border-b text-left'>
                        <th className='pr-4 pb-2 font-medium'>ID</th>
                        <th className='pr-4 pb-2 font-medium'>Amount</th>
                        <th className='pr-4 pb-2 font-medium'>Method</th>
                        <th className='pr-4 pb-2 font-medium'>Status</th>
                        <th className='pr-4 pb-2 font-medium'>Booking</th>
                        <th className='pr-4 pb-2 font-medium'>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p: Payment) => (
                        <tr
                          key={p.id}
                          className='border-b last:border-0'
                        >
                          <td className='text-muted-foreground py-3 pr-4 font-mono text-xs'>
                            {truncateId(p.id)}
                          </td>
                          <td className='py-3 pr-4 font-medium'>
                            {formatCurrency(p.amount)}
                          </td>
                          <td className='py-3 pr-4'>
                            {PAYMENT_METHOD_LABELS[p.method] ?? p.method}
                          </td>
                          <td className='py-3 pr-4'>
                            <Badge
                              variant={
                                p.status === 'completed'
                                  ? 'success'
                                  : p.status === 'pending'
                                    ? 'warning'
                                    : p.status === 'failed'
                                      ? 'destructive'
                                      : 'secondary'
                              }
                              className='capitalize'
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td className='text-muted-foreground py-3 pr-4 font-mono text-xs'>
                            {p.booking_id ? truncateId(p.booking_id) : '—'}
                          </td>
                          <td className='text-muted-foreground py-3 pr-4 whitespace-nowrap'>
                            {formatDate(p.created_at)}
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className='text-muted-foreground py-8 text-center'
                          >
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

        <TabsContent value='reviews'>
          <Card className='text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
            <CardHeader>
              <CardTitle className='text-lg'>Reviews</CardTitle>
              <CardDescription>
                {reviews.length} reviews across all sources
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {reviews.map((r: Review) => (
                <div
                  key={r.id}
                  className='flex gap-3 rounded-lg border p-4'
                >
                  <Avatar className='h-10 w-10 shrink-0'>
                    {r.author_avatar ? (
                      <AvatarImage
                        src={r.author_avatar}
                        alt={r.author_name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {r.author_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <div>
                        <p className='leading-tight font-medium'>{r.author_name}</p>
                        <div className='mt-1 flex items-center gap-2'>
                          <StarRating
                            rating={r.rating}
                            size='sm'
                          />
                          <Badge
                            variant='outline'
                            className='text-xs'
                          >
                            {REVIEW_SOURCE_LABELS[r.source] ?? r.source}
                          </Badge>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-muted-foreground text-xs'>
                          {timeAgo(r.created_at)}
                        </span>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='text-muted-foreground hover:text-destructive h-8 w-8'
                          onClick={() =>
                            toast.error(`Review deleted`, {
                              description: `Removed review by ${r.author_name}.`,
                            })
                          }
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                    <p className='text-muted-foreground mt-2 text-sm'>{r.text}</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className='text-muted-foreground py-8 text-center'>
                  No reviews yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className='max-w-lg text-bold text-accent/90 text-sm sm:text-base border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking ? `ID: ${selectedBooking.id}` : 'Booking information'}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Badge variant={STATUS_VARIANTS[selectedBooking.status] ?? 'default'}>
                  {STATUS_LABELS[selectedBooking.status] ?? selectedBooking.status}
                </Badge>
                <span className='font-display text-2xl font-bold'>
                  {formatCurrency(selectedBooking.estimated_cost)}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-3 text-sm'>
                <DetailItem
                  icon={ICONS.package}
                  label='Service'
                  value={
                    SERVICE_LABELS[selectedBooking.service_type] ??
                    selectedBooking.service_type
                  }
                />
                <DetailItem
                  icon={ICONS.usersSmall}
                  label='Crew Size'
                  value={`${selectedBooking.crew_size} movers`}
                />
                <DetailItem
                  icon={ICONS.calendarSmall}
                  label='Move Date'
                  value={formatDate(selectedBooking.moving_date)}
                />
                <DetailItem
                  icon={ICONS.clock}
                  label='Time Window'
                  value={selectedBooking.time_window}
                />
              </div>

              <Separator />

              <div className='space-y-2 text-sm'>
                <div className='flex items-start gap-2'>
                  <MapPin className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                  <div>
                    <p className='text-muted-foreground text-xs'>From</p>
                    <p>{selectedBooking.origin_address}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <MapPin className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                  <div>
                    <p className='text-muted-foreground text-xs'>To</p>
                    <p>{selectedBooking.destination_address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='text-sm'>
                <p className='text-muted-foreground text-xs'>Home Size</p>
                <p>
                  {HOME_SIZE_LABELS[selectedBooking.home_size] ??
                    selectedBooking.home_size}
                </p>
              </div>

              {selectedBooking.notes && (
                <>
                  <Separator />
                  <div className='text-sm'>
                    <p className='text-muted-foreground text-xs'>Notes</p>
                    <p className='mt-1'>{selectedBooking.notes}</p>
                  </div>
                </>
              )}

              <div className='text-muted-foreground flex items-center gap-2 pt-2 text-xs'>
                <TruckIcon className='h-3.5 w-3.5' />
                Booked {timeAgo(selectedBooking.created_at)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

function KpiCard({
  label,
  value,
  icon,
  accent,
  className,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardDescription>{label}</CardDescription>
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg',
              accent
            )}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='font-display text-2xl font-bold'>{value}</p>
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
    <div className='flex items-start gap-2 font-mono'>
      <div className='text-muted-foreground mt-0.5'>{icon}</div>
      <div>
        <p className='text-muted-foreground text-xs'>{label}</p>
        <p className='font-medium'>{value}</p>
      </div>
    </div>
  );
}
