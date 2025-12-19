import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightSidebarProvider, RightSidebar } from './RightSidebarContext';

export function Layout() {
  return (
    <RightSidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
    </RightSidebarProvider>
  );
}
