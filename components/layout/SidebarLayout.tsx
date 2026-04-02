"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  GitBranch,
  ArrowUpDown,
  ArrowUpAZ,
  ListOrdered,
  SquareStack,
  ArrowRightLeft,
  Menu,
  ChevronLeft,
  ChevronRight,
  Home,
  Hash,
  Zap,
  Route,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/playground/avl", label: "AVL Tree", icon: GitBranch },
  { href: "/playground/bubble-sort", label: "Bubble Sort", icon: ArrowUpDown },
  {
    href: "/playground/insertion-sort",
    label: "Insertion Sort",
    icon: ArrowUpAZ,
  },
  { href: "/playground/quick-sort", label: "Quick Sort", icon: Zap },
  { href: "/playground/array-list", label: "ArrayList", icon: ListOrdered },
  {
    href: "/playground/linked-list",
    label: "LinkedList",
    icon: ArrowRightLeft,
  },
  { href: "/playground/queue", label: "Queue", icon: ArrowRightLeft },
  { href: "/playground/stack", label: "Stack", icon: SquareStack },
  { href: "/playground/hash-table", label: "Hash Table", icon: Hash },
  { href: "/playground/graph", label: "Graph", icon: GitBranch },
  { href: "/playground/dijkstra", label: "Dijkstra", icon: Route },
]

type SidebarLayoutProps = {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-svh">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 md:relative md:z-0",
          collapsed ? "w-16" : "w-56",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-3">
          {!collapsed && (
            <span className="text-sm font-semibold">VisualAlgo</span>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed)
              setMobileOpen(false)
            }}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={collapsed ? label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b bg-card px-4 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-semibold">VisualAlgo</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
