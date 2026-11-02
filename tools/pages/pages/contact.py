from parts import head, header, footer
from blocks import page_head, enquiry

body = page_head("Contact", "Contact", "Get in <em>touch.</em>",
                 "Call, WhatsApp or send us a message, or visit us on Westoe Road. We'll get back to you during opening hours.", buttons=False) + enquiry("Contact page", "kitchen")

def build():
    return head("Contact Reface | Kitchen Makeovers in South Shields",
                "Contact Reface: call (0191) 456 3718, WhatsApp us for a free Photoquote, or visit 85 Westoe Rd, South Shields NE33 4LU.") + header("contact.html") + body + footer()
