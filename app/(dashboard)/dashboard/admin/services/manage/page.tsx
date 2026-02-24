'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
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
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Service {
  _id: string;
  documentId: string;
  categoryName: string;
  order: number;
  status: 'published' | 'draft' | 'archived';
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited';
  mainContent: {
    contentTitle: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-100 text-green-800 border-green-200',
  draft:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  archived:  'bg-gray-100 text-gray-600 border-gray-200',
};

const STOCK_COLORS: Record<string, string> = {
  in_stock:     'bg-green-100 text-green-800 border-green-200',
  out_of_stock: 'bg-red-100 text-red-700 border-red-200',
  limited:      'bg-orange-100 text-orange-800 border-orange-200',
};

const STOCK_LABELS: Record<string, string> = {
  in_stock:     'In Stock',
  out_of_stock: 'Out of Stock',
  limited:      'Limited',
};

export default function ServiceManagementPage() {
  const [services, setServices]     = useState<Service[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Filters
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [status, setStatus]         = useState('all');
  const [page, setPage]             = useState(1);
  const [limit, setLimit]           = useState(20);

  // Delete confirm
  const [deleteService, setDeleteSvc] = useState<Service | null>(null);
  const [deleteLoading, setDelLoad]   = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchServices = useCallback(async (opts?: { resetPage?: boolean }) => {
    setLoading(true);
    setError('');
    const currentPage = opts?.resetPage ? 1 : page;
    if (opts?.resetPage) setPage(1);

    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
      if (search.trim()) params.set('search', search.trim());
      if (category !== 'all') params.set('category', category);
      if (status !== 'all')   params.set('status', status);

      const res  = await fetch(`/api/admin/services?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch services');
      setServices(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, status]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchServices({ resetPage: true }), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => { fetchServices(); }, [category, status, page, limit]);

  // --- Toggle publish/unpublish ---
  const toggleStatus = async (service: Service) => {
    const newStatus = service.status === 'published' ? 'draft' : 'published';
    try {
      const res  = await fetch(`/api/admin/services/${service._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      showToast(newStatus === 'published' ? 'Service published' : 'Service unpublished');
      setServices(prev => prev.map(s => s._id === service._id ? { ...s, status: newStatus } : s));
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // --- Duplicate ---
  const duplicate = async (service: Service) => {
    try {
      const payload = {
        documentId:   `${service.documentId}-copy`,
        categoryName: service.categoryName,
        order:        service.order + 1,
        status:       'draft',
        stockStatus:  service.stockStatus,
        mainContent:  (service as any).mainContent,
      };
      const res  = await fetch('/api/admin/services', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Duplicate failed');
      showToast('Service duplicated as draft');
      fetchServices();
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // --- Delete ---
  const confirmDelete = async () => {
    if (!deleteService) return;
    setDelLoad(true);
    try {
      const res  = await fetch(`/api/admin/services/${deleteService._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      showToast('Service deleted');
      setDeleteSvc(null);
      fetchServices();
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
            <Package className="h-6 w-6 text-blue-600" />
            Services
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination ? `${pagination.total} total services` : 'Manage all services'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchServices()} disabled={loading} className="gap-2">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/admin/services/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
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
              placeholder="Search by title or document ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={v => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="diagnostic">Diagnostic</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
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
          <div className="p-16 text-center">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">Failed to load services</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchServices()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="space-y-1.5">
                          <div className="h-4 w-44 bg-gray-200 rounded" />
                          <div className="h-3 w-28 bg-gray-100 rounded" />
                        </div>
                      </td>
                      <td className="px-4 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3 text-center"><div className="h-4 w-6 bg-gray-200 rounded mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-7 w-7 bg-gray-200 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No services found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {search || category !== 'all' || status !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Add your first service to get started'}
                      </p>
                      {!search && category === 'all' && status === 'all' && (
                        <Button asChild size="sm" className="mt-4">
                          <Link href="/dashboard/admin/services/new">
                            <Plus className="h-4 w-4 mr-2" /> Add First Service
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : services.map(service => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {service.mainContent?.contentTitle || '(untitled)'}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{service.documentId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200 capitalize">
                        {service.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                        STATUS_COLORS[service.status] ?? STATUS_COLORS.draft
                      )}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        STOCK_COLORS[service.stockStatus] ?? STOCK_COLORS.in_stock
                      )}>
                        {STOCK_LABELS[service.stockStatus] ?? service.stockStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 font-medium">{service.order}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(service.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                            <Link href={`/services/${service.documentId}`} target="_blank">
                              <Eye className="h-3.5 w-3.5" /> Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                            <Link href={`/dashboard/admin/services/${service._id}/edit`}>
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicate(service)} className="gap-2 cursor-pointer">
                            <Copy className="h-3.5 w-3.5" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(service)} className="gap-2 cursor-pointer">
                            {service.status === 'published'
                              ? <><XCircle className="h-3.5 w-3.5" /> Unpublish</>
                              : <><CheckCircle className="h-3.5 w-3.5" /> Publish</>
                            }
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteSvc(service)}
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
                    className={cn('h-8 w-8 p-0', p === page && 'bg-blue-600 hover:bg-blue-700')}>
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

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteService} onOpenChange={open => !open && !deleteLoading && setDeleteSvc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteService?.mainContent?.contentTitle || deleteService?.documentId}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSvc(null)} disabled={deleteLoading}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700 text-white">
              {deleteLoading ? 'Deleting…' : 'Delete Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
