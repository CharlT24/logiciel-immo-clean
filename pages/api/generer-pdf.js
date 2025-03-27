import { supabase } from "@/lib/supabaseClient"
import pdf from "html-pdf"

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).send("ID manquant")

  // Récupère le bien depuis Supabase
  const { data: bien, error } = await supabase.from("biens").select("*").eq("id", id).single()
  if (error || !bien) return res.status(404).send("Bien introuvable")

  // HTML de la fiche
  const html = `
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Fiche Bien</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #e67e22; }
        p { margin: 5px 0; }
        .label { font-weight: bold; color: #555; }
      </style>
    </head>
    <body>
      <h1>${bien.titre}</h1>
      <p><span class="label">📍 Ville :</span> ${bien.ville}</p>
      <p><span class="label">📏 Surface :</span> ${bien.surface_m2} m²</p>
      <p><span class="label">💰 Prix :</span> ${bien.prix.toLocaleString()} €</p>
      <p><span class="label">🔋 DPE :</span> ${bien.dpe}</p>
      <p><span class="label">💼 Honoraires :</span> ${bien.honoraires?.toLocaleString() || 0} €</p>
      <p><span class="label">📅 Disponibilité :</span> ${bien.disponible ? "Disponible" : "Indisponible"}</p>
      <p><span class="label">📦 Statut :</span> ${
        bien.vendu ? "Vendu" : bien.sous_compromis ? "Sous compromis" : "En vente"
      }</p>
      <hr />
      <h3>Description</h3>
      <p>${bien.description}</p>
    </body>
    </html>
  `

  // Génération PDF
  pdf.create(html).toBuffer((err, buffer) => {
    if (err) return res.status(500).send("Erreur PDF")

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `inline; filename="fiche-${bien.id}.pdf"`)
    res.send(buffer)
  })
}
