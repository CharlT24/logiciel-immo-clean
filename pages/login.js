import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Email ou mot de passe incorrect.")
      return
    }

    const user = data.user
    if (!user) {
      setError("Utilisateur introuvable.")
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from("utilisateurs")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError) {
      setError("Impossible de récupérer le rôle.")
      return
    }

    if (profile.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center text-orange-600">Connexion</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded">
          Se connecter
        </button>

        <p className="text-sm text-center text-gray-600">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-orange-600 hover:underline">Créer un compte</a>
        </p>
      </form>
    </div>
  )
}
