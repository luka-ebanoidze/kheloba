import { useState } from 'react'
import { useShop, useCartSummary } from '../store/ShopContext'
import { Icon, QtyInput, Empty } from '../components/ui'
import ProductArt from '../components/ProductArt'
import { gel } from '../utils/format'
import { computeTotals } from '../utils/totals'
import { PROMO_CODES, FREE_SHIPPING_FROM } from '../data/products'

export default function Cart() {
  const { state, dispatch, notify } = useShop()
  const { lines, subtotal } = useCartSummary()
  const [code, setCode] = useState(state.promo || '')
  const [promoError, setPromoError] = useState(null)
  const t = computeTotals(subtotal, state.promo)

  if (!lines.length) {
    return (
      <div className="wrap page">
        <Empty
          title="კალათა ცარიელია"
          text="დაამატეთ ნივთები კატალოგიდან და აქ გამოჩნდება."
          action={<a className="btn" href="#shop">კატალოგის ნახვა</a>}
        />
      </div>
    )
  }

  const applyPromo = (e) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (!c) return
    if (PROMO_CODES[c]) {
      dispatch({ type: 'promo/set', code: c })
      setPromoError(null)
      notify(`პრომოკოდი გააქტიურდა: ${PROMO_CODES[c].label}`)
    } else {
      setPromoError('ასეთი პრომოკოდი არ არსებობს. სცადეთ KHELOBA10')
    }
  }

  const leftForFree = FREE_SHIPPING_FROM - (subtotal - t.discount)

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>კალათა</h1>
      </div>
      <div className="cart-layout">
        <ul className="cart-list">
          {lines.map((l) => (
            <li key={l.key} className="cart-line">
              <a href={`#product-${l.id}`} className="cart-thumb"><ProductArt product={l.product} /></a>
              <div className="cart-info">
                <a href={`#product-${l.id}`}><strong>{l.product.name}</strong></a>
                <span className="muted small">{l.product.artisan}{l.size ? `, ზომა ${l.size}` : ''}</span>
                <span className="muted small">{gel(l.product.price)} ცალი</span>
              </div>
              <QtyInput id={`q-${l.key}`} value={l.qty} max={l.product.stock} onChange={(v) => dispatch({ type: 'cart/setQty', key: l.key, qty: v })} />
              <strong className="line-total">{gel(l.qty * l.product.price)}</strong>
              <button
                className="icon-btn"
                aria-label={`წაშლა: ${l.product.name}`}
                onClick={() => {
                  dispatch({ type: 'cart/remove', key: l.key })
                  notify('ნივთი წაიშალა კალათიდან')
                }}
              >
                <Icon name="trash" size={20} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="panel summary">
          <h2>შეჯამება</h2>
          <form className="promo" onSubmit={applyPromo}>
            <label htmlFor="promo">პრომოკოდი</label>
            <div className="promo-row">
              <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="მაგ. KHELOBA10" />
              <button className="btn btn-ghost btn-small">გამოყენება</button>
            </div>
            {promoError && <span className="field-error" role="alert">{promoError}</span>}
          </form>

          <dl className="totals">
            <div><dt>ნივთები</dt><dd>{gel(t.subtotal)}</dd></div>
            {t.discount > 0 && <div className="text-ok"><dt>ფასდაკლება ({state.promo})</dt><dd>−{gel(t.discount)}</dd></div>}
            <div><dt>მიწოდება თბილისში</dt><dd>{t.delivery ? gel(t.delivery) : 'უფასო'}</dd></div>
            <div className="total"><dt>სულ</dt><dd>{gel(t.total)}</dd></div>
          </dl>
          {leftForFree > 0 && (
            <p className="muted small">უფასო მიწოდებამდე დაგაკლდათ {gel(leftForFree)}.</p>
          )}
          <a href="#checkout" className="btn btn-block">შეკვეთის გაფორმება</a>
          <a href="#shop" className="link center">შოპინგის გაგრძელება</a>
        </aside>
      </div>
    </div>
  )
}
