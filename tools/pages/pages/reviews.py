from parts import head, header, footer
from blocks import page_head
from icons import ICONS as I

body = page_head("Reviews", "Testimonials", "What our <em>customers say.</em>",
                 "Reviews from homeowners across South Shields and nearby areas, taken from our Google listing.", buttons=False) + f'''
<section class="section bg-stone">
  <div class="container">
    <div data-reviews></div>
    <div class="btn-row" style="justify-content:center;margin-top:32px">
      <a class="btn" data-google href="https://share.google/85vLoGir77iD04as1">See all our reviews on Google</a>
      <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} Get a free Photoquote</a>
    </div>
  </div>
</section>
'''

def build():
    return head("Customer Reviews | Reface, South Shields",
                "Read what customers say about Reface kitchen makeovers, fitted bedrooms and bathrooms in South Shields.") + header("reviews.html") + body + footer()
