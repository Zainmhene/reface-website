from parts import head, header, footer
from icons import ICONS as I

body = f'''
<section class="hero-still" aria-label="Reface kitchen makeovers">
  <picture>
    <source media="(max-aspect-ratio: 9/10)" srcset="assets/img/home/hero-tall.webp">
    <img class="hs-img" src="assets/img/home/hero-1600.webp" srcset="assets/img/home/hero-900.webp 900w, assets/img/home/hero-1600.webp 1600w" sizes="100vw" width="1600" height="1003" alt="Kitchen with Alnwick shaker doors in Parisian Blue Oak and brass handles" fetchpriority="high">
  </picture>
  <div class="container">
    <p class="eyebrow">Reface · South Shields</p>
    <h1>Same kitchen. <em>Whole new look.</em></h1>
    <p class="lead">Kitchen makeovers, fitted bedrooms and fitted bathrooms, made to measure and fitted by our own team.</p>
    <div class="btn-row">
      <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} Get a free Photoquote</a>
      <a class="btn btn-outline-light" href="contact.html">Contact us</a>
    </div>
    <a class="hero-rating" data-google href="https://share.google/85vLoGir77iD04as1"><span class="stars" aria-hidden="true">★★★★★</span> <u>Read our Google reviews</u></a>
  </div>
</section>

<section class="section" id="offer">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>What we offer</p><h2 data-reveal>A new look, <em>without the upheaval.</em></h2></div>
      <p class="lead" data-reveal>We keep what works and replace what you see. Everything is made to measure and fitted by our own team across South Shields and nearby areas.</p>
    </div>
    <div class="services">
      <div class="service-card" data-reveal>
        <img src="assets/img/home/kitchens-800.webp" loading="lazy" alt="Shaker kitchen in a soft cashmere colour with a white island">
        <div class="svc-body"><h3>Kitchen makeovers</h3><p>New doors, drawer fronts, worktops, handles and splashbacks on your existing units. Complete new kitchens too.</p></div>
      </div>
      <div class="service-card" data-reveal data-delay="100">
        <img src="assets/img/home/bedrooms-800.webp" loading="lazy" alt="Fitted bedroom furniture in dark green">
        <div class="svc-body"><h3>Fitted bedrooms</h3><p>Fitted wardrobes, drawers and storage built around your room, alcoves and slopes included.</p></div>
      </div>
      <div class="service-card no-photo" data-reveal data-delay="200">
        <span class="svc-icon">{I["spark"]}</span>
        <div class="svc-body"><h3>Fitted bathrooms</h3><p>Bathroom installation and renovation, with vanity units and storage to match.</p></div>
      </div>
    </div>
    <p class="offer-extras" data-reveal>Also: quartz, granite and laminate worktops · glass splashbacks · sinks and taps · landlord and pre-sale upgrades.</p>
  </div>
</section>

<section class="section bg-navy" id="photoquote">
  <div class="container pq">
    <div>
      <p class="eyebrow" data-reveal>Free Photoquote</p>
      <h2 data-reveal>Send a photo. <em>Get a price.</em></h2>
      <p class="lead" style="margin-top:16px" data-reveal>The quickest way to find out what your makeover would cost. No home visit needed to get started.</p>
      <div class="btn-row" style="margin-top:24px" data-reveal>
        <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} Start my Photoquote</a>
      </div>
    </div>
    <div class="steps">
      <div class="step" data-reveal><div class="step-num">1</div><h3>Take photos</h3><p>Snap your kitchen, bedroom or bathroom from the front on your phone.</p></div>
      <div class="step" data-reveal data-delay="80"><div class="step-num">2</div><h3>Send them</h3><p>WhatsApp them to us, with rough measurements if you have them.</p></div>
      <div class="step" data-reveal data-delay="160"><div class="step-num">3</div><h3>Get your price</h3><p>We'll come back to you with a free, no-obligation quote.</p></div>
    </div>
  </div>
</section>

<section class="section bg-stone" id="reviews">
  <div class="container">
    <div class="section-head center" style="justify-items:center">
      <p class="eyebrow" data-reveal>Reviews</p>
      <h2 data-reveal>What our <em>customers say.</em></h2>
    </div>
    <div data-reviews="3"></div>
    <p class="center" style="margin-top:24px"><a class="text-link" href="reviews.html">See all reviews</a></p>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="cta-band" data-reveal>
      <div>
        <p class="eyebrow" style="color:var(--brass-light)">Get in touch</p>
        <h2>Let's make your room <em>feel new.</em></h2>
        <p class="lead" style="margin-top:14px">Call us, WhatsApp us, or send a message. We'll get back to you during opening hours.</p>
      </div>
      <div class="btn-row">
        <a class="btn btn-light" data-tel href="tel:+441914563718">{I["phone"]} <span data-tel="text">(0191) 456 3718</span></a>
        <a class="btn btn-outline-light" href="contact.html">Send a message</a>
      </div>
    </div>
  </div>
</section>
'''

LD = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"HomeAndConstructionBusiness","name":"Reface","url":"https://www.refacegroup.co.uk","telephone":"+44 191 456 3718","description":"Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields.","address":{"@type":"PostalAddress","streetAddress":"85 Westoe Rd","addressLocality":"South Shields","postalCode":"NE33 4LU","addressCountry":"GB"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday"],"opens":"10:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Friday","opens":"09:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"10:00","closes":"14:00"}],"areaServed":"South Shields and nearby areas"}</script>'''

def build():
    return head("Reface | Kitchen Makeovers, Fitted Bedrooms & Bathrooms in South Shields",
                "Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields. Send a photo on WhatsApp for a free Photoquote.", LD) + header("index.html") + body + footer()
