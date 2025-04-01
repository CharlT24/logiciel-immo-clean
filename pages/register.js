import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    // Étape 1 : création du compte
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError("Erreur à la création du compte : " + signUpError.message)
      setLoading(false)
      return
    }

    // Étape 2 : forcer la connexion pour activer la session
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (loginError) {
      setError("Erreur de connexion automatique : " + loginError.message)
      setLoading(false)
      return
    }

    const user = loginData?.user
    console.log("✅ USER CONNECTÉ :", user)

    if (!user?.id) {
      setError("Impossible de récupérer l'ID utilisateur.")
      setLoading(false)
      return
    }

    // Étape 3 : insérer dans la table `utilisateurs`
    const { error: insertError } = await supabase.from("utilisateurs").insert([
      {
        id: user.id,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        role: "agent",
        is_validated: false,
      }
    ])

    if (insertError) {
      console.error("❌ INSERT ERROR", insertError)
      setError("Erreur lors de l'enregistrement du profil : " + insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/login"), 2000)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center text-orange-600">Créer un compte agent</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">✅ Compte créé avec succès ! Redirection...</p>}

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded">
          {loading ? "Création..." : "Créer le compte"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Déjà inscrit ?{" "}
          <a href="/login" className="text-orange-600 hover:underline">Se connecter</a>
        </p>
      </form>
    </div>
  )
}
