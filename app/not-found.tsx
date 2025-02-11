import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          {/* 404 Image/Icon */}
          <div className="relative">
            <div className="text-9xl font-bold text-purple-200">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-24 w-24 text-purple-500" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
            <p className="text-gray-600">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="javascript:history.back()">
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </Link>
            
            <Link href="/">
              <Button
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            Need assistance?{' '}
            <Link 
              href="/contact"
              className="text-primary hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 