import {
  Bug,
  ClipboardList,
  Construction,
  FileX,
  HelpCircle,
  LayoutDashboard,
  Lock,
  ServerOff,
  ShieldCheck,
  UserX,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type SidebarData } from '@/types/sidebar';
import { LogoIcon } from '@/components/icons/logo-icon';
import { AppRoutes } from './routes';

export function useSidebarData(): SidebarData {
  const t = useTranslations('sidebar');

  return {
    info: {
      name: 'Next Admin Template',
      logo: LogoIcon,
      plan: 'Next Admin Template',
    },
    navGroups: [
      {
        title: t('general'),
        items: [
          {
            title: t('dashboard'),
            url: AppRoutes.Dashboard,
            icon: LayoutDashboard,
          },

          {
            title: t('questionnaireGroups'),
            url: AppRoutes.QuestionnaireGroups,
            icon: ClipboardList,
          },

          {
            title: t('users'),
            url: AppRoutes.Users,
            icon: Users,
          },
          {
            title: t('roles'),
            url: AppRoutes.Roles,
            icon: ShieldCheck,
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
              { title: t('signIn'), url: AppRoutes.SignIn },
              { title: t('signUp'), url: AppRoutes.SignUp },
              { title: t('forgotPassword'), url: AppRoutes.ForgotPassword },
              { title: t('otp'), url: AppRoutes.OTP },
            ],
          },
          {
            title: t('errors'),
            icon: Bug,
            items: [
              {
                title: t('unauthorized'),
                url: AppRoutes.Unauthorized,
                icon: Lock,
              },
              { title: t('forbidden'), url: AppRoutes.Forbidden, icon: UserX },
              { title: t('notFound'), url: AppRoutes.NotFound, icon: FileX },
              {
                title: t('internalServerError'),
                url: AppRoutes.InternalServerError,
                icon: ServerOff,
              },
              {
                title: t('maintenance'),
                url: AppRoutes.Maintenance,
                icon: Construction,
              },
            ],
          },
        ],
      },
      {
        title: t('other'),
        items: [
          {
            title: t('helpCenter'),
            url: AppRoutes.HelpCenter,
            icon: HelpCircle,
          },
        ],
      },
    ],
  };
}
