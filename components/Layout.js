import Link from "next/link"
import Image from "next/image"

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 fixed top-0 left-0 bottom-0 z-40 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <Link href="/dashboard" className="block mb-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col space-y-4 text-sm">
            <Link href="/dashboard" className="hover:text-orange-600">🏠 Tableau de bord</Link>
            <Link href="/clients" className="hover:text-orange-600">👥 Clients</Link>
            <Link href="/biens" className="hover:text-orange-600">🏡 Biens</Link>
            <Link href="/rapprochements" className="hover:text-orange-600">🔍 Rapprochements</Link>
            <Link href="/reseau" className="hover:text-orange-600">🧑‍🤝‍🧑 Mon Réseau</Link>
            <Link href="/partenaires" className="hover:text-orange-600">🤝 Nos Partenaires</Link>
            <Link href="/statistiques" className="hover:text-orange-600">📊 Statistiques</Link>
            <Link href="/parametres" className="hover:text-orange-600">⚙️ Paramètres</Link>
          </nav>
        </div>

        {/* Footer optionnel */}
        <div className="text-xs text-gray-400 mt-10">
          &copy; {new Date().getFullYear()} OpenImmobilier
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}
