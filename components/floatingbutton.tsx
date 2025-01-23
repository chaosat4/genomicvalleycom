'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Share2, Github, Linkedin, Twitter } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export function FloatingSocialButtons() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 bg-purple-50 right-4 z-50">
      <div className={`flex flex-col-reverse items-end space-y-2 space-y-reverse ${isOpen ? 'mb-4' : ''}`}>
        {isOpen && socialLinks.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 text-purple-600 hover:text-purple-700"
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
              <link.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}
      </div>
      <Button
        variant="default"
        size="icon"
        className="bg-purple-600 hover:bg-purple-700 text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle social links"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

