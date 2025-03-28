// pages/login.js
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("❌ Identifiants incorrects")
      return
    }

    const user = data.user
    if (!user) return

    // 🧠 Récupérer le rôle
    const { data: profile } = await supabase
      .from("utilisateurs")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role) {
      localStorage.setItem("role", profile.role)
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-orange-600">Connexion</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}
