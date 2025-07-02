import Link from "next/link"
import { Phone, MapPin, Mail } from 'lucide-react'
import { FOOTER_CONSTANTS } from "@/constants"

export default function Footer() {
  return (
    <footer className="w-full">

      {/* Main Footer Content */}
      <div className="container bg-purple-50 mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {FOOTER_CONSTANTS.columns.map((column, index) => (
            <div key={index} className="col-span-2 md:col-span-1">
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-gray-600 hover:text-purple-600">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get in Touch */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="font-semibold mb-4">{FOOTER_CONSTANTS.getInTouch.title}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-purple-600 mt-1" />
                <p className="text-gray-600">{FOOTER_CONSTANTS.getInTouch.phone}</p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-purple-600 mt-1" />
                <p className="text-gray-600">{FOOTER_CONSTANTS.getInTouch.email}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                <p className="text-gray-600">{FOOTER_CONSTANTS.getInTouch.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <p className="text-sm text-gray-600">{FOOTER_CONSTANTS.copyright}</p>
            <p className="text-sm text-gray-600">GSTIN: 07AAKCG6119R1ZX</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

