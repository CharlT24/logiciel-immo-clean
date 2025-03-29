import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Layout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const pagesSansSidebar = ["/login", "/register"]

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data: userData } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userData?.role === "admin") {
          setIsAdmin(true)
        }
      }
    }
    fetchUser()
  }, [])

  // Cacher tout le layout sur certaines pages
  if (pagesSansSidebar.includes(router.pathname)) {
    return <main>{children}</main>
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">

      {/* TOPBAR */}
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={36} height={36} />
          <h1 className="text-xl font-bold text-orange-600 tracking-tight">Open Immobilier</h1>
        </div>

        {/* Compte connecté + actions */}
        <div className="text-sm text-gray-600 flex flex-col items-end">
          <span>👤 Compte connecté</span>
          {isAdmin && (
            <Link href="/admin/utilisateurs" className="text-orange-600 hover:underline text-xs">⚙️ Accès admin</Link>
          )}
          <button
            onClick={handleLogout}
            className="text-orange-500 text-xs hover:underline mt-1"
          >
            🔓 Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r shadow-md p-5 hidden md:flex flex-col space-y-6">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
            <NavItem href="/dashboard" icon="🏠" label="Tableau de bord" />
            <NavItem href="/biens" icon="🏡" label="Biens" />
            <NavItem href="/clients" icon="👥" label="Clients" />
            <NavItem href="/reseau" icon="🌐" label="Mon réseau" />
            <NavItem href="/rapprochements" icon="🔍" label="Rapprochements" />
            <NavItem href="/statistiques" icon="📊" label="Statistiques" />
            <NavItem href="/parametres" icon="⚙️" label="Paramètres" />
          </nav>
        </aside>

        {/* CONTENU CENTRAL */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>

        {/* ACTIONS RAPIDES */}
        <aside className="w-80 bg-orange-50 border-l hidden xl:flex flex-col p-6 space-y-4 shadow-inner">
          <h2 className="font-semibold text-orange-700 text-sm mb-2">⚡ Actions rapides</h2>
          <QuickLink href="/biens/ajouter" text="➕ Ajouter un bien" />
          <QuickLink href="/clients/ajouter" text="👤 Nouveau client" />
          <QuickLink href="/agenda" text="📅 Accéder à l'agenda" />
          <QuickLink href="/reseau" text="🌐 Voir les agents" />
          <QuickLink href="/statistiques" text="📊 Voir les stats" />
        </aside>
      </div>
    </div>
  )
}

function NavItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-orange-100 hover:text-orange-700 transition"
    >
      <span>{icon}</span> <span>{label}</span>
    </Link>
  )
}

function QuickLink({ href, text }) {
  return (
    <Link
      href={href}
      className="text-sm text-orange-700 hover:underline transition"
    >
      {text}
    </Link>
  )
}
