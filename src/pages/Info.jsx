import { useState } from 'react'
import { useShop } from '../store/ShopContext'
import { Field, ProductCard, Empty } from '../components/ui'
import { validate, validators } from '../utils/format'
import { LogoMark } from '../components/Layout'

export function Wishlist() {
  const { state } = useShop()
  const items = state.products.filter((p) => state.wishlist.includes(p.id))
  return (
    <div className="wrap page">
      <div className="page-head"><h1>სურვილების სია</h1></div>
      {items.length ? (
        <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <Empty title="სია ცარიელია" text="ნივთის ბარათზე გულის ღილაკით შეინახეთ ის, რაც მოგეწონათ." action={<a className="btn" href="#shop">კატალოგის ნახვა</a>} />
      )}
    </div>
  )
}

export function About() {
  return (
    <div className="wrap page about">
      <div className="about-hero">
        <LogoMark size={56} />
        <h1>ხელობა აკავშირებს ხელოსანს და მყიდველს</h1>
        <p className="lead">
          საქართველოში ასობით ოსტატი ქმნის კერამიკას, მინანქარს, თექასა და ფარდაგს, მაგრამ მათი უმეტესობა მხოლოდ
          ბაზრობებზე და ტურისტულ სეზონზე ყიდის. ჩვენ მათ ერთ ონლაინ სივრცეს ვთავაზობთ, სადაც ნივთის ყიდვა მთელი წლის
          განმავლობაში და ნებისმიერი ქალაქიდან შეიძლება.
        </p>
      </div>

      <div className="about-cols">
        <section>
          <h2>როგორ ვარჩევთ ხელოსნებს</h2>
          <p>ყველა ოსტატს პირადად ვხვდებით სახელოსნოში. ვამოწმებთ, რომ ნივთი ხელით არის შექმნილი და არა ქარხნული. ხელოსანი თავად აწესებს ფასს და იღებს გაყიდვის 80%-ს.</p>
        </section>
        <section>
          <h2>მიწოდება</h2>
          <p>თბილისში 1–2 სამუშაო დღეში (6 ₾), რეგიონებში 2–4 დღეში (10 ₾). 150 ₾-ზე მეტი შეკვეთისას მიწოდება უფასოა. შეგიძლიათ ნივთი ვაკის სახელოსნოდანაც წაიღოთ.</p>
        </section>
        <section>
          <h2>დაბრუნება</h2>
          <p>ნივთის დაბრუნება შესაძლებელია მიღებიდან 14 დღის განმავლობაში, თუ ის დაუზიანებელია. ინდივიდუალური შეკვეთით დამზადებული ნივთი არ ბრუნდება.</p>
        </section>
      </div>

      <section className="panel demo-note">
        <h2>პროექტის შესახებ</h2>
        <p>
          ეს არის სასწავლო პროექტი. ხელოსნების სახელები გამოგონილია, ფოტოები სადემონსტრაციო მიზნით არის გამოყენებული. შეკვეთები, შეფასებები და შეტყობინებები ინახება
          თქვენი ბრაუზერის მეხსიერებაში (localStorage) და მონაცემთა ბაზის იმიტაციას ასრულებს. ონლაინ გადახდა და ელფოსტის
          გაგზავნა იმიტირებულია.
        </p>
      </section>
    </div>
  )
}

export function Contact() {
  const { dispatch, notify } = useShop()
  const empty = { name: '', email: '', topic: 'კითხვა ნივთზე', message: '' }
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(v, {
      name: [validators.name],
      email: [validators.required, validators.email],
      message: [validators.minLen(10)],
    })
    setErrors(errs)
    if (Object.keys(errs).length) return
    dispatch({ type: 'message/add', message: { ...v, id: Date.now(), date: new Date().toISOString(), read: false } })
    notify('შეტყობინება გაიგზავნა')
    setSent(true)
    setV(empty)
  }

  return (
    <div className="wrap page">
      <div className="page-head"><h1>კონტაქტი</h1></div>
      <div className="contact-layout">
        <div className="contact-info">
          <dl className="specs">
            <div><dt>სახელოსნო და მაღაზია</dt><dd>თბილისი, ვაკე, ი. ჭავჭავაძის გამზ. 1</dd></div>
            <div><dt>სამუშაო საათები</dt><dd>ორშ–შაბ, 11:00–19:00</dd></div>
            <div><dt>ტელეფონი</dt><dd>+995 555 00 00 00</dd></div>
            <div><dt>ელფოსტა</dt><dd>hello@kheloba.ge</dd></div>
            <div><dt>ხართ ხელოსანი?</dt><dd>მოგვწერეთ თემით „თანამშრომლობა" და დაგიკავშირდებით 3 დღეში.</dd></div>
          </dl>
        </div>

        <form className="panel" onSubmit={submit} noValidate>
          <h2>მოგვწერეთ</h2>
          {sent && <p className="notice notice-ok" role="status">მადლობა! შეტყობინება მიღებულია, გიპასუხებთ 24 საათში.</p>}
          <div className="two">
            <Field id="c-name" label="სახელი" error={errors.name}>
              <input id="c-name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
            </Field>
            <Field id="c-email" label="ელფოსტა" error={errors.email}>
              <input id="c-email" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
            </Field>
          </div>
          <Field id="c-topic" label="თემა">
            <select id="c-topic" value={v.topic} onChange={(e) => setV({ ...v, topic: e.target.value })}>
              <option>კითხვა ნივთზე</option>
              <option>შეკვეთა და მიწოდება</option>
              <option>ინდივიდუალური შეკვეთა</option>
              <option>თანამშრომლობა</option>
            </select>
          </Field>
          <Field id="c-message" label="შეტყობინება" error={errors.message}>
            <textarea id="c-message" rows="5" value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
          </Field>
          <button className="btn">შეტყობინების გაგზავნა</button>
        </form>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="wrap page">
      <Empty title="გვერდი ვერ მოიძებნა" text="ბმული არასწორია ან გვერდი წაიშალა." action={<a className="btn" href="#home">მთავარ გვერდზე</a>} />
    </div>
  )
}
