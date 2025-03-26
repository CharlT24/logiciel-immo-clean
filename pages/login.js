import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [mode, setMode] = useState("login") // "login", "signup", "reset"

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: userData } = await supabase
          .from('utilisateurs')
          .select('is_validated')
          .eq('id', session.user.id)
          .single()

        if (userData?.is_validated) {
          router.push("/espace")
        } else {
          router.push("/pending")
        }
      }
    }

    checkSession()
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError("")

    if (mode === "login") {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) return setError("Erreur : " + signInError.message)

      const user = data.user

      const { data: existingUser } = await supabase
        .from("utilisateurs")
        .select("id")
        .eq("id", user.id)
        .single()

      if (!existingUser) {
        await supabase.from("utilisateurs").insert([{
          id: user.id,
          email: user.email,
          is_validated: false,
          is_admin: false
        }])
      }

      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("is_validated")
        .eq("id", user.id)
        .single()

      if (userData?.is_validated) {
        router.push("/dashboard")
      } else {
        router.push("/pending")
      }

    } else if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) return setError("Erreur : " + signUpError.message)
      alert("Compte créé ! Tu peux maintenant te connecter.")
      setMode("login")

    } else if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      if (resetError) return setError("Erreur : " + resetError.message)
      alert("Un email de réinitialisation a été envoyé.")
      setMode("login")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <form onSubmit={handleAuth} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "login" && "🔐 Connexion"}
          {mode === "signup" && "🆕 Créer un compte"}
          {mode === "reset" && "🔁 Réinitialiser le mot de passe"}
        </h2>

        <input
          className="w-full border p-2 mb-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {mode !== "reset" && (
          <input
            className="w-full border p-2 mb-2 rounded"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {mode === "login" && "Se connecter"}
          {mode === "signup" && "Créer le compte"}
          {mode === "reset" && "Envoyer le lien"}
        </button>

        <div className="text-sm text-center mt-4 space-y-1">
          {mode !== "login" && (
            <p className="text-blue-600 cursor-pointer" onClick={() => setMode("login")}>
              🔙 Retour à la connexion
            </p>
          )}

          {mode === "login" && (
            <>
              <p className="text-blue-600 cursor-pointer" onClick={() => setMode("signup")}>
                🆕 Créer un compte
              </p>
              <p className="text-blue-600 cursor-pointer" onClick={() => setMode("reset")}>
                🔁 Mot de passe oublié ?
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
