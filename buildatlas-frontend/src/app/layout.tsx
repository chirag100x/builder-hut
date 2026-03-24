import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuildAtlas',
  description: 'Smart Construction Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col text-slate-800`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
