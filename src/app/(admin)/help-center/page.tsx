import { Main } from '@/components/layout/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutoFormExample } from '@/containers/examples/auto-form/auto-form-example';
import { TableExample } from '@/containers/examples/table/table-example';

export default function HelpCenterPage() {
  return (
    <Main>
      <Tabs defaultValue='table'>
        <TabsList className='mb-6'>
          <TabsTrigger value='table'>DataTable Example</TabsTrigger>
          <TabsTrigger value='form'>AutoForm Example</TabsTrigger>
        </TabsList>
        <TabsContent value='table'>
          <TableExample />
        </TabsContent>
        <TabsContent value='form'>
          <AutoFormExample />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
