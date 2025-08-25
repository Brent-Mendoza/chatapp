import type { ReactNode } from "react"
import { useAuth } from "../pages/Layout"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: user } = useAuth()

  if (!user) return <Navigate to="/" replace />

  return <>{children}</>
}
