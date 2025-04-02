import axios from "axios"

type WordPressExportOptions = {
  wpUrl: string // ex: https://tonsite.com
  username: string
  appPassword: string
  postType?: string // ex: "post" ou "bien_immobilier"
  bien: {
    titre: string
    description: string
    prix: number
    ville: string
    imageUrl?: string // Supabase public URL
  }
}

export async function exportToWordPress({
  wpUrl,
  username,
  appPassword,
  postType = "post",
  bien
}: WordPressExportOptions) {
  const auth = Buffer.from(`${username}:${appPassword}`).toString("base64")
  const headers = {
    Authorization: `Basic ${auth}`
  }

  let mediaId: number | null = null

  // 🔼 1. Upload image (optionnel)
  if (bien.imageUrl) {
    const imageResp = await axios.get(bien.imageUrl, { responseType: "arraybuffer" })
    const fileName = bien.imageUrl.split("/").pop() || "photo.jpg"

    const uploadResp = await axios.post(
      `${wpUrl}/wp-json/wp/v2/media`,
      imageResp.data,
      {
        headers: {
          ...headers,
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": "image/jpeg" // à adapter si PNG/WebP
        }
      }
    )

    mediaId = uploadResp.data.id
  }

  // 📝 2. Créer le post
  const postData = {
    title: bien.titre,
    content: `${bien.description}\n\nPrix: ${bien.prix}€\nVille: ${bien.ville}`,
    status: "publish",
    featured_media: mediaId || undefined
  }

  const post = await axios.post(
    `${wpUrl}/wp-json/wp/v2/${postType}`,
    postData,
    { headers }
  )

  return post.data // retour complet de WordPress
}
