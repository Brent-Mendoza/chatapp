import type { ReactNode } from "react"
import { useAuth } from "../pages/Layout"
import { Navigate } from "react-router-dom"

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { data: user } = useAuth()

  if (user) return <Navigate to="/chat" replace />

  return <>{children}</>
}
