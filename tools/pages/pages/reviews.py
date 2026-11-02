from parts import head, header, footer
from blocks import page_head
from icons import ICONS as I

body = page_head("Reviews", "Testimonials", "What our <em>customers say.</em>",
                 "Real reviews from Reface customers, copied word for word from our Google listing.", buttons=False) + f'''
<section class="section bg-stone">
  <div class="container">
    <div data-reviews></div>
    <div class="btn-row" style="justify-content:center;margin-top:32px">
      <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} Get a free Photoquote</a>
      <a class="btn btn-ghost" href="contact.html">Contact us</a>
    </div>
  </div>
</section>
'''

def build():
    return head("Customer Reviews | Reface, South Shields",
                "Read what customers say about Reface kitchen makeovers, fitted bedrooms and bathrooms in South Shields.") + header("reviews.html") + body + footer()
