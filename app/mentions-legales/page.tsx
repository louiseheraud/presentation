import Link from 'next/link'
import ParcoursNav from '@/components/ParcoursNav'

export default function MentionsLegalesPage() {
  return (
    <>
      <ParcoursNav />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Mentions légales</h1>

        <div className="flex flex-col gap-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-gray-900 mb-2">Éditeur du site</h2>
            <p>CapOral — Louise Heraud</p>
            <p>Auto-entrepreneur</p>
            <p>Contact : <a href="mailto:louiseh217@gmail.com" className="text-indigo-500 hover:underline">louiseh217@gmail.com</a></p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">Hébergement</h2>
            <p>Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images) est la propriété exclusive de CapOral. Toute reproduction est interdite sans autorisation préalable.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">Données personnelles</h2>
            <p>Les données collectées (email, mot de passe) sont utilisées uniquement pour accéder à votre espace personnel. Elles ne sont pas transmises à des tiers. Conformément au RGPD, vous pouvez demander la suppression de votre compte à tout moment en écrivant à <a href="mailto:louiseh217@gmail.com" className="text-indigo-500 hover:underline">louiseh217@gmail.com</a>.</p>
          </section>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-indigo-500 hover:underline">← Retour à l'accueil</Link>
        </div>
      </main>
    </>
  )
}
