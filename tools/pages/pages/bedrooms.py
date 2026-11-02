from parts import head, header, footer
from blocks import page_hero, designer, gallery, enquiry

G = [
 ("bedrooms/turnberry-cashmere","Turnberry","Ultra Matt Cashmere","classic",501),
 ("bedrooms/glacier-super-matt-fir-green","Glacier","Super Matt Fir Green","modern",501),
 ("bedrooms/matfen-parisian-blue-oak","Matfen","Parisian Blue Oak","classic",501),
 ("bedrooms/glacier-high-gloss-white","Glacier","High Gloss White","modern",501),
 ("bedrooms/hampton-graphite","Hampton","Ultra Matt Graphite","classic",501),
 ("bedrooms/arko-casella-reed-green-oak","Arko","Light Casella &amp; Reed Green Oak","modern",501),
 ("bedrooms/bamburgh-white","Bamburgh","Ultra Matt White","classic",501),
 ("bedrooms/glacier-high-gloss-cashmere","Glacier","High Gloss Cashmere","modern",501),
 ("bedrooms/portree-indigo-study","Portree","Ultra Matt Indigo","classic",501),
 ("bedrooms/rialto-dust-grey","Rialto","Ultra Matt Dust Grey","modern",501),
 ("bedrooms/glendale-pale-cream","Glendale","Ultra Matt Pale Cream","classic",501),
 ("bedrooms/glacier-super-matt-light-grey","Glacier","Super Matt Light Grey","modern",501),
 ("bedrooms/alnwick-white-grey","Alnwick","Ultra Matt White Grey","classic",501),
 ("bedrooms/glacier-light-grey-graphite-study","Glacier","High Gloss Light Grey &amp; Graphite","modern",501),
 ("bedrooms/portree-white-oak","Portree","White Oak","classic",501),
 ("bedrooms/monaco-light-concrete","Monaco","Light Concrete","modern",501),
 ("bedrooms/scoop-light-grey","Scoop","Ultra Matt Light Grey","modern",1048),
]

body = page_hero("bedrooms/glacier-super-matt-black", "Fitted bedrooms", "Fitted bedrooms",
    "Storage that fits <em>like it grew there.</em>",
    "Made-to-measure wardrobes, drawers and dressing areas that use every alcove, slope and corner of your room.",
    "Fitted bedroom in Glacier Super Matt Black") + \
  designer("bedroom") + \
  gallery("b-gallery", G, "Bedrooms we <em>love.</em>", "Every bedroom here uses doors from our range. Tap a photo to see it bigger.") + \
  enquiry("Bedrooms page", "bedroom")

def build():
    return head("Fitted Bedrooms & Wardrobes in South Shields | Reface", "Fitted bedrooms, fitted and built-in wardrobes and bespoke bedroom furniture in South Shields, made to measure and installed. Free WhatsApp Photoquote.") + header("bedrooms.html") + body + footer('<script src="js/ranges.js"></script>')
