import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)
  const [coverUrl, setCoverUrl] = useState(null)
  const [galleryUrls, setGalleryUrls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchBien()
      fetchPhotos()
    }
  }, [id])

  const fetchBien = async () => {
    const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
    if (!error) setBien(data)
    setLoading(false)
  }

  const fetchPhotos = async () => {
    const { data: coverData } = supabase.storage.from("photos").getPublicUrl(`covers/${id}/cover.jpg`)
    setCoverUrl(coverData.publicUrl)

    const { data: gallery } = await supabase.storage.from("photos").list(`gallery/${id}`)
    if (gallery?.length) {
      const urls = gallery.map(photo =>
        supabase.storage.from("photos").getPublicUrl(`gallery/${id}/${photo.name}`).data.publicUrl
      )
      setGalleryUrls(urls)
    }
  }

  if (loading || !bien) return <p className="text-center mt-10">Chargement...</p>

  const totalPrix = (bien.prix_vente || 0) + (bien.honoraires || 0)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="flex justify-between items-center">
        <button onClick={() => router.push("/biens")} className="text-orange-600 text-sm hover:underline">⬅️ Retour</button>
      </div>

      <h1 className="text-3xl font-bold text-orange-600">🏡 {bien.titre}</h1>
      <p className="text-gray-600 text-sm">{bien.ville} ({bien.code_postal})</p>
      <p className="text-sm text-gray-400">Mandat : {bien.mandat} – Statut : {bien.statut}</p>

      {coverUrl && <img src={coverUrl} alt="photo" className="w-full rounded-xl shadow-xl h-96 object-cover" />}

      {galleryUrls.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500 mt-6 mb-2">📸 Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryUrls.map((url, idx) => (
              <img key={idx} src={url} className="rounded-lg shadow h-40 object-cover" />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
        <p>📐 Surface : <strong>{bien.surface_m2} m²</strong></p>
        <p>🛏️ Chambres : <strong>{bien.nb_chambres}</strong></p>
        <p>🛋️ Pièces : <strong>{bien.nb_pieces}</strong></p>
        <p>🏢 Étage : <strong>{bien.etage}</strong></p>
        <p>🏷️ Type : <strong>{bien.type_bien}</strong></p>
        <p>🏗️ Année : <strong>{bien.annee_construction}</strong></p>
        <p>🔥 Chauffage : <strong>{bien.type_chauffage} ({bien.mode_chauffage})</strong></p>
        <p>🌍 Terrain : <strong>{bien.surface_terrain} m²</strong></p>
      </div>

      <div className="bg-orange-50 p-4 rounded shadow text-sm">
        <p>💰 Prix de vente : <strong>{bien.prix_vente?.toLocaleString()} €</strong></p>
        <p>➕ Honoraires : {bien.honoraires?.toLocaleString()} €</p>
        <p>💸 Net vendeur : {bien.prix_net_vendeur?.toLocaleString()} €</p>
        <p>📊 % Honoraires : {bien.pourcentage_honoraires}%</p>
        <p>📜 Taxe foncière : {bien.taxe_fonciere} €</p>
        <p>💼 Charges annuelles : {bien.quote_part_charges} €</p>
        <p>🏛️ Fonds travaux : {bien.fonds_travaux} €</p>
      </div>

      {/* Bloc DPE stylisé */}
      {bien.dpe && bien.dpe !== "" && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-orange-500">🔍 Diagnostic Énergétique</h2>
          {bien.dpe === "vierge" ? (
            <p className="text-sm mt-2 text-gray-600">DPE vierge (non soumis)</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <img src="/dpe_example.jpg" alt="DPE" className="w-full rounded-xl border" />
              <div className="space-y-2 text-sm">
                <p>⚡ Consommation énergie primaire : {bien.dpe_conso_indice} kWh/m²/an</p>
                <p>🌫️ GES (CO₂) : {bien.dpe_ges_indice} kgCO₂/m²/an</p>
                <p>🔥 Énergie finale : {bien.energie_finale_kwh} kWh/m²/an</p>
                <p>💶 Estimation annuelle : {bien.dpe_cout_min} € – {bien.dpe_cout_max} €</p>
                <p className="text-gray-500 italic">Données estimées sur l'année de référence 2023</p>
              </div>
            </div>
          )}
        </div>
      )}

      {bien.description && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-orange-500">📝 Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
            {bien.description}
            {'\n\n'}🔍 Infos risques : <a href="https://www.georisques.gouv.fr" className="text-blue-600 underline" target="_blank">Géorisques</a>
          </p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">📍 Localisation</h2>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(bien.ville + ", " + bien.code_postal)}`}
          width="100%"
          height="350"
          className="rounded-xl shadow"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  )
}
