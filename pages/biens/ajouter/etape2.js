// pages/biens/ajouter/etape2.js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Etape2() {
  const router = useRouter()
  const { id } = router.query

  const [surface, setSurface] = useState("")
  const [pieces, setPieces] = useState("")
  const [chambres, setChambres] = useState("")
  const [etage, setEtage] = useState("")
  const [dpe, setDpe] = useState("D")
  const [honoraires, setHonoraires] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const updates = {
      surface_m2: parseFloat(surface),
      nb_pieces: parseInt(pieces),
      nb_chambres: parseInt(chambres),
      etage: etage,
      dpe: dpe,
      honoraires: parseFloat(honoraires),
      description: description,
    }

    const { error } = await supabase
      .from("biens")
      .update(updates)
      .eq("id", id)

    if (error) {
      console.error("❌ Erreur Supabase :", error)
      setError("Erreur lors de la mise à jour")
      return
    }

    router.push(`/biens/ajouter/etape3?id=${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🏗️ Étape 2 : Caractéristiques du bien</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Surface (m²)</label>
            <input
              type="number"
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre de pièces</label>
            <input
              type="number"
              value={pieces}
              onChange={(e) => setPieces(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre de chambres</label>
            <input
              type="number"
              value={chambres}
              onChange={(e) => setChambres(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Étage</label>
            <input
              type="text"
              value={etage}
              onChange={(e) => setEtage(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">DPE</label>
            <select
              value={dpe}
              onChange={(e) => setDpe(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
              <option>F</option>
              <option>G</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Honoraires (€)</label>
            <input
              type="number"
              value={honoraires}
              onChange={(e) => setHonoraires(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Description du bien</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm"
          ></textarea>
        </div>

        <div className="flex justify-between mt-6">
          <Link
            href={`/biens/ajouter/etape1?id=${id}`}
            className="text-sm text-orange-600 hover:underline"
          >
            ⬅️ Retour à l’étape 1
          </Link>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md"
          >
            Étape suivante ➡️
          </button>
        </div>
      </form>
    </div>
  )
}
