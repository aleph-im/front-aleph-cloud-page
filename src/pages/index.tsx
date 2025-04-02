import { useSPARedirect } from '@/hooks/common/useSPARedirect'

export default function HomePage() {
  useSPARedirect('/console')
  return null
}
