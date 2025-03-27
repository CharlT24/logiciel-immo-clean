// pages/clients/[id]/modifier.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierClient() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", ville_recherche: "", budget_min: "", budget_max: "", type_bien: "",
  })

  useEffect(() => {
    if (!id) return
    const fetchClient = async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()
      if (data) setForm(data)
    }
    fetchClient()
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("clients").update(form).eq("id", id)
    if (!error) router.push("/clients")
    else alert("❌ Erreur à la modification")
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">✏️ Modifier client</h2>
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
