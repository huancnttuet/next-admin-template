import {
  Bug,
  ClipboardList,
  Construction,
  FileX,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Package,
  ServerOff,
  ShieldCheck,
  Star,
  Tags,
  UserX,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type SidebarData } from '@/types/sidebar';
import { Permissions } from './rbac';
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
            title: t('products'),
            url: AppRoutes.Products,
            icon: Package,
            permissions: Permissions.ProductsRead,
          },
          {
            title: t('orders'),
            url: AppRoutes.Orders,
            icon: ClipboardList,
            permissions: Permissions.OrdersRead,
          },
          {
            title: t('promocodes'),
            url: AppRoutes.Promocodes,
            icon: Tags,
            permissions: Permissions.PromocodesRead,
          },
          {
            title: t('categories'),
            url: AppRoutes.Categories,
            icon: Tags,
            permissions: Permissions.CategoriesRead,
          },
          {
            title: t('reviews'),
            url: AppRoutes.Reviews,
            icon: Star,
            permissions: Permissions.ReviewsRead,
          },

          {
            title: t('users'),
            url: AppRoutes.Users,
            icon: Users,
            permissions: Permissions.UsersRead,
          },
          {
            title: t('roles'),
            url: AppRoutes.Roles,
            icon: ShieldCheck,
            permissions: Permissions.RolesRead,
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
