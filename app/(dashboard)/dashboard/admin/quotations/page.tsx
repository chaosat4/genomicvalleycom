'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Quotation {
  _id: string;
  quotationNumber: string;
  userInfo: {
    name: string;
    email: string;
    institution: string;
    phone: string;
  };
  serviceInfo: {
    title: string;
    category: string;
  };
  pricing: {
    totalPrice: number;
    priceBeforeGST: number;
    gstPercentage: number;
  };
  status: 'generated' | 'sent' | 'expired';
  createdAt: string;
  expiresAt: string;
  pdfUrl?: string;
  pdfFilename?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type StatusFilter = 'all' | 'generated' | 'sent' | 'expired';

const STATUS_COLORS: Record<string, string> = {
  generated: 'bg-blue-100 text-blue-800 border-blue-200',
  sent:      'bg-green-100 text-green-800 border-green-200',
  expired:   'bg-gray-100 text-gray-600 border-gray-200',
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState<StatusFilter>('all');
  const [page, setPage]             = useState(1);
  const [limit, setLimit]           = useState(20);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchQuotations = useCallback(async (opts?: { resetPage?: boolean }) => {
    setLoading(true);
    setError('');
    const currentPage = opts?.resetPage ? 1 : page;
    if (opts?.resetPage) setPage(1);

    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
      if (search.trim()) params.set('search', search.trim());
      if (status !== 'all') params.set('status', status);

      const res  = await fetch(`/api/admin/quotations?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch');
      setQuotations(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load quotations');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchQuotations({ resetPage: true }), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => { fetchQuotations(); }, [status, page, limit]);

  const isExpired = (q: Quotation) => new Date(q.expiresAt) < new Date();

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
            <FileText className="h-6 w-6 text-orange-500" />
            Quotations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination ? `${pagination.total} total quotations` : 'View all generated quotations'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchQuotations()} disabled={loading} className="gap-2">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by quotation #, customer, or service…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={v => { setStatus(v as StatusFilter); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => fetchQuotations()}>Retry</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3">
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 bg-gray-200 rounded" />
                          <div className="h-3 w-36 bg-gray-100 rounded" />
                        </div>
                      </td>
                      <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-4 w-20 bg-gray-200 rounded ml-auto" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-7 w-7 bg-gray-200 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : quotations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-gray-400 text-sm">
                      No quotations found.
                    </td>
                  </tr>
                ) : quotations.map(q => {
                  const expired = isExpired(q);
                  return (
                    <tr key={q._id} className={cn('hover:bg-gray-50 transition-colors', expired && q.status !== 'expired' && 'opacity-70')}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold text-gray-800">{q.quotationNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{q.userInfo.name}</p>
                        <p className="text-xs text-gray-500">{q.userInfo.email}</p>
                        {q.userInfo.institution && (
                          <p className="text-xs text-gray-400">{q.userInfo.institution}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800 truncate max-w-[160px]">{q.serviceInfo.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{q.serviceInfo.category}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold text-gray-900">{q.pricing.totalPrice.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-400">incl. {q.pricing.gstPercentage}% GST</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          STATUS_COLORS[q.status] ?? STATUS_COLORS.generated
                        )}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className={cn(expired ? 'text-red-500' : 'text-gray-500')}>
                          {new Date(q.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {q.pdfUrl ? (
                          <a
                            href={q.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            PDF
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
                    className={cn('h-8 w-8 p-0', p === page && 'bg-orange-500 hover:bg-orange-600')}>
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
    </div>
  );
}
