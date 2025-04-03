import { useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Etape5() {
  const router = useRouter()

  useEffect(() => {
    const envoyerVersWordPress = async () => {
      const id = router.query.id
      if (!id) return

      // 📦 1. Récupération du bien depuis Supabase
      const { data: bien, error } = await supabase
        .from("biens")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !bien) {
        console.error("❌ Erreur Supabase :", error)
        return
      }

      // 🖼️ 2. Photo de couverture (on construit l'URL)
      const coverUrl = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${id}/cover.jpg`

      // 🖼️ 3. Récupération des photos de galerie (listing dynamique)
      const { data: galleryData, error: galleryError } = await supabase
        .storage
        .from("photos")
        .list(`gallery/${id}`, {
          limit: 20,
          offset: 0
        })

      const gallery = galleryData?.map(photo => 
        `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${id}/${photo.name}`
      ) || []

      // ✅ 4. Fusion et envoi à WordPress
      const payload = {
        ...bien,
        cover: coverUrl,
        gallery: gallery
      }

      fetch("http://localhost/wordpress/wp-json/oi/v1/biens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(response => {
          console.log("✅ Bien envoyé à WordPress avec images :", response)
        })
        .catch(err => {
          console.error("❌ Échec de l’envoi à WordPress :", err)
        })
    }

    envoyerVersWordPress()
  }, [router.query.id])

  return (
    <div className="max-w-xl mx-auto bg-white p-10 mt-16 rounded-xl shadow border text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-600">✅ Bien enregistré !</h1>
      <p className="text-gray-600">Tu peux maintenant le retrouver dans ta liste de biens ou ajouter d’autres informations.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push("/biens")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded"
        >
          📂 Voir mes biens
        </button>
        <button
          onClick={() => router.push("/biens/ajouter/etape1")}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          ➕ Ajouter un autre
        </button>
      </div>
    </div>
  )
}
