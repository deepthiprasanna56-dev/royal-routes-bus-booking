import { useMemo, useState } from 'react'
import './App.css'

const buses = [
  { name: 'Zingbus', type: 'AC Sleeper (2+1)', from: '21:30', to: '06:15', duration: '8h 45m', seats: 12, price: 1299, rating: '4.8', tag: 'Most popular', color: 'blue' },
  { name: 'AbhiBus', type: 'AC Sleeper (2+1)', from: '22:45', to: '06:45', duration: '8h', seats: 11, price: 1199, rating: '4.8', tag: 'Top rated', color: 'green' },
  { name: 'IntrCity SmartBus', type: 'AC Seater/Sleeper', from: '22:15', to: '07:10', duration: '8h 55m', seats: 8, price: 1149, rating: '4.7', tag: 'Top rated', color: 'green' },
  { name: 'Royal Express', type: 'Volvo AC Sleeper', from: '23:00', to: '07:30', duration: '8h 30m', seats: 16, price: 1499, rating: '4.9', tag: 'Premium', color: 'purple' },
  { name: 'Morning Star Travels', type: 'AC Seater', from: '06:15', to: '15:10', duration: '8h 55m', seats: 20, price: 899, rating: '4.5', tag: 'Best value', color: 'blue' },
  { name: 'GreenLine Sleeper', type: 'AC Sleeper (2+1)', from: '19:45', to: '04:15', duration: '8h 30m', seats: 6, price: 1399, rating: '4.7', tag: 'Night ride', color: 'green' },
  { name: 'Sapphire Volvo', type: 'Volvo AC Sleeper', from: '20:30', to: '05:00', duration: '8h 30m', seats: 4, price: 1699, rating: '4.9', tag: 'Premium', color: 'purple' },
]
const cities = ['New Delhi', 'Jaipur', 'Agra', 'Chandigarh', 'Lucknow', 'Dehradun', 'Mumbai', 'Pune', 'Bengaluru', 'Hyderabad']
const offers = [
  { discount: '10% OFF', title: 'Your first journey', description: 'Get 10% off your first bus booking.', detail: 'Maximum discount ₹150', code: 'FIRSTBUS', tone: 'green' },
  { discount: '₹100 OFF', title: 'A little travel bonus', description: 'Save ₹100 on an eligible bus ticket.', detail: 'Minimum booking ₹799', code: 'ROUTE100', tone: 'gold' },
  { discount: '15% OFF', title: 'Weekend getaway', description: 'Enjoy a discount on your next weekend trip.', detail: 'Maximum discount ₹200', code: 'WEEKEND', tone: 'clay' },
]
const today = new Date().toISOString().slice(0, 10)

function durationMinutes(duration) {
  const [hours, minutes] = duration.match(/\d+/g).map(Number)
  return hours * 60 + minutes
}

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    swap: <><path d="m7 7 3-3 3 3M10 4v13M17 17l-3 3-3-3M14 20V7"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    bus: <><path d="M5 17h14M6 17l-1 3m14-3 1 3M5 17V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11"/><path d="M5 11h14M8 14h.01M16 14h.01"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function App() {
  const [from, setFrom] = useState('New Delhi')
  const [to, setTo] = useState('Jaipur')
  const [date, setDate] = useState(today)
  const [searched, setSearched] = useState(false)
  const [step, setStep] = useState('search')
  const [bus, setBus] = useState(buses[0])
  const [seats, setSeats] = useState([])
  const [passengers, setPassengers] = useState([])
  const [error, setError] = useState('')
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginPhone, setLoginPhone] = useState('')
  const [filter, setFilter] = useState('All buses')
  const [sortBy, setSortBy] = useState('recommended')
  const [copiedCode, setCopiedCode] = useState('')
  const [ticketId] = useState(() => `GR${Math.floor(100000 + Math.random() * 899999)}`)

  const fare = useMemo(() => seats.length * bus.price, [seats, bus.price])
  const journeyDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const visibleBuses = useMemo(() => {
    const filtered = buses.filter(item => {
      if (filter === 'AC sleeper') return item.type.toLowerCase().includes('sleeper')
      if (filter === 'Under ₹1,300') return item.price < 1300
      if (filter === 'Top rated') return Number(item.rating) >= 4.8
      return true
    })
    if (sortBy === 'price') return [...filtered].sort((a, b) => a.price - b.price)
    if (sortBy === 'departure') return [...filtered].sort((a, b) => a.from.localeCompare(b.from))
    if (sortBy === 'duration') return [...filtered].sort((a, b) => durationMinutes(a.duration) - durationMinutes(b.duration))
    if (sortBy === 'rating') return [...filtered].sort((a, b) => Number(b.rating) - Number(a.rating))
    return filtered
  }, [filter, sortBy])

  async function copyOfferCode(code) {
    let copied
    try {
      await navigator.clipboard.writeText(code)
      copied = true
    } catch {
      const input = document.createElement('textarea')
      input.value = code
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      copied = document.execCommand('copy')
      input.remove()
    }
    if (copied) setCopiedCode(code)
  }

  function searchBuses(event) {
    event.preventDefault()
    if (!from || !to || from === to) { setError('Choose two different cities to find your ride.'); return }
    setError('')
    setSearched(true)
    setStep('search')
    window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }
  function chooseBus(item) { setBus(item); setSeats([]); setStep('seats'); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function toggleSeat(id) {
    setSeats(current => current.includes(id) ? current.filter(seat => seat !== id) : current.length < 6 ? [...current, id] : current)
    setError('')
  }
  function continueToPassengers() {
    if (!seats.length) { setError('Select at least one seat to continue.'); return }
    setPassengers(seats.map((_, i) => ({ name: '', age: '', gender: i === 0 ? 'Female' : 'Male' })))
    setError(''); setStep('passengers'); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function confirmBooking(event) {
    event.preventDefault()
    if (passengers.some(p => !p.name.trim() || !p.age || Number(p.age) < 1 || Number(p.age) > 100)) { setError('Enter each passenger’s name and a valid age.'); return }
    setError(''); setStep('confirmed'); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function resetBooking() { setStep('search'); setSearched(false); setSeats([]); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function navigateTo(target) {
    if (target === 'results') {
      setStep('search')
      setSearched(true)
      setFilter('All buses')
      setSortBy('recommended')
    }
    if (target === 'why-us') setStep('search')
    window.history.pushState(null, '', `#${target}`)
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return <div className="app-shell">
    <header className="site-header"><a className="brand" href="#home" onClick={resetBooking}><span className="brand-mark"><Icon name="bus" size={22}/></span><span>go<span className="brand-accent">route</span><small>TRAVEL, MADE EASY</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#results" onClick={event => { event.preventDefault(); navigateTo('results') }}>Bus tickets</a><a href="#why-us" onClick={event => { event.preventDefault(); navigateTo('why-us') }}>Why goRoute</a><a href="#help">Help</a></nav>
      <button className="login-btn" onClick={() => setLoginOpen(true)}><Icon name="user"/> <span>Log in</span></button>
    </header>

    {step === 'search' && <>
      <main id="home">
        <section className="hero"><div className="hero-bg-shape shape-one"/><div className="hero-bg-shape shape-two"/><div className="hero-copy"><div className="eyebrow"><span/> YOUR NEXT ADVENTURE STARTS HERE</div><h1>Good trips.<br/><em>Great stories.</em></h1><p>Find your seat, settle in, and let the road take you somewhere wonderful.</p><div className="hero-proof"><span className="proof-avatars"><i>A</i><i>R</i><i>S</i></span><span><b>2 million+</b> happy travellers</span><span className="proof-stars">★★★★★ <b>4.8/5</b></span></div></div>
          <div className="hero-art"><div className="sun-disc"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="road-line"/><div className="bus-illustration"><div className="bus-top"><span>go<span>route</span></span><b>EXPRESS</b></div><div className="bus-windows"><i/><i/><i/><i/></div><div className="bus-lower"><span>✦</span><span>✦</span><span>✦</span></div><div className="bus-wheel wheel-left"/><div className="bus-wheel wheel-right"/></div><div className="art-label label-top">TAKE THE SCENIC ROUTE <span>↗</span></div><div className="art-label label-bottom">MADE FOR THE JOURNEY</div><div className="sparkle spark-one">✳</div><div className="sparkle spark-two">✦</div></div>
        </section>
        <section className="search-wrap" aria-label="Search for buses"><form className="search-card" onSubmit={searchBuses}>
          <label className="field"><span className="field-icon"><Icon name="pin"/></span><span className="field-content"><small>FROM</small><select value={from} onChange={e => setFrom(e.target.value)} aria-label="From city">{cities.map(city => <option key={city}>{city}</option>)}</select></span></label>
          <button type="button" className="swap-btn" aria-label="Swap cities" onClick={() => { setFrom(to); setTo(from) }}><Icon name="swap" size={18}/></button>
          <label className="field"><span className="field-icon"><Icon name="pin"/></span><span className="field-content"><small>TO</small><select value={to} onChange={e => setTo(e.target.value)} aria-label="To city">{cities.map(city => <option key={city}>{city}</option>)}</select></span></label>
          <label className="field date-field"><span className="field-icon"><Icon name="calendar"/></span><span className="field-content"><small>JOURNEY DATE</small><input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} aria-label="Journey date" required/></span></label>
          <button className="search-btn" type="submit"><span>Find my bus</span><Icon name="arrow"/></button>
        </form>{error && <p className="form-error search-error">{error}</p>}</section>
        <section className="trust-row"><span><Icon name="shield"/> Safe & secure booking</span><i/><span>✦ &nbsp;Free cancellation options</span><i/><span>◷ &nbsp;24/7 travel support</span></section>
        <section className="offers-section"><div className="offers-heading"><div><span className="eyebrow">SPECIAL OFFERS</span><h2>A better trip, for less.</h2><p>Pick an offer, copy the code, and get ready for your next adventure.</p></div><span className="offers-note">Demo offers only. Discounts are not applied to ticket totals.</span></div><div className="offer-grid">{offers.map(offer => <article className={`offer-card offer-${offer.tone}`} key={offer.code}><div><span className="offer-label">goRoute offer</span><h3>{offer.discount}</h3><h4>{offer.title}</h4><p>{offer.description}</p><small>{offer.detail}</small></div><button type="button" className="offer-code" onClick={() => copyOfferCode(offer.code)}><span><small>COUPON CODE</small><b>{offer.code}</b></span><span>{copiedCode === offer.code ? 'Copied!' : 'Copy code'}</span></button></article>)}</div></section>
        {!searched && <section className="popular-section"><div className="section-heading"><div><span className="eyebrow">A LITTLE INSPIRATION</span><h2>Popular getaways</h2></div><a href="#results" onClick={event => { event.preventDefault(); navigateTo('results') }}>See all routes <Icon name="arrow" size={16}/></a></div><div className="route-grid">{[['Jaipur','Pink city weekends','6h 30m','JAIPUR'],['Agra','A little wonder awaits','3h 45m','AGRA'],['Dehradun','Trade city lights for pines','5h 50m','DEHRADUN']].map(([city, caption, duration, code], i) => <button className={`route-card route-${i+1}`} key={city} onClick={() => { setTo(city); navigateTo('results') }}><span className="route-code">DEL → {code}</span><span className="route-city">{city}</span><span className="route-caption">{caption}</span><span className="route-duration"><Icon name="clock" size={14}/>{duration} <b>from ₹{i === 0 ? '799' : i === 1 ? '499' : '699'}</b></span></button>)}</div></section>}
        {searched && <section className="results-section" id="results"><div className="results-heading"><div><span className="eyebrow">YOUR NEXT RIDE</span><h2>{from} <span>→</span> {to}</h2><p>{journeyDate} · {visibleBuses.length} {visibleBuses.length === 1 ? 'bus' : 'buses'} found</p></div><button className="edit-search" onClick={() => { document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) }}>Edit search ↑</button></div><div className="result-controls"><div className="filters">{['All buses','AC sleeper','Under ₹1,300','Top rated'].map(f => <button className={filter === f ? 'filter active' : 'filter'} key={f} onClick={() => setFilter(f)}>{f}</button>)}</div><label className="sort-control">Sort by <select aria-label="Sort buses" value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="recommended">Recommended</option><option value="price">Price: low to high</option><option value="departure">Departure: earliest</option><option value="duration">Shortest journey</option><option value="rating">Highest rated</option></select></label></div><div className="bus-list">{visibleBuses.map((item, i) => <article className="bus-card" key={item.name}><div className="bus-operator"><span className={`operator-icon ${item.color}`}>✦</span><div><h3>{item.name}</h3><p>{item.type}</p></div>{i === 0 && <span className="bus-tag">{item.tag}</span>}</div><div className="bus-timing"><div><b>{item.from}</b><small>{from}</small></div><div className="duration"><span>{item.duration}</span><i/><small>Direct</small></div><div><b>{item.to}</b><small>{to}</small></div></div><div className="bus-amenities"><span>❄ &nbsp;AC</span><span>◉ &nbsp;Charging</span><span>☾ &nbsp;Blanket</span></div><div className="bus-book"><div><strong>₹{item.price.toLocaleString('en-IN')}</strong><small>onwards · {item.seats} seats left</small></div><button onClick={() => chooseBus(item)}>View seats <Icon name="arrow" size={16}/></button><div className="rating">★ {item.rating}</div></div></article>)}</div></section>}
        <section className="why-row" id="why-us"><div className="why-title"><span className="eyebrow">THE GO ROUTE DIFFERENCE</span><h2>It’s the little things<br/>that make a trip.</h2></div><div><span className="why-icon">♧</span><h3>Thoughtful journeys</h3><p>Know what to expect before you board, from seat to stop.</p></div><div><span className="why-icon">⌁</span><h3>Plans can change</h3><p>Flexible ticket options to keep your trip stress-free.</p></div><div><span className="why-icon">♡</span><h3>Here when you need us</h3><p>Real people, ready to help you get where you’re going.</p></div></section>
      </main>
    </>}

    {step !== 'search' && <main className="booking-main"><div className="booking-top"><button className="back-btn" onClick={() => { setStep(step === 'confirmed' ? 'search' : step === 'passengers' ? 'seats' : 'search'); setError('') }}>← <span>{step === 'confirmed' ? 'Back to home' : 'Back'}</span></button><div className="steps"><span className="done"><i>✓</i> Choose bus</span><b/><span className={step === 'seats' ? 'current' : 'done'}><i>{step === 'seats' ? '2' : '✓'}</i> Select seats</span><b/><span className={step === 'passengers' || step === 'confirmed' ? 'current' : ''}><i>{step === 'confirmed' ? '✓' : '3'}</i> Passenger details</span></div></div>
      {step === 'seats' && <><div className="booking-title"><div><span className="eyebrow">MAKE YOURSELF COMFORTABLE</span><h1>Pick your seats</h1><p>{from} to {to} <span>·</span> {journeyDate} <span>·</span> {bus.from} departure</p></div><div className="bus-pill"><span className="operator-icon blue">✦</span><span><b>{bus.name}</b><small>{bus.type}</small></span></div></div><div className="seat-layout"><section className="seat-picker"><div className="seat-picker-head"><h2>Lower deck</h2><span>Front of bus <span className="steering">◉</span></span></div><div className="seat-legend"><span><i className="seat-sample"/> Available</span><span><i className="seat-sample selected"/> Selected</span><span><i className="seat-sample booked"/> Occupied</span><span><i className="seat-sample ladies"/> Ladies</span></div><div className="seat-map"><div className="driver-label">DRIVER</div><div className="seat-grid">{Array.from({ length: 24 }, (_, idx) => { const n = idx + 1; const occupied = [2, 5, 8, 11, 14, 19, 21].includes(n); const aisle = idx % 3 === 2; return <span className={aisle ? 'seat-cell aisle-gap' : 'seat-cell'} key={n}>{!aisle && <button disabled={occupied} aria-label={`Seat ${n}${occupied ? ', occupied' : ''}`} className={`seat ${occupied ? 'occupied' : ''} ${seats.includes(`${n}A`) ? 'chosen' : ''} ${n === 6 || n === 13 ? 'ladies-seat' : ''}`} onClick={() => toggleSeat(`${n}A`)}>{n}A</button>}</span> })}</div><div className="seat-map-note"><span>← Window</span><span>Aisle →</span></div></div><div className="upper-deck"><h3>Upper deck <span>More room to stretch out</span></h3><div>{['21U','22U','23U','24U','25U','26U'].map((s, i) => <button key={s} className={`seat ${[1,4].includes(i) ? 'occupied' : ''} ${seats.includes(s) ? 'chosen' : ''}`} disabled={[1,4].includes(i)} onClick={() => toggleSeat(s)}>{s}</button>)}</div></div></section><aside className="booking-sidebar"><div className="sidebar-route"><span className="route-rail"><i/><b/><i/></span><div><b>{from}</b><small>{bus.from} · Boarding point</small><b>{to}</b><small>{bus.to} · Arrival point</small></div></div><div className="sidebar-info"><span><Icon name="calendar" size={16}/>{journeyDate}</span><span><Icon name="clock" size={16}/>{bus.duration}</span></div><div className="selected-fares"><h3>Your selection <small>{seats.length}/6 seats</small></h3>{seats.length ? seats.map(s => <div className="fare-row" key={s}><span>Seat {s}</span><b>₹{bus.price.toLocaleString('en-IN')}</b></div>) : <p className="empty-seats">Tap a seat to add it to your trip.</p>}</div><div className="total-row"><span>Total fare</span><strong>₹{fare.toLocaleString('en-IN')}</strong></div><button className="primary-btn full" onClick={continueToPassengers}>Continue <Icon name="arrow"/></button>{error && <p className="form-error">{error}</p>}<small className="secure-note"><Icon name="shield" size={14}/> Secure checkout · Free cancellation</small></aside></div></>}

      {step === 'passengers' && <><div className="booking-title"><div><span className="eyebrow">ALMOST THERE</span><h1>Who’s travelling?</h1><p>Just a few details, then your getaway is booked.</p></div></div><form className="passenger-layout" onSubmit={confirmBooking}><section className="passenger-card"><div className="card-heading"><span className="heading-icon"><Icon name="user"/></span><div><h2>Passenger details</h2><p>Enter the details as they appear on your ID</p></div></div>{passengers.map((p, i) => <div className="passenger-fields" key={i}><div className="passenger-label">PASSENGER {i + 1}<span>Seat {seats[i]}</span></div><div className="passenger-inputs"><label>Full name<input required placeholder="e.g. Aanya Sharma" value={p.name} onChange={e => setPassengers(passengers.map((p, n) => n === i ? { ...p, name: e.target.value } : p))}/></label><label>Age<input required type="number" min="1" max="100" placeholder="Age" value={p.age} onChange={e => setPassengers(passengers.map((p, n) => n === i ? { ...p, age: e.target.value } : p))}/></label><label>Gender<select value={p.gender} onChange={e => setPassengers(passengers.map((p, n) => n === i ? { ...p, gender: e.target.value } : p))}><option>Female</option><option>Male</option><option>Other</option></select></label></div></div>)}<div className="contact-fields"><h3>Contact details</h3><p>Your ticket will be sent here</p><div className="passenger-inputs"><label>Mobile number<div className="phone-input"><span>🇮🇳 +91</span><input required type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" title="Enter a 10-digit mobile number"/></div></label><label>Email address<input required type="email" placeholder="you@example.com"/></label></div></div></section><aside className="booking-sidebar checkout-sidebar"><h3>Booking summary</h3><div className="summary-bus"><span className="operator-icon blue">✦</span><span><b>{bus.name}</b><small>{bus.type}</small></span></div><div className="summary-route"><b>{from}</b><span>→</span><b>{to}</b><small>{journeyDate} · {bus.from} departure</small></div><div className="fare-row"><span>Seats ({seats.join(', ')})</span><b>₹{fare.toLocaleString('en-IN')}</b></div><div className="fare-row"><span>Taxes & fees</span><b>Included</b></div><div className="total-row"><span>Total payable</span><strong>₹{fare.toLocaleString('en-IN')}</strong></div><button className="primary-btn full">Confirm & book <Icon name="arrow"/></button>{error && <p className="form-error">{error}</p>}<small className="secure-note"><Icon name="shield" size={14}/> Your details are encrypted and secure</small></aside></form></>}

      {step === 'confirmed' && <section className="confirmation"><div className="confirmation-check"><Icon name="check" size={32}/></div><span className="eyebrow">IT’S OFFICIAL</span><h1>Your trip is booked!</h1><p className="confirm-copy">Your getaway is just around the corner. We’ve sent your ticket details to your inbox.</p><div className="ticket"><div className="ticket-top"><div><span className="eyebrow">E-TICKET · {ticketId}</span><h2>{bus.name}</h2><span>{bus.type}</span></div><span className="confirmed-tag"><Icon name="check" size={14}/> CONFIRMED</span></div><div className="ticket-route"><div><small>FROM</small><b>{from}</b><span>{bus.from}</span></div><div className="ticket-line"><span>✦</span><i/></div><div><small>TO</small><b>{to}</b><span>{bus.to}</span></div></div><div className="ticket-meta"><div><small>DATE</small><b>{journeyDate}</b></div><div><small>SEAT{seats.length > 1 ? 'S' : ''}</small><b>{seats.join(', ')}</b></div><div><small>PASSENGER{passengers.length > 1 ? 'S' : ''}</small><b>{passengers.map(p => p.name).join(', ')}</b></div><div><small>TOTAL PAID</small><b>₹{fare.toLocaleString('en-IN')}</b></div></div><div className="ticket-footer"><span>✦ &nbsp;Please arrive 15 minutes before departure</span><span>Need help? <a href="mailto:hello@goroute.example">Talk to us</a></span></div></div><button className="primary-btn" onClick={resetBooking}>Back to home <Icon name="arrow"/></button></section>}
    </main>}

    <footer className="site-footer" id="help"><a className="brand footer-brand" href="#home" onClick={resetBooking}><span className="brand-mark"><Icon name="bus" size={20}/></span><span>go<span className="brand-accent">route</span><small>TRAVEL, MADE EASY</small></span></a><span>Go somewhere good. © 2026 goRoute</span><div><a href="mailto:hello@goroute.example">Contact</a><a href="#why-us">About us</a><a href="#help">Travel help</a></div></footer>
    {loginOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setLoginOpen(false) }}><section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="modal-close" aria-label="Close" onClick={() => setLoginOpen(false)}>×</button><span className="modal-icon"><Icon name="bus" size={25}/></span><span className="eyebrow">WELCOME ABOARD</span><h2 id="login-title">Your journeys,<br/>all in one place.</h2><p>Log in or create an account to see your bookings and save your favourite routes.</p><form onSubmit={e => { e.preventDefault(); setLoginOpen(false) }}><label>Mobile number</label><div className="phone-input"><span>🇮🇳 +91</span><input autoFocus required type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" value={loginPhone} onChange={e => setLoginPhone(e.target.value)}/></div><button className="primary-btn full">Continue <Icon name="arrow"/></button></form><small>By continuing, you agree to our <a href="#help">Terms</a> & <a href="#help">Privacy Policy</a>.</small></section></div>}
  </div>
}

export default App
