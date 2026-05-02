import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CapOral — Coaching prépa',
  description: 'Sessions de coaching individuel pour étudiants en prépa : lettre de motivation, CV, entraînement aux oraux.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body style={{ background: '#f7f8fc', minHeight: '100vh' }}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
