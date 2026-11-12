// პროდუქტების საწყისი მონაცემები.
// რეალურ პროექტში ეს მონაცემები სერვერიდან / მონაცემთა ბაზიდან ჩაიტვირთებოდა.
// ხელოსნები და მათი სახელები გამოგონილია (სადემონსტრაციო).
//
// ფოტოები დევს public/products/ საქაღალდეში.
// ახალი ფოტოს დასამატებლად ჩააგდეთ ფაილი იქ და მიუთითეთ image: 'products/ფაილი.jpg'
// imagePos — ფოტოს რომელი ნაწილი გამოჩნდეს კვადრატულ ბარათზე (CSS object-position).

export const CATEGORIES = [
  { id: 'ceramics', name: 'კერამიკა', note: 'დოქები, ლარნაკები, ფიალები' },
  { id: 'enamel', name: 'მინანქარი', note: 'ტიხრული მინანქრის სამკაულები' },
  { id: 'felt', name: 'თექა', note: 'სვანური ქუდები, შარფები' },
  { id: 'carpet', name: 'ფარდაგი', note: 'ხელით ნაქსოვი ფარდაგები' },
  { id: 'wood', name: 'ხის ნაკეთობა', note: 'ყუთები, კოვზები' },
]

export const REGIONS = ['თბილისი', 'კახეთი', 'იმერეთი', 'სვანეთი', 'სამეგრელო', 'რაჭა', 'თუშეთი']

export const PRODUCTS = [
  {
    id: 1, slug: 'wine-jug', category: 'ceramics', name: 'ღვინის დოქი „ალაზანი"',
    image: 'products/wine-jug.jpg',
    price: 85, stock: 12, region: 'კახეთი', artisan: 'ნინო გელაშვილი',
    technique: 'თიხა, ხელით მოხატული ჭიქური',
    size: 'სიმაღლე 20 სმ', palette: ['#5B3A8C', '#EDE6D6', '#2D5A44'],
    description: 'ღია ფერის კერამიკული დოქი ღვინის ან წყლის მისართმევად. გვერდზე ხელით არის მოხატული ყურძნის მტევანი და ვაზის ფოთლები, ყელი და ძირი მწვანე ჭიქურით არის შემკული.',
    featured: true, rating: 4.8, reviews: [
      { name: 'თამარი', stars: 5, text: 'სუფრაზე ძალიან ლამაზად გამოიყურება, ღვინოს არ ატარებს.' },
      { name: 'Anna K.', stars: 5, text: 'Bought as a gift, arrived well packed.' },
    ],
  },
  {
    id: 3, slug: 'clay-bowls', category: 'ceramics', name: 'თიხის ფიალები (2 ცალი)',
    image: 'products/clay-bowls.jpg',
    price: 45, stock: 20, region: 'სამეგრელო', artisan: 'მაკა ჯანაშია',
    technique: 'წითელი თიხა, უჭიქურო ზედაპირი',
    size: 'დიამეტრი 16 სმ', palette: ['#C97B3D', '#F0D9C0', '#7A3E1A'],
    description: 'ორი ბრტყელი ფიალა წითელი თიხისგან. გამოდგება სუფრაზე მისართმევად, თიხა სითბოს დიდხანს ინარჩუნებს.',
    featured: false, rating: 4.7, reviews: [],
  },
  {
    id: 4, slug: 'enamel-necklace', category: 'enamel', name: 'მინანქრის ყელსაბამი',
    image: 'products/enamel-necklace.jpg',
    price: 160, stock: 8, region: 'თბილისი', artisan: 'ეკა მამულაშვილი',
    technique: 'ტიხრული მინანქარი, ვერცხლი 925',
    size: 'დიამეტრი 3.5 სმ · ჯაჭვი 45 სმ', palette: ['#1F4FA8', '#C9D6EA', '#13306B'],
    description: 'რგოლისებრი გულსაკიდი ლურჯი და ცისფერი მინანქრით, ტალღისებრი ორნამენტით. ტიხრული მინანქარი ქართული ოქრომჭედლობის ერთ-ერთი უძველესი ტექნიკაა: ვერცხლის თხელი ტიხრები ფერად მინას ყოფს და ნიმუშს ქმნის.',
    featured: true, rating: 4.9, reviews: [
      { name: 'სოფო', stars: 5, text: 'ფოტოზე უკეთესია, ფერები ძალიან ცოცხალია.' },
      { name: 'ნათია', stars: 5, text: 'დედას ვაჩუქე, ძალიან გაუხარდა.' },
    ],
  },
  {
    id: 5, slug: 'enamel-earrings', category: 'enamel', name: 'მინანქრის საყურეები',
    image: 'products/enamel-earrings.jpg', imagePos: 'center 20%',
    price: 135, stock: 10, region: 'თბილისი', artisan: 'ეკა მამულაშვილი',
    technique: 'ტიხრული მინანქარი, მოოქროვილი ვერცხლი',
    size: '2 სმ', palette: ['#2D6A4F', '#A7D3E0', '#1F4FA8'],
    description: 'მარაოს ფორმის საყურეები ლურჯი და მწვანე ყვავილებით ცისფერ ფონზე. მსუბუქია და ყოველდღიურად ტარებისთვის მოსახერხებელი.',
    featured: true, rating: 4.8, reviews: [],
  },
  {
    id: 6, slug: 'enamel-brooch', category: 'enamel', name: 'მინანქრის გულსაბნევი',
    image: 'products/enamel-brooch.jpg',
    price: 110, stock: 4, region: 'იმერეთი', artisan: 'დავით ქავთარაძე',
    technique: 'მინანქარი, მოოქროვილი ლითონი',
    size: '5 × 6 სმ', palette: ['#C9A227', '#8C2B1F', '#4FB3BF'],
    description: 'ფრთაგაშლილი ჩიტის ფორმის გულსაბნევი წითელი და ფირუზისფერი მინანქრით. პალტოზე, პიჯაკზე ან შარფზე დასამაგრებლად.',
    featured: false, rating: 4.5, reviews: [],
  },
  {
    id: 7, slug: 'svan-hat', category: 'felt', name: 'სვანური ქუდი',
    image: 'products/svan-hat.jpg',
    price: 55, stock: 25, region: 'სვანეთი', artisan: 'ლია ფილფანი',
    technique: 'ცხვრის მატყლი, სველი თელვა',
    size: 'უნივერსალური ზომა', palette: ['#4A4A4A', '#D9D9D9', '#1E1E1E'],
    description: 'ნაცრისფერი სვანური ქუდი ხელით თელილი მატყლისგან, შავი ნაკერებით. ზამთარში თბილია, ზაფხულში მზისგან იცავს — მთაში ასე ატარებენ საუკუნეებია.',
    featured: true, rating: 4.9, reviews: [
      { name: 'Mark', stars: 5, text: 'Authentic and warm. Great souvenir from Svaneti.' },
    ],
  },
  {
    id: 8, slug: 'felt-shawl', category: 'felt', name: 'თექის შარფი „მთის ყვავილი"',
    image: 'products/felt-shawl.jpg', imagePos: 'center 30%',
    price: 75, stock: 9, region: 'თუშეთი', artisan: 'ქეთო ბაღაკაშვილი',
    technique: 'მერინოს მატყლი აბრეშუმზე ნათელი',
    size: '180 × 60 სმ', palette: ['#B3263E', '#F2F0EC', '#6B6B6B'],
    description: 'თეთრი ნუნო-თექის მოსასხამი წითელი ყაყაჩოებით. მსუბუქია, არ იჩხვლიტება და მხრებზე კარგად ეხვევა.',
    featured: false, rating: 4.7, reviews: [],
  },
  {
    id: 10, slug: 'kakhuri-pardagi', category: 'carpet', name: 'კახური ფარდაგი',
    image: 'products/kakhuri-pardagi.jpg',
    price: 680, stock: 2, region: 'კახეთი', artisan: 'მანანა ხოსიტაშვილი',
    technique: 'შალი, ხელით ქსოვა საქსოვ დაზგაზე, ნატურალური საღებავები',
    size: '120 × 180 სმ', palette: ['#8C1C2B', '#E2B44B', '#1F2F4F'],
    description: 'წითელი ფარდაგი სამი დიდი რომბით და ცისფერ-ოქროსფერი ორნამენტით. ხაოს გარეშეა და ორივე მხრიდან გამოიყენება. ერთი ფარდაგის მოქსოვას დაახლოებით ორი თვე სჭირდება.',
    featured: true, rating: 5.0, reviews: [
      { name: 'ირაკლი', stars: 5, text: 'ოთახის მთავარი დეტალი გახდა. ფერები ზუსტად ისეთია, როგორც საიტზე.' },
    ],
  },
  {
    id: 11, slug: 'small-pardagi', category: 'carpet', name: 'პატარა ფარდაგი',
    image: 'products/small-pardagi.jpg',
    price: 290, stock: 5, region: 'თუშეთი', artisan: 'ლამარა იდოიძე',
    technique: 'მატყლი და ბამბა, ხელით ქსოვა',
    size: '60 × 100 სმ', palette: ['#1F5C4F', '#F2EDE0', '#D9C24A'],
    description: 'მწვანე ფარდაგი ქართული ანბანის ასოებით და ტრადიციული ორნამენტით, ფოჩებით. კარგად ჯდება შემოსასვლელში ან ბავშვის ოთახში.',
    featured: false, rating: 4.8, reviews: [],
  },
  {
    id: 12, slug: 'wall-carpet', category: 'carpet', name: 'კედლის ხალიჩა',
    image: 'products/wall-carpet.jpg', imagePos: 'center 35%',
    price: 420, stock: 3, region: 'რაჭა', artisan: 'ნანა ჯაფარიძე',
    technique: 'შალი, ხელით ქსოვა',
    size: '50 × 100 სმ', palette: ['#1E1E1E', '#B3263E', '#7FA7D9'],
    description: 'შავი ფონის დეკორატიული ხალიჩა წითელი, ცისფერი და თეთრი ორნამენტებით და ფოჩებით. განკუთვნილია კედელზე ჩამოსაკიდად.',
    featured: false, rating: 4.7, reviews: [],
  },
  {
    id: 14, slug: 'jewelry-box', category: 'wood', name: 'კვეთილი ყუთი სამკაულებისთვის',
    image: 'products/jewelry-box.jpg',
    price: 95, stock: 7, region: 'სამეგრელო', artisan: 'ბესო ქობალია',
    technique: 'კაკლის ხე, შიგნით რბილი ქსოვილი',
    size: '26 × 18 × 8 სმ', palette: ['#6F4E37', '#EFE9E0', '#3E2A1E'],
    description: 'კაკლის ხის ყუთი სამკაულებისთვის. სახურავში ჯაჭვების ჩამოსაკიდებელი ადგილია, ქვემოთ კი ბეჭდებისა და საყურეების განყოფილებები.',
    featured: true, rating: 4.8, reviews: [],
  },
  {
    id: 15, slug: 'wooden-spoons', category: 'wood', name: 'ხის კოვზები (3 ცალი)',
    image: 'products/wooden-spoons.jpg',
    price: 35, stock: 30, region: 'სვანეთი', artisan: 'ლია ფილფანი',
    technique: 'ნეკერჩხალი, ბალი და კაკალი, ხელით თლა',
    size: '25–30 სმ', palette: ['#C9A27A', '#2F3640', '#5A3E2B'],
    description: 'სამი კოვზი სამი სახის ხისგან. ხე ჭურჭელს არ კაწრავს და სწორი მოვლით წლობით ძლებს.',
    featured: false, rating: 4.6, reviews: [],
  },
  {
    id: 16, slug: 'pomegranate-vase', category: 'ceramics', name: 'ლარნაკი „ბროწეული"',
    image: 'products/pomegranate-vase.jpg',
    price: 140, stock: 0, region: 'თბილისი', artisan: 'გიორგი ბერიძე',
    technique: 'შავი თიხა, ხელით მოხატული',
    size: 'სიმაღლე 18 სმ', palette: ['#1E1E1E', '#D9402B', '#3F7A4A'],
    description: 'შავი თიხის ლარნაკი ხელით მოხატული ბროწეულის ხით. ამჟამად მარაგში არ არის — ახალი პარტია ხელოსანთან მზადდება.',
    featured: false, rating: 4.9, reviews: [],
  },
]

// სატესტო პრომოკოდები
export const PROMO_CODES = {
  KHELOBA10: { percent: 10, label: '10% ფასდაკლება' },
  STUDENT15: { percent: 15, label: '15% სტუდენტური ფასდაკლება' },
}

export const FREE_SHIPPING_FROM = 150
export const DELIVERY = {
  tbilisi: { label: 'თბილისში — 1–2 დღე', price: 6 },
  regions: { label: 'რეგიონებში — 2–4 დღე', price: 10 },
  pickup: { label: 'გატანა სახელოსნოდან (ვაკე)', price: 0 },
}
