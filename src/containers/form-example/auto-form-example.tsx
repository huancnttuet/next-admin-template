'use client';

import { useState } from 'react';
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
import { createProfileSchema } from './form-example.schema';
import type { ProfileInput } from './form-example.schema';

export function AutoFormExample() {
  const t = useTranslations('autoFormExample');
  const [submittedData, setSubmittedData] = useState<ProfileInput | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Build schema inside component so `t` is always fresh.
  const schema = createProfileSchema(t);
  const schemaProvider = new ZodProvider(schema);

  // ---------- Handlers ----------

  const handleCreate = (data: ProfileInput) => {
    setIsPending(true);
    // Simulate async submit
    setTimeout(() => {
      setIsPending(false);
      setSubmittedData(data);
      toast.success(t('submitSuccess'));
    }, 800);
  };

  const handleEdit = (data: ProfileInput) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setSubmittedData(data);
      toast.success(t('submitSuccess'));
    }, 800);
  };

  const handleReset = () => {
    setSubmittedData(null);
    toast(t('resetSuccess'));
  };

  // ---------- Render ----------

  return (
    <div className='space-y-6'>
      {/* Page header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('description')}
          </p>
        </div>
        {submittedData && (
          <Button variant='outline' size='sm' onClick={handleReset}>
            {t('resetTitle')}
          </Button>
        )}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* ── Forms ── */}
        <div className='space-y-6'>
          <Tabs defaultValue='create'>
            <TabsList className='mb-4 w-full'>
              <TabsTrigger value='create' className='flex-1'>
                {t('createTitle')}
              </TabsTrigger>
              <TabsTrigger value='edit' className='flex-1'>
                {t('editTitle')}
              </TabsTrigger>
            </TabsList>

            {/* ── Create tab ── */}
            <TabsContent value='create'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('createTitle')}</CardTitle>
                  <CardDescription>{t('createDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoForm schema={schemaProvider} onSubmit={handleCreate}>
                    <div className='flex justify-end pt-2'>
                      <Button type='submit' disabled={isPending}>
                        {isPending ? t('submitting') : t('submitCreate')}
                      </Button>
                    </div>
                  </AutoForm>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Edit tab — pre-filled with defaultValues ── */}
            <TabsContent value='edit'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('editTitle')}</CardTitle>
                  <CardDescription>{t('editDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoForm
                    schema={schemaProvider}
                    onSubmit={handleEdit}
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
        </div>

        {/* ── Submitted data preview ── */}
        <div>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>{t('submittedTitle')}</CardTitle>
              <CardDescription>{t('submittedDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {submittedData ? (
                <div className='space-y-3'>
                  <SubmittedRow
                    label='username'
                    value={submittedData.username}
                  />
                  <Separator />
                  <SubmittedRow label='email' value={submittedData.email} />
                  <Separator />
                  <SubmittedRow label='age' value={String(submittedData.age)} />
                  <Separator />
                  <SubmittedRow label='role' value={submittedData.role} />
                  <Separator />
                  {submittedData.bio && (
                    <>
                      <SubmittedRow label='bio' value={submittedData.bio} />
                      <Separator />
                    </>
                  )}
                  <div className='flex items-center justify-between'>
                    <span className='font-mono text-sm text-muted-foreground'>
                      isActive
                    </span>
                    <Badge
                      variant={submittedData.isActive ? 'default' : 'secondary'}
                    >
                      {submittedData.isActive ? 'true' : 'false'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  Submit the form to see results here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Schema reference ── */}
      <SchemaReference />
    </div>
  );
}

// ---------- helpers ----------

function SubmittedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between'>
      <span className='font-mono text-sm text-muted-foreground'>{label}</span>
      <span className='max-w-[60%] truncate text-sm font-medium'>{value}</span>
    </div>
  );
}

function SchemaReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Schema reference</CardTitle>
        <CardDescription>
          The form above is generated entirely from this Zod schema — no JSX per
          field needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className='overflow-x-auto rounded-md bg-muted p-4 text-xs'>
          {`import { z } from 'zod'
import { fieldConfig } from '@/lib/autoform'

export function createProfileSchema(t: (key: string) => string) {
  return z.object({
    // z.string() → <Input>
    username: z
      .string({ required_error: t('fieldUsernameRequired') })
      .min(1, { message: t('fieldUsernameRequired') })
      .superRefine(fieldConfig({
        label: t('fieldUsername'),
        inputProps: { placeholder: t('fieldUsernamePlaceholder') },
      })),

    // z.string().email() → <Input type="email">
    email: z
      .string({ required_error: t('fieldEmailRequired') })
      .email({ message: t('fieldEmailInvalid') })
      .superRefine(fieldConfig({
        label: t('fieldEmail'),
        inputProps: { placeholder: t('fieldEmailPlaceholder') },
      })),

    // z.number() → <Input type="number">
    age: z
      .number({ required_error: t('fieldAgeRequired') })
      .min(1, { message: t('fieldAgeMin') })
      .superRefine(fieldConfig({
        label: t('fieldAge'),
        inputProps: { placeholder: t('fieldAgePlaceholder') },
      })),

    // z.enum() → <Select>
    role: z
      .enum(['admin', 'editor', 'viewer'])
      .superRefine(fieldConfig({ label: t('fieldRole') })),

    // optional z.string() → <Textarea> via fieldType override
    bio: z
      .string()
      .optional()
      .superRefine(fieldConfig({
        label: t('fieldBio'),
        fieldType: 'string',
        inputProps: { placeholder: t('fieldBioPlaceholder') },
      })),

    // z.boolean() → <Checkbox>
    isActive: z
      .boolean()
      .default(false)
      .superRefine(fieldConfig({ label: t('fieldIsActive') })),
  })
}`}
        </pre>
      </CardContent>
    </Card>
  );
}
