import { Header } from "./header";
import { LanguageSwitcher } from "./language-switcher";
import { LayoutControls } from "./layout-controls";
import { ProfileDropdown } from "./profile-dropdown";
import { Search } from "./search";
import { ThemeSwitch } from "./theme-switch";

export function AppHeader() {
  return (
    <Header>
      <Search />
      <div className='ml-auto flex items-center gap-2'>
        <LayoutControls />
        <LanguageSwitcher />
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </Header>
  );
}
