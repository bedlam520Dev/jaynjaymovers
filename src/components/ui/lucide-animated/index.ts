import { createContext, createElement, useContext } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { ArrowLeftIcon } from './arrow-left';
import { ArrowRightIcon } from './arrow-right';
import { BadgeAlertIcon } from './badge-alert';
import { BoxIcon } from './box';
import { BoxesIcon } from './boxes';
import { CalendarDaysIcon } from './calendar-days';
import { CheckIcon } from './check';
import { ChevronDownIcon } from './chevron-down';
import { ChevronLeftIcon } from './chevron-left';
import { ChevronRightIcon } from './chevron-right';
import { CircleCheckIcon } from './circle-check';
import { ClockIcon } from './clock';
import { CreditCardIcon } from './credit-card';
import { DollarSignIcon } from './dollar-sign';
import { ExternalLinkIcon } from './external-link';
import { EyeOffIcon } from './eye-off';
import { EyeIcon } from './eye';
import { FacebookIcon } from './facebook';
import { FilePenLineIcon } from './file-pen-line';
import { HeartHandshakeIcon } from './heart-handshake';
import { HomeIcon } from './home';
import { InstagramIcon } from './instagram';
import { LoaderIcon } from './loader';
import { LockIcon } from './lock';
import { MailboxIcon } from './mailbox';
import { MapPinIcon } from './map-pin';
import { MenuIcon } from './menu';
import { MoonIcon } from './moon';
import { PhoneIcon } from './phone';
import { SearchIcon } from './search';
import { ShieldCheckIcon } from './shield-check';
import { ShredderIcon } from './shredder';
import { SparklesIcon } from './sparkles';
import { SunIcon } from './sun';
import { SunsetIcon } from './sunset';
import { TrendingUpIcon } from './trending-up';
import { TruckIcon } from './truck';
import { TwitterIcon } from './twitter';
import { UploadIcon } from './upload';
import { UserIcon } from './user';
import { UsersIcon } from './users';
import { XIcon } from './x';

const iconRegistry = {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeAlertIcon,
  BoxIcon,
  BoxesIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  ClockIcon,
  CreditCardIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  EyeIcon,
  FacebookIcon,
  FilePenLineIcon,
  HeartHandshakeIcon,
  HomeIcon,
  InstagramIcon,
  LoaderIcon,
  LockIcon,
  MailboxIcon,
  MapPinIcon,
  MenuIcon,
  MoonIcon,
  PhoneIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShredderIcon,
  SparklesIcon,
  SunIcon,
  SunsetIcon,
  TrendingUpIcon,
  TruckIcon,
  TwitterIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  XIcon,
};

type IconRegistry = typeof iconRegistry;
type IconName = keyof IconRegistry;

type LucAnim8Props = {
  name?: IconName;
  [key: string]: unknown;
};

type LucAnim8ContextValue = IconRegistry;

const LucAnim8Context = createContext<LucAnim8ContextValue | null>(null);

function LucAnim8Provider({
  children,
  icons,
}: {
  children: ReactNode;
  icons?: Partial<IconRegistry>;
}) {
  const registry = { ...iconRegistry, ...icons } as IconRegistry;

  return createElement(
    LucAnim8Context.Provider,
    { value: registry },
    children
  );
}

function LucAnim8({ name, ...props }: LucAnim8Props) {
  const registry = useContext(LucAnim8Context) ?? iconRegistry;

  if (!name) {
    return null;
  }

  const Icon = registry[name];

  if (!Icon) {
    return null;
  }

  return createElement(Icon as ComponentType<Record<string, unknown>>, props);
}

function LucAnim8s({ name, ...props }: LucAnim8Props) {
  return createElement(LucAnim8, { name, ...props });
}

function useLucAnim8(name: IconName) {
  const registry = useContext(LucAnim8Context) ?? iconRegistry;
  return registry[name] ?? null;
}

export {
  LucAnim8,
  LucAnim8Provider,
  LucAnim8s,
  useLucAnim8,
};
export type { IconName, LucAnim8Props };
