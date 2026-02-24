'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TestTube, Dna, FileText, DollarSign, Plus, ArrowRight } from 'lucide-react';

interface DashboardStats {
  totalServices: number;
  publishedServices: number;
  draftServices: number;
  totalKits: number;
  totalPanels: number;
  totalQuotations: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [servicesRes, kitsRes, panelsRes, quotationsRes] = await Promise.all([
          fetch('/api/admin/services?limit=1'),
          fetch('/api/admin/kits?limit=1'),
          fetch('/api/admin/panels?limit=1'),
          fetch('/api/admin/quotations?limit=1'),
        ]);

        const [servicesData, kitsData, panelsData, quotationsData] = await Promise.all([
          servicesRes.json(),
          kitsRes.json(),
          panelsRes.json(),
          quotationsRes.json(),
        ]);

        setStats({
          totalServices:    servicesData.pagination?.total  || 0,
          publishedServices: 0,
          draftServices:     0,
          totalKits:        kitsData.pagination?.total      || 0,
          totalPanels:      panelsData.pagination?.total    || 0,
          totalQuotations:  quotationsData.pagination?.total || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Services',
      value: stats?.totalServices || 0,
      icon: Package,
      href: '/dashboard/admin/services/manage',
      color: 'bg-blue-500',
    },
    {
      title: 'Kits',
      value: stats?.totalKits || 0,
      icon: TestTube,
      href: '/dashboard/admin/kits/manage',
      color: 'bg-green-500',
    },
    {
      title: 'Panels',
      value: stats?.totalPanels || 0,
      icon: Dna,
      href: '/dashboard/admin/panels/manage',
      color: 'bg-purple-500',
    },
    {
      title: 'Quotations',
      value: stats?.totalQuotations || 0,
      icon: FileText,
      href: '/dashboard/admin/quotations',
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Service',
      description: 'Create a new diagnostic or research service',
      href: '/dashboard/admin/services/new',
      icon: Plus,
    },
    {
      title: 'Add New Kit',
      description: 'Add a new kit to the library',
      href: '/dashboard/admin/kits/new',
      icon: TestTube,
    },
    {
      title: 'Update Pricing',
      description: 'Modify service pricing configuration',
      href: '/dashboard/admin/pricing',
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Manage your services, kits, panels, and pricing</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <action.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Recent service updates and quotation activity will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
