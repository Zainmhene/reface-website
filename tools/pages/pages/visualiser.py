from parts import head, header, footer
from icons import ICONS as I

body = f'''
<section class="page-hero plain">
  <div class="container">
    <p class="crumbs"><a href="index.html">Home</a> / AI Visualiser</p>
    <span class="badge badge-new">New · AI Visualiser</span>
    <h1 style="margin-top:18px">See your room in a <em>new colour.</em></h1>
    <p class="lead">Take a photo of your kitchen, bedroom or bathroom. Pick a door style and up to three colours from our real range, and our AI will show you three designs to choose from.</p>
  </div>
</section>

<section class="section-tight">
  <div class="container vis-shell">

    <div class="vis-col-photo">
      <div class="vis-step"><span class="vis-num">1</span><div><h2 class="vis-h">Add a photo of your room</h2><p class="muted small mb-0">On your phone you can take one now.</p></div></div>
      <div class="dropzone" id="vis-drop">
        <span class="dz-icon">{I["camera"]}</span>
        <b>Take or upload a photo</b>
        <span class="muted small">JPG or PNG, straight from your camera roll</span>
        <img class="dz-preview" id="vis-preview" alt="Your room" hidden>
        <span class="dz-change" id="vis-change" hidden>{I["camera"]} Change photo</span>
        <input type="file" id="vis-file" accept="image/*" aria-label="Take or upload a photo of your room">
      </div>
      <div class="notice vis-error" id="vis-photo-error" role="alert" hidden>{I["info"]}<span></span></div>
      <ul class="vis-tips">
        <li>{I["check"]} Stand back so all the doors are in the photo</li>
        <li>{I["check"]} Shoot straight on, in good light</li>
        <li>{I["check"]} Clear the worktops if you can</li>
      </ul>
    </div>

    <div class="vis-col-options">
      <div class="vis-block">
        <div class="vis-step"><span class="vis-num">2</span><h2 class="vis-h">Which room is it?</h2></div>
        <div class="seg" id="vis-room" role="group" aria-label="Room">
          <button type="button" data-room="kitchen" aria-pressed="true">Kitchen</button>
          <button type="button" data-room="bedroom" aria-pressed="false">Bedroom</button>
          <button type="button" data-room="bathroom" aria-pressed="false">Bathroom</button>
        </div>
      </div>

      <div class="vis-block">
        <div class="vis-step"><span class="vis-num">3</span><div><h2 class="vis-h">Choose a door style</h2><p class="muted small mb-0">Chosen: <b id="vis-door-name">Alnwick</b></p></div></div>
        <div class="door-styles" id="vis-doors" role="group" aria-label="Door style"></div>
      </div>

      <div class="vis-block">
        <div class="vis-step"><span class="vis-num">4</span><div><h2 class="vis-h">Pick up to 3 colours</h2><p class="muted small mb-0">We'll create one design for each colour.</p></div></div>
        <div class="vis-picked" id="vis-picked" aria-live="polite"></div>
        <div class="seg vis-range" id="vis-range" role="group" aria-label="Colour range">
          <button type="button" data-range="vinyl" aria-pressed="true">Vinyl</button>
          <button type="button" data-range="supermatt" aria-pressed="false">Super Matt</button>
          <button type="button" data-range="gloss" aria-pressed="false">High Gloss</button>
        </div>
        <div class="chip-grid" id="vis-colours" role="group" aria-label="Colours"></div>
        <p class="muted small vis-limit" id="vis-limit" hidden>You can pick 3 colours. We've swapped out your first choice.</p>
      </div>

      <div class="vis-block">
        <div class="vis-step"><span class="vis-num">5</span><h2 class="vis-h">Handles</h2></div>
        <div class="seg" id="vis-handle" role="group" aria-label="Handle finish">
          <button type="button" data-handle="Brushed brass" aria-pressed="true">Brushed brass</button>
          <button type="button" data-handle="Matt black" aria-pressed="false">Matt black</button>
          <button type="button" data-handle="Brushed nickel" aria-pressed="false">Brushed nickel</button>
          <button type="button" data-handle="Chrome" aria-pressed="false">Chrome</button>
          <button type="button" data-handle="Handleless" aria-pressed="false">Handleless</button>
        </div>
      </div>

      <div class="vis-go">
        <button class="btn btn-brass btn-block" type="button" id="vis-generate" disabled>{I["spark"]} <span>Create my 3 designs</span></button>
        <p class="form-note" id="vis-go-note">Add a photo first, then create your designs.</p>
      </div>
    </div>
  </div>
</section>

<section class="section-tight vis-output" id="vis-output" hidden aria-live="polite">
  <div class="container">
    <div class="section-head" style="margin-bottom:28px">
      <p class="eyebrow">Your designs</p>
      <h2 id="vis-out-title">Pick your <em>favourite.</em></h2>
    </div>
    <div id="vis-fallback" hidden></div>
    <div class="vis-compare" id="vis-compare" hidden>
      <div class="ba" id="vis-ba">
        <img id="vis-ba-before" alt="Your room before">
        <img class="ba-after" id="vis-ba-after" alt="Your room with the new design">
        <div class="ba-handle"></div>
        <span class="ba-label l">Before</span><span class="ba-label r" id="vis-ba-label">After</span>
        <input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
      </div>
      <p class="muted small center" style="margin-top:10px">Drag across the photo to compare. AI designs are a guide; your real doors are made to measure.</p>
    </div>
    <div class="vis-results" id="vis-results"></div>
  </div>
</section>

<section class="section-tight bg-paper">
  <div class="container vis-info">
    <div class="notice info">{I["info"]}<div><b>Your photo stays private.</b> We only use it to create your designs. It isn't stored on our website or shared with anyone else.</div></div>
    <div class="notice">{I["spark"]}<div><b>How it works.</b> Our AI keeps your room exactly as it is (walls, floor, worktops and appliances) and changes only the doors, drawer fronts and handles, so you can see the difference a makeover makes.</div></div>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="cta-band">
      <div>
        <p class="eyebrow" style="color:var(--brass-light)">Prefer to talk?</p>
        <h2>Send us a photo. <em>We'll do the rest.</em></h2>
        <p class="lead" style="margin-top:14px">Our free WhatsApp Photoquote gets you a real price from the Reface team, with no obligation.</p>
      </div>
      <div class="btn-row">
        <a class="btn btn-whatsapp" data-wa href="https://wa.me/441914563718">{I["wa"]} WhatsApp Photoquote</a>
        <a class="btn btn-outline-light" href="estimate.html">Price guide</a>
      </div>
    </div>
  </div>
</section>
'''

def build():
    return (head("AI Visualiser | See Your Kitchen in a New Colour | Reface",
                 "Upload a photo of your kitchen, bedroom or bathroom and see it with new Reface doors, colours and handles in seconds. Free, with no obligation.",
                 '<link rel="stylesheet" href="css/visualiser.css">')
            + header("visualiser.html") + body
            + footer(scripts='<script src="js/visualiser.js"></script>'))
