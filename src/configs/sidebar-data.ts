import {
  Bug,
  Construction,
  FileX,
  HelpCircle,
  LayoutDashboard,
  ListTodo,
  Lock,
  MessagesSquare,
  Monitor,
  Package,
  Palette,
  Bell,
  ServerOff,
  Settings,
  ShieldCheck,
  UserCog,
  UserX,
  Users,
  Wrench,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type SidebarData } from '@/types/sidebar'
import { IIGIIcon } from '@/components/icons/iig-icon'

export function useSidebarData(): SidebarData {
  const t = useTranslations('sidebar')

  return {
    user: {
      name: 'Admin User',
      email: 'admin@example.com',
      avatar: '/avatars/01.png',
    },
    info: {
      name: 'ELearning Admin',
      logo: IIGIIcon,
      plan: 'IIG Vietnam',
    },
    navGroups: [
      {
        title: t('general'),
        items: [
          {
            title: t('dashboard'),
            url: '/',
            icon: LayoutDashboard,
          },
          {
            title: t('tasks'),
            url: '/tasks',
            icon: ListTodo,
          },
          {
            title: t('apps'),
            url: '/apps',
            icon: Package,
          },
          {
            title: t('chats'),
            url: '/chats',
            badge: '3',
            icon: MessagesSquare,
          },
          {
            title: t('users'),
            url: '/users',
            icon: Users,
          },
        ],
      },
      {
        title: t('pages'),
        items: [
          {
            title: t('auth'),
            icon: ShieldCheck,
            items: [
              { title: t('signIn'), url: '/sign-in' },
              { title: t('signIn2Col'), url: '/sign-in-2' },
              { title: t('signUp'), url: '/sign-up' },
              { title: t('forgotPassword'), url: '/forgot-password' },
              { title: t('otp'), url: '/otp' },
            ],
          },
          {
            title: t('errors'),
            icon: Bug,
            items: [
              { title: t('unauthorized'), url: '/errors/unauthorized', icon: Lock },
              { title: t('forbidden'), url: '/errors/forbidden', icon: UserX },
              { title: t('notFound'), url: '/errors/not-found', icon: FileX },
              {
                title: t('internalServerError'),
                url: '/errors/internal-server-error',
                icon: ServerOff,
              },
              { title: t('maintenance'), url: '/errors/maintenance', icon: Construction },
            ],
          },
        ],
      },
      {
        title: t('other'),
        items: [
          {
            title: t('settings'),
            icon: Settings,
            items: [
              { title: t('profile'), url: '/settings', icon: UserCog },
              { title: t('account'), url: '/settings/account', icon: Wrench },
              { title: t('appearance'), url: '/settings/appearance', icon: Palette },
              { title: t('notifications'), url: '/settings/notifications', icon: Bell },
              { title: t('display'), url: '/settings/display', icon: Monitor },
            ],
          },
          {
            title: t('helpCenter'),
            url: '/help-center',
            icon: HelpCircle,
          },
        ],
      },
    ],
  }
}
