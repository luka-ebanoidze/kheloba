// პროდუქტის ილუსტრაცია SVG-ით.
// ფოტოების ნაცვლად თითოეული ნივთი იხატება კოდით, მისი ფერებით
// (palette) და კატეგორიის მიხედვით. რეალურ მაღაზიაში აქ ფოტო ჩაჯდებოდა.

function Rosette({ cx, cy, r, color, petals = 6, stroke }) {
  return (
    <g>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - r / 2}
          rx={r / 4.2}
          ry={r / 2}
          fill={color}
          stroke={stroke}
          strokeWidth={stroke ? 2 : 0}
          transform={`rotate(${(360 / petals) * i} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r / 6} fill={stroke || color} />
    </g>
  )
}

function Ceramics({ p }) {
  const [a, b, c] = p.palette
  const v = p.id % 3
  if (v === 2) {
    // ჯამი
    return (
      <g>
        <ellipse cx="200" cy="318" rx="110" ry="14" fill={c} opacity="0.18" />
        <path d="M78 190 Q 200 380 322 190 Z" fill={a} />
        <ellipse cx="200" cy="190" rx="122" ry="30" fill={c} />
        <ellipse cx="200" cy="186" rx="112" ry="22" fill={b} opacity="0.9" />
        <path d="M98 230 Q 200 300 302 230" fill="none" stroke={b} strokeWidth="6" strokeDasharray="14 10" />
        <Rosette cx={200} cy={186} r={30} color={a} petals={8} />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="200" cy="336" rx="96" ry="12" fill={c} opacity="0.2" />
      <path d="M252 140 C 330 136, 334 236, 282 254" fill="none" stroke={c} strokeWidth="16" strokeLinecap="round" />
      <path
        d="M142 332 C 86 300, 92 200, 150 176 L 162 128 C 160 114, 150 104, 144 92 L 256 92 C 250 104, 240 114, 238 128 L 250 176 C 308 200, 314 300, 258 332 Z"
        fill={a}
      />
      <path d="M144 92 L 256 92 L 262 80 L 138 80 Z" fill={c} />
      <path d="M118 236 L 140 216 L 162 236 L 184 216 L 206 236 L 228 216 L 250 236 L 272 216 L 284 230" fill="none" stroke={b} strokeWidth="6" strokeLinejoin="round" />
      <path d="M118 260 L 284 260" stroke={b} strokeWidth="3" />
      <Rosette cx={200} cy={290} r={26} color={b} petals={v === 0 ? 6 : 8} />
    </g>
  )
}

function Enamel({ p }) {
  const [a, b, c] = p.palette
  const petals = [8, 6, 12][p.id % 3]
  return (
    <g>
      <path d="M120 40 Q 200 150 280 40" fill="none" stroke={b} strokeWidth="3" />
      <circle cx="200" cy="128" r="10" fill="none" stroke={b} strokeWidth="5" />
      <circle cx="200" cy="230" r="96" fill={b} />
      <circle cx="200" cy="230" r="86" fill={c} />
      {Array.from({ length: petals }).map((_, i) => (
        <path
          key={i}
          d="M200 230 C 186 196, 186 170, 200 150 C 214 170, 214 196, 200 230 Z"
          fill={i % 2 ? a : '#F4EFE3'}
          stroke={b}
          strokeWidth="3"
          transform={`rotate(${(360 / petals) * i} 200 230)`}
        />
      ))}
      <circle cx="200" cy="230" r="16" fill={a} stroke={b} strokeWidth="4" />
      <circle cx="200" cy="230" r="86" fill="none" stroke={b} strokeWidth="3" strokeDasharray="2 8" />
    </g>
  )
}

function Felt({ p }) {
  const [a, b, c] = p.palette
  if (p.id % 2 === 0) {
    // შარფი / ფლოსტები — დაკეცილი ქსოვილი
    return (
      <g>
        <ellipse cx="200" cy="330" rx="120" ry="12" fill={c} opacity="0.2" />
        <rect x="90" y="110" width="220" height="200" rx="24" fill={a} transform="rotate(-8 200 210)" />
        <rect x="110" y="96" width="200" height="190" rx="24" fill={b} transform="rotate(6 200 190)" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={150 + i * 34} cy={150 + (i % 2) * 40} r="14" fill={a} opacity="0.85" />
        ))}
        <path d="M120 250 C 170 230, 230 270, 300 246" fill="none" stroke={c} strokeWidth="5" strokeDasharray="10 8" />
      </g>
    )
  }
  // სვანური ქუდი
  return (
    <g>
      <ellipse cx="200" cy="300" rx="130" ry="18" fill={c} opacity="0.2" />
      <path d="M96 276 C 92 160, 308 160, 304 276 Z" fill={a} />
      <path d="M118 200 C 150 172, 250 172, 282 200" fill="none" stroke={b} strokeWidth="6" />
      <ellipse cx="200" cy="276" rx="108" ry="18" fill={c} />
      <path d="M110 240 L 290 240" stroke={b} strokeWidth="14" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M${120 + i * 22} 233 l 8 7 l -8 7 l -8 -7 Z`} fill={a} />
      ))}
    </g>
  )
}

function Carpet({ p }) {
  const [a, b, c] = p.palette
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={112 + i * 16} y1="54" x2={112 + i * 16} y2="70" stroke={b} strokeWidth="3" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={'b' + i} x1={112 + i * 16} y1="330" x2={112 + i * 16} y2="346" stroke={b} strokeWidth="3" />
      ))}
      <rect x="100" y="70" width="200" height="260" fill={a} />
      <rect x="114" y="84" width="172" height="232" fill="none" stroke={b} strokeWidth="8" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${122 + i * 18.5} 96 l 9 9 l -9 9 l -9 -9 Z`} fill={c} />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={'t' + i} d={`M${122 + i * 18.5} 286 l 9 9 l -9 9 l -9 -9 Z`} fill={c} />
      ))}
      {[150, 200, 250].map((y, i) => (
        <g key={y}>
          <path d={`M200 ${y - 32} L 236 ${y} L 200 ${y + 32} L 164 ${y} Z`} fill={i === 1 ? b : c} />
          <path d={`M200 ${y - 16} L 218 ${y} L 200 ${y + 16} L 182 ${y} Z`} fill={i === 1 ? c : b} />
        </g>
      ))}
    </g>
  )
}

function Wood({ p }) {
  const [a, b, c] = p.palette
  if (p.id % 2 === 0) {
    // ყუთი
    return (
      <g>
        <ellipse cx="200" cy="320" rx="130" ry="14" fill={c} opacity="0.2" />
        <rect x="80" y="170" width="240" height="140" rx="6" fill={a} />
        <path d="M70 150 L 330 150 L 320 186 L 80 186 Z" fill={c} />
        <path d="M80 120 L 320 120 L 330 150 L 70 150 Z" fill={b} />
        <Rosette cx={200} cy={240} r={42} color={b} petals={6} />
        <rect x="190" y="180" width="20" height="14" fill={b} />
      </g>
    )
  }
  // დაფა / კოვზები
  return (
    <g>
      <ellipse cx="200" cy="330" rx="110" ry="12" fill={c} opacity="0.2" />
      <rect x="110" y="110" width="180" height="210" rx="40" fill={a} />
      <rect x="180" y="56" width="40" height="70" rx="14" fill={a} />
      <circle cx="200" cy="80" r="9" fill={c} />
      {[150, 190, 230, 270].map((y) => (
        <path key={y} d={`M126 ${y} Q 200 ${y - 10} 274 ${y}`} fill="none" stroke={c} strokeWidth="2" opacity="0.35" />
      ))}
      <circle cx="200" cy="215" r="52" fill="none" stroke={b} strokeWidth="4" />
      <Rosette cx={200} cy={215} r={40} color={b} petals={6} />
    </g>
  )
}

const BY_CATEGORY = { ceramics: Ceramics, enamel: Enamel, felt: Felt, carpet: Carpet, wood: Wood }

// პროდუქტის სურათი: თუ ფოტო აქვს — ფოტო, თუ არა (მაგ. მართვის პანელიდან
// ფოტოს გარეშე დამატებული ნივთი) — SVG ილუსტრაცია მისი ფერებით.
// ოპტიმიზაცია: ყოველ ფოტოს აქვს პატარა WebP ვერსია (500px, ფაილი -500.webp).
// ბრაუზერი srcSet-ით თავად ირჩევს — ბარათზე პატარას, დიდ ეკრანზე დიდს.
export default function ProductArt({ product, className = "", cover = false, sizes = "(max-width: 560px) 50vw, 320px" }) {
  if (product.image) {
    const small = product.image.endsWith('.jpg') ? product.image.replace(/\.jpg$/, '-500.webp') : null
    return (
      <img
        className={`art art-photo ${className}`}
        src={small || product.image}
        srcSet={small ? `${small} 500w, ${product.image} 1000w` : undefined}
        sizes={small ? sizes : undefined}
        width="500"
        height="500"
        alt={product.name}
        loading="lazy"
        // თუ პატარა ვერსია არ არსებობს (მაგ. ახლად დამატებული ფოტო), იტვირთება ორიგინალი
        onError={(e) => {
          const img = e.currentTarget
          if (img.dataset.fallback) return
          img.dataset.fallback = '1'
          img.removeAttribute('srcset')
          img.src = product.image
        }}
        style={product.imagePos ? { objectPosition: product.imagePos } : undefined}
      />
    )
  }
  const Art = BY_CATEGORY[product.category] || Ceramics
  const [, b, c] = product.palette
  return (
    <svg className={`art ${className}`} viewBox="0 0 400 400" preserveAspectRatio={cover ? "xMidYMid slice" : "xMidYMid meet"} role="img" aria-label={product.name}>
      <rect width="400" height="400" fill={b} opacity="0.22" />
      <g fill={c} opacity="0.07">
        {Array.from({ length: 100 }).map((_, i) => (
          <circle key={i} cx={20 + (i % 10) * 40} cy={20 + Math.floor(i / 10) * 40} r="2" />
        ))}
      </g>
      <Art p={product} />
    </svg>
  )
}
