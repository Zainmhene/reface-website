from parts import head, header, footer
from blocks import page_hero, designer, gallery, enquiry
from icons import ICONS as I

G = [
 ("kitchens/glacier-high-gloss-white","Glacier","High Gloss White","modern",501),
 ("kitchens/turnberry-cashmere","Turnberry","Ultra Matt Cashmere","classic",501),
 ("kitchens/glacier-high-gloss-reed-green","Glacier","High Gloss Reed Green","modern",501),
 ("kitchens/alnwick-parisian-blue-oak","Alnwick","Parisian Blue Oak","classic",501),
 ("kitchens/glacier-high-gloss-graphite","Glacier","High Gloss Graphite","modern",501),
 ("kitchens/portree-reed-green","Portree","Ultra Matt Reed Green","classic",501),
 ("kitchens/glacier-super-matt-black","Glacier","Super Matt Black","modern",501),
 ("kitchens/matfen-light-grey-oak","Matfen","Light Grey Oak","classic",501),
 ("kitchens/glacier-high-gloss-parisian-blue","Glacier","High Gloss Parisian Blue","modern",501),
 ("kitchens/sherwood-pale-cream","Sherwood","Ultra Matt Pale Cream","classic",501),
 ("kitchens/arko-graphite-casella-oak","Arko","Graphite &amp; Light Casella Oak","modern",501),
 ("kitchens/glendale-white","Glendale","Ultra Matt White","classic",501),
 ("kitchens/glacier-super-matt-white","Glacier","Super Matt White","modern",501),
 ("kitchens/monaco-indigo-white-grey","Monaco","Indigo &amp; White Grey","modern",501),
 ("kitchens/glacier-high-gloss-light-grey","Glacier","High Gloss Light Grey","modern",501),
 ("kitchens/premier-concrete","Premier","Dark &amp; Light Concrete","modern",501),
 ("kitchens/glacier-super-matt-light-grey","Glacier","Super Matt Light Grey","modern",501),
 ("kitchens/glacier-super-matt-graphite","Glacier","Super Matt Graphite","modern",501),
]

body = page_hero("kitchens/portree-reed-green", "Kitchen makeovers", "Kitchen makeovers",
    "A new kitchen, <em>without the new kitchen.</em>",
    "We keep your existing units and replace everything you see, made to measure in the style and colour you choose.",
    "Portree kitchen in Ultra Matt Reed Green with island") + \
  designer("kitchen") + \
  gallery("k-gallery", G, "Kitchens we <em>love.</em>", "Every kitchen here uses doors from our range. Tap a photo to see it bigger.") + \
  enquiry("Kitchens page", "kitchen")

def build():
    return head("Kitchen Makeovers in South Shields | Replacement Kitchen Doors | Reface", "Kitchen makeovers, replacement kitchen doors and complete kitchen renovations in South Shields. Made-to-measure doors, quartz, granite and laminate worktops, supplied and fitted.") + header("kitchens.html") + body + footer('<script src="js/ranges.js"></script>')
