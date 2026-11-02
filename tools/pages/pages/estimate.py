from parts import head, header, footer
from icons import ICONS as I

body = f'''
<section class="page-hero plain">
  <div class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / Price guide</nav>
    <p class="eyebrow">Price guide</p>
    <h1>Your makeover, <em>priced.</em></h1>
    <p class="lead">Answer a few quick questions about your room and watch your guide price build as you go. No email needed to see it.</p>
  </div>
</section>

<section class="section-tight" id="estimator">
  <div class="container est-shell">
    <div class="est-main">
      <div class="est-panel" id="est-panel">
        <div class="est-progress" aria-hidden="true"></div>
        <p class="est-count small muted" aria-live="polite"></p>

        <!-- The room steps are drawn here by js/estimate.js -->
        <div id="est-steps"></div>

        <!-- Final step: send the quote to Reface -->
        <div class="est-step" id="step-contact" data-step="contact">
          <h2 tabindex="-1">Where should we <em>send it?</em></h2>
          <p>We'll check your guide price and get back to you with a proper quote. Free, with no obligation.</p>
          <form data-enquiry="Price guide" novalidate class="est-form">
            <div class="field"><label for="e-name">Your name</label><input id="e-name" name="name" type="text" autocomplete="name" required></div>
            <div class="field-row">
              <div class="field"><label for="e-phone">Phone</label><input id="e-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
              <div class="field"><label for="e-email">Email</label><input id="e-email" name="email" type="email" autocomplete="email"></div>
            </div>
            <div class="field-row">
              <div class="field"><label for="e-post">Postcode</label><input id="e-post" name="postcode" type="text" autocomplete="postal-code" autocapitalize="characters"></div>
              <div class="field"><label for="e-pref">Best way to contact you</label>
                <select id="e-pref" name="contactPref">
                  <option>Phone call</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                </select>
              </div>
            </div>
            <div class="field"><label for="e-msg">Anything else? <span class="hint">(optional)</span></label><textarea id="e-msg" name="message" placeholder="e.g. Best time to call, or anything about your room we should know"></textarea></div>
            <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
            <button class="btn btn-block" type="submit">Send my quote request {I["arrow"]}</button>
            <a class="btn btn-whatsapp btn-block est-wa" id="est-wa" data-wa href="https://wa.me/441914563718">{I["wa"]} Send photos on WhatsApp too</a>
            <p class="form-note">Photos help us price accurately. WhatsApp opens with your guide price already typed in; just attach a few photos of your room.</p>
            <div class="form-status" role="status"></div>
          </form>
        </div>

        <div class="est-nav">
          <button class="btn btn-ghost" type="button" data-nav="back">{I["arrow-l"]} Back</button>
          <button class="btn" type="button" data-nav="next">Next {I["arrow"]}</button>
        </div>
      </div>

      <div class="mobile-total" aria-hidden="true">
        <span><span class="small" style="display:block;opacity:.7">Guide price</span><b data-mobile-total>£0</b></span>
        <a class="btn btn-sm btn-light" href="#est-summary">Breakdown</a>
      </div>
    </div>

    <aside class="est-summary" id="est-summary" aria-label="Your guide price">
      <div class="est-placeholder"></div>
      <p class="eyebrow" style="margin-bottom:8px">Guide price</p>
      <h3 data-sum-room>Kitchen makeover</h3>
      <p class="est-choices" data-sum-choices></p>
      <div class="est-total" data-sum-total aria-live="polite">£0</div>
      <ul class="est-lines" data-sum-lines></ul>
      <p class="est-small">Guide price for supply and fit including VAT. Your exact price is confirmed after a free, no-obligation survey.</p>
    </aside>
  </div>
</section>
'''


def build():
    return (head("Price Guide | Reface Kitchen Makeovers, Bedrooms & Bathrooms",
                 "Get a guide price for your kitchen makeover, fitted bedroom or fitted bathroom in about a minute. Free, no obligation.",
                 '<link rel="stylesheet" href="css/estimate.css">')
            + header("estimate.html") + body
            + footer('<script src="js/estimate.js"></script>'))
