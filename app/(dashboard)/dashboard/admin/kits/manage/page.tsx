'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TestTube,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Kit {
  _id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'library-prep':  'bg-blue-100 text-blue-800 border-blue-200',
  'rna-seq':       'bg-green-100 text-green-800 border-green-200',
  'dna-seq':       'bg-purple-100 text-purple-800 border-purple-200',
  'other':         'bg-gray-100 text-gray-700 border-gray-200',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS['other'];
}

const EMPTY_EDIT = { name: '', code: '', description: '', price: '', category: '' };

export default function KitsManagePage() {
  const [kits, setKits]             = useState<Kit[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Filters
  const [search, setSearch]         = useState('');
  const [activeFilter, setActive]   = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage]             = useState(1);
  const [limit, setLimit]           = useState(20);

  // Edit dialog
  const [editKit, setEditKit]       = useState<Kit | null>(null);
  const [editForm, setEditForm]     = useState(EMPTY_EDIT);
  const [editLoading, setEditLoad]  = useState(false);

  // Delete confirm
  const [deleteKit, setDeleteKit]   = useState<Kit | null>(null);
  const [deleteLoading, setDelLoad] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchKits = useCallback(async (opts?: { resetPage?: boolean }) => {
    setLoading(true);
    setError('');
    const currentPage = opts?.resetPage ? 1 : page;
    if (opts?.resetPage) setPage(1);

    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
      if (search.trim()) params.set('search', search.trim());
      if (activeFilter === 'active')   params.set('isActive', 'true');
      if (activeFilter === 'inactive') params.set('isActive', 'false');

      const res  = await fetch(`/api/admin/kits?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch');
      setKits(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load kits');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, activeFilter]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchKits({ resetPage: true }), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => { fetchKits(); }, [activeFilter, page, limit]);

  // --- Edit ---
  const openEdit = (kit: Kit) => {
    setEditKit(kit);
    setEditForm({
      name: kit.name,
      code: kit.code,
      description: kit.description ?? '',
      price: String(kit.price),
      category: kit.category,
    });
  };

  const saveEdit = async () => {
    if (!editKit) return;
    setEditLoad(true);
    try {
      const res  = await fetch(`/api/admin/kits/${editKit._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:        editForm.name,
          code:        editForm.code,
          description: editForm.description,
          price:       parseFloat(editForm.price) || 0,
          category:    editForm.category,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      showToast('Kit updated');
      setEditKit(null);
      fetchKits();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setEditLoad(false);
    }
  };

  // --- Toggle active ---
  const toggleActive = async (kit: Kit) => {
    try {
      const res  = await fetch(`/api/admin/kits/${kit._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isActive: !kit.isActive }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      showToast(kit.isActive ? 'Kit deactivated' : 'Kit activated');
      setKits(prev => prev.map(k => k._id === kit._id ? { ...k, isActive: !k.isActive } : k));
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // --- Delete ---
  const confirmDelete = async () => {
    if (!deleteKit) return;
    setDelLoad(true);
    try {
      const res  = await fetch(`/api/admin/kits/${deleteKit._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      showToast('Kit deleted');
      setDeleteKit(null);
      fetchKits();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setDelLoad(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TestTube className="h-6 w-6 text-green-600" />
            Kits
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination ? `${pagination.total} total kits` : 'Manage all library preparation kits'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchKits()} disabled={loading} className="gap-2">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/admin/kits/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Kit
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={activeFilter} onValueChange={v => { setActive(v as typeof activeFilter); setPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => fetchKits()}>Retry</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-36 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-24 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-4 w-16 bg-gray-200 rounded ml-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-7 w-7 bg-gray-200 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : kits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400 text-sm">
                      No kits found.{' '}
                      <Link href="/dashboard/admin/kits/new" className="text-green-600 hover:underline">
                        Add the first kit
                      </Link>
                    </td>
                  </tr>
                ) : kits.map(kit => (
                  <tr key={kit._id} className={cn('hover:bg-gray-50 transition-colors', !kit.isActive && 'opacity-60')}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{kit.name}</p>
                      {kit.description && (
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{kit.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{kit.code}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        categoryColor(kit.category)
                      )}>
                        {kit.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {kit.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {kit.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(kit.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => openEdit(kit)} className="gap-2 cursor-pointer">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(kit)} className="gap-2 cursor-pointer">
                            {kit.isActive
                              ? <><ToggleLeft className="h-3.5 w-3.5" /> Deactivate</>
                              : <><ToggleRight className="h-3.5 w-3.5" /> Activate</>
                            }
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteKit(kit)}
                            className="gap-2 cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
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
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="h-8 px-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const total = pagination.totalPages;
                let p = total <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= total - 2 ? total - 4 + i : page - 2 + i;
                return (
                  <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} disabled={loading}
                    className={cn('h-8 w-8 p-0', p === page && 'bg-green-600 hover:bg-green-700')}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages || loading} className="h-8 px-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editKit} onOpenChange={open => !open && !editLoading && setEditKit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Kit</DialogTitle>
            <DialogDescription>Update kit details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name *</Label>
              <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Code *</Label>
              <Input value={editForm.code} onChange={e => setEditForm(f => ({ ...f, code: e.target.value }))} className="font-mono" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" min="0" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={editForm.category} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="library-prep">Library Prep</SelectItem>
                  <SelectItem value="rna-seq">RNA-Seq</SelectItem>
                  <SelectItem value="dna-seq">DNA-Seq</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditKit(null)} disabled={editLoading}>Cancel</Button>
            <Button onClick={saveEdit} disabled={editLoading || !editForm.name || !editForm.code}>
              {editLoading ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteKit} onOpenChange={open => !open && !deleteLoading && setDeleteKit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Kit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteKit?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteKit(null)} disabled={deleteLoading}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700 text-white">
              {deleteLoading ? 'Deleting…' : 'Delete Kit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
