import { useShop } from '../store/ShopContext'
import { CATEGORIES, FREE_SHIPPING_FROM } from '../data/products'
import { ProductCard, Icon } from '../components/ui'
import ProductArt from '../components/ProductArt'

export default function Home() {
  const { state } = useShop()
  // ჯერ ადმინის მიერ მონიშნული, შემდეგ ყველაზე მაღალი შეფასების ნივთები — სულ 8
  const featured = [
    ...state.products.filter((p) => p.featured && p.stock > 0),
    ...[...state.products].filter((p) => !p.featured && p.stock > 0).sort((a, b) => b.rating - a.rating),
  ].slice(0, 8)
  const heroItems = [12, 4, 5].map((id) => state.products.find((p) => p.id === id)).filter(Boolean)
  const artisans = new Set(state.products.map((p) => p.artisan)).size
  const regions = new Set(state.products.map((p) => p.region)).size

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>ნივთები, რომლებიც ნამდვილად ხელნაკეთია</h1>
            <p className="lead">
              მინანქარი თბილისიდან, ფარდაგი კახეთიდან, სვანური ქუდი მესტიიდან. ვყიდით პირდაპირ ხელოსნებისგან და
              თითოეულ ნივთს ავტორის სახელით გიგზავნით.
            </p>
            <div className="hero-actions">
              <a href="#shop" className="btn">კატალოგის ნახვა</a>
              <a href="#about" className="btn btn-ghost">როგორ ვმუშაობთ</a>
            </div>
            <dl className="hero-facts">
              <div><dt>ხელოსანი</dt><dd>{artisans}</dd></div>
              <div><dt>რეგიონი</dt><dd>{regions}</dd></div>
              <div><dt>უფასო მიწოდება</dt><dd>{FREE_SHIPPING_FROM} ₾-დან</dd></div>
            </dl>
          </div>
          <div className="hero-art" aria-hidden="true">
            {heroItems.map((p, i) => (
              <a key={p.id} href={`#product-${p.id}`} className={`hero-tile hero-tile-${i}`} tabIndex={-1}>
                <ProductArt product={p} cover sizes={i === 0 ? "(max-width: 820px) 60vw, 360px" : "(max-width: 820px) 40vw, 240px"} />
                <span>{p.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>ხელობის მიხედვით</h2>
          </div>
          <div className="cat-row">
            {CATEGORIES.map((c) => {
              const sample = state.products.find((p) => p.category === c.id)
              const n = state.products.filter((p) => p.category === c.id).length
              return (
                <a key={c.id} href={`#shop-${c.id}`} className="cat-tile">
                  {sample && <ProductArt product={sample} />}
                  <strong>{c.name}</strong>
                  <span className="muted">{c.note}</span>
                  <span className="cat-count">{n} ნივთი</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>ახლა ყველაზე მოთხოვნადი</h2>
            <a href="#shop" className="link">ყველა ნივთი</a>
          </div>
          <div className="grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <h2>შეკვეთიდან კარამდე</h2>
          <ol className="steps">
            <li>
              <Icon name="bag" />
              <h3>აირჩიეთ ნივთი</h3>
              <p>პროდუქტის გვერდზე ხედავთ ხელოსანს, რეგიონს, მასალას და ზომას.</p>
            </li>
            <li>
              <Icon name="hand" />
              <h3>ხელოსანი ამზადებს</h3>
              <p>მარაგში არსებულ ნივთს 1 დღეში ვფუთავთ. ყოველ შეკვეთას ავტორის ბარათი ახლავს.</p>
            </li>
            <li>
              <Icon name="truck" />
              <h3>მიღება</h3>
              <p>თბილისში 1–2 დღეში, რეგიონებში 2–4 დღეში. შეკვეთის სტატუსს „ჩემ შეკვეთებში" ნახავთ.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap quote">
          <blockquote>
            „ფარდაგს ორი თვე ვქსოვ. ადრე მხოლოდ ბაზრობაზე ვყიდდი, ახლა ჩემი ნამუშევარი ბერლინშიც კი ჩავიდა."
          </blockquote>
          <p className="muted">მანანა ხოსიტაშვილი, ფარდაგის ოსტატი, კახეთი</p>
        </div>
      </section>
    </>
  )
}
