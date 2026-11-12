export const gel = (n) => `${Number(n).toLocaleString('ka-GE', { maximumFractionDigits: 2 })} ₾`

export const dateKa = (iso) =>
  new Date(iso).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })

export const plural = (n, word) => `${n} ${word}`

// ფორმების ვალიდაცია
export const validators = {
  required: (v) => (String(v ?? '').trim() ? null : 'შეავსეთ ეს ველი'),
  name: (v) => (String(v).trim().length >= 2 ? null : 'სახელი მინიმუმ 2 სიმბოლო უნდა იყოს'),
  phone: (v) => {
    const digits = String(v).replace(/[\s()-]/g, '').replace(/^\+?995/, '')
    return /^5\d{8}$/.test(digits) ? null : 'ჩაწერეთ მობილურის ნომერი, მაგ. 555 12 34 56'
  },
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()) ? null : 'ელფოსტის ფორმატი არასწორია, მაგ. name@mail.ge'),
  minLen: (n) => (v) => (String(v).trim().length >= n ? null : `მინიმუმ ${n} სიმბოლო`),
}

export function validate(values, rules) {
  const errors = {}
  for (const [field, fns] of Object.entries(rules)) {
    for (const fn of fns) {
      const err = fn(values[field])
      if (err) {
        errors[field] = err
        break
      }
    }
  }
  return errors
}

export const orderNumber = () => 'KH-' + Date.now().toString().slice(-6)
