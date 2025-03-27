import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import CarteGoogle from "@/components/CarteGoogle"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query

  const [bien, setBien] = useState(null)
  const [agentId, setAgentId] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      console.log("🔍 ID du bien reçu :", id)

      const { data: sessionData } = await supabase.auth.getSession()
      const currentUserId = sessionData?.session?.user?.id
      setAgentId(currentUserId)

      const { data: bienData, error } = await supabase
        .from("biens")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("❌ Erreur Supabase :", error)
        return
      }

      if (bienData && (!bienData.lat || !bienData.lng)) {
        console.log("📍 Lancement géocodage...")
        const geo = await geocodeVille(bienData.ville)
        if (geo) {
          await supabase.from("biens").update({
            lat: geo.lat,
            lng: geo.lng,
          }).eq("id", bienData.id)
          bienData.lat = geo.lat
          bienData.lng = geo.lng
        }
      }

      console.log("✅ Bien chargé :", bienData)
      setBien(bienData)
    }

    fetchData()
  }, [id])

  const geocodeVille = async (ville) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(ville)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        console.log("📍 Coordonnées géo :", lat, lng)
        return { lat, lng }
      } else {
        console.warn("⚠️ Aucun résultat géo pour :", ville)
      }
    } catch (err) {
      console.error("❌ Erreur géocodage :", err)
    }
    return null
  }

  if (!bien) return <p className="p-8">⏳ Chargement du bien...</p>
  const isMine = agentId === bien.agent_id

  return (
    <div className="p-8">
      <a href="/dashboard" className="text-sm text-orange-600 hover:underline">⬅️ Retour au Dashboard</a>
      <h1 className="text-3xl font-bold mt-4 mb-4">{bien.titre}</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <p><strong>📍 Ville :</strong> {bien.ville}</p>
          <p><strong>📏 Surface :</strong> {bien.surface_m2} m²</p>
          <p><strong>💰 Prix :</strong> {bien.prix?.toLocaleString()} €</p>
          <p><strong>🔋 DPE :</strong> {bien.dpe}</p>
          <p><strong>💼 Honoraires :</strong> {bien.honoraires?.toLocaleString()} €</p>
          <p><strong>📅 Disponibilité :</strong> {bien.disponible ? "🟢 Disponible" : "🔴 Indisponible"}</p>
          <p><strong>📦 Statut :</strong> {bien.vendu ? "✅ Vendu" : bien.sous_compromis ? "📑 Sous compromis" : "🟢 En vente"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">📝 Description :</p>
          <div className="bg-white p-4 rounded shadow text-sm text-gray-700 whitespace-pre-wrap">{bien.description}</div>
        </div>
      </div>

      {bien.lat && bien.lng && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-2">🗺️ Localisation</h2>
          <CarteGoogle lat={bien.lat} lng={bien.lng} />
        </>
      )}

      {isMine && (
        <div className="mt-6">
          <a
            href={`/biens/modifier?id=${bien.id}`}
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            ✏️ Modifier ce bien
          </a>
        </div>
      )}
    </div>
  )
}
