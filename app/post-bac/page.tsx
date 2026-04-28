import ParcoursNav from '@/components/ParcoursNav'
import ParcoursSection from '@/components/ParcoursSection'
import { parcoursList } from '@/lib/parcours'

export default function PostBacPage() {
  const parcours = parcoursList.find((p) => p.id === 'post-bac')!
  return (
    <>
      <ParcoursNav />
      <main>
        <ParcoursSection parcours={parcours} />
      </main>
    </>
  )
}
