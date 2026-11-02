from icons import ICONS as I


def page_head(crumb, eyebrow, h1, lead, buttons=True):
    """The navy title band at the top of each inner page."""
    btns = f'''
    <div class="btn-row">
      <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} Free Photoquote</a>
      <a class="btn btn-outline-light" data-tel href="tel:+441914563718">{I["phone"]} Call us</a>
    </div>''' if buttons else ""
    return f'''
<section class="page-hero plain">
  <div class="container">
    <div class="crumbs"><a href="index.html">Home</a> / {crumb}</div>
    <p class="eyebrow">{eyebrow}</p>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>{btns}
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
        <a class="contact-line" data-tel href="tel:+441914563718" data-reveal><span class="cl-icon">{I["phone"]}</span><span><small>Call us · lines open <span data-lines>Mon–Fri 9am–5pm, Sat 10am–3pm</span></small><b>(0191) 456 3718</b></span></a>
        <a class="contact-line" data-wa href="https://wa.me/441914563718" data-reveal><span class="cl-icon">{I["wa"]}</span><span><small>Free Photoquote</small><b>Send photos on WhatsApp</b></span></a>
        <a class="contact-line" data-maps href="https://www.google.com/maps/search/?api=1&amp;query=Reface+85+Westoe+Rd+South+Shields+NE33+4LU" data-reveal><span class="cl-icon">{I["pin"]}</span><span><small>Find us</small><b>85 Westoe Rd, South Shields NE33 4LU</b></span></a>
        <a class="contact-line" data-mail href="#" data-reveal><span class="cl-icon">{I["mail"]}</span><span><small>Email</small><b data-mail="text">info@refacegroup.co.uk</b></span></a>
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
