import { ChangeEvent, useCallback, useId, useState } from 'react'

export type DomainProp = {
  id: string
  name: string
}

export const defaultDomain: DomainProp = {
  id: `domain-0`,
  name: '',
}

export type UseDomainItemProps = {
  domain: DomainProp
  onChange: (domains: DomainProp) => void
  onRemove: (domainId: string) => void
}

export type UseDomainItemReturn = {
  id: string
  domain: DomainProp
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove: () => void
}

export function useDomainItem({
  domain,
  onChange,
  onRemove,
}: UseDomainItemProps): UseDomainItemReturn {
  const id = useId()

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const newDomain: DomainProp = { ...domain, name }
      onChange(newDomain)
    },
    [onChange, domain],
  )

  const handleRemove = useCallback(() => {
    onRemove(domain.id)
  }, [domain.id, onRemove])

  return {
    id,
    domain,
    handleNameChange,
    handleRemove,
  }
}

// --------------------

export type UseDomainsProps = {
  domains?: DomainProp[]
  onChange: (domains: DomainProp[]) => void
}

export type UseDomainsReturn = {
  domains: DomainProp[]
  handleChange: (domains: DomainProp) => void
  handleAdd: () => void
  handleRemove: (domainId: string) => void
}

export function useAddDomains({
  domains: domainsProp,
  onChange,
}: UseDomainsProps): UseDomainsReturn {
  const [domainsState, setDomainsState] = useState<DomainProp[]>([])
  const domains = domainsProp || domainsState

  const handleChange = useCallback(
    (domain: DomainProp) => {
      const updatedDomains = [...domains]
      const index = domains.findIndex((domain) => domain.id === domain.id)

      if (index !== -1) {
        updatedDomains[index] = domain
      } else {
        updatedDomains.push(domain)
      }

      setDomainsState(updatedDomains)
      onChange(updatedDomains)
    },
    [onChange, domains],
  )

  const handleAdd = useCallback(() => {
    const newDomain = {
      ...defaultDomain,
      id: `domain-${Date.now()}`,
    }

    const updatedDomains = [...domains, newDomain]

    setDomainsState(updatedDomains)
    onChange(updatedDomains)
  }, [onChange, domains])

  const handleRemove = useCallback(
    (domainId: string) => {
      const updatedDomains = domains.filter((domain) => domain.id !== domainId)

      setDomainsState(updatedDomains)
      onChange(updatedDomains)
    },
    [onChange, domains],
  )

  return {
    domains,
    handleChange,
    handleAdd,
    handleRemove,
  }
}
