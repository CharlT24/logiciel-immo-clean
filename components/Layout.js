import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function Layout({ children }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Gestion du montage client

  const pagesSansSidebar = ["/login", "/register"];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data: userData } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", userId)
          .single();

        if (userData?.role === "admin") {
          setIsAdmin(true);
        }
      }
    };

    fetchUser();
    setIsMounted(true); // Marquer comme monté côté client
  }, []);

  // Ne pas afficher la sidebar sur les pages login/register
  if (pagesSansSidebar.includes(router.pathname)) {
    return <main>{children}</main>;
  }

  // Afficher "Loading..." jusqu'à ce que le composant soit monté côté client
  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-white text-gray-800 font-inter">
      <aside className="w-64 bg-white p-6 shadow-xl rounded-tr-3xl rounded-br-3xl border-r border-gray-200 space-y-4 transition-all">
        {/* Logo */}
        <div
          className="flex items-center justify-start cursor-pointer mb-6"
          onClick={() => router.push("/dashboard")}
        >
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2" />
          <span className="text-xl font-extrabold text-orange-500 tracking-tight">Mon Agence</span>
        </div>

        {/* Navigation principale */}
        <button onClick={() => router.push("/dashboard")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">📊 Tableau de bord</button>
        <button onClick={() => router.push("/clients")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">👥 Clients</button>
        <button onClick={() => router.push("/biens")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">🏡 Biens</button>

        {/* Ajouter le lien immopro avec vérification de la page actuelle */}
        <button
          onClick={() => {
            // Vérifie si l'utilisateur est déjà sur la page "/immopro"
            if (router.pathname !== "/immopro") {
              router.push("/immopro");
            } else {
              router.replace("/immopro"); // Remplacer la page sans redirection hard
            }
          }}
          className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition"
        >
          🏢 immopro
        </button>

        {/* Autres liens de navigation */}
        <button
          onClick={() => router.push("/agents")}
          className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition"
        >
          🧑‍💼 Agents
        </button>

        <button onClick={() => router.push("/export")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">📤 Export</button>
        <button onClick={() => router.push("/agenda")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">📅 Agenda</button>
        <button onClick={() => window.open("https://www.a2sformation.com", "_blank")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">🎓 Formation</button>
        <button onClick={() => router.push("/parametres")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">⚙️ Paramètres</button>

        {/* Admin only */}
        {isAdmin && (
          <>
            <button onClick={() => router.push("/crypto")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">₿ Crypto</button>
            <button onClick={() => router.push("/admin")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">⚙️ Admin</button>
          </>
        )}

        {/* Déconnexion */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/login")
            }}
            className="block w-full text-left py-2 px-3 rounded text-red-600 hover:bg-red-100 transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-white rounded-tl-3xl shadow-inner overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
