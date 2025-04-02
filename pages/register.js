import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Register() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: "",
    nom: "",
    telephone: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { email, password, nom, telephone } = form

    if (!email || !password || !nom || !telephone) {
      alert("Tous les champs sont requis")
      setLoading(false)
      return
    }

    // ✅ Étape 1 : création de l'utilisateur via Supabase Auth
    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      console.error("❌ Erreur création compte :", signUpError)
      alert("Erreur Supabase : " + signUpError.message)
      setLoading(false)
      return
    }

    // ✅ Étape 2 : récupérer le token de session
    const sessionRes = await supabase.auth.getSession()
    const accessToken = sessionRes?.data?.session?.access_token

    if (!accessToken) {
      alert("❌ Impossible de récupérer le token d’accès")
      setLoading(false)
      return
    }

    // ✅ Étape 3 : appel de l’API sécurisée côté serveur
    const res = await fetch("/api/register-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ nom, telephone }),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error("❌ Erreur API :", result)
      alert("Erreur API : " + result.error)
      setLoading(false)
      return
    }

    alert("✅ Compte créé avec succès !")
    router.push("/login")
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 shadow-lg rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-orange-600 text-center">📝 Créer un compte</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          value={form.nom}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  )
}
