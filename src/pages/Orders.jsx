import { useShop, ORDER_STATUSES } from '../store/ShopContext'
import { Empty, Icon } from '../components/ui'
import { gel, dateKa } from '../utils/format'

// შეკვეთის სტატუსის ვიზუალური მაჩვენებელი
export function StatusTrack({ status }) {
  if (status === 'გაუქმებულია') return <span className="pill pill-danger">გაუქმებულია</span>
  const flow = ORDER_STATUSES.slice(0, 4)
  const idx = flow.indexOf(status)
  return (
    <ol className="track" aria-label={`სტატუსი: ${status}`}>
      {flow.map((s, i) => (
        <li key={s} className={i <= idx ? 'is-done' : ''} aria-current={i === idx ? 'step' : undefined}>
          <span className="dot" />
          {s}
        </li>
      ))}
    </ol>
  )
}

export function OrderSuccess({ id }) {
  const { state } = useShop()
  const order = state.orders.find((o) => o.id === id)
  if (!order) return <div className="wrap page"><Empty title="შეკვეთა ვერ მოიძებნა" text="" action={<a className="btn" href="#orders">ჩემი შეკვეთები</a>} /></div>

  return (
    <div className="wrap page narrow">
      <div className="success">
        <span className="success-mark"><Icon name="check" size={36} /></span>
        <h1>მადლობა, შეკვეთა მიღებულია</h1>
        <p className="lead">
          შეკვეთის ნომერია <strong>{order.id}</strong>. დადასტურება გამოიგზავნა მისამართზე {order.customer.email}.
        </p>
      </div>
      <OrderCard order={order} />
      <div className="row-actions">
        <a className="btn" href="#orders">ჩემი შეკვეთები</a>
        <a className="btn btn-ghost" href="#shop">შოპინგის გაგრძელება</a>
      </div>
      <p className="muted small center">სადემონსტრაციო ვერსიაში ელფოსტა რეალურად არ იგზავნება.</p>
    </div>
  )
}

export function OrderCard({ order }) {
  return (
    <article className="panel order">
      <header className="order-head">
        <div>
          <strong>{order.id}</strong>
          <span className="muted small">{dateKa(order.date)}</span>
        </div>
        <strong>{gel(order.totals.total)}</strong>
      </header>
      <StatusTrack status={order.status} />
      <ul className="mini-lines">
        {order.items.map((i, k) => (
          <li key={k}>
            <a href={`#product-${i.id}`}>{i.name}{i.size ? ` (${i.size})` : ''} × {i.qty}</a>
            <span>{gel(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="order-meta">
        <div><dt>მიწოდება</dt><dd>{order.delivery.label}{order.delivery.address ? `, ${order.delivery.city}, ${order.delivery.address}` : ''}</dd></div>
        <div><dt>გადახდა</dt><dd>{order.payment}</dd></div>
        {order.giftWrap && <div><dt>შეფუთვა</dt><dd>სასაჩუქრე{order.giftNote ? `: „${order.giftNote}"` : ''}</dd></div>}
      </dl>
    </article>
  )
}

export default function Orders() {
  const { state } = useShop()
  return (
    <div className="wrap page narrow">
      <div className="page-head">
        <h1>ჩემი შეკვეთები</h1>
        <p className="muted">შეკვეთების სტატუსს ადმინისტრატორი ცვლის მართვის პანელიდან.</p>
      </div>
      {state.orders.length ? (
        <div className="stack">
          {state.orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      ) : (
        <Empty title="შეკვეთები ჯერ არ გაქვთ" text="პირველი შეკვეთის შემდეგ აქ ნახავთ მის სტატუსს." action={<a className="btn" href="#shop">კატალოგის ნახვა</a>} />
      )}
    </div>
  )
}
