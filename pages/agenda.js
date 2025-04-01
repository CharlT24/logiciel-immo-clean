import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Agenda() {
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if redirected back from OAuth
    const url = new URL(window.location.href)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    if (code && state) {
      setConnected(true)
      setProvider(state)
      // Tu pourras ici appeler ton backend pour échanger le code contre un token
    }
  }, [])

  const connectGoogle = () => {
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirect_uri = process.env.NEXT_PUBLIC_BASE_URL + "/agenda"
    const scope = "https://www.googleapis.com/auth/calendar.readonly"
    const auth_url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=offline&prompt=consent&state=google`
    window.location.href = auth_url
  }

  const connectOutlook = () => {
    const client_id = process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID
    const redirect_uri = process.env.NEXT_PUBLIC_BASE_URL + "/agenda"
    const scope = "Calendars.Read"
    const auth_url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&response_mode=query&scope=${scope}&state=outlook`
    window.location.href = auth_url
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📅 Agenda connecté</h1>

      {!connected && (
        <div className="space-y-4">
          <button onClick={connectGoogle} className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 transition w-full">
            🔗 Se connecter avec Google
          </button>
          <button onClick={connectOutlook} className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition w-full">
            🔗 Se connecter avec Outlook
          </button>
        </div>
      )}

      {connected && (
        <div className="mt-6">
          <p className="text-green-600 font-semibold text-lg">
            ✅ Connecté avec {provider === "google" ? "Google Calendar" : "Outlook"} !
          </p>
          <p className="text-gray-600 mt-2">Les événements seront affichés ici prochainement.</p>
        </div>
      )}
    </div>
  )
}
