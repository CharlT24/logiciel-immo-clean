import "../styles/globals.css"
import { useState } from "react"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      {/* ✅ Logo cliquable + taille réduite */}
      <div className="absolute top-4 right-4 z-50">
        <a href="https://www.openimmobilier.immo" target="_blank" rel="noopener noreferrer">
          <img
            src="/logo.png"
            alt="Logo Open Immobilier"
            className="h-1 w-auto drop-shadow-md bg-white p-1 rounded-md"
          />
        </a>
      </div>

      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
