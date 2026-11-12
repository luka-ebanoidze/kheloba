import { createContext, useContext, useEffect, useReducer, useCallback, useState } from 'react'
import { PRODUCTS } from '../data/products'

// ─────────────────────────────────────────────────────────────
// მაღაზიის მთლიანი მდგომარეობა (state) ერთ ადგილას.
// მონაცემთა ბაზის იმიტაცია: ყველაფერი ინახება ბრაუზერის
// localStorage-ში, ამიტომ გვერდის განახლების შემდეგაც რჩება.
// ─────────────────────────────────────────────────────────────

// ვერსია შეიცვალა, როცა პროდუქტებს ფოტოები დაემატა — ძველი შენახული მონაცემები აღარ ჩაიტვირთება
const STORAGE_KEY = 'kheloba-state-v2'

export const ORDER_STATUSES = ['მიღებულია', 'მზადდება', 'გაგზავნილია', 'ჩაბარებულია', 'გაუქმებულია']

const initialState = {
  products: PRODUCTS,
  cart: [], // [{ key, id, qty, size }]
  wishlist: [], // [productId]
  orders: [],
  messages: [],
  reviews: {}, // { [productId]: [{ name, stars, text, date }] }
  promo: null,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ბრაუზერმა შენახვა დაბლოკა (მაგ. პრივატული ფანჯარა) — საიტი მაინც მუშაობს
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'cart/add': {
      const { id, qty = 1, size = null } = action
      const product = state.products.find((p) => p.id === id)
      const key = size ? `${id}-${size}` : String(id)
      const existing = state.cart.find((c) => c.key === key)
      const inCart = state.cart.filter((c) => c.id === id).reduce((s, c) => s + c.qty, 0)
      const allowed = Math.max(0, Math.min(qty, product.stock - inCart))
      if (allowed === 0) return state
      const cart = existing
        ? state.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + allowed } : c))
        : [...state.cart, { key, id, qty: allowed, size }]
      return { ...state, cart }
    }
    case 'cart/setQty': {
      const item = state.cart.find((c) => c.key === action.key)
      const product = state.products.find((p) => p.id === item.id)
      const others = state.cart.filter((c) => c.id === item.id && c.key !== item.key).reduce((s, c) => s + c.qty, 0)
      const qty = Math.max(1, Math.min(action.qty, product.stock - others))
      return { ...state, cart: state.cart.map((c) => (c.key === action.key ? { ...c, qty } : c)) }
    }
    case 'cart/remove':
      return { ...state, cart: state.cart.filter((c) => c.key !== action.key) }
    case 'promo/set':
      return { ...state, promo: action.code }
    case 'wishlist/toggle':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((x) => x !== action.id)
          : [...state.wishlist, action.id],
      }
    case 'order/place': {
      // მარაგის შემცირება შეკვეთის შემდეგ
      const products = state.products.map((p) => {
        const sold = action.order.items.filter((i) => i.id === p.id).reduce((s, i) => s + i.qty, 0)
        return sold ? { ...p, stock: Math.max(0, p.stock - sold) } : p
      })
      return { ...state, products, orders: [action.order, ...state.orders], cart: [], promo: null }
    }
    case 'order/status': {
      const order = state.orders.find((o) => o.id === action.id)
      let products = state.products
      // გაუქმებისას მარაგი ბრუნდება
      if (action.status === 'გაუქმებულია' && order.status !== 'გაუქმებულია') {
        products = products.map((p) => {
          const back = order.items.filter((i) => i.id === p.id).reduce((s, i) => s + i.qty, 0)
          return back ? { ...p, stock: p.stock + back } : p
        })
      }
      return {
        ...state,
        products,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: action.status } : o)),
      }
    }
    case 'message/add':
      return { ...state, messages: [action.message, ...state.messages] }
    case 'message/read':
      return { ...state, messages: state.messages.map((m) => (m.id === action.id ? { ...m, read: true } : m)) }
    case 'review/add': {
      const list = state.reviews[action.productId] || []
      return { ...state, reviews: { ...state.reviews, [action.productId]: [action.review, ...list] } }
    }
    case 'product/add':
      return { ...state, products: [...state.products, action.product] }
    case 'product/update':
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.id ? { ...p, ...action.changes } : p)),
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [toast, setToast] = useState(null)

  useEffect(() => saveState(state), [state])

  const notify = useCallback((text) => {
    setToast({ text, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <ShopContext.Provider value={{ state, dispatch, notify, toast }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  return useContext(ShopContext)
}

// დამხმარე: კალათის ჯამების გამოთვლა
export function useCartSummary() {
  const { state } = useShop()
  const lines = state.cart
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.id) }))
    .filter((l) => l.product)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0)
  return { lines, count, subtotal }
}
