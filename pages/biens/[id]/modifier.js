import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierBien() {
  const router = useRouter()
  const { id } = router.query

  const [bien, setBien] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (id) fetchBien()
  }, [id])

  const fetchBien = async () => {
    const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
    if (error) {
      console.error("Erreur chargement bien :", error)
      setMessage("Erreur lors du chargement.")
    } else {
      setBien(data)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setBien({ ...bien, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("biens").update(bien).eq("id", id)
    if (error) {
      console.error("Erreur update :", error)
      setMessage("Erreur lors de la sauvegarde.")
    } else {
      setMessage("✅ Bien modifié avec succès !")
      setTimeout(() => router.push("/biens"), 1000)
    }
  }

  if (loading) return <p className="p-6">Chargement...</p>
  if (!bien) return <p className="p-6 text-red-500">Aucun bien trouvé.</p>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">✏️ Modifier le bien</h1>

      {message && <p className="text-sm text-center text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="surface_m2" value={bien.surface_m2 || ""} onChange={handleChange} type="number" placeholder="Surface (m²)" className="w-full border p-2 rounded" />
        <input name="nb_pieces" value={bien.nb_pieces || ""} onChange={handleChange} type="number" placeholder="Nombre de pièces" className="w-full border p-2 rounded" />
        <input name="nb_chambres" value={bien.nb_chambres || ""} onChange={handleChange} type="number" placeholder="Nombre de chambres" className="w-full border p-2 rounded" />
        <input name="etage" value={bien.etage || ""} onChange={handleChange} type="text" placeholder="Étage" className="w-full border p-2 rounded" />
        <input name="dpe" value={bien.dpe || ""} onChange={handleChange} type="text" placeholder="DPE" className="w-full border p-2 rounded" />
        <input name="prix_vente" value={bien.prix_vente || ""} onChange={handleChange} type="number" placeholder="Prix de vente (€)" className="w-full border p-2 rounded" />
        <input name="honoraires" value={bien.honoraires || ""} onChange={handleChange} type="number" placeholder="Honoraires (€)" className="w-full border p-2 rounded" />

        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input name="charge_vendeur" type="checkbox" checked={bien.charge_vendeur || false} onChange={handleChange} />
            Charge vendeur
          </label>
          <label className="flex items-center gap-2">
            <input name="charge_acquereur" type="checkbox" checked={bien.charge_acquereur || false} onChange={handleChange} />
            Charge acquéreur
          </label>
        </div>

        <textarea name="description" value={bien.description || ""} onChange={handleChange} rows={4} placeholder="Description du bien" className="w-full border p-2 rounded" />

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
          💾 Enregistrer les modifications
        </button>
      </form>
    </div>
  )
}