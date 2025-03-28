// pages/biens/[id].js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query

  const [bien, setBien] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    console.log("🔍 ID du bien reçu :", id)

    const fetchBien = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
      if (error) console.error("❌ Erreur Supabase :", error)
      setBien(data)
      setLoading(false)
    }

    fetchBien()
  }, [id])

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>
  if (!bien) return <div className="p-8 text-red-500">Bien introuvable</div>

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-700">🏡 {bien.titre}</h1>
        <Link
          href={`/biens/${bien.id}/modifier`}
          className="text-sm bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          ✏️ Modifier
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <p><strong>📍 Ville :</strong> {bien.ville}</p>
        <p><strong>📏 Surface :</strong> {bien.surface_m2} m²</p>
        <p><strong>💰 Prix :</strong> {bien.prix.toLocaleString()} €</p>
        <p><strong>🔋 DPE :</strong> {bien.dpe}</p>
        <p><strong>🧾 Honoraires :</strong> {bien.honoraires} €</p>
        <p><strong>📄 Description :</strong> {bien.description || "Aucune description disponible."}</p>
        <p><strong>📤 Export LeBonCoin :</strong> {bien.export_leboncoin ? "✅ Oui" : "❌ Non"}</p>
        <p><strong>📤 Export SeLoger :</strong> {bien.export_seloger ? "✅ Oui" : "❌ Non"}</p>
        <p><strong>📆 Statut :</strong> {bien.vendu ? "✅ Vendu" : bien.sous_compromis ? "📝 Sous compromis" : "🟢 Disponible"}</p>
      </div>
    </div>
  )
}
