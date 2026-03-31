import {
  Bug,
  ClipboardList,
  Construction,
  FileX,
  HelpCircle,
  LayoutDashboard,
  Lock,
  ServerOff,
  Settings,
  ShieldCheck,
  UserCircle,
  UserX,
  type LucideIcon,
} from 'lucide-react';
import { AppRoutes } from '@/configs/routes';

export interface SearchItem {
  /** i18n key under the 'sidebar' or custom namespace */
  labelKey: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Navigation URL */
  url: string;
  /** Group this item belongs to */
  group: 'general' | 'pages' | 'settings' | 'other';
  /** Optional i18n group label key (under 'sidebar') */
  groupLabelKey: string;
  /** Optional keywords for better searching */
  keywords?: string[];
}

export const searchItems: SearchItem[] = [
  // ── General ────────────────────────────────────────────
  {
    labelKey: 'dashboard',
    icon: LayoutDashboard,
    url: AppRoutes.Dashboard,
    group: 'general',
    groupLabelKey: 'general',
    keywords: ['home', 'overview'],
  },

  {
    labelKey: 'questionnaireGroups',
    icon: ClipboardList,
    url: AppRoutes.QuestionnaireGroups,
    group: 'general',
    groupLabelKey: 'general',
    keywords: ['questionnaire', 'quiz', 'group', 'exam'],
  },
  {
    labelKey: 'roles',
    icon: ShieldCheck,
    url: AppRoutes.Roles,
    group: 'general',
    groupLabelKey: 'general',
    keywords: ['role', 'permission', 'access'],
  },
  // ── Settings ───────────────────────────────────────────
  {
    labelKey: 'account',
    icon: UserCircle,
    url: AppRoutes.Account,
    group: 'settings',
    groupLabelKey: 'settings',
    keywords: ['account', 'user', 'info'],
  },
  {
    labelKey: 'settings',
    icon: Settings,
    url: AppRoutes.Settings,
    group: 'settings',
    groupLabelKey: 'settings',
    keywords: [
      'theme',
      'font',
      'color',
      'dark',
      'light',
      'settings',
      'setting',
    ],
  },
  // ── Pages / Auth ────────────────────────────────────────
  {
    labelKey: 'signIn',
    icon: ShieldCheck,
    url: AppRoutes.SignIn,
    group: 'pages',
    groupLabelKey: 'auth',
    keywords: ['login'],
  },
  {
    labelKey: 'signUp',
    icon: ShieldCheck,
    url: AppRoutes.SignUp,
    group: 'pages',
    groupLabelKey: 'auth',
    keywords: ['register', 'create account'],
  },
  {
    labelKey: 'forgotPassword',
    icon: ShieldCheck,
    url: AppRoutes.ForgotPassword,
    group: 'pages',
    groupLabelKey: 'auth',
    keywords: ['reset', 'password'],
  },
  // ── Pages / Errors ──────────────────────────────────────
  {
    labelKey: 'unauthorized',
    icon: Lock,
    url: AppRoutes.Unauthorized,
    group: 'pages',
    groupLabelKey: 'errors',
    keywords: ['401', 'auth'],
  },
  {
    labelKey: 'forbidden',
    icon: UserX,
    url: AppRoutes.Forbidden,
    group: 'pages',
    groupLabelKey: 'errors',
    keywords: ['403', 'permission'],
  },
  {
    labelKey: 'notFound',
    icon: FileX,
    url: AppRoutes.NotFound,
    group: 'pages',
    groupLabelKey: 'errors',
    keywords: ['404', 'missing'],
  },
  {
    labelKey: 'internalServerError',
    icon: ServerOff,
    url: AppRoutes.InternalServerError,
    group: 'pages',
    groupLabelKey: 'errors',
    keywords: ['500', 'crash'],
  },
  {
    labelKey: 'maintenance',
    icon: Construction,
    url: AppRoutes.Maintenance,
    group: 'pages',
    groupLabelKey: 'errors',
    keywords: ['down', 'offline'],
  },
  // ── Other ───────────────────────────────────────────────
  {
    labelKey: 'helpCenter',
    icon: HelpCircle,
    url: AppRoutes.HelpCenter,
    group: 'other',
    groupLabelKey: 'other',
    keywords: ['support', 'faq', 'docs'],
  },
  {
    labelKey: 'errors',
    icon: Bug,
    url: AppRoutes.Unauthorized,
    group: 'pages',
    groupLabelKey: 'errors',
    keywords: ['error', 'bug'],
  },
];
