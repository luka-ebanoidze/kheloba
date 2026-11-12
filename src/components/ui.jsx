import { useShop } from '../store/ShopContext'
import { CATEGORIES } from '../data/products'
import { gel } from '../utils/format'
import ProductArt from './ProductArt'

const PATHS = {
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  bag: 'M5 8h14l-1 12H6L5 8zm4 0V6a3 3 0 0 1 6 0v2',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12l5 5 9-10',
  search: 'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm5-2l4 4',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13',
  minus: 'M6 12h12',
  plus: 'M12 6v12M6 12h12',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  hand: 'M8 13V6a1.5 1.5 0 0 1 3 0v5m0-6a1.5 1.5 0 0 1 3 0v6m0-5a1.5 1.5 0 0 1 3 0v8c0 3-2 6-6 6s-6-3-7-5l-2-4a1.5 1.5 0 0 1 2.6-1.4L8 13',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0m5 0c2-4 6-3 5 0',
  back: 'M15 6l-6 6 6 6',
}

export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

export function Stars({ value, size = 14 }) {
  return (
    <span className="stars" aria-label={`შეფასება ${value} 5-დან`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.8l2.5 5.3 5.7.7-4.2 3.9 1.1 5.7L10 14.6l-5.1 2.8 1.1-5.7L1.8 7.8l5.7-.7z"
            fill={i <= Math.round(value) ? 'var(--gold)' : 'var(--line)'}
          />
        </svg>
      ))}
    </span>
  )
}

export function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <span className="field-error" id={`${id}-err`} role="alert">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  )
}

export function QtyInput({ value, max, onChange, id }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="რაოდენობის შემცირება">
        <Icon name="minus" size={16} />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min="1"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 1)}
        aria-label="რაოდენობა"
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="რაოდენობის გაზრდა">
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}

export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name || id

export function ProductCard({ product }) {
  const { state, dispatch, notify } = useShop()
  const liked = state.wishlist.includes(product.id)
  const soldOut = product.stock === 0

  return (
    <article className="card">
      <a href={`#product-${product.id}`} className="card-media">
        <ProductArt product={product} />
        {soldOut && <span className="tag tag-out">არ არის მარაგში</span>}
        {!soldOut && product.stock <= 3 && <span className="tag">დარჩა {product.stock}</span>}
      </a>
      <button
        className={`like ${liked ? 'is-on' : ''}`}
        aria-pressed={liked}
        aria-label={liked ? 'სურვილებიდან ამოღება' : 'სურვილებში დამატება'}
        onClick={() => {
          dispatch({ type: 'wishlist/toggle', id: product.id })
          notify(liked ? 'ამოღებულია სურვილებიდან' : 'დამატებულია სურვილებში')
        }}
      >
        <Icon name="heart" size={18} />
      </button>
      <div className="card-body">
        <span className="card-meta">{categoryName(product.category)}, {product.region}</span>
        <h3><a href={`#product-${product.id}`}>{product.name}</a></h3>
        <div className="card-foot">
          <span className="price">{gel(product.price)}</span>
          <button
            className="btn btn-small"
            disabled={soldOut}
            onClick={() => {
              if (product.sizes) {
                window.location.hash = `product-${product.id}`
                return
              }
              dispatch({ type: 'cart/add', id: product.id })
              notify('დამატებულია კალათაში')
            }}
          >
            {product.sizes ? 'აირჩიეთ ზომა' : 'კალათაში'}
          </button>
        </div>
      </div>
    </article>
  )
}

export function Empty({ title, text, action }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      {action}
    </div>
  )
}
