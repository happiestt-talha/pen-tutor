import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/components/auth/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pen Tutor - Connect Students with Tutors",
  description: "Find the perfect tutor or student for your educational needs",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
