import { useState } from 'react'
import { useShop, useCartSummary } from '../store/ShopContext'
import { Icon } from './ui'

const NAV = [
  { href: '#home', label: 'მთავარი', page: 'home' },
  { href: '#shop', label: 'კატალოგი', page: 'shop' },
  { href: '#about', label: 'ჩვენ შესახებ', page: 'about' },
  { href: '#contact', label: 'კონტაქტი', page: 'contact' },
]

export function Header({ route }) {
  const [open, setOpen] = useState(false)
  const { state } = useShop()
  const { count } = useCartSummary()

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a href="#home" className="logo" onClick={() => setOpen(false)} aria-label="ხელობა — მთავარი">
          <LogoMark />
          <span>ხელობა</span>
        </a>

        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="მთავარი მენიუ">
          {NAV.map((n) => (
            <a
              key={n.page}
              href={n.href}
              aria-current={route.page === n.page ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
          <a href="#orders" aria-current={route.page === 'orders' ? 'page' : undefined} onClick={() => setOpen(false)}>
            ჩემი შეკვეთები
          </a>
          <a href="#admin" className="nav-admin" aria-current={route.page === 'admin' ? 'page' : undefined} onClick={() => setOpen(false)}>
            მართვის პანელი
          </a>
        </nav>

        <div className="header-actions">
          <a href="#wishlist" className="icon-btn" aria-label={`სურვილების სია (${state.wishlist.length})`}>
            <Icon name="heart" />
            {state.wishlist.length > 0 && <span className="badge">{state.wishlist.length}</span>}
          </a>
          <a href="#cart" className="icon-btn" aria-label={`კალათა (${count})`}>
            <Icon name="bag" />
            {count > 0 && <span className="badge">{count}</span>}
          </a>
          <button
            className="icon-btn menu-toggle"
            aria-expanded={open}
            aria-label={open ? 'მენიუს დახურვა' : 'მენიუს გახსნა'}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}

export function LogoMark({ size = 28 }) {
  // ბორჯღალის სტილიზებული ნიშანი
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo-mark">
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d="M20 20 C 20 12, 26 8, 30 10 C 26 12, 24 16, 20 20 Z"
          fill="currentColor"
          transform={`rotate(${(360 / 7) * i} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="3.2" fill="currentColor" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <a href="#home" className="logo">
            <LogoMark />
            <span>ხელობა</span>
          </a>
          <p className="muted">ქართველი ხელოსნების ნამუშევრები ერთ სივრცეში. თითოეული ნივთი ხელით არის შექმნილი.</p>
        </div>
        <div>
          <h4>მაღაზია</h4>
          <a href="#shop-ceramics">კერამიკა</a>
          <a href="#shop-enamel">მინანქარი</a>
          <a href="#shop-felt">თექა</a>
          <a href="#shop-carpet">ფარდაგი</a>
          <a href="#shop-wood">ხის ნაკეთობა</a>
        </div>
        <div>
          <h4>მომხმარებელს</h4>
          <a href="#orders">შეკვეთის სტატუსი</a>
          <a href="#about">მიწოდება და დაბრუნება</a>
          <a href="#contact">დაგვიკავშირდით</a>
        </div>
        <div>
          <h4>კონტაქტი</h4>
          <p>თბილისი, ვაკე, ი. ჭავჭავაძის გამზ. 1</p>
          <p>+995 555 00 00 00</p>
          <p>hello@kheloba.ge</p>
        </div>
      </div>
      <div className="wrap footer-note">
        <span>© 2026 ხელობა. სასწავლო პროექტი</span>
        <span>შეკვეთები და გადახდა სადემონსტრაციოა — მონაცემები ინახება მხოლოდ თქვენს ბრაუზერში.</span>
      </div>
    </footer>
  )
}

export function Toast() {
  const { toast } = useShop()
  if (!toast) return null
  return (
    <div className="toast" role="status" key={toast.id}>
      <Icon name="check" />
      {toast.text}
    </div>
  )
}
