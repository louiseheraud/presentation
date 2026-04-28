import ParcoursNav from '@/components/ParcoursNav'
import ParcoursSection from '@/components/ParcoursSection'
import { parcoursList } from '@/lib/parcours'

export default function AstPage() {
  const parcours = parcoursList.find((p) => p.id === 'ast')!
  return (
    <>
      <ParcoursNav />
      <main>
        <ParcoursSection parcours={parcours} />
      </main>
    </>
  )
}
