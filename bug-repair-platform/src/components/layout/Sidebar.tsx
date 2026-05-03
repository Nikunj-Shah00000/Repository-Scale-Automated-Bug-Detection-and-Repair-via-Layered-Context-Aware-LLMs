import { Link, useLocation } from "wouter";
import {
  Activity,
  Bug,
  FolderGit2,
  GitPullRequest,
  Globe2,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Repositories", href: "/repositories", icon: FolderGit2 },
  { name: "Bugs", href: "/bugs", icon: Bug },
  { name: "Patches", href: "/patches", icon: GitPullRequest },
  { name: "Agent Sessions", href: "/agents", icon: Activity },
  { name: "Translations", href: "/translations", icon: Globe2 },
  { name: "Vulnerabilities", href: "/vulnerabilities", icon: ShieldAlert },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar px-3 py-4">
      <div className="flex items-center gap-2 px-2 pb-6">
        <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 text-primary">
          <Bug className="h-5 w-5" />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider text-primary">
          BRP_CORE
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          SYSTEM_ONLINE
        </div>
      </div>
    </div>
  );
}
