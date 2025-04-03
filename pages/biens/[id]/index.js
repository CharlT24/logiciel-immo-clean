import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)
  const [coverUrl, setCoverUrl] = useState(null)
  const [galleryUrls, setGalleryUrls] = useState([])
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      setUserId(uid)

      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", uid)
        .single()

      setRole(userData?.role || "")
    }

    getUser()
  }, [])

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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce bien ? Cette action est irréversible.")
    if (!confirmDelete) return

    const { error } = await supabase.from("biens").delete().eq("id", id)
    if (error) {
      alert("❌ Erreur lors de la suppression")
    } else {
      alert("✅ Bien supprimé")
      router.push("/biens")
    }
  }

  if (loading || !userId || role === "") {
    return <p className="text-center mt-10">Chargement de la fiche bien...</p>
  }

  if (!bien) {
    return <p className="text-center text-red-600 mt-10">Bien introuvable</p>
  }

  const isOwnerOrAdmin = userId === bien.agent_id || role === "admin"
  const totalPrix = (bien.prix_vente || 0) + (bien.honoraires || 0)
  const addressQuery = encodeURIComponent(`${bien.ville || ""}, ${bien.code_postal || ""}`)
  const mapEmbed = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${addressQuery}`

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 print:bg-white">
      {/* Retour & Actions */}
      <div className="flex justify-between items-center">
        <button onClick={() => router.push("/biens")} className="text-orange-600 text-sm hover:underline">⬅️ Retour à la liste</button>
        <div className="flex gap-4 items-center">
          {isOwnerOrAdmin && <button onClick={() => router.push(`/biens/${id}/modifier`)} className="text-sm text-orange-600 hover:underline">📝 Modifier</button>}
          {role === "admin" && <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">🗑️ Supprimer</button>}
          {role === "admin" && <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">Admin</span>}
        </div>
      </div>

      {/* Bouton PDF */}
      <div className="flex justify-end">
        <button onClick={() => window.print()} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow text-sm">📄 Télécharger cette fiche</button>
      </div>

      {/* Titre & localisation */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600">🏡 {bien.titre}</h1>
        <p className="text-gray-600 text-sm mt-1">{bien.ville} ({bien.code_postal})</p>
        <p className="text-sm text-gray-400">Mandat : {bien.mandat} – Statut : {bien.statut}</p>
      </div>

      {coverUrl && (<img src={coverUrl} alt="photo" className="w-full rounded-xl shadow-xl h-96 object-cover" />)}

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
        <p>🛋️ Pièces : <strong>{bien.nb_pieces}</strong></p>
        <p>🛏️ Chambres : <strong>{bien.nb_chambres}</strong></p>
        <p>📊 DPE : <strong>{bien.dpe}</strong></p>
        <p>🏢 Étage : <strong>{bien.etage || '-'}</strong></p>
        <p>🏷️ Type : <strong>{bien.type_bien}</strong></p>
        <p>🏗️ Année de construction : <strong>{bien.annee_construction || '-'}</strong></p>
        <p>🔥 Chauffage : <strong>{bien.type_chauffage} ({bien.mode_chauffage})</strong></p>
        <p>🏞️ Terrain : <strong>{bien.surface_terrain} m²</strong></p>
        <p>🏛️ Mitoyenneté : <strong>{bien.mitoyennete}</strong></p>
        <p>🏢 Étages immeuble : <strong>{bien.nb_etages_immeuble}</strong></p>
      </div>

      <div className="bg-orange-50 p-4 rounded shadow text-sm">
        <p>💰 Prix de vente : <strong>{bien.prix_vente?.toLocaleString()} €</strong></p>
        <p>➕ Honoraires : {bien.honoraires?.toLocaleString()} €</p>
        <p className="mt-1 font-semibold">Total : {totalPrix.toLocaleString()} €</p>
        <p>📊 Pourcentage honoraires : {((bien.honoraires / bien.prix_vente) * 100 || 0).toFixed(2)}%</p>
        {bien.charge_vendeur && <p>✅ Honoraires à la charge du vendeur</p>}
        {bien.charge_acquereur && <p>✅ Honoraires à la charge de l’acquéreur</p>}
        <p>📜 Taxe foncière : {bien.taxe_fonciere || '-'} €</p>
        <p>🏷️ Numéro de dossier : {bien.numero_dossier || '-'}</p>
      </div>

      {bien.description && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500">📝 Description</h2>
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
            {bien.description}
            {'\n\n'}🔍 Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site :
            <a href="https://www.georisques.gouv.fr" className="text-blue-600 underline ml-2" target="_blank">Géorisques</a>
          </p>
        </div>
      )}

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

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">📍 Localisation</h2>
        <iframe
          src={mapEmbed}
          width="100%"
          height="350"
          className="rounded-xl shadow"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  )
}
