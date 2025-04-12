// pages/api/export/cron.js
import { supabase } from "@/lib/supabaseClient"
import { generateXML } from "@/utils/xmlGenerator"
import { getSettings } from "@/utils/getSettings"
import nodemailer from "nodemailer"

export default async function handler(req, res) {
  const settings = await getSettings()
  const { data: biens } = await supabase.from("biens").select("*")

  const portails = Object.keys(settings)
    .filter(k => k.startsWith("portail_") && settings[k] === "1")
    .map(k => k.replace("portail_", ""))

  const biensExportables = biens.filter(b => {
    const exp = b.exports || {}
    return portails.some(p => exp[p])
  })

  const xml = generateXML(biensExportables)

  const transporter = nodemailer.createTransport({
    host: settings.smtp_host,
    port: Number(settings.smtp_port),
    secure: settings.smtp_secure === "true",
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass
    }
  })

  await transporter.sendMail({
    from: settings.smtp_user,
    to: settings.smtp_user, // ou vers un email des portails
    subject: "Export XML automatique",
    text: "Veuillez trouver le fichier XML généré automatiquement.",
    attachments: [
      {
        filename: "export-auto.xml",
        content: xml,
        contentType: "application/xml"
      }
    ]
  })

  await supabase.from("export_logs").insert({
    portail: "automatique",
    nb_biens: biensExportables.length
  })

  res.status(200).json({ message: "Export automatique effectué ✅", count: biensExportables.length })
}
