export const AppRoutes = {
  // Dashboard
  Dashboard: '/',
  QuestionnaireGroups: '/questionnaire-groups',
  HelpCenter: '/help-center',

  // Auth
  SignIn: '/sign-in',
  SignUp: '/sign-up',
  ForgotPassword: '/forgot-password',
  OTP: '/otp',

  // Account
  Account: '/account',

  // User
  Users: '/users',

  // Settings
  Settings: '/settings',

  // Errors
  Unauthorized: '/errors/unauthorized',
  Forbidden: '/errors/forbidden',
  NotFound: '/errors/not-found',
  InternalServerError: '/errors/internal-server-error',
  Maintenance: '/errors/maintenance',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
