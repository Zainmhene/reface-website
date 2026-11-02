from parts import head, header, footer
from icons import ICONS as I
from blocks import enquiry

body = f'''
<section class="hero tone-light" data-hero aria-label="Watch a kitchen come together" data-frames-wide="assets/img/hero/wide/f-{{n}}.webp" data-count-wide="61" data-frames-tall="assets/img/hero/tall/f-{{n}}.webp" data-count-tall="61">
  <div class="hero-track">
    <div class="hero-sticky">
      <canvas class="hero-canvas" aria-hidden="true"></canvas>
      <picture><source media="(max-aspect-ratio: 9/10)" srcset="assets/img/hero/navy-kitchen-tall-900.webp"><img class="hero-fallback" src="assets/img/hero/navy-kitchen-1600.webp" srcset="assets/img/hero/navy-kitchen-900.webp 900w, assets/img/hero/navy-kitchen-1600.webp 1600w" sizes="100vw" alt="Finished navy kitchen with a gold-veined marble alcove, brass hood and brass pendant lights"></picture>
      <div class="hero-shade"></div><div class="hero-shade-light"></div>
      <div class="hero-progress"></div>
      <div class="hero-captions">
        <div class="hero-cap is-on" data-at="0">
          <p class="eyebrow">Reface · South Shields</p>
          <h1>Bare board <em>to brand new.</em></h1>
          <p>Kitchens designed, supplied and fitted across South Shields. Scroll to watch the room come together.</p>
          <div class="btn-row">
            <a class="btn btn-brass" href="estimate.html">Get a free quote {I["arrow"]}</a>
            <a class="btn btn-outline-light" data-wa href="https://wa.me/441914563718">{I["wa"]} WhatsApp Photoquote</a>
          </div>
        </div>
        <div class="hero-cap" data-at="0.23" aria-hidden="true"><p class="eyebrow">01 · Units</p><h2>Made to measure, <em>fitted to the inch.</em></h2><p>Cabinets, doors and drawers built around your room, or new doors on the units you already have.</p></div>
        <div class="hero-cap" data-at="0.36" aria-hidden="true"><p class="eyebrow">02 · Stone</p><h2>Stone, <em>floor to ceiling.</em></h2><p>Quartz, granite and laminate worktops and splashbacks, made to measure.</p></div>
        <div class="hero-cap" data-at="0.57" aria-hidden="true"><p class="eyebrow">03 · Brass</p><h2>Deep navy, <em>warm brass.</em></h2><p>52 door colours, with handles in brass, black, nickel or chrome.</p></div>
        <div class="hero-cap" data-at="0.69" aria-hidden="true"><p class="eyebrow">04 · Light</p><h2>Lit <em>from within.</em></h2><p>Under-cabinet and shelf lighting to finish the room.</p></div>
        <div class="hero-cap" data-at="0.82" aria-hidden="true"><p class="eyebrow">05 · Done</p><h2>Ready for the first <em>Sunday roast.</em></h2><p>Designed, supplied and fitted by Reface, South Shields.</p>
          <div class="btn-row"><a class="btn btn-brass" href="estimate.html">Book a free quote {I["arrow"]}</a><a class="btn btn-outline-light" href="#studio">Try our colours</a></div></div>
      </div>
      <ol class="hero-rail" aria-hidden="true"><li><span>Bare</span></li><li><span>Units</span></li><li><span>Stone</span></li><li><span>Brass</span></li><li><span>Light</span></li><li><span>Done</span></li></ol>
      <div class="scroll-hint"><i></i>Watch the room come together</div>
      <span class="hero-note" title="AI visualisation of a kitchen being built, in Reface navy, marble and brass.">Visualisation</span>
    </div>
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>What we do</p><h2 data-reveal>Three rooms. <em>One standard.</em></h2></div>
      <p class="lead" data-reveal>Made-to-measure kitchens, bedrooms and bathrooms, designed, supplied and fitted across South Shields.</p>
    </div>
    <div class="services">
      <a class="service-card" href="kitchens.html" data-reveal>
        <img src="assets/img/kitchens/glacier-super-matt-black-island-800.webp" loading="lazy" alt="Glacier Super Matt Black kitchen with island">
        <div class="svc-body"><span class="svc-num">01</span><h3>Kitchen makeovers</h3><p>New doors, worktops, handles and splashbacks on your existing units.</p><span class="svc-link">Explore kitchens {I["arrow"]}</span></div>
      </a>
      <a class="service-card" href="bedrooms.html" data-reveal data-delay="100">
        <img src="assets/img/bedrooms/glacier-super-matt-fir-green-800.webp" loading="lazy" alt="Fitted bedroom in Glacier Super Matt Fir Green">
        <div class="svc-body"><span class="svc-num">02</span><h3>Fitted bedrooms</h3><p>Wardrobes, drawers and dressing areas that fit every alcove and slope.</p><span class="svc-link">Explore bedrooms {I["arrow"]}</span></div>
      </a>
      <a class="service-card" href="bathrooms.html" data-reveal data-delay="200">
        <img src="assets/img/studio/bathroom-parisian-blue-900.webp" loading="lazy" alt="Fitted bathroom with vanity unit and tall cupboard" style="object-position:55% 50%">
        <div class="svc-body"><span class="svc-num">03</span><h3>Fitted bathrooms</h3><p>Vanity units and storage in the same door styles and colours.</p><span class="svc-link">Explore bathrooms {I["arrow"]}</span></div>
      </a>
    </div>
  </div>
</section>

<section class="section bg-navy" id="studio">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Colour Studio</p><h2 data-reveal>Pick a room. <em>Tap a colour.</em></h2></div>
      <p class="lead" data-reveal>Real rooms from our range in our real colours. Tap a colour on the photo, or swipe across it, and watch the room change.</p>
    </div>
    <div class="cs" data-studio>
      <div class="cs-bar">
        <div class="cs-tabs" role="tablist" aria-label="Choose a room">
          <button type="button" role="tab" aria-selected="true" data-room="kitchen">Kitchen</button>
          <button type="button" role="tab" aria-selected="false" data-room="bedroom">Bedroom</button>
          <button type="button" role="tab" aria-selected="false" data-room="bathroom">Bathroom</button>
        </div>
        <div class="cs-styles" aria-label="Choose a style"></div>
      </div>
      <div class="cs-stage" tabindex="0" aria-label="Room preview. Swipe or use the arrow keys to change the colour">
        <img class="cs-a" alt="" width="1600" height="1002">
        <img class="cs-b" alt="" width="1600" height="1002" aria-hidden="true">
        <div class="cs-line"></div>
        <div class="cs-label"><span class="cs-range"></span><b class="cs-name"></b></div>
        <div class="cs-dock">
          <span class="cs-hint">Tap a colour</span>
          <div class="cs-dots" role="radiogroup" aria-label="Colours"></div>
        </div>
      </div>
      <div class="cs-foot">
        <p class="cs-note"></p>
        <div class="btn-row">
          <a class="btn btn-light cs-cta" href="estimate.html">Price this colour {I["arrow"]}</a>
          <a class="btn btn-outline-light" href="visualiser.html">{I["spark"]} Try it on my room</a>
        </div>
      </div>
      <p class="studio-disclaimer">Colours are applied digitally to brochure photography to give you an idea of the finish. Screens vary, so ask to see real samples.</p>
    </div>
  </div>
</section>

<section class="section bg-stone" id="reviews">
  <div class="container">
    <div class="section-head center" style="justify-items:center">
      <p class="eyebrow" data-reveal>Reviews</p>
      <h2 data-reveal>Loved by <em>homeowners.</em></h2>
    </div>
    <div data-reviews></div>
  </div>
</section>

''' + enquiry("Home page", "kitchen") + '''
'''

LD = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"HomeAndConstructionBusiness","name":"Reface","alternateName":"Reface Group","url":"https://www.refacegroup.co.uk","telephone":"+44 191 456 3718","email":"info@refacegroup.co.uk","description":"Kitchen makeovers, fitted bedrooms and fitted bathrooms in South Shields. Made-to-measure replacement doors, worktops, handles and splashbacks.","address":{"@type":"PostalAddress","streetAddress":"85 Westoe Rd","addressLocality":"South Shields","postalCode":"NE33 4LU","addressCountry":"GB"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday"],"opens":"10:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Friday","opens":"09:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"10:00","closes":"14:00"}],"areaServed":"South Shields and nearby areas"}</script>
<link rel="preload" as="image" href="assets/img/hero/wide/f-000.webp" media="(min-aspect-ratio: 9/10)">
<link rel="preload" as="image" href="assets/img/hero/tall/f-000.webp" media="(max-aspect-ratio: 9/10)">'''

def build():
    return head("Reface | Kitchen Makeovers, Fitted Bedrooms & Bathrooms in South Shields", "Transform your kitchen without replacing it. Made-to-measure doors, worktops, handles and splashbacks, plus fitted bedrooms and bathrooms. Free WhatsApp Photoquote.", LD) + header("index.html") + body + footer()
