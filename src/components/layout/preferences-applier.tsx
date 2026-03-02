'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/stores/preferences-store';

/** Default border-radius from :root */
const DEFAULT_RADIUS = '0.5rem';

/** Scale CSS values */
const SCALE_MAP = {
  normal: '1',
  xs: '0.9',
  lg: '1.1',
} as const;

/** Radius CSS values */
const RADIUS_MAP = {
  normal: '0.5rem',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

/** All font CSS classes that can be applied to the body */
const FONT_CLASSES = [
  'font-inter',
  'font-manrope',
  'font-nunito',
  'font-plus-jakarta-sans',
  'font-space-grotesk',
  'font-dm-sans',
  'font-system',
] as const;

/**
 * Applies user preferences (theme preset, font, scale, radius, content layout)
 * to the document element so CSS can respond accordingly.
 *
 * Mount once inside <Providers> — it has no visible UI.
 */
export function PreferencesApplier() {
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const font = usePreferencesStore((s) => s.font);
  const scale = usePreferencesStore((s) => s.scale);
  const radius = usePreferencesStore((s) => s.radius);
  const contentLayout = usePreferencesStore((s) => s.contentLayout);

  /* ── Theme preset ── */
  useEffect(() => {
    const root = document.documentElement;
    if (themePreset === 'default') {
      root.removeAttribute('data-theme-preset');
      root.style.setProperty('--radius', DEFAULT_RADIUS);
    } else {
      root.setAttribute('data-theme-preset', themePreset);
    }
  }, [themePreset]);

  /* ── Font family ── */
  useEffect(() => {
    const body = document.body;
    body.classList.remove(...FONT_CLASSES);
    body.classList.add(`font-${font}`);
  }, [font]);

  /* ── Scale ── */
  useEffect(() => {
    document.documentElement.style.fontSize =
      scale === 'normal' ? '' : `calc(16px * ${SCALE_MAP[scale]})`;
  }, [scale]);

  /* ── Radius ── */
  useEffect(() => {
    document.documentElement.style.setProperty('--radius', RADIUS_MAP[radius]);
  }, [radius]);

  /* ── Content layout ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-content-layout', contentLayout);
  }, [contentLayout]);

  return null;
}
