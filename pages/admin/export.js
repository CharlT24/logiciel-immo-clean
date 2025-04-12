import Link from "next/link"
import { useState } from "react"

export default function ExportAdmin() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const lancerExportManuel = async () => {
    setLoading(true)
    setStatus("")

    const res = await fetch("/api/export/cron")
    const json = await res.json()

    setLoading(false)
    setStatus(`✅ Export manuel effectué : ${json.count} biens envoyés.`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🔄 Gestion des exports</h1>

      <ul className="space-y-4">
        <li>
          <Link href="/export" className="text-blue-600 hover:underline">
            📦 Export des biens vers portails
          </Link>
        </li>
        <li>
          <Link href="/export/reporting" className="text-blue-600 hover:underline">
            📊 Reporting des exportations
          </Link>
        </li>
        <li>
          <Link href="/admin/parametres" className="text-blue-600 hover:underline">
            ⚙️ Paramètres des portails et SMTP
          </Link>
        </li>
      </ul>

      <div className="pt-6 border-t mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">🛠 Export manuel immédiat</h2>
        <button
          onClick={lancerExportManuel}
          disabled={loading}
          className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "⏳ Export en cours..." : "🚀 Lancer l’export maintenant"}
        </button>
        {status && <p className="text-green-600 mt-2">{status}</p>}
      </div>
    </div>
  )
}
