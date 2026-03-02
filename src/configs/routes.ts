export const AppRoutes = {
  // Dashboard
  Dashboard: '/',
  Tasks: '/tasks',
  Apps: '/apps',
  Chats: '/chats',
  Users: '/users',
  HelpCenter: '/help-center',

  // Auth
  SignIn: '/sign-in',
  SignIn2: '/sign-in-2',
  SignUp: '/sign-up',
  ForgotPassword: '/forgot-password',
  OTP: '/otp',

  // Settings
  Settings: '/settings',
  SettingsAccount: '/settings/account',
  SettingsAppearance: '/settings/appearance',
  SettingsNotifications: '/settings/notifications',
  SettingsDisplay: '/settings/display',

  // Errors
  Unauthorized: '/errors/unauthorized',
  Forbidden: '/errors/forbidden',
  NotFound: '/errors/not-found',
  InternalServerError: '/errors/internal-server-error',
  Maintenance: '/errors/maintenance',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
