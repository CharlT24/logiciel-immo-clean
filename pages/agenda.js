import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Agenda() {
  const sessionHook = useSession()
  const session = sessionHook?.data
  const [vacation, setVacation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session?.accessToken) {
      fetchVacationSettings()
    }
  }, [session])

  const fetchVacationSettings = async () => {
    try {
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })

      if (!res.ok) throw new Error("Erreur API Gmail")

      const data = await res.json()
      setVacation(data)
    } catch (err) {
      console.error("❌", err)
      setError("Erreur lors de la récupération des paramètres Gmail.")
    }
  }

  const handleOutlookLogin = () => {
    alert("🔧 Connexion Outlook à intégrer (Microsoft Graph API)")
  }

  if (sessionHook.status === "loading") {
    return (
      <div className="text-center mt-20 text-gray-500 text-sm">
        ⏳ Chargement de la session...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📅 Mon Agenda / Gmail</h1>

      {!session && (
        <div className="space-y-4">
          <p className="text-gray-600">Connecte-toi pour synchroniser ton agenda</p>

          <button
            onClick={() => signIn("google")}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 block"
          >🔐 Connexion Google</button>

          <button
            onClick={handleOutlookLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 block"
          >🔷 Connexion Outlook</button>
        </div>
      )}

      {session && (
        <div className="space-y-4">
          <p className="text-gray-600">Connecté en tant que : <strong>{session.user.email}</strong></p>
          <button
            onClick={() => signOut()}
            className="text-red-600 text-sm hover:underline"
          >🚪 Se déconnecter</button>

          <hr />

          <h2 className="text-lg font-semibold">🛎️ Réponse automatique Gmail</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {vacation ? (
            <div className="bg-orange-50 p-4 rounded space-y-2 text-sm">
              <p><strong>Activée :</strong> {vacation.enable ? "Oui" : "Non"}</p>
              <p><strong>Objet :</strong> {vacation.subject || "-"}</p>
              <p><strong>Message :</strong> {vacation.responseBodyPlainText || "-"}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chargement des données Gmail...</p>
          )}
        </div>
      )}
    </div>
  )
}
