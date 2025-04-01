import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const user = data?.user

    if (user?.id) {
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
        setError("Utilisateur créé dans Auth mais pas dans la table utilisateurs : " + insertError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push("/login"), 1500)
    } else {
      setError("Erreur inconnue lors de la création")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">Créer un compte agent</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input name="nom" placeholder="Nom" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="prenom" placeholder="Prénom" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required className="w-full border p-2 rounded" />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">✅ Agent créé avec succès !</p>}

        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          {loading ? "Création..." : "Créer le compte"}
        </button>
      </form>
    </div>
  )
}
