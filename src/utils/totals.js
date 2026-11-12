import { PROMO_CODES, FREE_SHIPPING_FROM, DELIVERY } from '../data/products'

export const GIFT_WRAP_PRICE = 5

// შეკვეთის ჯამის გამოთვლა: ფასდაკლება → მიწოდება → შეფუთვა
export function computeTotals(subtotal, promoCode, deliveryKey = 'tbilisi', giftWrap = false) {
  const promo = promoCode ? PROMO_CODES[promoCode] : null
  const discount = promo ? Math.round(subtotal * promo.percent) / 100 : 0
  const afterDiscount = subtotal - discount
  const baseDelivery = DELIVERY[deliveryKey]?.price ?? 0
  const delivery = subtotal === 0 || afterDiscount >= FREE_SHIPPING_FROM ? 0 : baseDelivery
  const wrap = giftWrap ? GIFT_WRAP_PRICE : 0
  const total = afterDiscount + delivery + wrap
  return { subtotal, discount, delivery, wrap, total, promo }
}
