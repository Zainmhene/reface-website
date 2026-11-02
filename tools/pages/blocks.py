from icons import ICONS as I

def page_hero(img, crumb, eyebrow, h1, lead, alt):
    return f'''
<section class="page-hero">
  <img class="ph-img" src="assets/img/{img}-1400.webp" srcset="assets/img/{img}-800.webp 800w, assets/img/{img}-1400.webp 1400w" sizes="100vw" alt="{alt}" fetchpriority="high">
  <div class="container">
    <div class="crumbs"><a href="index.html">Home</a> / {crumb}</div>
    <p class="eyebrow">{eyebrow}</p>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
    <div class="btn-row">
      <a class="btn btn-brass" href="estimate.html?room={'kitchen' if 'Kitchen' in crumb else 'bedroom'}">Get a free quote {I["arrow"]}</a>
      <a class="btn btn-outline-light" data-wa href="https://wa.me/441914563718">{I["wa"]} WhatsApp Photoquote</a>
    </div>
  </div>
</section>'''

def ranges(room):
    noun = "kitchen" if room == "kitchen" else ("bedroom" if room == "bedroom" else "bathroom")
    return f'''
<section class="section bg-stone" id="ranges">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>The ranges</p><h2 data-reveal>Two ranges. <em>Every taste.</em></h2></div>
      <p class="lead" data-reveal>Sleek and handleless or classic and in-frame. Tap any colour to try it on a door below.</p>
    </div>
    <div class="range-grid">
      <article class="range-card" data-reveal>
        <span class="badge">Glacier · Laser edge</span>
        <h3>High gloss &amp; super matt</h3>
        <p>High gloss acrylic and PVC, laminated for a perfect gloss or super matt finish, then edged with laser and PUR technology so there are no visible joins. Made-to-measure sizes, ideal for a sleek modern {noun}.</p>
        <h4 class="small" style="font-family:var(--font-body);font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:22px 0 12px">High gloss · 11 colours</h4>
        <div class="chip-grid" data-chips="gloss"></div>
        <h4 class="small" style="font-family:var(--font-body);font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:26px 0 12px">Super matt · 12 colours</h4>
        <div class="chip-grid" data-chips="supermatt"></div>
      </article>
      <article class="range-card" data-reveal data-delay="100">
        <span class="badge">Vinyl · Any style, any colour</span>
        <h3>20 styles in 29 finishes</h3>
        <p>Create your own door by choosing any style in any colour, from smooth ultra matts to real-feel oak grains and concretes. Made to measure, so your {noun} is truly bespoke.</p>
        <h4 class="small" style="font-family:var(--font-body);font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:22px 0 12px">Vinyl · 29 colours</h4>
        <div class="chip-grid" data-chips="vinyl"></div>
      </article>
    </div>
  </div>
</section>'''

def designer(room):
    return f'''
<section class="section" id="design">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Door designer</p><h2 data-reveal>Design <em>your door.</em></h2></div>
      <p class="lead" data-reveal>Pick a range, a style, a colour and a handle. When you love it, we'll price it for your {room}.</p>
    </div>
    <div class="door-designer" data-designer data-room="{room}">
      <div class="door-preview" data-reveal>
        <div class="door-frame"><img alt="" src="assets/img/doors/tint-alnwick.webp"><span class="door-sheen"></span><span class="door-handle"></span></div>
        <div class="door-caption"><b class="dd-name">Alnwick</b><span class="dd-sub">Parisian Blue Oak · Brushed brass</span></div>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn-sm dd-cta" href="estimate.html?room={room}">Price this door {I["arrow"]}</a>
          <a class="btn btn-sm btn-ghost" href="visualiser.html">{I["spark"]} Try on my room</a>
        </div>
      </div>
      <div>
        <div class="ctrl-group"><h4>Range</h4><div class="seg dd-range">
          <button type="button" data-v="vinyl" aria-pressed="true">Vinyl</button>
          <button type="button" data-v="supermatt" aria-pressed="false">Glacier Super Matt</button>
          <button type="button" data-v="gloss" aria-pressed="false">Glacier High Gloss</button>
        </div></div>
        <div class="ctrl-group dd-style-group"><h4>Door style</h4><div class="door-styles dd-styles"></div></div>
        <div class="ctrl-group"><h4>Colour</h4><div class="chip-grid dd-colours" style="grid-template-columns:repeat(auto-fill,minmax(64px,1fr))"></div></div>
        <div class="ctrl-group"><h4>Handles</h4><div class="seg dd-handles">
          <button type="button" data-v="Brushed brass" data-c="#c9a46a" aria-pressed="true">Brushed brass</button>
          <button type="button" data-v="Matt black" data-c="#26282b" aria-pressed="false">Matt black</button>
          <button type="button" data-v="Brushed nickel" data-c="#b8b8b2" aria-pressed="false">Brushed nickel</button>
          <button type="button" data-v="Chrome" data-c="#e3e7ea" aria-pressed="false">Chrome</button>
          <button type="button" data-v="Handleless" data-c="" aria-pressed="false">Handleless</button>
        </div></div>
      </div>
    </div>
  </div>
</section>'''

def gallery(gid, items, intro_h2, intro_lead):
    figs = "\n".join(
        f'<figure data-tags="{t}"><img src="assets/img/{p}-800.webp" data-full="assets/img/{p}-1400.webp" loading="lazy" width="800" height="{h}" alt="{a} {b}"><figcaption><b>{a}</b><span>{b}</span></figcaption></figure>'
        for p,a,b,t,h in items)
    return f'''
<section class="section" id="gallery">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Gallery</p><h2 data-reveal>{intro_h2}</h2></div>
      <p class="lead" data-reveal>{intro_lead}</p>
    </div>
    <div class="gallery-filters seg" data-filter-for="{gid}">
      <button type="button" data-filter="all" aria-pressed="true">All</button>
      <button type="button" data-filter="modern" aria-pressed="false">Modern</button>
      <button type="button" data-filter="classic" aria-pressed="false">Classic</button>
    </div>
    <div class="gallery" id="{gid}" data-gallery>{figs}</div>
  </div>
</section>
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo"><button class="icon-btn" type="button" aria-label="Close">{I["close"]}</button><img alt=""><div class="lb-cap"></div></div>'''

HANDLES = [("linea","Linea","Satin brass · Matt black"),("plato-knob","Plato Knob","Brushed brass · Inox · Anthracite · Black"),("edge-straight","Edge Straight","Brass · Inox · Anthracite · Black"),("manor","Manor","Antique brass · Gold · Matt black"),
           ("elan","Elan","Brushed brass · Inox · Brushed black"),("ines","Ines","Brushed nickel · Chrome · Matt black"),("brixton","Brixton","Satin brass · Nickel · Chrome · Pewter"),("bar","Bar","Brushed nickel T bar, bow and block")]
def handles():
    cards = "\n".join(f'<div class="handle-card" data-reveal data-delay="{(k%4)*60}"><img src="assets/img/handles/{i}.webp" loading="lazy" alt="{n} handles"><b>{n}</b><span>{f}</span></div>' for k,(i,n,f) in enumerate(HANDLES))
    return f'''
<section class="section bg-paper" id="handles">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Handles</p><h2 data-reveal>The finishing <em>touch.</em></h2></div>
      <p class="lead" data-reveal>Knobs, bars, cup and edge pulls in brass, black, nickel, chrome and more, plus integrated handleless options.</p>
    </div>
    <div class="handles-grid">{cards}</div>
  </div>
</section>'''

def cta(title, lead, room):
    return f'''
<section class="section-tight">
  <div class="container">
    <div class="cta-band" data-reveal>
      <div><p class="eyebrow" style="color:var(--brass-light)">Free Photoquote</p><h2>{title}</h2><p class="lead" style="margin-top:14px">{lead}</p></div>
      <div class="btn-row">
        <a class="btn btn-light" href="estimate.html?room={room}">{I["calc"]} Price guide</a>
        <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} WhatsApp us</a>
      </div>
    </div>
  </div>
</section>'''

def included(title, items, aside_img, aside_alt):
    lis = "\n".join(f'<li><span><b>{a}</b> <span class="muted">{b}</span></span></li>' for a,b in items)
    return f'''
<section class="section" id="included">
  <div class="container feature">
    <div>
      <p class="eyebrow" data-reveal>What's included</p>
      <h2 data-reveal>{title}</h2>
      <ul class="feature-list" data-reveal>{lis}</ul>
      <div class="btn-row" data-reveal><a class="btn" href="#design">Design your door {I["arrow"]}</a><a class="btn btn-ghost" href="#gallery">See the gallery</a></div>
    </div>
    <div data-reveal><img src="assets/img/{aside_img}-800.webp" loading="lazy" alt="{aside_alt}" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);width:100%;aspect-ratio:4/4.4;object-fit:cover"></div>
  </div>
</section>'''

HINTS = {"kitchen": "e.g. L-shaped kitchen, about 18 doors, would love Reed Green",
         "bedroom": "e.g. Wardrobes along one wall, about 3 metres, in Cashmere",
         "bathroom": "e.g. Vanity unit and tall cupboard in Super Matt Graphite"}

def enquiry(source, room="kitchen"):
    """The enquiry section that sits at the bottom of every main page."""
    hint = HINTS.get(room, HINTS["kitchen"])
    return f'''
<section class="section bg-navy" id="contact">
  <div class="container contact-grid">
    <div>
      <p class="eyebrow" data-reveal>Get in touch</p>
      <h2 data-reveal>Let's make your room <em>feel new.</em></h2>
      <p class="lead" style="margin-top:16px" data-reveal>Call, WhatsApp or send us a message. We'll get back to you during opening hours.</p>
      <div class="contact-lines">
        <a class="contact-line" data-tel href="tel:+441914563718" data-reveal><span class="cl-icon">{I["phone"]}</span><span><small>Call us</small><b>(0191) 456 3718</b></span></a>
        <a class="contact-line" data-wa href="https://wa.me/441914563718" data-reveal><span class="cl-icon">{I["wa"]}</span><span><small>Free Photoquote</small><b>Send photos on WhatsApp</b></span></a>
        <a class="contact-line" data-maps href="https://www.google.com/maps/search/?api=1&amp;query=Reface+85+Westoe+Rd+South+Shields+NE33+4LU" data-reveal><span class="cl-icon">{I["pin"]}</span><span><small>Find us</small><b>85 Westoe Rd, South Shields NE33 4LU</b></span></a>
        <a class="contact-line" data-mail href="mailto:info@refacegroup.co.uk" data-reveal><span class="cl-icon">{I["mail"]}</span><span><small>Email</small><b>info@refacegroup.co.uk</b></span></a>
      </div>
      <div data-reveal><p class="eyebrow" style="margin-bottom:10px">Opening hours</p><ul class="hours" data-hours><li><span>Monday – Thursday</span><b>10am – 4pm</b></li><li><span>Friday</span><b>9am – 4pm</b></li><li><span>Saturday</span><b>10am – 2pm</b></li><li><span>Sunday</span><b>Closed</b></li></ul></div>
    </div>
    <form class="card-form" data-enquiry="{source}" novalidate data-reveal>
      <h3 style="margin-bottom:6px">Request a free quote</h3>
      <p class="muted small" style="margin-bottom:22px">Tell us a little about your project. It only takes a minute.</p>
      <div class="field"><span class="label">I'm interested in</span>
        <div class="check-pills">
          <label><input type="checkbox" name="interest" value="Kitchen makeover"{" checked" if room == "kitchen" else ""}><span>Kitchen</span></label>
          <label><input type="checkbox" name="interest" value="Fitted bedroom"{" checked" if room == "bedroom" else ""}><span>Bedroom</span></label>
          <label><input type="checkbox" name="interest" value="Fitted bathroom"{" checked" if room == "bathroom" else ""}><span>Bathroom</span></label>
        </div></div>
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field-row">
        <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
      </div>
      <div class="field"><label for="f-post">Postcode</label><input id="f-post" name="postcode" type="text" autocomplete="postal-code" autocapitalize="characters"></div>
      <div class="field"><label for="f-msg">Anything else? <span class="hint">(optional)</span></label><textarea id="f-msg" name="message" placeholder="{hint}"></textarea></div>
      <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
      <button class="btn btn-block" type="submit">Send my enquiry {I["arrow"]}</button>
      <p class="form-note">We'll only use your details to reply about your project.</p>
      <div class="form-status" role="status"></div>
    </form>
  </div>
</section>'''
