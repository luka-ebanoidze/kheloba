import { useState } from 'react'
import { useShop, useCartSummary } from '../store/ShopContext'
import { Field, Empty } from '../components/ui'
import { gel, validate, validators, orderNumber } from '../utils/format'
import { computeTotals, GIFT_WRAP_PRICE } from '../utils/totals'
import { DELIVERY, REGIONS } from '../data/products'
import { go } from '../router'

const PAYMENTS = {
  card_online: 'ბარათით ონლაინ (სადემონსტრაციო)',
  card_courier: 'ბარათით კურიერთან',
  cash: 'ნაღდი ფულით მიღებისას',
}

export default function Checkout() {
  const { state, dispatch } = useShop()
  const { lines, subtotal } = useCartSummary()
  const [v, setV] = useState({
    name: '', phone: '', email: '', delivery: 'tbilisi', city: 'თბილისი', address: '',
    payment: 'card_courier', giftWrap: false, giftNote: '', comment: '', agree: false,
  })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  if (!lines.length && !processing) {
    return (
      <div className="wrap page">
        <Empty title="გასაფორმებელი არაფერია" text="კალათა ცარიელია." action={<a className="btn" href="#shop">კატალოგის ნახვა</a>} />
      </div>
    )
  }

  const t = computeTotals(subtotal, state.promo, v.delivery, v.giftWrap)
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const rules = {
      name: [validators.name],
      phone: [validators.required, validators.phone],
      email: [validators.required, validators.email],
      agree: [(x) => (x ? null : 'დაეთანხმეთ მიწოდებისა და დაბრუნების პირობებს')],
    }
    if (v.delivery !== 'pickup') rules.address = [validators.required, validators.minLen(5)]
    const errs = validate(v, rules)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }

    // გადახდის დამუშავების იმიტაცია
    setProcessing(true)
    setTimeout(() => {
      const order = {
        id: orderNumber(),
        date: new Date().toISOString(),
        status: 'მიღებულია',
        customer: { name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim() },
        delivery: { method: v.delivery, label: DELIVERY[v.delivery].label, city: v.delivery === 'pickup' ? 'თბილისი' : v.city, address: v.address.trim() },
        payment: PAYMENTS[v.payment],
        giftWrap: v.giftWrap,
        giftNote: v.giftNote.trim(),
        comment: v.comment.trim(),
        items: lines.map((l) => ({ id: l.id, name: l.product.name, price: l.product.price, qty: l.qty, size: l.size })),
        totals: t,
        promo: state.promo,
      }
      dispatch({ type: 'order/place', order })
      go(`success-${order.id}`)
    }, 1200)
  }

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>შეკვეთის გაფორმება</h1>
      </div>
      <form className="checkout-layout" onSubmit={submit} noValidate>
        <div className="checkout-form">
          <fieldset className="panel">
            <legend>საკონტაქტო ინფორმაცია</legend>
            <Field id="name" label="სახელი და გვარი" error={errors.name}>
              <input id="name" autoComplete="name" value={v.name} onChange={set('name')} aria-invalid={!!errors.name} />
            </Field>
            <div className="two">
              <Field id="phone" label="მობილური" error={errors.phone} hint="SMS-ით მიიღებთ შეკვეთის სტატუსს">
                <input id="phone" type="tel" autoComplete="tel" placeholder="555 12 34 56" value={v.phone} onChange={set('phone')} aria-invalid={!!errors.phone} />
              </Field>
              <Field id="email" label="ელფოსტა" error={errors.email}>
                <input id="email" type="email" autoComplete="email" placeholder="name@mail.ge" value={v.email} onChange={set('email')} aria-invalid={!!errors.email} />
              </Field>
            </div>
          </fieldset>

          <fieldset className="panel">
            <legend>მიწოდება</legend>
            <div className="radios">
              {Object.entries(DELIVERY).map(([k, d]) => (
                <label key={k} className={`radio-card ${v.delivery === k ? 'is-on' : ''}`}>
                  <input type="radio" name="delivery" value={k} checked={v.delivery === k} onChange={set('delivery')} />
                  <span>{d.label}</span>
                  <strong>{d.price ? gel(d.price) : 'უფასო'}</strong>
                </label>
              ))}
            </div>
            {v.delivery !== 'pickup' && (
              <div className="two">
                <Field id="city" label="ქალაქი / რეგიონი">
                  <select id="city" value={v.city} onChange={set('city')}>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field id="address" label="მისამართი" error={errors.address}>
                  <input id="address" autoComplete="street-address" placeholder="ქუჩა, სახლი, ბინა" value={v.address} onChange={set('address')} aria-invalid={!!errors.address} />
                </Field>
              </div>
            )}
            <label className="check">
              <input id="giftWrap" type="checkbox" checked={v.giftWrap} onChange={set('giftWrap')} />
              სასაჩუქრე შეფუთვა (+{gel(GIFT_WRAP_PRICE)})
            </label>
            {v.giftWrap && (
              <Field id="giftNote" label="ბარათზე დასაწერი ტექსტი" hint="არასავალდებულო">
                <input id="giftNote" maxLength={120} value={v.giftNote} onChange={set('giftNote')} />
              </Field>
            )}
          </fieldset>

          <fieldset className="panel">
            <legend>გადახდა</legend>
            <div className="radios">
              {Object.entries(PAYMENTS).map(([k, label]) => (
                <label key={k} className={`radio-card ${v.payment === k ? 'is-on' : ''}`}>
                  <input type="radio" name="payment" value={k} checked={v.payment === k} onChange={set('payment')} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {v.payment === 'card_online' && (
              <p className="notice small">
                ეს სასწავლო პროექტია: ონლაინ გადახდა იმიტირებულია და ბარათის მონაცემები არ მოითხოვება. რეალურ ვერსიაში
                აქ ბანკის გადახდის გვერდი (მაგ. TBC ან Bank of Georgia) ჩაირთვება.
              </p>
            )}
            <Field id="comment" label="კომენტარი კურიერისთვის" hint="არასავალდებულო">
              <textarea id="comment" rows="2" value={v.comment} onChange={set('comment')} />
            </Field>
          </fieldset>
        </div>

        <aside className="panel summary">
          <h2>თქვენი შეკვეთა</h2>
          <ul className="mini-lines">
            {lines.map((l) => (
              <li key={l.key}>
                <span>{l.product.name}{l.size ? ` (${l.size})` : ''} × {l.qty}</span>
                <span>{gel(l.qty * l.product.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>ნივთები</dt><dd>{gel(t.subtotal)}</dd></div>
            {t.discount > 0 && <div className="text-ok"><dt>ფასდაკლება</dt><dd>−{gel(t.discount)}</dd></div>}
            <div><dt>მიწოდება</dt><dd>{t.delivery ? gel(t.delivery) : 'უფასო'}</dd></div>
            {t.wrap > 0 && <div><dt>შეფუთვა</dt><dd>{gel(t.wrap)}</dd></div>}
            <div className="total"><dt>გადასახდელი</dt><dd>{gel(t.total)}</dd></div>
          </dl>
          <label className={`check ${errors.agree ? 'has-error' : ''}`}>
            <input id="agree" type="checkbox" checked={v.agree} onChange={set('agree')} />
            ვეთანხმები მიწოდებისა და დაბრუნების პირობებს
          </label>
          {errors.agree && <span className="field-error" role="alert">{errors.agree}</span>}
          <button className="btn btn-block" disabled={processing}>
            {processing ? 'შეკვეთა მუშავდება…' : `შეკვეთა, ${gel(t.total)}`}
          </button>
        </aside>
      </form>
    </div>
  )
}
