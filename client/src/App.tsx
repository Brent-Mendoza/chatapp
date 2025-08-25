import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./pages/Layout"
import Landing from "./pages/landing/Landing"
import Chat from "./pages/chat/Chat"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import PublicRoute from "./components/PublicRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import Error from "./pages/Error"

export const queryClient = new QueryClient()
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: (
            <PublicRoute>
              <Landing />
            </PublicRoute>
          ),
        },
        {
          path: "/chat",
          element: (
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ])
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
