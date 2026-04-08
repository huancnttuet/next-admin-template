import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ContentLayout = 'centered' | 'full-width';
export type NavbarStyle = 'sticky' | 'scroll';
export type SidebarVariant = 'inset' | 'sidebar' | 'floating';
export type SidebarCollapsible = 'icon' | 'offcanvas';
export type FontKey =
  | 'inter'
  | 'manrope'
  | 'nunito'
  | 'plus-jakarta-sans'
  | 'space-grotesk'
  | 'dm-sans'
  | 'system';
export type ScaleKey = 'normal' | 'xs' | 'lg';
export type RadiusKey = 'normal' | 'sm' | 'md' | 'lg' | 'xl';

export const PREFERENCE_DEFAULTS = {
  themeMode: 'light' as ThemeMode,
  themePreset: 'default' as string,
  font: 'nunito' as FontKey,
  scale: 'normal' as ScaleKey,
  radius: 'normal' as RadiusKey,
  contentLayout: 'full-width' as ContentLayout,
  navbarStyle: 'sticky' as NavbarStyle,
  sidebarVariant: 'inset' as SidebarVariant,
  sidebarCollapsible: 'icon' as SidebarCollapsible,
};

export type PreferencesState = {
  themeMode: ThemeMode;
  themePreset: string;
  font: FontKey;
  scale: ScaleKey;
  radius: RadiusKey;
  contentLayout: ContentLayout;
  navbarStyle: NavbarStyle;
  sidebarVariant: SidebarVariant;
  sidebarCollapsible: SidebarCollapsible;
};

type PreferencesActions = {
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (preset: string) => void;
  setFont: (font: FontKey) => void;
  setScale: (scale: ScaleKey) => void;
  setRadius: (radius: RadiusKey) => void;
  setContentLayout: (layout: ContentLayout) => void;
  setNavbarStyle: (style: NavbarStyle) => void;
  setSidebarVariant: (variant: SidebarVariant) => void;
  setSidebarCollapsible: (mode: SidebarCollapsible) => void;
  resetPreferences: () => void;
};

export const usePreferencesStore = create<
  PreferencesState & PreferencesActions
>()(
  persist(
    (set) => ({
      ...PREFERENCE_DEFAULTS,
      setThemeMode: (mode) => set({ themeMode: mode }),
      setThemePreset: (preset) => set({ themePreset: preset }),
      setFont: (font) => set({ font }),
      setScale: (scale) => set({ scale }),
      setRadius: (radius) => set({ radius }),
      setContentLayout: (layout) => set({ contentLayout: layout }),
      setNavbarStyle: (style) => set({ navbarStyle: style }),
      setSidebarVariant: (variant) => set({ sidebarVariant: variant }),
      setSidebarCollapsible: (mode) => set({ sidebarCollapsible: mode }),
      resetPreferences: () => set(PREFERENCE_DEFAULTS),
    }),
    {
      name: 'preferences-storage',
    },
  ),
);
