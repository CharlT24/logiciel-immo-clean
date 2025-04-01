import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)

  useEffect(() => {
    if (id) fetchBien()
  }, [id])

  const fetchBien = async () => {
    const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
    if (error) console.error("Erreur chargement bien :", error)
    else setBien(data)
  }

  if (!bien) return <p className="text-center text-gray-400 mt-10">Chargement du bien...</p>

  const totalPrix = (bien.prix_vente || 0) + (bien.honoraires || 0)
  const mapLink = bien.latitude && bien.longitude ? `https://www.google.com/maps?q=${bien.latitude},${bien.longitude}` : null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 print:bg-white">
      {/* Bouton PDF */}
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow text-sm"
        >📄 Télécharger cette fiche</button>
      </div>

      {/* Titre & localisation */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600">🏡 {bien.titre}</h1>
        <p className="text-gray-600 text-sm mt-1">{bien.ville} ({bien.code_postal})</p>
        <p className="text-sm text-gray-400">Mandat : {bien.mandat} - Statut : {bien.statut}</p>
      </div>

      {/* Image couverture */}
      {bien.photos && (
        <img src={bien.photos} alt="photo" className="w-full rounded-xl shadow-xl h-96 object-cover" />
      )}

      {/* Galerie */}
      {bien["photo-biens"] && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500 mt-6 mb-2">📸 Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bien["photo-biens"].map((url, idx) => (
              <img key={idx} src={url} className="rounded-lg shadow h-40 object-cover" />
            ))}
          </div>
        </div>
      )}

      {/* Infos détaillées */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
        <p>📐 Surface : <strong>{bien.surface_m2} m²</strong></p>
        <p>🛋️ Pièces : <strong>{bien.nb_pieces}</strong></p>
        <p>🛏️ Chambres : <strong>{bien.nb_chambres}</strong></p>
        <p>📊 DPE : <strong>{bien.dpe}</strong></p>
        <p>🏢 Étage : <strong>{bien.etage || '-'}</strong></p>
        <p>🏷️ Type : <strong>{bien.type_bien}</strong></p>
      </div>

      {/* Prix */}
      <div className="bg-orange-50 p-4 rounded shadow text-sm">
        <p>💰 Prix de vente : <strong>{bien.prix_vente?.toLocaleString()} €</strong></p>
        <p>➕ Honoraires : {bien.honoraires?.toLocaleString()} €</p>
        <p className="mt-1 font-semibold">Total : {totalPrix.toLocaleString()} €</p>
        {bien.charge_vendeur && <p>✅ Honoraires à la charge du vendeur</p>}
        {bien.charge_acquereur && <p>✅ Honoraires à la charge de l’acquéreur</p>}
      </div>

      {/* Description */}
      {bien.description && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500">📝 Description</h2>
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{bien.description}</p>
        </div>
      )}

      {/* Options */}
      {bien.options && bien.options.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500">🔧 Options & équipements</h2>
          <div className="flex flex-wrap gap-3 mt-2">
            {bien.options.map((opt, i) => (
              <span key={i} className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full shadow">
                {opt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      {mapLink && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-orange-500 mb-2">📍 Localisation</h2>
          <iframe
            src={`https://www.google.com/maps?q=${bien.latitude},${bien.longitude}&hl=fr&z=15&output=embed`}
            width="100%"
            height="350"
            className="rounded-xl shadow"
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  )
}
