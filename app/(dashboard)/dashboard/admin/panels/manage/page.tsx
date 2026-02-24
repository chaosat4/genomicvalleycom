'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Dna,
  RefreshCw,
  DatabaseZap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Panel {
  _id: string;
  documentId: string;
  name: string;
  geneCount: number;
  genes?: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  human: 'Human DNA Panels',
  pro: 'DNA Pro Panels',
  ultra: 'DNA Ultra Panels',
};

const EMPTY_EDIT = {
  name: '',
  documentId: '',
  geneCount: '0',
  genes: '',
  category: 'human',
  order: '0',
};

export default function PanelsManagePage() {
  const [panels, setPanels]         = useState<Panel[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Filters
  const [search, setSearch]         = useState('');
  const [activeFilter, setActive]   = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage]             = useState(1);
  const [limit, setLimit]           = useState(20);

  // Edit dialog
  const [editPanel, setEditPanel]   = useState<Panel | null>(null);
  const [editForm, setEditForm]     = useState(EMPTY_EDIT);
  const [editLoading, setEditLoad]  = useState(false);

  // Delete confirm
  const [deletePanel, setDeleteP]   = useState<Panel | null>(null);
  const [deleteLoading, setDelLoad] = useState(false);

  // Seed
  const [seedLoading, setSeedLoad]  = useState(false);
  const [seedDialog, setSeedDialog] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPanels = useCallback(async (opts?: { resetPage?: boolean }) => {
    setLoading(true);
    setError('');
    const currentPage = opts?.resetPage ? 1 : page;
    if (opts?.resetPage) setPage(1);

    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
      if (search.trim()) params.set('search', search.trim());
      if (activeFilter === 'active')   params.set('isActive', 'true');
      if (activeFilter === 'inactive') params.set('isActive', 'false');

      const res  = await fetch(`/api/admin/panels?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch');
      setPanels(data.data);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load panels');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, activeFilter]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchPanels({ resetPage: true }), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => { fetchPanels(); }, [activeFilter, page, limit]);

  // --- Edit ---
  const openEdit = (panel: Panel) => {
    setEditPanel(panel);
    setEditForm({
      name: panel.name,
      documentId: panel.documentId,
      geneCount: String(panel.geneCount ?? 0),
      genes: panel.genes ?? '',
      category: panel.category,
      order: String(panel.order ?? 0),
    });
  };

  const saveEdit = async () => {
    if (!editPanel) return;
    setEditLoad(true);
    try {
      const payload = {
        name: editForm.name,
        documentId: editForm.documentId,
        geneCount: parseInt(editForm.geneCount, 10) || 0,
        genes: editForm.genes || undefined,
        category: editForm.category,
        order: parseInt(editForm.order, 10) || 0,
      };
      const res  = await fetch(`/api/admin/panels/${editPanel._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      showToast('Panel updated');
      setEditPanel(null);
      fetchPanels();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Update failed', 'error');
    } finally {
      setEditLoad(false);
    }
  };

  // --- Toggle active ---
  const toggleActive = async (panel: Panel) => {
    try {
      const res  = await fetch(`/api/admin/panels/${panel._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isActive: !panel.isActive }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      showToast(panel.isActive ? 'Panel deactivated' : 'Panel activated');
      setPanels(prev => prev.map(p => p._id === panel._id ? { ...p, isActive: !p.isActive } : p));
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Update failed', 'error');
    }
  };

  // --- Delete ---
  const confirmDelete = async () => {
    if (!deletePanel) return;
    setDelLoad(true);
    try {
      const res  = await fetch(`/api/admin/panels/${deletePanel._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      showToast('Panel deleted');
      setDeleteP(null);
      fetchPanels();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Delete failed', 'error');
    } finally {
      setDelLoad(false);
    }
  };

  // --- Seed ---
  const runSeed = async () => {
    setSeedLoad(true);
    try {
      const res  = await fetch('/api/admin/panels/seed', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Seed failed');
      showToast(`Seed complete: ${data.inserted} inserted, ${data.updated} updated`);
      setSeedDialog(false);
      fetchPanels({ resetPage: true });
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Seed failed', 'error');
    } finally {
      setSeedLoad(false);
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
            <Dna className="h-6 w-6 text-purple-600" />
            Gene Panels
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination ? `${pagination.total} total panels` : 'Manage all gene panels'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchPanels()} disabled={loading} className="gap-2">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSeedDialog(true)} className="gap-2">
            <DatabaseZap className="h-4 w-4" />
            Seed Default Data
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/admin/panels/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Panel
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
              placeholder="Search by name or document ID…"
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => fetchPanels()}>Retry</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Genes</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-44 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-4 w-8 bg-gray-200 rounded ml-auto" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-4 w-6 bg-gray-200 rounded ml-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-7 w-7 bg-gray-200 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : panels.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400 text-sm">
                      No panels found.{' '}
                      <button onClick={() => setSeedDialog(true)} className="text-purple-600 hover:underline">
                        Seed default data
                      </button>
                      {' '}or{' '}
                      <Link href="/dashboard/admin/panels/new" className="text-purple-600 hover:underline">
                        add a panel manually
                      </Link>.
                    </td>
                  </tr>
                ) : panels.map(panel => (
                  <tr key={panel._id} className={cn('hover:bg-gray-50 transition-colors', !panel.isActive && 'opacity-60')}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{panel.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{panel.documentId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-purple-100 text-purple-800 border-purple-200">
                        {CATEGORY_LABELS[panel.category] ?? panel.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-gray-700">
                      {panel.geneCount ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {panel.order ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {panel.isActive ? (
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
                      {new Date(panel.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => openEdit(panel)} className="gap-2 cursor-pointer">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(panel)} className="gap-2 cursor-pointer">
                            {panel.isActive
                              ? <><ToggleLeft className="h-3.5 w-3.5" /> Deactivate</>
                              : <><ToggleRight className="h-3.5 w-3.5" /> Activate</>
                            }
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteP(panel)}
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
                const p = total <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= total - 2 ? total - 4 + i : page - 2 + i;
                return (
                  <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} disabled={loading}
                    className={cn('h-8 w-8 p-0', p === page && 'bg-purple-600 hover:bg-purple-700')}>
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
      <Dialog open={!!editPanel} onOpenChange={open => !open && !editLoading && setEditPanel(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Panel</DialogTitle>
            <DialogDescription>Update panel details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name *</Label>
              <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Document ID *</Label>
              <Input value={editForm.documentId} onChange={e => setEditForm(f => ({ ...f, documentId: e.target.value }))} className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category *</Label>
                <Select value={editForm.category} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of Genes *</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.geneCount}
                  onChange={e => setEditForm(f => ({ ...f, geneCount: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                min="0"
                value={editForm.order}
                onChange={e => setEditForm(f => ({ ...f, order: e.target.value }))}
              />
            </div>
            <div>
              <Label>Gene List (optional)</Label>
              <Input
                value={editForm.genes}
                onChange={e => setEditForm(f => ({ ...f, genes: e.target.value }))}
                placeholder="Comma-separated gene names"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPanel(null)} disabled={editLoading}>Cancel</Button>
            <Button onClick={saveEdit} disabled={editLoading || !editForm.name || !editForm.documentId}>
              {editLoading ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deletePanel} onOpenChange={open => !open && !deleteLoading && setDeleteP(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Panel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletePanel?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteP(null)} disabled={deleteLoading}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700 text-white">
              {deleteLoading ? 'Deleting…' : 'Delete Panel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seed Confirm Dialog */}
      <Dialog open={seedDialog} onOpenChange={open => !open && !seedLoading && setSeedDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seed Default Panel Data</DialogTitle>
            <DialogDescription>
              This will upsert all 32 default panels (Human, Pro, and Ultra categories) into the database.
              Existing panels with matching Document IDs will be updated. New panels will be created.
              This action is safe to run multiple times.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSeedDialog(false)} disabled={seedLoading}>Cancel</Button>
            <Button onClick={runSeed} disabled={seedLoading} className="gap-2">
              <DatabaseZap className="h-4 w-4" />
              {seedLoading ? 'Seeding…' : 'Seed Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
