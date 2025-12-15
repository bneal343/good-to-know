import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Accounting Services Pricebook',
  description: 'Professional accounting services with flexible pricing and bundles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-8">
                <Link href="/" className="text-xl font-bold text-primary-600">
                  Accounting Services
                </Link>
                <Link href="/pricebook" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  View Pricebook
                </Link>
                <Link href="/admin/components" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Manage Components
                </Link>
                <Link href="/admin/bundles" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Manage Bundles
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
