// components/Layout.js
import Link from "next/link"
import Image from "next/image"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TOPBAR */}
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-orange-600">Open Immobilier</h1>
        </div>
        <div className="text-sm text-gray-600">Bienvenue 👋</div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR GAUCHE */}
        <aside className="w-64 bg-gray-50 border-r p-5 hidden md:block">
          <nav className="flex flex-col space-y-4 text-sm">
            <Link href="/dashboard" className="hover:text-orange-600">🏠 Tableau de bord</Link>
            <Link href="/biens" className="hover:text-orange-600">🏡 Biens</Link>
            <Link href="/clients" className="hover:text-orange-600">👥 Clients</Link>
            <Link href="/reseau" className="hover:text-orange-600">🌐 Mon réseau</Link>
            <Link href="/rapprochements" className="hover:text-orange-600">🔍 Rapprochements</Link>
            <Link href="/statistiques" className="hover:text-orange-600">📊 Statistiques</Link>
            <Link href="/parametres" className="hover:text-orange-600">⚙️ Paramètres</Link>
          </nav>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>

        {/* ACTIONS RAPIDES */}
        <aside className="w-72 bg-white border-l p-5 hidden xl:block">
          <h2 className="font-semibold text-gray-700 mb-4">⚡ Actions rapides</h2>
          <div className="flex flex-col space-y-3 text-sm">
            <Link href="/biens/ajouter" className="text-blue-600 hover:underline">➕ Ajouter un bien</Link>
            <Link href="/clients/ajouter" className="text-blue-600 hover:underline">👤 Nouveau client</Link>
            <Link href="/agenda" className="text-blue-600 hover:underline">🗓️ Accéder à l'agenda</Link>
            <Link href="/reseau" className="text-blue-600 hover:underline">🌐 Voir les agents</Link>
            <Link href="/statistiques" className="text-blue-600 hover:underline">📊 Voir les stats</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
