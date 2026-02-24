'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import {
  LayoutDashboard,
  Package,
  TestTube,
  Dna,
  DollarSign,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard/admin',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Services',
    href: '/dashboard/admin/services',
    icon: <Package className="h-5 w-5" />,
    children: [
      { label: 'Add New Service', href: '/dashboard/admin/services/new' },
      { label: 'Manage Services', href: '/dashboard/admin/services/manage' },
    ],
  },
  {
    label: 'Kits',
    href: '/dashboard/admin/kits',
    icon: <TestTube className="h-5 w-5" />,
    children: [
      { label: 'Add New Kit', href: '/dashboard/admin/kits/new' },
      { label: 'Manage Kits', href: '/dashboard/admin/kits/manage' },
    ],
  },
  {
    label: 'Panels',
    href: '/dashboard/admin/panels',
    icon: <Dna className="h-5 w-5" />,
    children: [
      { label: 'Add New Panel', href: '/dashboard/admin/panels/new' },
      { label: 'Manage Panels', href: '/dashboard/admin/panels/manage' },
    ],
  },
  {
    label: 'Pricing',
    href: '/dashboard/admin/pricing',
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    label: 'Quotations',
    href: '/dashboard/admin/quotations',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: 'Users',
    href: '/dashboard/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect if not authenticated or not admin — after session resolves
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    const role = (session.user as any)?.role;
    if (role !== 'admin') {
      router.replace('/');
    }
  }, [isPending, session, pathname]);

  const user = session?.user as any;
  const isAdmin = !isPending && !!session && user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar — always rendered */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">GV</span>
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-gray-900 truncate">Admin</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    !sidebarOpen && 'justify-center'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>

                {hasChildren && sidebarOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children!.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-sm transition-colors',
                            isChildActive
                              ? 'bg-purple-50 text-purple-700'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
          {isPending ? (
            /* Skeleton while session loads */
            <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
                </div>
              )}
            </div>
          ) : session ? (
            sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-purple-700 font-semibold text-sm">
                      {session.user.name?.charAt(0).toUpperCase() ||
                        session.user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-red-600 shrink-0"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-red-600"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )
          ) : null}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 lg:p-8 animate-in fade-in duration-200">
          {/* Access denied — shown inline, not as full-screen takeover */}
          {!isPending && session && !isAdmin ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
              <ShieldAlert className="h-12 w-12 text-red-400" />
              <p className="text-gray-700 font-medium text-lg">Access denied</p>
              <p className="text-gray-500 text-sm">Admin privileges required.</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
