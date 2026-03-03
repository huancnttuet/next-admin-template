'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { buildSSOLogoutUrl } from '@/configs/sso';
import { AppRoutes } from '@/configs/routes';
import { userMenuGroups, type ProfileMenuItem } from '@/configs/user-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProfileDropdown() {
  const { data: session } = useSession();
  const t = useTranslations('sidebar');
  const isSSO = session?.provider === 'sso';

  const handleSignOut = async () => {
    if (isSSO) {
      await signOut({ redirect: false });
      // eslint-disable-next-line react-hooks/immutability -- intentional full-page redirect for SSO logout
      window.location.href = buildSSOLogoutUrl();
    } else {
      signOut({ callbackUrl: AppRoutes.SignIn });
    }
  };

  const userName = session?.user?.name || '';
  const userEmail = session?.user?.email || t('unknownEmail');

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-1.5'>
            <p className='text-sm font-medium leading-none'>{userName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userMenuGroups.map((group, groupIndex) => {
          const visibleItems = group.items.filter(
            (item) => !item.ssoOnly || isSSO,
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIndex}>
              <DropdownMenuGroup>
                {visibleItems.map((item) =>
                  renderProfileItem(item, t, handleSignOut),
                )}
              </DropdownMenuGroup>
              {groupIndex < userMenuGroups.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function renderProfileItem(
  item: ProfileMenuItem,
  t: (key: string) => string,
  onSignOut: () => void,
) {
  const Icon = item.icon;
  const shortcut = item.shortcut ? (
    <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
  ) : null;

  if (item.isSignOut) {
    return (
      <DropdownMenuItem key={item.labelKey} onClick={onSignOut}>
        {Icon && <Icon />}
        {t(item.labelKey)}
        {shortcut}
      </DropdownMenuItem>
    );
  }

  if (item.externalHref) {
    return (
      <DropdownMenuItem key={item.labelKey} asChild>
        <a href={item.externalHref} target='_blank' rel='noopener noreferrer'>
          {Icon && <Icon />}
          {t(item.labelKey)}
          {shortcut}
        </a>
      </DropdownMenuItem>
    );
  }

  if (item.href) {
    return (
      <DropdownMenuItem key={item.labelKey} asChild>
        <Link href={item.href}>
          {Icon && <Icon />}
          {t(item.labelKey)}
          {shortcut}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem key={item.labelKey}>
      {Icon && <Icon />}
      {t(item.labelKey)}
      {shortcut}
    </DropdownMenuItem>
  );
}
