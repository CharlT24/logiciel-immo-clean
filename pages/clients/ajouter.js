// pages/clients/ajouter.js
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function AjouterClient() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", ville_recherche: "", budget_min: "", budget_max: "", type_bien: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const session = await supabase.auth.getSession()
    const agentId = session.data?.session?.user?.id
    const { error } = await supabase.from("clients").insert([{ ...form, agent_id: agentId }])
    if (!error) router.push("/clients")
    else alert("❌ Erreur à l'ajout du client")
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">➕ Ajouter un client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "nom", label: "Nom" },
          { name: "email", label: "Email", type: "email" },
          { name: "telephone", label: "Téléphone" },
          { name: "ville_recherche", label: "Ville de recherche" },
          { name: "budget_min", label: "Budget min", type: "number" },
          { name: "budget_max", label: "Budget max", type: "number" },
          { name: "type_bien", label: "Type de bien (maison...)" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        ))}
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Enregistrer
        </button>
      </form>
    </div>
  )
}
