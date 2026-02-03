import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jay Bennett - Skill Catalog",
  description: "AI-Native Product Engineer showcasing capability-based skills",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Jay Bennett
            </Link>
            <div className="flex gap-6">
              <Link href="/skill-topology" className="hover:text-blue-600">
                Skill Topology
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
