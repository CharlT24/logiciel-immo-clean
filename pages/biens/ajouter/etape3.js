// pages/biens/ajouter/etape3.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import Link from "next/link"

export default function Etape3UploadPhotos() {
  const router = useRouter()
  const { id } = router.query

  const [coverFile, setCoverFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [coverPreview, setCoverPreview] = useState(null)
  const [galleryPreviews, setGalleryPreviews] = useState([])

  useEffect(() => {
    if (!id) return
    console.log("🔍 ID du bien :", id)
  }, [id])

  const handleUpload = async () => {
    if (!id) return alert("ID de bien manquant.")

    try {
      // 📸 Upload photo de couverture
      if (coverFile) {
        const { error: coverError } = await supabase.storage
          .from("photos")
          .upload(`covers/${id}/cover.jpg`, coverFile, {
            upsert: true,
          })

        if (coverError) throw coverError
      }

      // 🖼️ Upload galerie
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i]
        const { error } = await supabase.storage
          .from("photos")
          .upload(`gallery/${id}/${Date.now()}-${file.name}`, file, {
            upsert: true,
          })
        if (error) throw error
      }

      alert("✅ Photos uploadées avec succès")
      router.push(`/biens/ajouter/etape4?id=${id}`)
    } catch (error) {
      console.error("❌ Erreur d’upload :", error)
      alert("Erreur lors de l’upload")
    }
  }

  const previewFile = (file, setPreview) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const previewGallery = (files) => {
    const previews = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result)
        if (previews.length === files.length) {
          setGalleryPreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-600">📸 Étape 3 : Ajoutez des photos</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* COVER */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 border">
          <h2 className="font-semibold text-gray-800">🖼️ Photo de couverture</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              setCoverFile(file)
              previewFile(file, setCoverPreview)
            }}
            className="text-sm"
          />
          {coverPreview && (
            <Image
              src={coverPreview}
              alt="Preview"
              width={400}
              height={300}
              className="rounded border mt-2 object-cover"
            />
          )}
        </div>

        {/* GALERIE */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 border">
          <h2 className="font-semibold text-gray-800">🗂️ Galerie (jusqu’à 7 photos)</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files
              setGalleryFiles(files)
              previewGallery(files)
            }}
            className="text-sm"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {galleryPreviews.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`photo-${idx}`}
                width={150}
                height={150}
                className="rounded object-cover border"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <Link
          href={`/biens/ajouter/etape2?id=${id}`}
          className="text-sm text-orange-600 hover:underline"
        >
          ⬅️ Retour à l’étape 2
        </Link>
        <button
          onClick={handleUpload}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow"
        >
          ✅ Enregistrer et passer à l’étape 4
        </button>
      </div>
    </div>
  )
}
