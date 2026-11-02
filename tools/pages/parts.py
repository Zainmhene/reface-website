from icons import ICONS as I
CUR = ' aria-current="page"'

def head(title, desc, extra=""):
    return f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0c1c40">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/img/hero/navy-kitchen-1600.webp">
<link rel="icon" href="assets/img/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&text=reface&display=swap">
<link rel="stylesheet" href="css/site.css">
<script>
document.documentElement.classList.add("js");
/* Always open a page at the top (unless the link points to a section, e.g. #contact).
   Stops the browser restoring an old scroll position on reload or back. */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
</script>
{extra}
</head>'''

NAV = [("kitchens.html","Kitchens","01"),("bedrooms.html","Bedrooms","02"),("bathrooms.html","Bathrooms","03"),("estimate.html","Price guide","")]

BACK = '<a class="back-btn" href="index.html" data-back aria-label="Go back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg><span>Back</span></a>'

def header(active=""):
    nav = "".join(f'<a href="{h}"{CUR if h==active else ""}>{t}</a>' for h,t,_ in NAV)
    mnav = "".join(f'<a href="{h}">{t}<span>{n}</span></a>' for h,t,n in NAV) + '<a href="index.html#contact">Contact<span></span></a>'
    return f'''
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="topbar"><div class="container">
  <span><b>FREE</b> WhatsApp Photoquote · <a data-wa href="https://wa.me/441914563718">Send a photo →</a></span>
  <span class="tb-hours">85 Westoe Rd, South Shields · Open Mon–Sat · <a data-tel="text" href="tel:+441914563718">(0191) 456 3718</a></span>
</div></div>
<header class="site-header">
  <div class="container">
    {BACK if active != "index.html" else ""}<a class="logo" href="index.html" aria-label="Reface home"><span class="logo-word">reface</span><span class="logo-tag">Kitchens · Bedrooms · Bathrooms</span></a>
    <nav class="nav" aria-label="Main">{nav}</nav>
    <div class="header-actions">
      <a class="icon-btn" data-tel href="tel:+441914563718" aria-label="Call Reface">{I["phone"]}</a>
      <a class="btn btn-sm header-cta" href="estimate.html">Get a free quote</a>
      <button class="icon-btn menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">{I["menu"]}</button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="mm-top"><a class="logo" href="index.html"><span class="logo-word">reface</span></a><button class="icon-btn menu-close" type="button" aria-label="Close menu">{I["close"]}</button></div>
  <nav aria-label="Mobile">{mnav}</nav>
  <div class="mm-foot">
    <a class="btn btn-light btn-block" data-tel href="tel:+441914563718">{I["phone"]} Call (0191) 456 3718</a>
    <a class="btn btn-whatsapp btn-block" data-wa href="https://wa.me/441914563718">{I["wa"]} Free WhatsApp Photoquote</a>
  </div>
</div>
<main id="main">'''

def footer(scripts=""):
    return f'''</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="logo" href="index.html"><span class="logo-word">reface</span><span class="logo-tag" style="color:rgba(255,255,255,.5)">Kitchens · Bedrooms · Bathrooms</span></a>
        <p style="margin-top:18px;max-width:30ch">Made-to-measure kitchen makeovers, fitted bedrooms and fitted bathrooms for <span data-area>South Shields and nearby areas</span>.</p>
        <p style="margin:0"><a data-maps href="https://www.google.com/maps/search/?api=1&amp;query=Reface+85+Westoe+Rd+South+Shields+NE33+4LU">85 Westoe Rd, South Shields NE33 4LU</a></p>
        <div class="btn-row" style="margin-top:18px"><a class="btn btn-sm btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} Photoquote</a></div>
      </div>
      <div><h4>Explore</h4><ul>
        <li><a href="kitchens.html">Kitchen makeovers</a></li><li><a href="bedrooms.html">Fitted bedrooms</a></li><li><a href="bathrooms.html">Fitted bathrooms</a></li>
        <li><a href="index.html#studio">Colour Studio</a></li><li><a href="visualiser.html">AI Visualiser</a></li><li><a href="estimate.html">Price guide</a></li></ul></div>
      <div><h4>Contact</h4><ul>
        <li><a data-tel="text" href="tel:+441914563718">(0191) 456 3718</a></li>
        <li><a data-mail="text" href="mailto:info@refacegroup.co.uk">info@refacegroup.co.uk</a></li>
        <li><a data-wa href="https://wa.me/441914563718">WhatsApp Photoquote</a></li>
        <li><a href="index.html#contact">Send an enquiry</a></li>
        <li><a data-maps href="https://www.google.com/maps/search/?api=1&amp;query=Reface+85+Westoe+Rd+South+Shields+NE33+4LU">Get directions</a></li></ul></div>
      <div><h4>Opening hours</h4><ul class="hours" data-hours>
        <li><span>Monday – Thursday</span><b>10am – 4pm</b></li><li><span>Friday</span><b>9am – 4pm</b></li><li><span>Saturday</span><b>10am – 2pm</b></li><li><span>Sunday</span><b>Closed</b></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Reface Group · 85 Westoe Rd, South Shields NE33 4LU</span>
      <span>Photos show doors from our Classic &amp; Contemporary range. Colours on screen are a guide; ask to see real samples.</span>
    </div>
  </div>
</footer>
<nav class="action-bar" aria-label="Quick contact">
  <a data-tel href="tel:+441914563718">{I["phone"]} Call</a>
  <a class="ab-wa" data-wa href="https://wa.me/441914563718">{I["wa"]} WhatsApp</a>
  <a class="ab-quote" href="estimate.html">Free quote</a>
</nav>
<script src="js/config.js"></script>
<script src="js/catalogue.js"></script>
<script src="js/site.js"></script>
{scripts}
</body>
</html>
'''
