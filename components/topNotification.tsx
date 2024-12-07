"use client"
import { useState } from "react"

export default function TopNotification() {
    const [showNotification, setShowNotification] = useState(true)
    
    return (
       <>
        <div className={`transform transition-all duration-500 ease-in-out ${
                    showNotification 
                    ? 'opacity-100 translate-y-0 max-h-[100px]' 
                    : 'opacity-0 -translate-y-full max-h-0 overflow-hidden'
                }`}>            
        <div className="relative bg-purple-600 px-4 py-2 text-white">
              <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Genomicvalley is attending the Festivals of Genomics 2024, London. Meet us there!</span>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-white hover:text-gray-200"
                  aria-label="Close notification"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
        </div>
       </> 
    )
}