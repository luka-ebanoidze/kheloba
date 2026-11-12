import { useState } from 'react'
import { useShop, ORDER_STATUSES } from '../store/ShopContext'
import { Field, categoryName } from '../components/ui'
import { CATEGORIES, REGIONS } from '../data/products'
import { gel, dateKa, validate, validators } from '../utils/format'
import ProductArt from '../components/ProductArt'

// მართვის პანელი (ადმინისტრატორისთვის).
// რეალურ პროექტში აქ შესვლა პაროლით იქნებოდა დაცული.

const TABS = { orders: 'შეკვეთები', products: 'პროდუქტები', messages: 'შეტყობინებები' }

export default function Admin() {
  const { state } = useShop()
  const [tab, setTab] = useState('orders')
  const active = state.orders.filter((o) => o.status !== 'გაუქმებულია')
  const revenue = active.reduce((s, o) => s + o.totals.total, 0)
  const unread = state.messages.filter((m) => !m.read).length
  const lowStock = state.products.filter((p) => p.stock <= 3).length

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>მართვის პანელი</h1>
        <p className="muted">სადემონსტრაციო: ჩვეულებრივ ეს გვერდი მხოლოდ ადმინისტრატორისთვისაა ხელმისაწვდომი.</p>
      </div>

      <dl className="kpis">
        <div><dt>შეკვეთა</dt><dd>{state.orders.length}</dd></div>
        <div><dt>შემოსავალი</dt><dd>{gel(revenue)}</dd></div>
        <div><dt>წაუკითხავი შეტყობინება</dt><dd>{unread}</dd></div>
        <div className={lowStock ? 'warn' : ''}><dt>მცირე მარაგი (≤3)</dt><dd>{lowStock}</dd></div>
      </dl>

      <div className="tabs" role="tablist">
        {Object.entries(TABS).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>
            {label}
            {k === 'messages' && unread > 0 && <span className="badge badge-inline">{unread}</span>}
          </button>
        ))}
      </div>

      {tab === 'orders' && <OrdersTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'messages' && <MessagesTab />}

      <ResetBox />
    </div>
  )
}

function OrdersTab() {
  const { state, dispatch, notify } = useShop()
  if (!state.orders.length) return <p className="muted">შეკვეთები ჯერ არ არის. გააფორმეთ სატესტო შეკვეთა მაღაზიაში და აქ გამოჩნდება.</p>
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr><th>ნომერი</th><th>თარიღი</th><th>მყიდველი</th><th>ნივთები</th><th className="num">თანხა</th><th>სტატუსი</th></tr>
        </thead>
        <tbody>
          {state.orders.map((o) => (
            <tr key={o.id}>
              <td><strong>{o.id}</strong></td>
              <td>{dateKa(o.date)}</td>
              <td>{o.customer.name}<br /><span className="muted small">{o.customer.phone}</span></td>
              <td>{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</td>
              <td className="num">{gel(o.totals.total)}</td>
              <td>
                <select
                  aria-label={`სტატუსი ${o.id}`}
                  value={o.status}
                  onChange={(e) => {
                    dispatch({ type: 'order/status', id: o.id, status: e.target.value })
                    notify(`${o.id}: ${e.target.value}`)
                  }}
                >
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductsTab() {
  const { state, dispatch } = useShop()
  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th></th><th>პროდუქტი</th><th>კატეგორია</th><th className="num">ფასი, ₾</th><th className="num">მარაგი</th><th>მთავარზე</th></tr>
          </thead>
          <tbody>
            {state.products.map((p) => (
              <tr key={p.id}>
                <td className="thumb-cell"><ProductArt product={p} /></td>
                <td><a href={`#product-${p.id}`}>{p.name}</a><br /><span className="muted small">{p.artisan}</span></td>
                <td>{categoryName(p.category)}</td>
                <td className="num">
                  <input className="cell-input" type="number" min="1" aria-label={`ფასი: ${p.name}`} value={p.price}
                    onChange={(e) => dispatch({ type: 'product/update', id: p.id, changes: { price: Math.max(1, Number(e.target.value) || 1) } })} />
                </td>
                <td className="num">
                  <input className={`cell-input ${p.stock <= 3 ? 'low' : ''}`} type="number" min="0" aria-label={`მარაგი: ${p.name}`} value={p.stock}
                    onChange={(e) => dispatch({ type: 'product/update', id: p.id, changes: { stock: Math.max(0, Number(e.target.value) || 0) } })} />
                </td>
                <td>
                  <input type="checkbox" aria-label={`მთავარ გვერდზე: ${p.name}`} checked={!!p.featured}
                    onChange={(e) => dispatch({ type: 'product/update', id: p.id, changes: { featured: e.target.checked } })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddProduct />
    </>
  )
}

const PALETTES = [
  ['#1F4FA8', '#C9A227', '#B3263E'],
  ['#8A4B2E', '#D9A066', '#3B2418'],
  ['#2D6A4F', '#E9C46A', '#22332C'],
  ['#5B2333', '#E8D5A7', '#2B4162'],
]

function AddProduct() {
  const { state, dispatch, notify } = useShop()
  const empty = { name: '', category: 'ceramics', price: '', stock: '', region: 'თბილისი', artisan: '', technique: '', size: '', description: '', palette: 0 }
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const positive = (x) => (Number(x) > 0 ? null : 'ჩაწერეთ დადებითი რიცხვი')
    const errs = validate(v, {
      name: [validators.minLen(3)],
      price: [positive],
      stock: [(x) => (x !== '' && Number(x) >= 0 ? null : 'ჩაწერეთ რაოდენობა')],
      artisan: [validators.name],
      description: [validators.minLen(20)],
    })
    setErrors(errs)
    if (Object.keys(errs).length) return
    const id = Math.max(...state.products.map((p) => p.id)) + 1
    dispatch({
      type: 'product/add',
      product: {
        id, slug: `product-${id}`, name: v.name.trim(), category: v.category, price: Number(v.price), stock: Number(v.stock),
        region: v.region, artisan: v.artisan.trim(), technique: v.technique.trim() || '—', size: v.size.trim() || '—',
        description: v.description.trim(), palette: PALETTES[v.palette], featured: false, rating: 5, reviews: [],
      },
    })
    notify(`დაემატა: ${v.name}`)
    setV(empty)
  }

  return (
    <form className="panel add-product" onSubmit={submit} noValidate>
      <h2>ახალი პროდუქტის დამატება</h2>
      <div className="three">
        <Field id="ap-name" label="დასახელება" error={errors.name}><input id="ap-name" value={v.name} onChange={set('name')} /></Field>
        <Field id="ap-cat" label="კატეგორია">
          <select id="ap-cat" value={v.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </Field>
        <Field id="ap-region" label="რეგიონი">
          <select id="ap-region" value={v.region} onChange={set('region')}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
        </Field>
        <Field id="ap-price" label="ფასი, ₾" error={errors.price}><input id="ap-price" type="number" min="1" value={v.price} onChange={set('price')} /></Field>
        <Field id="ap-stock" label="მარაგი" error={errors.stock}><input id="ap-stock" type="number" min="0" value={v.stock} onChange={set('stock')} /></Field>
        <Field id="ap-artisan" label="ხელოსანი" error={errors.artisan}><input id="ap-artisan" value={v.artisan} onChange={set('artisan')} /></Field>
        <Field id="ap-tech" label="ტექნიკა და მასალა"><input id="ap-tech" value={v.technique} onChange={set('technique')} /></Field>
        <Field id="ap-size" label="ზომა"><input id="ap-size" value={v.size} onChange={set('size')} /></Field>
        <fieldset className="field">
          <legend>ფერები</legend>
          <div className="swatches">
            {PALETTES.map((p, i) => (
              <button type="button" key={i} aria-label={`ფერთა ნაკრები ${i + 1}`} aria-pressed={v.palette === i}
                className={v.palette === i ? 'is-on' : ''} onClick={() => setV({ ...v, palette: i })}
                style={{ background: `linear-gradient(90deg, ${p[0]} 0 33%, ${p[1]} 33% 66%, ${p[2]} 66%)` }} />
            ))}
          </div>
        </fieldset>
      </div>
      <Field id="ap-desc" label="აღწერა" error={errors.description}><textarea id="ap-desc" rows="3" value={v.description} onChange={set('description')} /></Field>
      <button className="btn">პროდუქტის დამატება</button>
    </form>
  )
}

function MessagesTab() {
  const { state, dispatch } = useShop()
  if (!state.messages.length) return <p className="muted">შეტყობინებები ჯერ არ არის. სცადეთ საკონტაქტო ფორმა.</p>
  return (
    <div className="stack">
      {state.messages.map((m) => (
        <article key={m.id} className={`panel message ${m.read ? '' : 'is-unread'}`}>
          <header className="order-head">
            <div><strong>{m.name}</strong> <span className="muted small">{m.email}</span></div>
            <span className="pill">{m.topic}</span>
          </header>
          <p>{m.message}</p>
          <div className="order-head">
            <span className="muted small">{dateKa(m.date)}</span>
            {!m.read && <button className="btn btn-ghost btn-small" onClick={() => dispatch({ type: 'message/read', id: m.id })}>წაკითხულად მონიშვნა</button>}
          </div>
        </article>
      ))}
    </div>
  )
}

function ResetBox() {
  const { dispatch, notify } = useShop()
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="reset-box">
      {confirm ? (
        <>
          <span>წაიშლება ყველა შეკვეთა, შეტყობინება და ცვლილება. გავაგრძელოთ?</span>
          <button className="btn btn-danger btn-small" onClick={() => { dispatch({ type: 'reset' }); setConfirm(false); notify('მონაცემები დაბრუნდა საწყის მდგომარეობაში') }}>დიახ, გასუფთავება</button>
          <button className="btn btn-ghost btn-small" onClick={() => setConfirm(false)}>გაუქმება</button>
        </>
      ) : (
        <button className="btn btn-ghost btn-small" onClick={() => setConfirm(true)}>სადემონსტრაციო მონაცემების გასუფთავება</button>
      )}
    </div>
  )
}
