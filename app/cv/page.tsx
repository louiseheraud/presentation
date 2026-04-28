import ServicePage from '@/components/ServicePage'
import { services } from '@/lib/services'

export default function CVPage() {
  return <ServicePage service={services.cv} />
}
