import "../styles/globals.css"
import { useState } from "react"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider as SupabaseProvider } from "@supabase/auth-helpers-react"
import { SessionProvider as AuthProvider } from "next-auth/react"
import Layout from "@/components/Layout"

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <AuthProvider session={pageProps.session}>
      <SupabaseProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SupabaseProvider>
    </AuthProvider>
  )
}
