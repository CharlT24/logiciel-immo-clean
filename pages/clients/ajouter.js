import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AjouterClient() {
  const [userId, setUserId] = useState(null)
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    ville_recherche: "",
    type_bien: "",
    budget_min: "",
    budget_max: "",
  })

  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push("/login")
      setUserId(session.user.id)
    }
    getUser()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userId) return alert("Utilisateur non connecté.")

    const { error } = await supabase.from("clients").insert([
      {
        ...form,
        budget_min: parseInt(form.budget_min),
        budget_max: parseInt(form.budget_max),
        agent_id: userId,
      },
    ])

    if (error) {
      console.error("❌ Erreur ajout client :", error)
      alert("Erreur lors de l’ajout.")
    } else {
      alert("✅ Client ajouté avec succès !")
      router.push("/clients")
    }
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 flex flex-col space-y-6 fixed h-full">
        <div className="text-2xl font-bold text-blue-600">LOGICIEL IMMO</div>
        <nav className="flex flex-col space-y-2 mt-6">
          <a href="/dashboard" className="hover:text-blue-600">🏠 Tableau de bord</a>
          <a href="/clients" className="text-blue-600 font-semibold">👥 Clients</a>
          <a href="/biens" className="hover:text-blue-600">🏡 Biens</a>
        </nav>
      </aside>

      {/* Formulaire */}
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6">➕ Ajouter un client</h1>

        <form onSubmit={handleSubmit} className="max-w-xl space-y-4 bg-white p-6 rounded shadow">
          <input type="text" name="nom" placeholder="Nom" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="ville_recherche" placeholder="Ville recherchée" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="type_bien" placeholder="Type de bien (maison, appart…)" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="budget_min" placeholder="Budget min (€)" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="budget_max" placeholder="Budget max (€)" required onChange={handleChange} className="w-full p-2 border rounded" />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Enregistrer le client
          </button>
        </form>
      </main>
    </div>
  )
}
