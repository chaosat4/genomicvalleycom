'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  UserX,
  UserCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  banned?: boolean;
  emailVerified?: boolean;
  image?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type SortField = 'createdAt' | 'name' | 'email' | 'role';
type SortOrder = 'asc' | 'desc';
type RoleFilter = 'all' | 'admin' | 'patient' | 'doctor';
type BannedFilter = 'all' | 'active' | 'banned';

const ROLE_COLORS: Record<string, string> = {
  admin:   'bg-purple-100 text-purple-800 border-purple-200',
  doctor:  'bg-blue-100 text-blue-800 border-blue-200',
  patient: 'bg-gray-100 text-gray-700 border-gray-200',
};

function Avatar({ user }: { user: User }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.name}
        className="h-9 w-9 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase();
  return (
    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-purple-700">{initials}</span>
    </div>
  );
}

function SortButton({
  field,
  currentSort,
  currentOrder,
  onSort,
  children,
}: {
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  onSort: (f: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = currentSort === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors"
    >
      {children}
      {isActive ? (
        currentOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

export default function UsersPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?._id ?? (session?.user as any)?.id;

  const [users, setUsers]           = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Filters
  const [search, setSearch]   = useState('');
  const [role, setRole]       = useState<RoleFilter>('all');
  const [banned, setBanned]   = useState<BannedFilter>('all');
  const [page, setPage]       = useState(1);
  const [limit, setLimit]     = useState(20);
  const [sort, setSort]       = useState<SortField>('createdAt');
  const [order, setOrder]     = useState<SortOrder>('desc');

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({ open: false, title: '', description: '', action: async () => {} });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async (opts?: { resetPage?: boolean }) => {
    setLoading(true);
    setError('');
    const currentPage = opts?.resetPage ? 1 : page;
    if (opts?.resetPage) setPage(1);

    try {
      const params = new URLSearchParams({
        page:  String(currentPage),
        limit: String(limit),
        sort,
        order,
      });
      if (search.trim()) params.set('search', search.trim());
      if (role !== 'all')   params.set('role', role);
      if (banned === 'active') params.set('banned', 'false');
      if (banned === 'banned') params.set('banned', 'true');

      const res  = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Failed to fetch');

      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, order, search, role, banned]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchUsers({ resetPage: true });
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  // Immediate refetch on filter/sort/page change
  useEffect(() => {
    fetchUsers();
  }, [role, banned, sort, order, page]);

  const handleSort = (field: SortField) => {
    if (sort === field) {
      setOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('desc');
    }
  };

  const patchUser = async (id: string, update: Partial<{ role: string; banned: boolean }>) => {
    const res  = await fetch(`/api/admin/users/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(update),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Update failed');
    return data.data as User;
  };

  const optimisticUpdate = (id: string, update: Partial<User>) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, ...update } : u));
  };

  const handleRoleChange = (user: User, newRole: string) => {
    if (newRole === user.role) return;
    setConfirmDialog({
      open: true,
      title: 'Change Role',
      description: `Change ${user.name || user.email}'s role from "${user.role}" to "${newRole}"?`,
      action: async () => {
        optimisticUpdate(user._id, { role: newRole as User['role'] });
        try {
          await patchUser(user._id, { role: newRole });
          showToast(`Role updated to ${newRole}`);
        } catch (e: any) {
          optimisticUpdate(user._id, { role: user.role }); // rollback
          showToast(e.message, 'error');
        }
      },
    });
  };

  const handleBanToggle = (user: User) => {
    const isBanning = !user.banned;
    setConfirmDialog({
      open: true,
      title: isBanning ? 'Ban User' : 'Unban User',
      description: isBanning
        ? `Are you sure you want to ban ${user.name || user.email}? They will no longer be able to sign in.`
        : `Unban ${user.name || user.email}? They will be able to sign in again.`,
      action: async () => {
        optimisticUpdate(user._id, { banned: isBanning });
        try {
          await patchUser(user._id, { banned: isBanning });
          showToast(isBanning ? 'User banned' : 'User unbanned');
        } catch (e: any) {
          optimisticUpdate(user._id, { banned: user.banned }); // rollback
          showToast(e.message, 'error');
        }
      },
    });
  };

  const runConfirmAction = async () => {
    setActionLoading(true);
    try {
      await confirmDialog.action();
    } finally {
      setActionLoading(false);
      setConfirmDialog(d => ({ ...d, open: false }));
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Users
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination ? `${pagination.total} total users` : 'Manage all registered users'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchUsers()}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Role filter */}
          <Select value={role} onValueChange={v => { setRole(v as RoleFilter); setPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={banned} onValueChange={v => { setBanned(v as BannedFilter); setPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit */}
          <Select value={String(limit)} onValueChange={v => { setLimit(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => fetchUsers()}>Retry</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <SortButton field="name" currentSort={sort} currentOrder={order} onSort={handleSort}>
                      User
                    </SortButton>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="role" currentSort={sort} currentOrder={order} onSort={handleSort}>
                      Role
                    </SortButton>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="createdAt" currentSort={sort} currentOrder={order} onSort={handleSort}>
                      Joined
                    </SortButton>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gray-200" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-28 bg-gray-200 rounded" />
                            <div className="h-3 w-40 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-3.5 w-24 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-7 w-7 bg-gray-200 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-gray-400 text-sm">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  users.map(user => {
                    const isSelf = user._id === currentUserId;
                    return (
                      <tr
                        key={user._id}
                        className={cn(
                          'hover:bg-gray-50 transition-colors',
                          user.banned && 'opacity-60'
                        )}
                      >
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar user={user} />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {user.name || '—'}
                                {isSelf && (
                                  <span className="ml-1.5 text-xs text-purple-500 font-normal">(you)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            ROLE_COLORS[user.role] ?? ROLE_COLORS.patient
                          )}>
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {user.banned ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              <UserX className="h-3 w-3" /> Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              <UserCheck className="h-3 w-3" /> Active
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-700"
                                disabled={isSelf}
                                title={isSelf ? 'Cannot modify your own account' : 'Actions'}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuLabel className="text-xs text-gray-500">
                                Change role
                              </DropdownMenuLabel>
                              {(['admin', 'doctor', 'patient'] as const).map(r => (
                                <DropdownMenuItem
                                  key={r}
                                  onClick={() => handleRoleChange(user, r)}
                                  className={cn(
                                    'gap-2 cursor-pointer',
                                    user.role === r && 'font-semibold text-purple-700 bg-purple-50'
                                  )}
                                >
                                  {r === 'admin' && <ShieldCheck className="h-3.5 w-3.5" />}
                                  {r !== 'admin' && <span className="w-3.5" />}
                                  <span className="capitalize">{r}</span>
                                  {user.role === r && <span className="ml-auto text-purple-500 text-xs">current</span>}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleBanToggle(user)}
                                className={cn(
                                  'gap-2 cursor-pointer',
                                  user.banned
                                    ? 'text-green-600 hover:text-green-700'
                                    : 'text-red-600 hover:text-red-700'
                                )}
                              >
                                {user.banned ? (
                                  <><UserCheck className="h-3.5 w-3.5" /> Unban user</>
                                ) : (
                                  <><ShieldOff className="h-3.5 w-3.5" /> Ban user</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let p: number;
                const total = pagination.totalPages;
                if (total <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= total - 2) {
                  p = total - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    disabled={loading}
                    className={cn('h-8 w-8 p-0', p === page && 'bg-purple-600 hover:bg-purple-700')}
                  >
                    {p}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages || loading}
                className="h-8 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={open => !actionLoading && setConfirmDialog(d => ({ ...d, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(d => ({ ...d, open: false }))}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={runConfirmAction}
              disabled={actionLoading}
              className={cn(
                confirmDialog.title.toLowerCase().includes('ban') && !confirmDialog.title.toLowerCase().includes('unban')
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              )}
            >
              {actionLoading ? 'Processing…' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
