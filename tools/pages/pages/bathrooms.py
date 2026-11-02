from parts import head, header, footer
from blocks import enquiry
from icons import ICONS as I

body = f'''
<section class="page-hero">
  <picture>
    <source media="(max-aspect-ratio: 9/10)" srcset="assets/img/studio/bathroom-parisian-blue-900.webp">
    <img class="ph-img" src="assets/img/studio/bathroom-parisian-blue-1600.webp" alt="Fitted bathroom with a wall-hung vanity unit and tall cupboard in Super Matt Parisian Blue" fetchpriority="high" style="object-position:60% 50%">
  </picture>
  <div class="container">
    <div class="crumbs"><a href="index.html">Home</a> / Fitted bathrooms</div>
    <p class="eyebrow">Fitted bathrooms</p>
    <h1>Calm, clutter-free <em>bathrooms.</em></h1>
    <p class="lead">Bathroom installation and renovation in South Shields, with vanity units, tall storage and toilet units made to measure in the same colours as our kitchens.</p>
    <div class="btn-row">
      <a class="btn btn-brass" href="#contact">Get a free quote {I["arrow"]}</a>
      <a class="btn btn-outline-light" data-wa href="https://wa.me/441914563718">{I["wa"]} WhatsApp Photoquote</a>
    </div>
  </div>
</section>

<section class="section bg-navy" id="design">
  <div class="container">
    <div class="section-head split">
      <div><p class="eyebrow" data-reveal>Try a colour</p><h2 data-reveal>Your bathroom, <em>your colour.</em></h2></div>
      <p class="lead" data-reveal>Tap a colour on the photo, or swipe across it, to see the vanity and tall cupboard in each of our Super Matt finishes.</p>
    </div>
    <div class="cs" data-studio data-start="bathroom">
      <div class="cs-stage" tabindex="0" aria-label="Bathroom preview. Swipe or use the arrow keys to change the colour">
        <img class="cs-a" alt="" width="1600" height="905">
        <img class="cs-b" alt="" width="1600" height="905" aria-hidden="true">
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
          <a class="btn btn-light cs-cta" href="estimate.html?room=bathroom">Price this colour {I["arrow"]}</a>
        </div>
      </div>
      <div class="cs-styles" hidden></div>
      <p class="studio-disclaimer">Visualisation: an AI-made bathroom with our colours applied digitally. Screens vary, so ask to see real samples.</p>
    </div>
  </div>
</section>


''' + enquiry("Bathrooms page", "bathroom")

def build():
    return head("Fitted Bathrooms in South Shields | Bathroom Installation & Renovation | Reface", "Bathroom installation, renovation and made-to-measure fitted bathroom furniture in South Shields: vanity units, tall storage and toilet units.") + header("bathrooms.html") + body + footer()
