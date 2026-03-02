'use client'

import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  usePreferencesStore,
  PREFERENCE_DEFAULTS,
  type ThemeMode,
  type ContentLayout,
  type NavbarStyle,
  type SidebarVariant,
  type SidebarCollapsible,
  type FontKey,
  type ScaleKey,
  type RadiusKey,
} from '@/stores/preferences-store'
import { useTheme } from 'next-themes'

const THEME_PRESETS = [
  { label: 'Default', value: 'default', color: 'bg-zinc-900 dark:bg-zinc-100' },
  { label: 'Blue', value: 'blue', color: 'bg-blue-600' },
  { label: 'Green', value: 'green', color: 'bg-green-600' },
  { label: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { label: 'Tangerine', value: 'tangerine', color: 'bg-orange-400' },
  { label: 'Soft Pop', value: 'soft-pop', color: 'bg-violet-500' },
  { label: 'Brutalist', value: 'brutalist', color: 'bg-red-500' },
  { label: 'Underground', value: 'underground', color: 'bg-amber-500' },
  { label: 'Sunset Glow', value: 'sunset-glow', color: 'bg-rose-500' },
  { label: 'Rose Garden', value: 'rose-garden', color: 'bg-pink-500' },
  { label: 'Lake View', value: 'lake-view', color: 'bg-cyan-600' },
  { label: 'Forest Whispers', value: 'forest-whispers', color: 'bg-emerald-700' },
  { label: 'Ocean Breeze', value: 'ocean-breeze', color: 'bg-sky-500' },
  { label: 'Lavender Dream', value: 'lavender-dream', color: 'bg-purple-500' },
] as const

const FONT_OPTIONS = [
  { label: 'Inter', value: 'inter' as FontKey },
  { label: 'Manrope', value: 'manrope' as FontKey },
  { label: 'Nunito', value: 'nunito' as FontKey },
  { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' as FontKey },
  { label: 'Space Grotesk', value: 'space-grotesk' as FontKey },
  { label: 'DM Sans', value: 'dm-sans' as FontKey },
  { label: 'System', value: 'system' as FontKey },
] as const

const SCALE_OPTIONS = [
  { label: 'XS', value: 'xs' as ScaleKey },
  { label: 'Normal', value: 'normal' as ScaleKey },
  { label: 'LG', value: 'lg' as ScaleKey },
] as const

const RADIUS_OPTIONS = [
  { label: 'SM', value: 'sm' as RadiusKey },
  { label: 'Normal', value: 'normal' as RadiusKey },
  { label: 'MD', value: 'md' as RadiusKey },
  { label: 'LG', value: 'lg' as RadiusKey },
  { label: 'XL', value: 'xl' as RadiusKey },
] as const

export function LayoutControls() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('preferences')

  const themePreset = usePreferencesStore((s) => s.themePreset)
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset)
  const font = usePreferencesStore((s) => s.font)
  const setFont = usePreferencesStore((s) => s.setFont)
  const scale = usePreferencesStore((s) => s.scale)
  const setScale = usePreferencesStore((s) => s.setScale)
  const radius = usePreferencesStore((s) => s.radius)
  const setRadius = usePreferencesStore((s) => s.setRadius)
  const contentLayout = usePreferencesStore((s) => s.contentLayout)
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout)
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle)
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle)
  const sidebarVariant = usePreferencesStore((s) => s.sidebarVariant)
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant)
  const sidebarCollapsible = usePreferencesStore((s) => s.sidebarCollapsible)
  const setSidebarCollapsible = usePreferencesStore((s) => s.setSidebarCollapsible)
  const resetPreferences = usePreferencesStore((s) => s.resetPreferences)

  const tCommon = useTranslations('common')

  const handleThemeModeChange = (mode: ThemeMode | '') => {
    if (!mode) return
    setTheme(mode)
  }

  const handleRestore = () => {
    resetPreferences()
    setTheme(PREFERENCE_DEFAULTS.themeMode)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost' className='rounded-full'>
          <Settings className='size-[1.2rem]' />
          <span className='sr-only'>{tCommon('preferences')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80'>
        <div className='flex flex-col gap-2'>
          {/* Header */}
          <div className='space-y-1.5'>
            <h4 className='text-sm font-medium leading-none'>{tCommon('preferences')}</h4>
            <p className='text-xs text-muted-foreground'>{tCommon('preferencesDescription')}</p>
          </div>

          <div className='space-y-3'>
            {/* Theme Preset */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('themePreset')}</Label>
              <Select value={themePreset} onValueChange={setThemePreset}>
                <SelectTrigger className='h-8 w-full text-xs'>
                  <SelectValue placeholder='Preset' />
                </SelectTrigger>
                <SelectContent>
                  {THEME_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} className='text-xs' value={preset.value}>
                      <span className='flex items-center gap-2'>
                        <span className={cn('size-2.5 rounded-full', preset.color)} />
                        {preset.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fonts */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('fonts')}</Label>
              <Select value={font} onValueChange={(v) => setFont(v as FontKey)}>
                <SelectTrigger className='h-8 w-full text-xs'>
                  <SelectValue placeholder='Select font' />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} className='text-xs' value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scale */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('scale')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={scale}
                onValueChange={(v) => v && setScale(v as ScaleKey)}
              >
                {SCALE_OPTIONS.map((opt) => (
                  <ToggleGroupItem
                    key={opt.value}
                    value={opt.value}
                    aria-label={opt.label}
                    className='flex-1 text-xs'
                  >
                    {opt.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Radius */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('radius')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={radius}
                onValueChange={(v) => v && setRadius(v as RadiusKey)}
              >
                {RADIUS_OPTIONS.map((opt) => (
                  <ToggleGroupItem
                    key={opt.value}
                    value={opt.value}
                    aria-label={opt.label}
                    className='flex-1 text-xs'
                  >
                    {opt.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Theme Mode */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('themeMode')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={theme ?? 'system'}
                onValueChange={handleThemeModeChange}
              >
                <ToggleGroupItem value='light' aria-label='Light' className='flex-1 text-xs'>
                  {t('light')}
                </ToggleGroupItem>
                <ToggleGroupItem value='dark' aria-label='Dark' className='flex-1 text-xs'>
                  {t('dark')}
                </ToggleGroupItem>
                <ToggleGroupItem value='system' aria-label='System' className='flex-1 text-xs'>
                  {t('system')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Page Layout */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('pageLayout')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={contentLayout}
                onValueChange={(v) => v && setContentLayout(v as ContentLayout)}
              >
                <ToggleGroupItem value='centered' aria-label='Centered' className='flex-1 text-xs'>
                  {t('centered')}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value='full-width'
                  aria-label='Full Width'
                  className='flex-1 text-xs'
                >
                  {t('fullWidth')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Navbar Behavior */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('navbarBehavior')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={navbarStyle}
                onValueChange={(v) => v && setNavbarStyle(v as NavbarStyle)}
              >
                <ToggleGroupItem value='sticky' aria-label='Sticky' className='flex-1 text-xs'>
                  {t('sticky')}
                </ToggleGroupItem>
                <ToggleGroupItem value='scroll' aria-label='Scroll' className='flex-1 text-xs'>
                  {t('scroll')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Sidebar Style */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('sidebarStyle')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={sidebarVariant}
                onValueChange={(v) => v && setSidebarVariant(v as SidebarVariant)}
              >
                <ToggleGroupItem value='inset' aria-label='Inset' className='flex-1 text-xs'>
                  {t('inset')}
                </ToggleGroupItem>
                <ToggleGroupItem value='sidebar' aria-label='Sidebar' className='flex-1 text-xs'>
                  {t('sidebar')}
                </ToggleGroupItem>
                <ToggleGroupItem value='floating' aria-label='Floating' className='flex-1 text-xs'>
                  {t('floating')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Sidebar Collapse Mode */}
            <div className='space-y-1'>
              <Label className='text-xs font-medium'>{t('sidebarCollapseMode')}</Label>
              <ToggleGroup
                type='single'
                variant='outline'
                size='sm'
                className='w-full'
                value={sidebarCollapsible}
                onValueChange={(v) => v && setSidebarCollapsible(v as SidebarCollapsible)}
              >
                <ToggleGroupItem value='icon' aria-label='Icon' className='flex-1 text-xs'>
                  {t('icon')}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value='offcanvas'
                  aria-label='OffCanvas'
                  className='flex-1 text-xs'
                >
                  {t('offCanvas')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Restore Defaults */}
            <Button
              type='button'
              size='sm'
              variant='outline'
              className='w-full'
              onClick={handleRestore}
            >
              {tCommon('restoreDefaults')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
