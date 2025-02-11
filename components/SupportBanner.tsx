'use client';

import { useRouter } from 'next/navigation';
import { FOOTER_CONSTANTS } from '@/constants';

export function SupportBanner() {
  const router = useRouter();

  const handleButtonClick = (action: string) => {
    if (action.startsWith('http')) {
      window.open(action, '_blank');
    } else {
      router.push(action);
    }
  };

  return (
    <div className="bg-purple-600 py-4">
      <div className="container mx-auto px-4 flex md:px-16 flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-white text-lg text-center sm:text-left">
          Talk to our Customer support for assistance
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => handleButtonClick('/request-call')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Request a call now
          </button>
          <button 
            onClick={() => handleButtonClick('https://wa.me/918091366601')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Talk to us on Whatsapp
          </button>
        </div>
      </div>
    </div>
  );
}

