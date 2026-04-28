import ParcoursNav from '@/components/ParcoursNav'
import ParcoursSection from '@/components/ParcoursSection'
import { parcoursList } from '@/lib/parcours'

export default function PrepaPage() {
  const parcours = parcoursList.find((p) => p.id === 'prepa')!
  return (
    <>
      <ParcoursNav />
      <main>
        <ParcoursSection parcours={parcours} />
      </main>
    </>
  )
}
