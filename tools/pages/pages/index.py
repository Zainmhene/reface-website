from parts import head, header, footer
from icons import ICONS as I

body = f'''
<section class="hero-still" aria-label="Reface kitchen makeovers">
  <picture>
    <source media="(min-width: 900px) and (min-aspect-ratio: 9/10)" srcset="assets/img/hero/navy-kitchen-1600.webp 1600w, assets/img/hero/navy-kitchen-2560.webp 2560w" sizes="100vw">
    <source media="(max-aspect-ratio: 9/10)" srcset="assets/img/home/hero-tall-720.webp 720w, assets/img/home/hero-tall-1080.webp 1080w" sizes="100vw">
    <img class="hs-img" src="assets/img/home/hero-1600.webp" srcset="assets/img/home/hero-900.webp 900w, assets/img/home/hero-1600.webp 1600w" sizes="100vw" width="1600" height="1003" alt="Kitchen with shaker doors in Parisian Blue Oak and brass handles" fetchpriority="high">
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
  <span class="hs-note" title="AI visualisation of a finished Reface-style kitchen in navy, marble and brass">Visualisation</span>
</section>

<section class="section" id="offer">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>What we offer</p><h2 data-reveal>A new look, <em>without the upheaval.</em></h2></div>
      <p class="lead" data-reveal>We keep what works and replace what you see. Everything is made to measure and fitted by our own team across South Shields and nearby areas.</p>
    </div>
    <div class="services services-4">
      <a class="service-card" href="#design" data-reveal>
        <img src="assets/img/home/kitchens-800.webp" srcset="assets/img/home/kitchens-800.webp 800w, assets/img/home/kitchens-1200.webp 1200w" sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" alt="Shaker kitchen in a soft cashmere colour with a white island">
        <div class="svc-body"><h3>Kitchen makeovers</h3><p>New doors, drawer fronts, worktops and handles on your existing units. A whole new look for a fraction of the cost of a new kitchen.</p><span class="svc-link">Design yours {I["arrow"]}</span></div>
      </a>
      <a class="service-card" href="gallery.html" data-reveal data-delay="80">
        <img src="assets/img/work/job5-1-500.webp" srcset="assets/img/work/job5-1-500.webp 500w, assets/img/work/job5-1-1000.webp 1000w" sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" alt="Dark grey shaker kitchen fitted by Reface, with marble-effect worktops">
        <span class="svc-tag">Real Reface job</span>
        <div class="svc-body"><h3>Fitted kitchens</h3><p>Complete kitchens designed, supplied and fitted by our own team, from the units to the worktops and appliances.</p><span class="svc-link">See our kitchens {I["arrow"]}</span></div>
      </a>
      <a class="service-card" href="#design" data-reveal data-delay="160">
        <img src="assets/img/home/bedrooms-800.webp" srcset="assets/img/home/bedrooms-800.webp 800w, assets/img/home/bedrooms-1200.webp 1200w" sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" alt="Fitted bedroom furniture in dark green">
        <div class="svc-body"><h3>Fitted bedrooms</h3><p>Wardrobes, drawers and storage made to measure and built around your room.</p><span class="svc-link">Design yours {I["arrow"]}</span></div>
      </a>
      <a class="service-card" href="gallery.html" data-reveal data-delay="240">
        <img src="assets/img/work/job1-6-500.webp" srcset="assets/img/work/job1-6-500.webp 500w, assets/img/work/job1-6-1000.webp 1000w" sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" alt="Bathroom fitted by Reface, with a navy vanity unit and bath panel" style="object-position:50% 60%">
        <span class="svc-tag">Real Reface job</span>
        <div class="svc-body"><h3>Fitted bathrooms</h3><p>Bathrooms designed, supplied and installed by our own team.</p><span class="svc-link">See this job {I["arrow"]}</span></div>
      </a>
    </div>
    <p class="offer-extras" data-reveal>We also do kitchen design, complete kitchen renovations, custom and replacement kitchen doors, cabinet installation, granite, quartz and laminate worktops, and appliances.</p>
  </div>
</section>

<section class="section" id="design">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Design your room</p><h2 data-reveal>Choose a door, a colour <em>and a handle.</em></h2></div>
      <p class="lead" data-reveal>Watch your kitchen or bedroom change as you tap. The close-up shows your exact door with the handle fitted. When you like it, send the design to us for a free quote.</p>
    </div>
    <div class="dz" data-designer data-reveal>
      <div class="dz-top">
        <div class="rooms" role="tablist" aria-label="Room">
          <button type="button" role="tab" id="dz-r-k" aria-selected="true">Kitchen</button>
          <button type="button" role="tab" id="dz-r-b" aria-selected="false">Bedroom</button>
        </div>
      </div>
      <div class="dz-home" id="dz-home">
        <div class="stage" id="dz-stage">
          <div class="slot room big" id="dz-s-room">
            <img id="dz-base-a" alt="Kitchen with Classic Shaker doors in Parisian Blue Oak" src="assets/img/designer/k/shaker-parisian-blue-oak.webp" width="1600" height="1005" loading="lazy">
            <img id="dz-base-b" alt="" src="assets/img/designer/k/shaker-parisian-blue-oak.webp" width="1600" height="1005" loading="lazy">
            <img id="dz-hl" alt="" src="assets/img/designer/k/h2/cup-handle-satin-brass.webp" width="1600" height="1005" loading="lazy">
            <span class="near" id="dz-near" hidden></span>
            <span class="vis">Visualisation · colours are a guide</span>
            <button type="button" class="swapchip"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 2h5v5M7 14H2V9M14 2 9 7M2 14l5-5"/></svg>Room</button>
          </div>
          <div class="slot cu small" id="dz-s-cu">
            <div class="scene" id="dz-scene" role="img" aria-label="Close-up of your doors and handles"></div>
            <span class="vis">Close-up · visualisation</span>
            <button type="button" class="swapchip"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 2h5v5M7 14H2V9M14 2 9 7M2 14l5-5"/></svg>Close-up</button>
          </div>
          <span class="loading" id="dz-loading" hidden></span>
        </div>
      </div>
      <div class="bar" id="dz-bar">
        <div class="row"><div class="lab"><b>Door</b><span id="dz-l-door"></span></div><div class="strip" id="dz-row-door"></div></div>
        <div class="row"><div class="lab"><b>Colour</b><span id="dz-l-colour"></span></div><div class="strip cols" id="dz-row-colour"></div></div>
        <div class="row"><div class="lab"><b>Handle</b><span id="dz-l-handle"></span></div><div class="strip" id="dz-row-handle"></div></div>
      </div>
      <div class="summary" aria-live="polite">
        <div><b id="dz-sum-main">Kitchen: Classic Shaker in Parisian Blue Oak</b><small id="dz-sum-sub"></small></div>
        <a class="btn btn-whatsapp" id="dz-cta" href="https://wa.me/447457403407" target="_blank" rel="noopener">{I["wa"]} Get a free quote for this design</a>
      </div>
      <p class="dz-note">Tap the small picture to swap the room and the close-up. "All" shows the whole range. Colours are applied digitally, so ask to see real samples. Rooms other than Shaker are AI visualisations; doors without their own room photo show the nearest style, and the close-up shows the exact door.</p>
    </div>
    <div class="dz dz-sheet" id="dz-sheet" hidden role="dialog" aria-modal="true" aria-labelledby="dz-s-title">
      <div class="back" data-close></div>
      <div class="card">
        <div class="shead"><h2 id="dz-s-title">Choose your design</h2><button type="button" class="done" data-close>Done</button></div>
        <div class="sbody">
          <div class="spv" id="dz-spv"><div class="info" id="dz-info"></div><a class="btn btn-whatsapp" id="dz-cta2" href="https://wa.me/447457403407" target="_blank" rel="noopener">{I["wa"]} Get a free quote for this design</a></div>
          <div class="sright">
            <div class="stabs" role="tablist" aria-label="Range">
              <button type="button" role="tab" data-st="door" aria-selected="true"><b>Doors</b><small id="dz-t-door"></small></button>
              <button type="button" role="tab" data-st="colour" aria-selected="false"><b>Colours</b><small id="dz-t-colour"></small></button>
              <button type="button" role="tab" data-st="handle" aria-selected="false"><b>Handles</b><small id="dz-t-handle"></small></button>
            </div>
            <div class="all" id="dz-s-all"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="photoquote">
  <div class="container pq">
    <div>
      <p class="eyebrow" data-reveal>Free Photoquote</p>
      <h2 data-reveal>Send a photo. <em>Get a price.</em></h2>
      <p class="lead" style="margin-top:16px" data-reveal>Photoquote is our free quote by photo. Send us a few photos of your kitchen, bedroom or bathroom on WhatsApp and we'll come back to you with a price. It's the quickest way to find out what your makeover would cost, with no home visit needed to get started.</p>
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

LD = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"HomeAndConstructionBusiness","name":"Reface","url":"https://www.refacegroup.co.uk","telephone":"+44 191 456 3718","email":"info@refacegroup.co.uk","description":"Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields.","address":{"@type":"PostalAddress","streetAddress":"85 Westoe Rd","addressLocality":"South Shields","postalCode":"NE33 4LU","addressCountry":"GB"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"09:00","closes":"17:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"10:00","closes":"15:00"}],"areaServed":"South Shields and nearby areas"}</script>'''

def build():
    return head("Reface | Kitchen Makeovers, Fitted Bedrooms & Bathrooms in South Shields",
                "Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields. Send a photo on WhatsApp for a free Photoquote.", LD + '\n<link rel="stylesheet" href="css/designer.css">') + header("index.html") + body + footer('<script src="js/designer-data.js"></script>\n<script src="js/designer.js"></script>')
