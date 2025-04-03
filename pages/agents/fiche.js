import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function FicheEditAgent() {
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAgent = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (!userId) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("utilisateurs")
        .select("id, nom, email, ville, telephone, bio")
        .eq("id", userId)
        .single()

      if (!error) {
        setAgent(data)
        setLoading(false)
      }
    }

    fetchAgent()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setAgent({ ...agent, [name]: value })
  }

  const handleSave = async () => {
    setSaving(true)

    const { error } = await supabase
      .from("utilisateurs")
      .update({
        nom: agent.nom,
        ville: agent.ville,
        telephone: agent.telephone,
        bio: agent.bio
      })
      .eq("id", agent.id)

    setSaving(false)

    if (error) {
      alert("❌ Erreur lors de l'enregistrement")
    } else {
      alert("✅ Informations mises à jour avec succès")
    }
  }

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Chargement du profil...</p>
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">👤 Ma fiche agent</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input
            name="nom"
            value={agent.nom}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Ville</label>
          <input
            name="ville"
            value={agent.ville || ""}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Téléphone</label>
          <input
            name="telephone"
            value={agent.telephone || ""}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={agent.bio || ""}
            onChange={handleChange}
            className="input w-full"
            rows={5}
            placeholder="Parlez un peu de vous..."
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition mt-6"
      >
        {saving ? "💾 Enregistrement..." : "💾 Enregistrer mes infos"}
      </button>
    </div>
  )
}
