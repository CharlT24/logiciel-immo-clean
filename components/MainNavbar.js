import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function MainNavbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center mb-6">
      <div className="space-x-4 text-sm">
        <button onClick={() => router.push("/dashboard")} className="hover:underline">🏠 Dashboard</button>
        <button onClick={() => router.push("/clients")} className="hover:underline">👥 Clients</button>
        <button onClick={() => router.push("/biens")} className="hover:underline">🏡 Biens</button>
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">
        🚪 Déconnexion
      </button>
    </nav>
  )
}
