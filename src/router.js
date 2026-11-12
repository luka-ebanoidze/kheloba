import { useEffect, useState } from 'react'

// მარტივი hash-როუტერი: #shop, #product-4, #shop-ceramics ...
// ასე საიტი ნებისმიერ სტატიკურ ჰოსტინგზე მუშაობს სერვერის კონფიგურაციის გარეშე.

function parse(hash) {
  const raw = hash.replace(/^#/, '') || 'home'
  const [page, ...rest] = raw.split('-')
  return { page, param: rest.join('-') || null, raw }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function go(path) {
  window.location.hash = path
}
