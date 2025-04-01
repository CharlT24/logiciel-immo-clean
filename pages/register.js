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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Ajout dans la table utilisateurs
    const { user } = data
    if (user) {
      await supabase.from("utilisateurs").insert([
        {
          id: user.id,
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          role: "agent",
          is_validated: false,
        }
      ])
    }

    setLoading(false)
    router.push("/login")
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Créer un compte agent</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input name="nom" onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Prénom</label>
          <input name="prenom" onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" name="email" onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Mot de passe</label>
          <input type="password" name="password" onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          {loading ? "Création en cours..." : "Créer le compte"}
        </button>
      </form>
    </div>
  )
}
