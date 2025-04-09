import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminCRM() {
  const [params, setParams] = useState(null)
  const [newType, setNewType] = useState("")

  useEffect(() => {
    const fetchParams = async () => {
      const { data, error } = await supabase.from("parametres_crm").select("*").single()
      if (!error && data) {
        setParams(data)
      } else {
        // Si aucune config existante, on peut l’initialiser
        await supabase.from("parametres_crm").insert({
          nom_agence: "Mon Agence",
          message_accueil: "Bienvenue sur votre espace professionnel.",
          couleur_primaire: "#f97316",
          types_biens: ["Maison", "Appartement", "Terrain"]
        })
        fetchParams()
      }
    }

    fetchParams()
  }, [])

  const handleChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddType = () => {
    if (newType && !params.types_biens.includes(newType)) {
      setParams((prev) => ({
        ...prev,
        types_biens: [...prev.types_biens, newType]
      }))
      setNewType("")
    }
  }

  const handleDeleteType = (type) => {
    setParams((prev) => ({
      ...prev,
      types_biens: prev.types_biens.filter((t) => t !== type)
    }))
  }

  const handleSave = async () => {
    const { error } = await supabase.from("parametres_crm").update(params).eq("id", params.id)
    if (!error) {
      alert("✅ Paramètres enregistrés")
    } else {
      alert("❌ Erreur lors de l’enregistrement")
    }
  }

  if (!params) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">⚙️ Paramètres CRM</h1>

      {/* Nom agence */}
      <div>
        <label className="block font-medium mb-1">🏢 Nom de l’agence</label>
        <input
          value={params.nom_agence}
          onChange={(e) => handleChange("nom_agence", e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Message accueil */}
      <div>
        <label className="block font-medium mb-1">💬 Message d’accueil</label>
        <textarea
          value={params.message_accueil}
          onChange={(e) => handleChange("message_accueil", e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Couleur principale */}
      <div>
        <label className="block font-medium mb-1">🎨 Couleur principale</label>
        <input
          type="color"
          value={params.couleur_primaire}
          onChange={(e) => handleChange("couleur_primaire", e.target.value)}
          className="h-10 w-24 border rounded"
        />
      </div>

      {/* Types de biens */}
      <div>
        <label className="block font-medium mb-2">🏷️ Types de biens</label>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Ajouter un type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button onClick={handleAddType} className="bg-orange-500 text-white px-4 rounded hover:bg-orange-600">
            Ajouter
          </button>
        </div>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          {params.types_biens.map((type, idx) => (
            <li key={idx} className="flex justify-between items-center">
              {type}
              <button onClick={() => handleDeleteType(type)} className="text-red-500 hover:underline text-xs">
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton sauvegarde */}
      <div className="pt-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          💾 Enregistrer les modifications
        </button>
      </div>
    </div>
  )
}
