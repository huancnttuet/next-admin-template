'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createBasicSchema,
  createAdvancedSchema,
  createDateBasicSchema,
  createDateRangeSchema,
  createDateBusinessSchema,
  createDateHolidaySchema,
  createLayoutSchema,
  createLayoutGridSchema,
  createImageUploadSchema,
  createMultiFileUploadSchema,
  createAsyncComboboxSchema,
  type BasicInput,
  type AdvancedInput,
  type DateInput,
  type LayoutInput,
  type FileUploadInput,
  type AsyncComboboxInput,
} from './form-example.schema';
import type { AsyncComboboxOption } from '@/components/ui/autoform/components/AsyncComboboxField';

// ── Mock API fetch functions ──────────────────────────────────────────────────
// Defined at module level so the references are stable — no useCallback needed.

async function fetchCategories(): Promise<AsyncComboboxOption[]> {
  await new Promise((r) => setTimeout(r, 2000));
  return [
    { value: 'frontend', label: 'Front-end Development' },
    { value: 'backend', label: 'Back-end Development' },
    { value: 'devops', label: 'DevOps & Infrastructure' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'data', label: 'Data Science & Analytics' },
    { value: 'design', label: 'UI / UX Design' },
    { value: 'security', label: 'Cyber Security' },
    { value: 'ml', label: 'Machine Learning & AI' },
  ];
}

async function fetchTags(): Promise<AsyncComboboxOption[]> {
  await new Promise((r) => setTimeout(r, 1600));
  return [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'certificate', label: 'With Certificate' },
  ];
}

export function AutoFormExample() {
  const t = useTranslations('autoFormExample');
  const [isPending, setIsPending] = useState(false);
  const [basicData, setBasicData] = useState<BasicInput | null>(null);
  const [advancedData, setAdvancedData] = useState<AdvancedInput | null>(null);
  const [dateData, setDateData] = useState<DateInput | null>(null);
  const [layoutData, setLayoutData] = useState<LayoutInput | null>(null);
  const [fileUploadData, setFileUploadData] = useState<FileUploadInput | null>(
    null,
  );
  const [asyncComboboxData, setAsyncComboboxData] =
    useState<AsyncComboboxInput | null>(null);

  const basicSchema = new ZodProvider(createBasicSchema(t));
  const advancedSchema = new ZodProvider(createAdvancedSchema(t));
  const dateBasicSchema = new ZodProvider(createDateBasicSchema(t));
  const dateRangeSchema = new ZodProvider(createDateRangeSchema(t));
  const dateBusinessSchema = new ZodProvider(createDateBusinessSchema(t));
  const dateHolidaySchema = new ZodProvider(createDateHolidaySchema(t));
  const layoutSchema = new ZodProvider(createLayoutSchema(t));
  const layoutGridSchema = new ZodProvider(createLayoutGridSchema(t));
  const imageUploadSchema = new ZodProvider(createImageUploadSchema(t));
  const multiFileUploadSchema = new ZodProvider(createMultiFileUploadSchema(t));
  const asyncComboboxSchema = new ZodProvider(
    createAsyncComboboxSchema(t, { fetchCategories, fetchTags }),
  );

  const handleSubmit =
    <T,>(setter: (v: T) => void) =>
    (data: T) => {
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
        setter(data);
        toast.success(t('submitSuccess'));
      }, 600);
    };

  return (
    <div className='space-y-8'>
      {/* ── Page header ── */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('description')}</p>
      </div>

      {/* ── Section 1: Basic fields ── */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>{t('sectionBasicTitle')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('sectionBasicDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <Tabs defaultValue='create'>
            <TabsList className='mb-4 w-full'>
              <TabsTrigger value='create' className='flex-1'>
                {t('createTitle')}
              </TabsTrigger>
              <TabsTrigger value='edit' className='flex-1'>
                {t('editTitle')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='create'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('createTitle')}</CardTitle>
                  <CardDescription>{t('createDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoForm
                    schema={basicSchema}
                    onSubmit={handleSubmit(setBasicData)}
                  >
                    <div className='flex justify-end pt-2'>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? t('submitting') : t('submitCreate')}
                      </Button>
                    </div>
                  </AutoForm>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='edit'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('editTitle')}</CardTitle>
                  <CardDescription>{t('editDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoForm
                    schema={basicSchema}
                    onSubmit={handleSubmit(setBasicData)}
                    defaultValues={{
                      username: 'john_doe',
                      email: 'john@example.com',
                      age: 28,
                      role: 'editor',
                      bio: 'Full-stack developer.',
                      isActive: true,
                    }}
                  >
                    <div className='flex justify-end pt-2'>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? t('submitting') : t('submitEdit')}
                      </Button>
                    </div>
                  </AutoForm>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className='h-fit'>
            <CardHeader>
              <CardTitle>{t('submittedTitle')}</CardTitle>
              <CardDescription>{t('submittedDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {basicData ? <JsonPreview data={basicData} /> : <EmptyPreview />}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ── Section 2: Advanced / rich input fields ── */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>{t('sectionAdvancedTitle')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('sectionAdvancedDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <Tabs defaultValue='create'>
            <TabsList className='mb-4 w-full'>
              <TabsTrigger value='create' className='flex-1'>
                {t('createTitle')}
              </TabsTrigger>
              <TabsTrigger value='edit' className='flex-1'>
                {t('editTitle')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='create'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('advancedCreateTitle')}</CardTitle>
                  <CardDescription>
                    {t('advancedCreateDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoForm
                    schema={advancedSchema}
                    onSubmit={handleSubmit(setAdvancedData)}
                  >
                    <div className='flex justify-end pt-2'>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? t('submitting') : t('submitCreate')}
                      </Button>
                    </div>
                  </AutoForm>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='edit'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('editTitle')}</CardTitle>
                  <CardDescription>{t('editDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoForm
                    schema={advancedSchema}
                    onSubmit={handleSubmit(setAdvancedData)}
                    defaultValues={{
                      birthday: '1995-06-15',
                      gender: 'male',
                      notifications: true,
                      interests: ['coding', 'gaming'],
                      skills: ['react', 'typescript'],
                      country: 'vn',
                      experience: 65,
                    }}
                  >
                    <div className='flex justify-end pt-2'>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? t('submitting') : t('submitEdit')}
                      </Button>
                    </div>
                  </AutoForm>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className='h-fit'>
            <CardHeader>
              <CardTitle>{t('submittedTitle')}</CardTitle>
              <CardDescription>{t('submittedDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {advancedData ? (
                <JsonPreview data={advancedData} />
              ) : (
                <EmptyPreview />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ── Section 3: Date picker variations ── */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>{t('sectionDateTitle')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('sectionDateDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='space-y-6'>
            {/* 1. Basic */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('dateVariantBasicTitle')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('dateVariantBasicDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={dateBasicSchema}
                  onSubmit={handleSubmit(setDateData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 2. Range */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('dateVariantRangeTitle')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('dateVariantRangeDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={dateRangeSchema}
                  onSubmit={handleSubmit(setDateData)}
                  defaultValues={{ date: '2026-06-15' }}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 3. Business days */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('dateVariantBusinessTitle')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('dateVariantBusinessDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={dateBusinessSchema}
                  onSubmit={handleSubmit(setDateData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 4. Disabled holidays */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('dateVariantHolidayTitle')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('dateVariantHolidayDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={dateHolidaySchema}
                  onSubmit={handleSubmit(setDateData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>
          </div>

          <Card className='h-fit'>
            <CardHeader>
              <CardTitle>{t('submittedTitle')}</CardTitle>
              <CardDescription>{t('submittedDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {dateData ? <JsonPreview data={dateData} /> : <EmptyPreview />}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ── Section 4: Custom form layouts ── */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>{t('sectionLayoutTitle')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('sectionLayoutDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='space-y-6'>
            {/* 1. Single column (default) */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('layoutVariant1Title')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('layoutVariant1Description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={layoutSchema}
                  onSubmit={handleSubmit(setLayoutData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 2. Two-column grid via custom uiComponents.Form */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('layoutVariant2Title')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('layoutVariant2Description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={layoutSchema}
                  onSubmit={handleSubmit(setLayoutData)}
                  uiComponents={{
                    Form: TwoColumnForm,
                  }}
                >
                  <div className='col-span-2 flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 3. Mixed widths via customData.className on each field */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('layoutVariant3Title')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('layoutVariant3Description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={layoutGridSchema}
                  onSubmit={handleSubmit(setLayoutData)}
                  uiComponents={{
                    Form: TwoColumnForm,
                  }}
                >
                  <div className='col-span-2 flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>
          </div>

          <Card className='h-fit'>
            <CardHeader>
              <CardTitle>{t('submittedTitle')}</CardTitle>
              <CardDescription>{t('submittedDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {layoutData ? (
                <JsonPreview data={layoutData} />
              ) : (
                <EmptyPreview />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ── Section 5: File upload & async combobox ── */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>
            {t('sectionUploadAsyncTitle')}
          </h2>
          <p className='text-sm text-muted-foreground'>
            {t('sectionUploadAsyncDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='space-y-6'>
            {/* 1. Single image upload */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('uploadVariant1Title')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('uploadVariant1Description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={imageUploadSchema}
                  onSubmit={handleSubmit(setFileUploadData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 2. Multiple files (images + PDF) */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('uploadVariant2Title')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('uploadVariant2Description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={multiFileUploadSchema}
                  onSubmit={handleSubmit(setFileUploadData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>

            {/* 3. Async combobox — data fetched from API */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium'>
                  {t('uploadVariant3Title')}
                </CardTitle>
                <CardDescription className='text-xs'>
                  {t('uploadVariant3Description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoForm
                  schema={asyncComboboxSchema}
                  onSubmit={handleSubmit(setAsyncComboboxData)}
                >
                  <div className='flex justify-end pt-2'>
                    <Button type='submit' size='sm' disabled={isPending}>
                      {isPending ? t('submitting') : t('submitCreate')}
                    </Button>
                  </div>
                </AutoForm>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card className='h-fit'>
              <CardHeader>
                <CardTitle>{t('submittedTitle')}</CardTitle>
                <CardDescription>{t('submittedDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {fileUploadData ? (
                  <JsonPreview data={fileUploadData} />
                ) : (
                  <EmptyPreview />
                )}
              </CardContent>
            </Card>

            <Card className='h-fit'>
              <CardHeader>
                <CardTitle>{t('submittedTitle')}</CardTitle>
                <CardDescription>{t('submittedDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {asyncComboboxData ? (
                  <JsonPreview data={asyncComboboxData} />
                ) : (
                  <EmptyPreview />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Field type reference ── */}
      <FieldTypeReference />
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * TwoColumnForm — drop-in replacement for the default <Form> component that
 * renders fields in a 2-column CSS grid. Pass via uiComponents={{ Form: TwoColumnForm }}.
 * Fields that need full width should set customData: { className: 'col-span-2' }
 * in their fieldConfig.
 */
const TwoColumnForm = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<'form'>
>(({ children, ...props }, ref) => (
  <form
    ref={ref}
    className='grid grid-cols-2 gap-x-4 gap-y-4'
    noValidate
    {...props}
  >
    {children}
  </form>
));
TwoColumnForm.displayName = 'TwoColumnForm';

function JsonPreview({ data }: { data: object }) {
  const safeData = JSON.parse(
    JSON.stringify(data, (_key, value) => {
      // FilePreview objects contain a File (non-serialisable) — show name + size instead
      if (value && typeof value === 'object' && value.file instanceof File) {
        return {
          name: value.file.name,
          size: value.file.size,
          type: value.file.type,
        };
      }
      return value;
    }),
  );
  return (
    <pre className='overflow-x-auto rounded-md bg-muted p-4 text-xs'>
      {JSON.stringify(safeData, null, 2)}
    </pre>
  );
}

function EmptyPreview() {
  return (
    <p className='py-8 text-center text-sm text-muted-foreground'>
      Submit the form to see results here.
    </p>
  );
}

const FIELD_TYPES: Array<{
  type: string;
  inferred: string;
  zod: string;
  component: string;
  customData?: string;
}> = [
  {
    type: '(default)',
    inferred: 'string',
    zod: 'z.string()',
    component: '<Input>',
  },
  {
    type: '(default)',
    inferred: 'number',
    zod: 'z.preprocess(…, z.number())',
    component: '<Input type="number">',
    customData: '—',
  },
  {
    type: '(default)',
    inferred: 'boolean',
    zod: 'z.boolean()',
    component: '<Checkbox>',
  },
  {
    type: '(default)',
    inferred: 'select',
    zod: 'z.enum([…])',
    component: '<Select>',
  },
  {
    type: 'date',
    inferred: 'string',
    zod: 'z.string()',
    component: 'Text input + calendar popover',
    customData:
      'min, max, disableWeekends, disabledDates, defaultMonth, placeholder',
  },
  {
    type: 'textarea',
    inferred: 'string',
    zod: 'z.string()',
    component: '<Textarea> (4 rows)',
  },
  {
    type: 'switch',
    inferred: 'boolean',
    zod: 'z.boolean()',
    component: '<Switch> + inline label',
  },
  {
    type: 'radio',
    inferred: 'select',
    zod: 'z.enum([…])',
    component: 'Radio button group',
  },
  {
    type: 'multi-checkbox',
    inferred: 'array',
    zod: 'z.enum([…]).array()',
    component: '<Checkbox> per option',
    customData: 'options?: string[]',
  },
  {
    type: 'multi-select',
    inferred: 'array',
    zod: 'z.enum([…]).array()',
    component: 'Badge pill dropdown',
    customData: 'options?: string[]',
  },
  {
    type: 'combobox',
    inferred: 'select',
    zod: 'z.enum([…])',
    component: '<Command> + <Popover>',
  },
  {
    type: 'slider',
    inferred: 'number',
    zod: 'z.coerce.number()',
    component: '<Slider> (0–100)',
  },
  {
    type: 'file-upload',
    inferred: 'any',
    zod: 'z.any()',
    component: 'Drag-and-drop zone + image/PDF preview',
    customData: 'accept, maxSizeMB, multiple, maxFiles',
  },
  {
    type: 'async-combobox',
    inferred: 'string',
    zod: 'z.string()',
    component: '<Command> + <Popover> + TanStack Query',
    customData: 'queryKey, queryFn, placeholder, searchPlaceholder, emptyText',
  },
];

function FieldTypeReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Field type reference</CardTitle>
        <CardDescription>
          Set{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>
            fieldType
          </code>{' '}
          in{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>
            fieldConfig()
          </code>{' '}
          to override the default component. Rows marked{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>
            (default)
          </code>{' '}
          are inferred automatically from the Zod type with no{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>
            fieldType
          </code>{' '}
          needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b text-left text-xs text-muted-foreground'>
                <th className='pb-2 pr-4 font-medium'>fieldType</th>
                <th className='pb-2 pr-4 font-medium'>Inferred from</th>
                <th className='pb-2 pr-4 font-medium'>Zod schema</th>
                <th className='pb-2 pr-4 font-medium'>Rendered as</th>
                <th className='pb-2 font-medium'>customData options</th>
              </tr>
            </thead>
            <tbody>
              {FIELD_TYPES.map(
                ({ type, inferred, zod, component, customData }) => (
                  <tr key={`${type}-${zod}`} className='border-b last:border-0'>
                    <td className='py-2 pr-4'>
                      <Badge
                        variant={type === '(default)' ? 'outline' : 'secondary'}
                        className='font-mono text-xs'
                      >
                        {type}
                      </Badge>
                    </td>
                    <td className='py-2 pr-4 font-mono text-xs text-muted-foreground'>
                      {inferred}
                    </td>
                    <td className='py-2 pr-4 font-mono text-xs text-muted-foreground'>
                      {zod}
                    </td>
                    <td className='py-2 pr-4 font-mono text-xs'>{component}</td>
                    <td className='py-2 text-xs text-muted-foreground'>
                      {customData ?? '—'}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
