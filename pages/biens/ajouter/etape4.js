// pages/biens/ajouter/etape4.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

const OPTIONS_LIST = [
  "Chauffage individuel",
  "Climatisation",
  "Double vitrage",
  "Fibre optique",
  "Jardin",
  "Terrasse",
  "Balcon",
  "Piscine",
  "Garage",
  "Cave",
  "Ascenseur",
  "Interphone",
  "Portail automatique",
  "Accès PMR",
  "Séjour lumineux",
  "Cuisine équipée",
  "Cuisine américaine",
  "Suite parentale",
  "Combles aménageables",
  "Alarme",
  "Vue dégagée",
  "Vue mer",
  "Parking",
  "Exposition Sud",
  "Exposition Est",
  "Exposition Nord",
  "Exposition Ouest",
  "Dernier étage",
  "Plain-pied"
]

export default function Etape4() {
  const router = useRouter()
  const { id } = router.query
  const [selectedOptions, setSelectedOptions] = useState([])

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = async () => {
    const { error } = await supabase
      .from("biens")
      .update({ options: selectedOptions })
      .eq("id", id)

    if (error) {
      console.error("❌ Erreur mise à jour :", error)
      alert("Erreur lors de la mise à jour")
    } else {
      alert("✅ Options enregistrées avec succès")
      router.push(`/biens/ajouter/etape5?id=${id}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 mt-8 rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">🔧 Étape 4 : Caractéristiques du bien</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPTIONS_LIST.map((option) => (
          <label key={option} className="flex items-center space-x-3 bg-orange-50 rounded p-3 shadow hover:bg-orange-100 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-orange-600"
              checked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push(`/biens/ajouter/etape3?id=${id}`)}
          className="text-sm text-orange-600 hover:underline"
        >
          ⬅️ Étape précédente
        </button>

        <button
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow"
        >
          ✅ Enregistrer & Continuer
        </button>
      </div>
    </div>
  )
}
