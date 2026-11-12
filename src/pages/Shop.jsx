import { useMemo, useState, useEffect } from 'react'
import { useShop } from '../store/ShopContext'
import { CATEGORIES, REGIONS } from '../data/products'
import { ProductCard, Icon, Empty, categoryName } from '../components/ui'

const SORTS = {
  popular: { label: 'პოპულარობით', fn: (a, b) => b.rating - a.rating },
  cheap: { label: 'ფასი: იაფიდან', fn: (a, b) => a.price - b.price },
  expensive: { label: 'ფასი: ძვირიდან', fn: (a, b) => b.price - a.price },
  name: { label: 'სახელით', fn: (a, b) => a.name.localeCompare(b.name, 'ka') },
}

export default function Shop({ initialCategory }) {
  const { state } = useShop()
  const maxPrice = Math.max(...state.products.map((p) => p.price))

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory || 'all')
  const [region, setRegion] = useState('all')
  const [priceTo, setPriceTo] = useState(maxPrice)
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState('popular')

  // როცა მენიუდან სხვა კატეგორიას ირჩევენ
  useEffect(() => setCategory(initialCategory || 'all'), [initialCategory])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.products
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => region === 'all' || p.region === region)
      .filter((p) => p.price <= priceTo)
      .filter((p) => !inStock || p.stock > 0)
      .filter((p) => !q || [p.name, p.artisan, p.technique, p.description, p.region, categoryName(p.category)].join(' ').toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [state.products, query, category, region, priceTo, inStock, sort])

  const reset = () => {
    setQuery('')
    setCategory('all')
    setRegion('all')
    setPriceTo(maxPrice)
    setInStock(false)
  }

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>კატალოგი</h1>
        <p className="muted">{state.products.length} ნივთი {CATEGORIES.length} ხელობიდან</p>
      </div>

      <div className="shop-layout">
        <aside className="filters" aria-label="ფილტრები">
          <div className="search">
            <Icon name="search" size={18} />
            <input
              id="search"
              type="search"
              placeholder="ძებნა: ნივთი, ხელოსანი, მასალა"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="ძებნა"
            />
          </div>

          <fieldset>
            <legend>ხელობა</legend>
            <div className="chips">
              <button className={`chip ${category === 'all' ? 'is-on' : ''}`} onClick={() => setCategory('all')}>ყველა</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} className={`chip ${category === c.id ? 'is-on' : ''}`} onClick={() => setCategory(c.id)} aria-pressed={category === c.id}>
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend><label htmlFor="region">რეგიონი</label></legend>
            <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">ყველა რეგიონი</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </fieldset>

          <fieldset>
            <legend><label htmlFor="price">ფასი {priceTo} ₾-მდე</label></legend>
            <input id="price" type="range" min="30" max={maxPrice} step="5" value={priceTo} onChange={(e) => setPriceTo(Number(e.target.value))} />
          </fieldset>

          <label className="check">
            <input id="instock" type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            მხოლოდ მარაგში არსებული
          </label>

          <button className="btn btn-ghost btn-small" onClick={reset}>ფილტრების გასუფთავება</button>
        </aside>

        <section aria-live="polite">
          <div className="results-bar">
            <span>ნაპოვნია {results.length}</span>
            <label className="sort">
              <span>დალაგება</span>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
              </select>
            </label>
          </div>
          {results.length ? (
            <div className="grid">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <Empty
              title="ამ ფილტრებით ნივთი ვერ მოიძებნა"
              text="შეცვალეთ საძიებო სიტყვა ან გაზარდეთ ფასის ზღვარი."
              action={<button className="btn" onClick={reset}>ფილტრების გასუფთავება</button>}
            />
          )}
        </section>
      </div>
    </div>
  )
}
