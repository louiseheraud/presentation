import ParcoursNav from '@/components/ParcoursNav'
import ParcoursSection from '@/components/ParcoursSection'
import { parcoursList } from '@/lib/parcours'

export default function Home() {
  return (
    <>
      <ParcoursNav />
      <main>
        {parcoursList.map((parcours) => (
          <ParcoursSection key={parcours.id} parcours={parcours} />
        ))}
      </main>
    </>
  )
}
