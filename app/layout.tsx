import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tremplin — Coaching prépa',
  description: 'Sessions de coaching individuel pour étudiants en prépa : lettre de motivation, CV, entraînement aux oraux.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="flex flex-col md:flex-row h-screen overflow-hidden" style={{ background: '#f7f8fc' }}>
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        {/* Mobile nav */}
        <MobileNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
