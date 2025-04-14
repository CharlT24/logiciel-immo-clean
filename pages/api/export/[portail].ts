// pages/api/export/[portail].ts
import { generateXML } from "@/lib/exports/generateXML"
import { supabase } from "@/lib/supabaseClient"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { portail } = req.query

  if (!portail || typeof portail !== "string") {
    return res.status(400).json({ error: "Paramètre portail manquant." })
  }

  try {
    const { data: biens, error } = await supabase
    .from("biens")
    .select("*")
  //   .eq("publie", true)
  //   .not("statut", "eq", "Archivé")
  

    console.log("📦 biens:", biens)
    console.log("❌ error:", error)

    if (error || !biens) {
      return res.status(500).json({ error: "Erreur récupération biens." })
    }

    try {
      console.log("👀 Appel generateXML avec :", portail, "— nb biens:", biens.length)
      const xml = generateXML(portail, biens)

      // 📝 Log export
      await supabase.from("export_logs").insert({
        portail,
        nb_biens: biens.length,
        user_email: req.headers["x-user-email"] || "admin"
      })

      res.setHeader("Content-Type", "application/xml")
      res.setHeader("Content-Disposition", `inline; filename=export-${portail}.xml`)
      res.send(xml)
    } catch (genErr: any) {
      console.error("❌ Erreur génération XML:", genErr.message)
      res.status(500).json({ error: "Erreur génération XML : " + genErr.message })
    }
  } catch (err: any) {
    res.status(500).json({ error: "Erreur export : " + err.message })
  }
}
