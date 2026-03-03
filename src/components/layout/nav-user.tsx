'use client';

import Link from 'next/link';
import { ChevronsUpDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { buildSSOLogoutUrl } from '@/configs/sso';
import { AppRoutes } from '@/configs/routes';
import { userMenuGroups, type ProfileMenuItem } from '@/configs/user-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const t = useTranslations('sidebar');
  const isSSO = session?.provider === 'sso';

  const userName = session?.user?.name ?? '';
  const userEmail = session?.user?.email || t('unknownEmail');

  const handleSignOut = async () => {
    if (isSSO) {
      await signOut({ redirect: false });
      // eslint-disable-next-line react-hooks/immutability -- intentional full-page redirect for SSO logout
      window.location.href = buildSSOLogoutUrl();
    } else {
      signOut({ callbackUrl: AppRoutes.SignIn });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarFallback className='rounded-lg'>
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{userName}</span>
                <span className='truncate text-xs'>{userEmail}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarFallback className='rounded-lg'>
                    {userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{userName}</span>
                  <span className='truncate text-xs'>{userEmail}</span>
                </div>
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
                      renderNavUserItem(item, t, handleSignOut),
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function renderNavUserItem(
  item: ProfileMenuItem,
  t: (key: string) => string,
  onSignOut: () => void,
) {
  const Icon = item.icon;

  if (item.isSignOut) {
    return (
      <DropdownMenuItem key={item.labelKey} onClick={onSignOut}>
        {Icon && <Icon />}
        {t(item.labelKey)}
      </DropdownMenuItem>
    );
  }

  if (item.externalHref) {
    return (
      <DropdownMenuItem key={item.labelKey} asChild>
        <a href={item.externalHref} target='_blank' rel='noopener noreferrer'>
          {Icon && <Icon />}
          {t(item.labelKey)}
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
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem key={item.labelKey}>
      {Icon && <Icon />}
      {t(item.labelKey)}
    </DropdownMenuItem>
  );
}
