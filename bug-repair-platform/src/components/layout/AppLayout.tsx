import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
