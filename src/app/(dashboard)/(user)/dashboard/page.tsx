'use client';

import { AvatarUpload } from '@/components/avatar-upload';
import { Container, Grid, Stack } from '@/components/layout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TruckIcon } from '@/components/ui/truck';
import { useAuth } from '@/hooks/use-auth';
import { useBookings } from '@/hooks/use-bookings';
import { usePayments } from '@/hooks/use-payments';
import {
  SERVICE_LABELS,
  HOME_SIZE_LABELS,
  STATUS_LABELS,
  STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
} from '@/lib/constants';
import { formatCurrency, formatDate, timeAgo, truncateId } from '@/lib/utils';
import type { Booking, Payment } from '@/types';
import {
  Calendar,
  DollarSign,
  Package,
  CreditCard,
  User,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const { bookings: hookBookings, loading: bookingsLoading } = useBookings();
  const { payments: hookPayments /* , loading: paymentsLoading */ } = usePayments();
  const router = useRouter();
  const bookings: Booking[] = hookBookings;
  const payments: Payment[] = hookPayments;

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center font-sans text-lg font-semibold'>
        <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
      </div>
    );
  }
  if (!user) {
    return (
      <Container
        size='md'
        className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center font-sans text-lg font-semibold'
      >
        <div className='bg-muted flex h-16 w-16 items-center justify-center rounded-full'>
          <User className='text-muted-foreground h-8 w-8' />
        </div>
        <div className='space-y-2'>
          <h1 className='font-heading text-2xl font-semibold'>Please sign in</h1>
          <p className='text-muted-foreground'>
            You need to be signed in to view your dashboard.
          </p>
        </div>
        <Stack
          gap='sm'
          className='@md:flex-row'
        >
          <Button
            render={<Link href='/auth/login' />}
            nativeButton={false}
          >
            {' '}
            Sign In
          </Button>
        </Stack>
      </Container>
    );
  }
  const activeBookings = bookings.filter(
    (b) =>
      b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'pending'
  ).length;
  const completedMoves = bookings.filter((b) => b.status === 'completed').length;
  const totalSpent = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const upcoming = bookings
    .filter(
      (b) =>
        b.status !== 'cancelled' &&
        b.status !== 'completed' &&
        new Date(b.moving_date) >= new Date(new Date().toDateString())
    )
    .sort(
      (a, b) => new Date(a.moving_date).getTime() - new Date(b.moving_date).getTime()
    )[0];

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const pendingTotal = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <Container
      size='xl'
      className='space-y-8 py-8 font-sans lg:py-12 text-bold text-accent/90 text-sm sm:text-base '
    >
      <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-6'>
          <Avatar className='h-20 w-20 border-4 border-inset border-primary/80 rounded-full shadow-glow'>
            <AvatarImage
              src={profile?.avatar_url ?? undefined}
              alt={profile?.full_name ?? user.email ?? 'User'}
            />
            <AvatarFallback>
              {(profile?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <p className='text-foreground/80 text-md'>Welcome back,</p>
            <h1 className='font-display text-2xl font-semibold sm:text-3xl'>
              {profile?.full_name ?? user.email?.split('@')[0] ?? 'Customer'}
            </h1>
            <p className='text-foreground/60 text-sm'>{user.email}</p>
          </div>
        </div>
        <Stack
          gap='lg'
          className='p-2 @md:flex-row border-4 border-inset border-primary/40 rounded-xl shadow-glow'
        >
          <Button
            render={<Link href='/quote' />}
            nativeButton={false}
            variant='default'
            className='p-3 bg-success/40 border-2 border-inset border-success/80 sm:px-4 sm:py-3'
          >
            <Package className='mr-2 h-4 w-4' />
            New Quote
          </Button>
          <Button
            render={<Link href='/schedule' />}
            nativeButton={false}
            variant='default'
            className='p-3 bg-success/40 border-2 border-inset border-success/80 sm:px-4 sm:py-3'
          >
            <Calendar className='mr-2 h-4 w-4' />
            Schedule Move
          </Button>
          <Button
            onClick={handleSignOut}
            variant='default'
            className='p-3 bg-primary/40 border-2 border-inset border-primary/70 sm:px-4 sm:py-3'
          >
            <LogOut className='mr-2 h-4 w-4' />
            Sign Out
          </Button>
        </Stack>
      </div>
      <Grid
        cols={{ base: 1, sm: 2, lg: 4 }}
        gap='lg'
      >
        <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardDescription>Active Bookings</CardDescription>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='font-display text-3xl font-semibold'>{activeBookings}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {bookingsLoading ? 'Loading…' : 'In progress or confirmed'}
            </p>
          </CardContent>
        </Card>
        <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardDescription>Completed Moves</CardDescription>
            <CheckCircle2 className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='font-display text-3xl font-semibold'>{completedMoves}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Successfully finished jobs
            </p>
          </CardContent>
        </Card>
        <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardDescription>Total Spent</CardDescription>
            <DollarSign className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='font-display text-3xl font-semibold'>
              {formatCurrency(totalSpent)}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Across all completed payments
            </p>
          </CardContent>
        </Card>
        <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardDescription>Upcoming</CardDescription>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='font-display text-lg font-semibold'>
              {upcoming ? formatDate(upcoming.moving_date) : '—'}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {upcoming
                ? `${SERVICE_LABELS[upcoming.service_type] ?? 'Move'} • ${upcoming.time_window}`
                : 'No scheduled moves'}
            </p>
          </CardContent>
        </Card>
      </Grid>
      <Tabs
        defaultValue='bookings'
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger value='bookings'>
            <Package className='mr-2 h-4 w-4' />
            Bookings
          </TabsTrigger>
          <TabsTrigger value='payments'>
            <CreditCard className='mr-2 h-4 w-4' />
            Payments
          </TabsTrigger>
          <TabsTrigger value='profile'>
            <User className='mr-2 h-4 w-4' />
            Profile
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value='bookings'
          className='space-y-4'
        >
          {bookings.length === 0 ? (
            <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
              <CardContent className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
                <Package className='text-muted-foreground h-10 w-10' />
                <p className='text-muted-foreground'>No bookings yet.</p>
                <Button
                  render={<Link href='/quote' />}
                  nativeButton={false}
                >
                  Request a Quote
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid
              cols={1}
              gap='lg'
            >
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                />
              ))}
            </Grid>
          )}
        </TabsContent>
        <TabsContent
          value='payments'
          className='space-y-4'
        >
          <Grid
            cols={{ base: 1, sm: 2 }}
            gap='lg'
          >
            <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Total Paid</CardDescription>
                <CheckCircle2 className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='font-display text-success text-3xl font-semibold'>
                  {formatCurrency(totalSpent)}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {payments.filter((p) => p.status === 'completed').length} completed
                  payments
                </p>
              </CardContent>
            </Card>
            <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Pending</CardDescription>
                <AlertCircle className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='font-display text-warning text-3xl font-semibold'>
                  {formatCurrency(pendingTotal)}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {pendingPayments.length} pending payments
                </p>
              </CardContent>
            </Card>
          </Grid>
          <div className='space-y-3'>
            {payments.length === 0 ? (
              <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
                <CardContent className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
                  <CreditCard className='text-muted-foreground h-10 w-10' />
                  <p className='text-muted-foreground'>No payments recorded.</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value='profile'>
          <ProfileForm
            fullName={profile?.full_name ?? ''}
            phone={profile?.phone ?? ''}
            email={user.email ?? ''}
            avatarUrl={profile?.avatar_url ?? null}
          />
        </TabsContent>
      </Tabs>
    </Container>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
      <CardHeader>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>
              {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
            </CardTitle>
            <CardDescription>
              {HOME_SIZE_LABELS[booking.home_size] ?? booking.home_size} • Booking{' '}
              {truncateId(booking.id)}
            </CardDescription>
          </div>
          <Badge variant={STATUS_VARIANTS[booking.status] ?? 'default'}>
            {STATUS_LABELS[booking.status] ?? booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex flex-wrap items-center gap-4 text-sm'>
          <span className='text-muted-foreground flex items-center gap-1.5'>
            <Calendar className='h-4 w-4' />
            {formatDate(booking.moving_date)}
          </span>
          <span className='text-muted-foreground flex items-center gap-1.5'>
            <Clock className='h-4 w-4' />
            {booking.time_window}
          </span>
          <span className='text-muted-foreground flex items-center gap-1.5'>
            <TruckIcon className='h-4 w-4' />
            Crew of {booking.crew_size}
          </span>
        </div>
        <Separator />
        <Grid
          cols={{ base: 1, sm: 2 }}
          gap='lg'
        >
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              From
            </p>
            <p className='flex items-start gap-1.5 text-sm'>
              <MapPin className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
              {booking.origin_address}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              To
            </p>
            <p className='flex items-start gap-1.5 text-sm'>
              <MapPin className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
              {booking.destination_address}
            </p>
          </div>
        </Grid>
        {booking.notes && (
          <p className='bg-muted/50 text-muted-foreground rounded-md p-3 text-sm'>
            {booking.notes}
          </p>
        )}
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <span className='text-muted-foreground text-sm'>Estimated cost</span>
        <span className='font-display text-xl font-semibold'>
          {formatCurrency(booking.estimated_cost)}
        </span>
      </CardFooter>
    </Card>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  const statusVariant =
    payment.status === 'completed'
      ? 'success'
      : payment.status === 'pending'
        ? 'warning'
        : payment.status === 'failed'
          ? 'destructive'
          : 'secondary';

  return (
    <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
      <CardContent className='flex flex-col gap-3 p-4 font-mono sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
            <CreditCard className='text-muted-foreground h-5 w-5' />
          </div>
          <div className='space-y-0.5'>
            <p className='font-medium'>
              {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
            </p>
            <p className='text-muted-foreground text-xs'>
              {formatDate(payment.created_at)} • {timeAgo(payment.created_at)}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Badge variant={statusVariant}>
            {STATUS_LABELS[payment.status] ?? payment.status}
          </Badge>
          <span className='font-display text-lg font-semibold'>
            {formatCurrency(payment.amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileForm({
  fullName,
  phone,
  email,
  avatarUrl: initialAvatarUrl,
}: {
  fullName: string;
  phone: string;
  email: string;
  avatarUrl: string | null;
}) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(fullName);
    setPhoneValue(phone);
    setAvatarUrl(initialAvatarUrl);
  }, [fullName, phone, initialAvatarUrl]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        full_name: name,
        phone: phoneValue,
        avatar_url: avatarUrl,
      });
      toast.success('Profile updated', {
        description: 'Your changes have been saved.',
      });
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className='border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
      <CardHeader>
        <CardTitle className='text-lg'>Profile Settings</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <AvatarUpload
          userId={user?.id ?? ''}
          avatarUrl={avatarUrl}
          fallbackText={name || 'User'}
          onUploaded={(url) => setAvatarUrl(url)}
          onRemoved={() => setAvatarUrl(null)}
        />
        <div className='space-y-2'>
          <Label htmlFor='profile-name'>Full Name</Label>
          <Input
            id='profile-name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your full name'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='profile-phone'>Phone</Label>
          <Input
            id='profile-phone'
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            placeholder='(555) 555-5555'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='profile-email'>Email</Label>
          <Input
            id='profile-email'
            value={email}
            readOnly
            disabled
            className='cursor-not-allowed opacity-70'
          />
          <p className='text-muted-foreground text-xs'>
            Email cannot be changed. Contact support to update your email.
          </p>
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <CheckCircle2 className='mr-2 h-4 w-4' />
          )}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
