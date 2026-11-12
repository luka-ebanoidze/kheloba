import { ShopProvider } from './store/ShopContext'
import { useRoute } from './router'
import { Header, Footer, Toast } from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders, { OrderSuccess } from './pages/Orders'
import Admin from './pages/Admin'
import { About, Contact, Wishlist, NotFound } from './pages/Info'

function Page({ route }) {
  switch (route.page) {
    case 'home': return <Home />
    case 'shop': return <Shop initialCategory={route.param} />
    case 'product': return <Product id={route.param} key={route.param} />
    case 'cart': return <Cart />
    case 'checkout': return <Checkout />
    case 'success': return <OrderSuccess id={route.param} />
    case 'orders': return <Orders />
    case 'wishlist': return <Wishlist />
    case 'about': return <About />
    case 'contact': return <Contact />
    case 'admin': return <Admin />
    default: return <NotFound />
  }
}

export default function App() {
  const route = useRoute()
  return (
    <ShopProvider>
      <a href="#main" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        მთავარ შიგთავსზე გადასვლა
      </a>
      <Header route={route} />
      <main id="main" tabIndex={-1}>
        <Page route={route} />
      </main>
      <Footer />
      <Toast />
    </ShopProvider>
  )
}
