"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import {
  ChartBar,
  House,
  Stamp,
  TestTube,
  Trash2,
  ListTodo,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: <House /> },
    { href: "/validate-videos", label: "Validate Videos", icon: <Stamp /> },
    {
      href: "/experiment-videos",
      label: "Experiment Videos",
      icon: <TestTube />,
    },
    {
      href: "/rejected-videos",
      label: "Rejected Videos",
      icon: <Trash2 />,
    },
    {
      href: "/analysis",
      label: "Analysis",
      icon: <ChartBar />,
    },
    {
      href: "/tasks",
      label: "Tasks",
      icon: <ListTodo />,
    },
  ];

  return (
    <div className="drawer-side">
      <label htmlFor="drawer" className="drawer-overlay"></label>
      <aside
        className={`bg-base-200/95 backdrop-blur-sm border-r border-base-300 min-h-screen transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-base-content">
                AdJustMoment
              </h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="btn btn-ghost btn-sm hover:bg-base-300"
            >
              {isCollapsed ? "→" : "←"}
            </button>
          </div>
          <ul className="menu bg-base-200/50 w-full rounded-box">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "bg-base-300 text-base-content"
                      : "hover:bg-base-300/50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-base-300">
          <button
            onClick={logout}
            className="btn btn-ghost w-full justify-start hover:bg-base-300/50"
          >
            <span className="text-xl">🚪</span>
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>
    </div>
  );
}
