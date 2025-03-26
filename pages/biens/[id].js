import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchBien = async () => {
      const { data } = await supabase.from("biens").select("*").eq("id", id).single()
      setBien(data)
    }
    fetchBien()
  }, [id])

  if (!bien) return <div className="p-8">Chargement...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded shadow space-y-6 mt-10">
      <h1 className="text-3xl font-bold">{bien.titre}</h1>
      <p>📍 {bien.ville} – {bien.surface_m2} m²</p>
      <p>💰 {bien.prix?.toLocaleString()} €</p>
      <p>🔋 DPE : {bien.dpe || "NC"}</p>
      <p>📝 {bien.description || "Aucune description."}</p>

      <div className="pt-4">
        <a href={`/biens/${bien.id}/modifier`} className="text-blue-600 underline">✏️ Modifier</a> |{" "}
        <a href="/biens" className="text-gray-600 underline">← Retour</a>
      </div>
    </div>
  )
}
