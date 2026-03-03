'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSidebarData } from '@/configs/sidebar';
import { usePreferencesStore } from '@/stores/preferences-store';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';
import { MainLogo } from './main-logo';

export function AppSidebar() {
  const sidebarVariant = usePreferencesStore((s) => s.sidebarVariant);
  const sidebarCollapsible = usePreferencesStore((s) => s.sidebarCollapsible);
  const data = useSidebarData();

  return (
    <Sidebar collapsible={sidebarCollapsible} variant={sidebarVariant}>
      <SidebarHeader>
        <MainLogo info={data.info} />
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
