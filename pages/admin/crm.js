import { useState } from "react"

export default function AdminCRM() {
  const [propertyTypes, setPropertyTypes] = useState(["Appartement", "Maison", "Terrain"])
  const [newType, setNewType] = useState("")
  const [agencyName, setAgencyName] = useState("Mon Agence")
  const [mainColor, setMainColor] = useState("#f97316") // orange
  const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue sur votre espace professionnel.")
  const [exports, setExports] = useState({
    seloger: true,
    leboncoin: false,
    bienici: true,
  })

  const handleAddType = () => {
    if (newType && !propertyTypes.includes(newType)) {
      setPropertyTypes([...propertyTypes, newType])
      setNewType("")
    }
  }

  const handleDeleteType = (type) => {
    setPropertyTypes(propertyTypes.filter(t => t !== type))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">🛠️ Personnalisation CRM</h1>

      {/* Nom agence */}
      <div>
        <label className="block font-medium mb-1">🏢 Nom de l’agence</label>
        <input
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Message accueil */}
      <div>
        <label className="block font-medium mb-1">💬 Message d’accueil</label>
        <textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Couleur principale */}
      <div>
        <label className="block font-medium mb-1">🎨 Couleur principale</label>
        <input
          type="color"
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
          className="h-10 w-24 border rounded"
        />
      </div>

      {/* Types de biens */}
      <div>
        <label className="block font-medium mb-2">🏷️ Types de biens</label>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Ajouter un type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button onClick={handleAddType} className="bg-orange-500 text-white px-4 rounded hover:bg-orange-600">Ajouter</button>
        </div>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          {propertyTypes.map((type, idx) => (
            <li key={idx} className="flex justify-between items-center">
              {type}
              <button onClick={() => handleDeleteType(type)} className="text-red-500 hover:underline text-xs">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Plateformes export */}
      <div>
        <label className="block font-medium mb-2">🌍 Plateformes d’export</label>
        <div className="space-y-1">
          {Object.keys(exports).map((platform) => (
            <label key={platform} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exports[platform]}
                onChange={() => setExports(prev => ({ ...prev, [platform]: !prev[platform] }))}
              />
              <span>{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          💾 Enregistrer les modifications
        </button>
      </div>
    </div>
  )
}
