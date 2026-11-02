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
    <p class="lead">Transform your existing kitchen for a fraction of the price of a new one. Plus fitted bedrooms and bathrooms, made to measure and fitted by our own team.</p>
    <div class="btn-row">
      <a class="btn btn-whatsapp" data-wa href="https://wa.me/447457403407">{I["wa"]} Get a free Photoquote</a>
      <a class="btn btn-outline-light" href="contact.html">Contact us</a>
    </div>
    <a class="hero-rating" data-google href="https://share.google/85vLoGir77iD04as1"><span class="stars" aria-hidden="true">★★★★★</span> <u data-rating-text>Read our Google reviews</u></a>
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
        <div class="svc-body"><h3>Kitchen makeovers</h3><p>Replacement doors, drawer fronts, worktops and handles on your existing units, from a budget makeover to a complete renovation.</p></div>
      </div>
      <div class="service-card" data-reveal data-delay="100">
        <img src="assets/img/home/bedrooms-800.webp" loading="lazy" alt="Fitted bedroom furniture in dark green">
        <div class="svc-body"><h3>Fitted bedrooms</h3><p>Fully fitted bedrooms: wardrobes, drawers and storage built around your room.</p></div>
      </div>
      <a class="service-card" href="gallery.html" data-reveal data-delay="200">
        <img src="assets/img/work/job1-6-500.webp" srcset="assets/img/work/job1-6-500.webp 500w, assets/img/work/job1-6-1000.webp 1000w" sizes="(min-width: 900px) 33vw, 100vw" loading="lazy" alt="Bathroom fitted by Reface, with a navy vanity unit and bath panel" style="object-position:50% 60%">
        <span class="svc-tag">Real Reface job</span>
        <div class="svc-body"><h3>Fitted bathrooms</h3><p>Fitted bathrooms designed, supplied and installed by our team.</p><span class="svc-link">See this job {I["arrow"]}</span></div>
      </a>
    </div>
    <p class="offer-extras" data-reveal>We also do kitchen design, bespoke and fully fitted kitchens, complete kitchen renovations, custom and replacement kitchen doors, cabinet installation, granite, quartz and laminate worktops, and appliances.</p>
  </div>
</section>

<section class="section bg-navy" id="studio">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Colour Studio</p><h2 data-reveal>Pick a room. <em>Tap a colour.</em></h2></div>
      <p class="lead" data-reveal>Rooms from our range in our real colours. Tap a colour on the photo, or swipe across it, and watch the room change.</p>
    </div>
    <div class="cs" data-studio data-reveal>
      <div class="cs-bar">
        <div class="cs-tabs" role="tablist" aria-label="Choose a room">
          <button type="button" role="tab" aria-selected="true" data-room="kitchen">Kitchen</button>
          <button type="button" role="tab" aria-selected="false" data-room="bedroom">Bedroom</button>
          <button type="button" role="tab" aria-selected="false" data-room="bathroom">Bathroom</button>
        </div>
        <div class="cs-styles" aria-label="Choose a style"></div>
      </div>
      <div class="cs-stage" tabindex="0" aria-label="Room preview. Swipe or use the arrow keys to change the colour">
        <img class="cs-a" src="assets/img/studio/hero-parisian-blue-oak-900.webp" alt="Kitchen in Parisian Blue Oak" width="1600" height="1002" loading="lazy">
        <div class="cs-wipe" aria-hidden="true"><img class="cs-b" alt="" width="1600" height="1002"><div class="cs-line"></div></div>
        <div class="cs-label"><span class="cs-range">Vinyl · Alnwick door</span><b class="cs-name">Parisian Blue Oak</b></div>
        <div class="cs-dock">
          <span class="cs-hint">Tap a colour</span>
          <div class="cs-dots" role="radiogroup" aria-label="Colours"></div>
        </div>
      </div>
      <div class="cs-foot">
        <p class="cs-note"></p>
        <a class="btn btn-whatsapp cs-cta" href="https://wa.me/447457403407" target="_blank" rel="noopener">{I["wa"]} Free Photoquote in this colour</a>
      </div>
      <p class="studio-disclaimer">Colours are applied digitally to brochure photography to give you an idea of the finish. Screens vary, so ask to see real samples.</p>
    </div>
  </div>
</section>

<section class="section" id="photoquote">
  <div class="container pq">
    <div>
      <p class="eyebrow" data-reveal>Free Photoquote</p>
      <h2 data-reveal>Send a photo. <em>Get a price.</em></h2>
      <p class="lead" style="margin-top:16px" data-reveal>Looking for a kitchen makeover? Do you use WhatsApp? Then ask about our absolutely FREE Photoquote service. It's the quickest way to find out what your makeover would cost, with no home visit needed to get started.</p>
      <div class="btn-row" style="margin-top:24px" data-reveal>
        <a class="btn btn-whatsapp" data-wa href="https://wa.me/447457403407">{I["wa"]} Start my Photoquote</a>
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

LD = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"HomeAndConstructionBusiness","name":"Reface","url":"https://www.refacegroup.co.uk","telephone":"+44 191 456 3718","email":"info@refacegroup.co.uk","description":"Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields.","address":{"@type":"PostalAddress","streetAddress":"85 Westoe Rd","addressLocality":"South Shields","postalCode":"NE33 4LU","addressCountry":"GB"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday"],"opens":"10:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Friday","opens":"09:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"10:00","closes":"14:00"}],"areaServed":"South Shields and nearby areas"}</script>'''

def build():
    return head("Reface | Kitchen Makeovers, Fitted Bedrooms & Bathrooms in South Shields",
                "Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields. Send a photo on WhatsApp for a free Photoquote.", LD) + header("index.html") + body + footer('<script src="js/studio.js"></script>')
