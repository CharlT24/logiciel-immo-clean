import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    checkUser()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded p-10 max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">🏠 Logiciel Immo</h1>
        <p className="text-gray-600">Gérez vos biens et vos clients avec puissance et simplicité.</p>

        {user ? (
          <a
            href="/dashboard"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🔐 Accéder au tableau de bord
          </a>
        ) : (
          <a
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔑 Se connecter
          </a>
        )}
      </div>
    </div>
  )
}
