from parts import head, header, footer
from blocks import page_head

body = page_head("Before &amp; After", "Our work", "Before <em>&amp; after.</em>",
                 "Real kitchens, bedrooms and bathrooms we've transformed. Drag the slider on each photo to compare.") + '''
<section class="section">
  <div class="container">
    <div data-work></div>
  </div>
</section>
'''

def build():
    return head("Before & After Gallery | Reface, South Shields",
                "Before and after photos of kitchen makeovers, fitted bedrooms and bathrooms by Reface in South Shields.") + header("gallery.html") + body + footer()
