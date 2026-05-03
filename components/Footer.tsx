import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-5xl mx-auto px-8 py-12 grid md:grid-cols-3 gap-10">

        {/* Logo + phrase */}
        <div>
          <div className="font-black text-xl tracking-tight text-gray-900 mb-3">
            Cap<span className="text-indigo-500">Oral</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Coaching individuel pour réussir vos dossiers et oraux des grandes écoles.
          </p>
        </div>

        {/* Liens */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Navigation</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { label: 'Accueil', href: '/' },
              { label: 'Post bac', href: '/post-bac' },
              { label: 'Prépa', href: '/prepa' },
              { label: 'AST', href: '/ast' },
              { label: 'À propos', href: '/a-propos' },
              { label: 'Réserver une séance', href: 'https://calendly.com/louiseh217' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-sm text-gray-500 hover:text-indigo-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact</p>
          <a
            href="mailto:caporalcoaching@gmail.com"
            className="text-sm text-gray-500 hover:text-indigo-500 transition-colors"
          >
            caporalcoaching@gmail.com
          </a>
        </div>

      </div>

      {/* Mentions légales */}
      <div className="border-t border-gray-100 py-4 px-8 flex flex-wrap justify-between items-center gap-2">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} CapOral — Tous droits réservés</p>
        <Link href="/mentions-legales" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Mentions légales
        </Link>
      </div>
    </footer>
  )
}
