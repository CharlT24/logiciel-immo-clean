// components/Layout.js
import Link from "next/link"
import Image from "next/image"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">

      {/* TOPBAR */}
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={36} height={36} />
          <h1 className="text-xl font-bold text-orange-600 tracking-tight">Open Immobilier</h1>
        </div>
        <div className="text-sm text-gray-600">👤 Compte connecté</div>
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
            <NavItem href="/mentions-legales" icon="📜" label="Mentions légales" />
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
