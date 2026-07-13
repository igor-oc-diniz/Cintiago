import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";

// Fixed shell for every internal screen: sidebar + global header, with the
// active screen rendered in the scrollable main area.
export function AppShell() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-gutter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
