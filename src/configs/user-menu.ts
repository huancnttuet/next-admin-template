import { Settings, UserCircle, type LucideIcon } from 'lucide-react';
import { KeyRound, LogOut } from 'lucide-react';
import { AppRoutes } from '@/configs/routes';
import { SSOConfig } from '@/configs/sso';

export interface ProfileMenuItem {
  /** i18n key under the 'sidebar' namespace */
  labelKey: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Internal route (rendered as Next.js Link) */
  href?: string;
  /** External URL (rendered as <a> with target="_blank") */
  externalHref?: string;
  /** Keyboard shortcut label (e.g. '⇧⌘P') */
  shortcut?: string;
  /** Show only when the user is authenticated via SSO */
  ssoOnly?: boolean;
  /** Marks this item as the sign-out action */
  isSignOut?: boolean;
}

export interface ProfileMenuGroup {
  items: ProfileMenuItem[];
}

/**
 * Menu groups used by **nav-user** (sidebar dropdown) and **profile-dropdown** (header dropdown).
 *
 * Groups are rendered top-to-bottom, separated by dividers.
 */
export const userMenuGroups: ProfileMenuGroup[] = [
  {
    items: [
      {
        labelKey: 'account',
        icon: UserCircle,
        href: AppRoutes.Account,
      },
      { labelKey: 'settings', icon: Settings, href: AppRoutes.Settings },
    ],
  },
  {
    items: [
      {
        labelKey: 'changePassword',
        icon: KeyRound,
        externalHref: SSOConfig.changePasswordPage,
        ssoOnly: true,
      },
    ],
  },
  {
    items: [{ labelKey: 'signOut', icon: LogOut, isSignOut: true }],
  },
];
