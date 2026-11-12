import { useState } from 'react'
import { useShop } from '../store/ShopContext'
import { ProductCard, Icon, Stars, Field, QtyInput, Empty, categoryName } from '../components/ui'
import ProductArt from '../components/ProductArt'
import { gel, validate, validators, dateKa } from '../utils/format'
import { FREE_SHIPPING_FROM } from '../data/products'

export default function Product({ id }) {
  const { state, dispatch, notify } = useShop()
  const product = state.products.find((p) => p.id === Number(id))
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState(null)
  const [sizeError, setSizeError] = useState(false)

  if (!product) {
    return (
      <div className="wrap page">
        <Empty title="ეს ნივთი ვერ მოიძებნა" text="შესაძლოა ბმული მოძველებულია." action={<a className="btn" href="#shop">კატალოგში დაბრუნება</a>} />
      </div>
    )
  }

  const liked = state.wishlist.includes(product.id)
  const inCart = state.cart.filter((c) => c.id === product.id).reduce((s, c) => s + c.qty, 0)
  const available = Math.max(0, product.stock - inCart)
  const userReviews = state.reviews[product.id] || []
  const allReviews = [...userReviews, ...product.reviews]
  const avg = allReviews.length ? allReviews.reduce((s, r) => s + r.stars, 0) / allReviews.length : product.rating
  const related = state.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  const addToCart = () => {
    if (product.sizes && !size) {
      setSizeError(true)
      return
    }
    dispatch({ type: 'cart/add', id: product.id, qty: Math.min(qty, available), size })
    notify(`კალათაში დაემატა: ${product.name}`)
    setQty(1)
  }

  return (
    <div className="wrap page">
      <a href="#shop" className="back-link"><Icon name="back" size={18} /> კატალოგი</a>

      <div className="product-layout">
        <div className="product-media">
          <ProductArt product={product} sizes="(max-width: 820px) 100vw, 560px" />
        </div>

        <div className="product-info">
          <span className="card-meta">{categoryName(product.category)}, {product.region}</span>
          <h1>{product.name}</h1>
          <div className="rating-row">
            <Stars value={avg} />
            <span className="muted">{avg.toFixed(1)}, {allReviews.length} შეფასება</span>
          </div>
          <p className="price price-lg">{gel(product.price)}</p>
          <p>{product.description}</p>

          <dl className="specs">
            <div><dt>ხელოსანი</dt><dd>{product.artisan}</dd></div>
            <div><dt>ტექნიკა და მასალა</dt><dd>{product.technique}</dd></div>
            <div><dt>ზომა</dt><dd>{product.size}</dd></div>
            <div>
              <dt>მარაგი</dt>
              <dd className={product.stock === 0 ? 'text-danger' : product.stock <= 3 ? 'text-warn' : ''}>
                {product.stock === 0 ? 'ამჟამად არ არის' : `${product.stock} ცალი`}
              </dd>
            </div>
          </dl>

          {product.sizes && (
            <fieldset className="size-pick">
              <legend>ზომა</legend>
              <div className="chips">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${size === s ? 'is-on' : ''}`}
                    aria-pressed={size === s}
                    onClick={() => { setSize(s); setSizeError(false) }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <span className="field-error" role="alert">აირჩიეთ ზომა</span>}
            </fieldset>
          )}

          {product.stock > 0 ? (
            <div className="buy-row">
              <QtyInput id="qty" value={Math.min(qty, Math.max(available, 1))} max={Math.max(available, 1)} onChange={(v) => setQty(Math.max(1, Math.min(v, available)))} />
              <button className="btn btn-grow" onClick={addToCart} disabled={available === 0}>
                {available === 0 ? 'მთელი მარაგი კალათაშია' : 'კალათაში დამატება'}
              </button>
              <button
                className={`icon-btn like-lg ${liked ? 'is-on' : ''}`}
                aria-pressed={liked}
                aria-label={liked ? 'სურვილებიდან ამოღება' : 'სურვილებში დამატება'}
                onClick={() => {
                  dispatch({ type: 'wishlist/toggle', id: product.id })
                  notify(liked ? 'ამოღებულია სურვილებიდან' : 'დამატებულია სურვილებში')
                }}
              >
                <Icon name="heart" />
              </button>
            </div>
          ) : (
            <p className="notice">ეს ნივთი ამჟამად არ არის მარაგში. დაამატეთ სურვილებში ან მოგვწერეთ, და შეგატყობინებთ, როცა ხელოსანი ახალს დაამზადებს.</p>
          )}

          <ul className="perks">
            <li><Icon name="truck" size={18} /> უფასო მიწოდება {FREE_SHIPPING_FROM} ₾-დან</li>
            <li><Icon name="gift" size={18} /> სასაჩუქრე შეფუთვა შეკვეთისას</li>
            <li><Icon name="hand" size={18} /> ავტორის ბარათი ყოველ ნივთთან</li>
          </ul>
        </div>
      </div>

      <section className="section reviews">
        <h2>შეფასებები</h2>
        <div className="reviews-layout">
          <ReviewForm productId={product.id} />
          <div className="review-list">
            {allReviews.length === 0 && <p className="muted">ჯერ შეფასება არ არის. დაწერეთ პირველი.</p>}
            {allReviews.map((r, i) => (
              <article key={i} className="review">
                <div className="review-head">
                  <strong>{r.name}</strong>
                  <Stars value={r.stars} />
                </div>
                <p>{r.text}</p>
                {r.date && <span className="muted small">{dateKa(r.date)}</span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <h2>იმავე ხელობიდან</h2>
          <div className="grid grid-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function ReviewForm({ productId }) {
  const { dispatch, notify } = useShop()
  const [values, setValues] = useState({ name: '', stars: 5, text: '' })
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(values, { name: [validators.name], text: [validators.minLen(10)] })
    setErrors(errs)
    if (Object.keys(errs).length) return
    dispatch({ type: 'review/add', productId, review: { ...values, date: new Date().toISOString() } })
    setValues({ name: '', stars: 5, text: '' })
    notify('შეფასება გამოქვეყნდა')
  }

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <h3>დაწერეთ შეფასება</h3>
      <Field id="rv-name" label="სახელი" error={errors.name}>
        <input id="rv-name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
      </Field>
      <fieldset className="field">
        <legend>შეფასება</legend>
        <div className="star-pick">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              aria-label={`${n} ვარსკვლავი`}
              aria-pressed={values.stars === n}
              className={n <= values.stars ? 'is-on' : ''}
              onClick={() => setValues({ ...values, stars: n })}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <Field id="rv-text" label="კომენტარი" error={errors.text}>
        <textarea id="rv-text" rows="3" value={values.text} onChange={(e) => setValues({ ...values, text: e.target.value })} />
      </Field>
      <button className="btn">შეფასების გამოქვეყნება</button>
    </form>
  )
}
