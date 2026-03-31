import { getTranslations } from 'next-intl/server';
import { Main } from '@/components/layout';
import { UsersTable } from '@/features/users/';

export default async function UsersPage() {
  const t = await getTranslations('users');

  return (
    <Main>
      <div className='mb-4 flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
          <p className='text-sm text-muted-foreground'>{t('description')}</p>
        </div>
      </div>
      <UsersTable />
    </Main>
  );
}
