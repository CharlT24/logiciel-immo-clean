// pages/admin/export.tsx
import { useEffect, useState } from "react"

export default function ExportAdmin() {
  const [biens, setBiens] = useState([])
  const [portail, setPortail] = useState("leboncoin")
  const [portails, setPortails] = useState([
    "leboncoin",
    "seloger",
    "bienici",
    "figaro",
    "fnaim",
    "greenacres",
    "wordpress"
  ])
  const [xmlPreview, setXmlPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [newPortail, setNewPortail] = useState("")
  const [credentials, setCredentials] = useState({})

  useEffect(() => {
    fetch("/api/biens/exportables")
      .then(res => res.json())
      .then(data => setBiens(data.biens || []))
  }, [])

  const handleExport = async () => {
    setLoading(true)
    setStatus("")
    try {
      const res = await fetch(`/api/export/${portail}`)
      const text = await res.text()
      setXmlPreview(text)
    } catch (e) {
      setXmlPreview("Erreur lors de la génération du XML.")
    }
    setLoading(false)
  }

  const handleMultiExport = async () => {
    setLoading(true)
    setStatus("")
    let success = 0
    for (const p of portails) {
      try {
        const res = await fetch(`/api/export/${p}`)
        if (res.ok) success++
      } catch (err) {
        console.error(`❌ Erreur export ${p}:`, err)
      }
    }
    setStatus(`✅ ${success} exports générés sur ${portails.length}`)
    setLoading(false)
  }

  const ajouterPortail = () => {
    if (!newPortail) return
    setPortails([...portails, newPortail])
    setNewPortail("")
  }

  const handleCredentialsChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🔄 Export vers portails</h1>

      <div className="flex gap-4 items-center">
        <label className="font-medium">Portail :</label>
        <select value={portail} onChange={e => setPortail(e.target.value)} className="border px-3 py-2 rounded">
          {portails.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={handleExport}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Générer XML
        </button>
        <button
          onClick={handleMultiExport}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Exporter tous
        </button>
      </div>

      <div className="flex gap-4 mt-4 items-end">
        <div>
          <label className="block text-sm font-medium">Ajouter un portail :</label>
          <input
            value={newPortail}
            onChange={(e) => setNewPortail(e.target.value)}
            className="border px-3 py-2 rounded w-48"
            placeholder="nom-du-portail"
          />
        </div>
        <button onClick={ajouterPortail} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Ajouter
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">🔐 Coordonnées du portail sélectionné</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="URL/API Endpoint"
            className="input"
            onChange={e => handleCredentialsChange("url", e.target.value)}
          />
          <input
            placeholder="Utilisateur (si FTP/API)"
            className="input"
            onChange={e => handleCredentialsChange("username", e.target.value)}
          />
          <input
            placeholder="Mot de passe ou token"
            className="input"
            onChange={e => handleCredentialsChange("password", e.target.value)}
          />
          <input
            placeholder="Répertoire ou config spécifique"
            className="input"
            onChange={e => handleCredentialsChange("destination", e.target.value)}
          />
        </div>
      </div>

      {status && <p className="text-green-700 font-medium mt-4">{status}</p>}

      <div className="bg-orange-50 p-4 rounded border text-sm">
        <strong>Biens exportables : {biens.length}</strong>
        <ul className="list-disc ml-6">
          {biens.map((b: any) => (
            <li key={b.id}>{b.titre} ({b.ville})</li>
          ))}
        </ul>
      </div>

      {xmlPreview && (
        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">🧾 Aperçu XML :</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-[400px]">
            {xmlPreview}
          </pre>
        </div>
      )}
    </div>
  )
}
