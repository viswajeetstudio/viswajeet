# Viswajeet Studio — Customization Guide

## How to Replace Images and Text in "All Masterworks"

Everything is set up so you can easily replace images and text in seconds without breaking any animations or layouts.

---

### Step 1: Add Your Images
1. Save your project pictures (JPG, PNG, WebP, or SVG) into the `img/` folder.
   * Example: Save your image as `img/my-work-1.jpg`.

---

### Step 2: Open `index.html` and Find the Masterwork
Open `index.html` and scroll down to the `<!-- 3D Card Grid with Dynamic Specular Lighting -->` section (around line 452).

Each project has a clear comment like this:

```html
<!-- =====================================================================
     ✦ MASTERWORK 01: [REPLACE IMAGE & TEXT HERE] ✦
     1. Replace Image: Change src="img/work-1.svg" to your image (e.g. img/my-photo.jpg)
     2. Replace Title: Change "Lumière Haute Parfumerie"
     3. Replace Description: Change the text inside <p class="drawer-desc">
     ===================================================================== -->
<article class="portfolio-card" data-category="ad" data-client="Maison Lumière Paris" data-year="2026" data-scope="Art Direction • Billboard • Print">
  <div class="card-glare"></div>
  <div class="artwork-canvas">
    
    <!-- 1. CHANGE YOUR IMAGE HERE -->
    <img src="img/my-work-1.jpg" alt="My Project Title" class="artwork-img">
    <span class="artwork-badge">Commercial Ad</span>
    
    <div class="card-hover-drawer">
      <span class="drawer-tag">Client Name</span>
      
      <!-- 2. CHANGE YOUR TITLE HERE -->
      <h4 class="drawer-title">My Project Title</h4>
      
      <!-- 3. CHANGE YOUR DESCRIPTION HERE -->
      <p class="drawer-desc">Brief description of your campaign, poster, or website design.</p>
      
      <span class="drawer-link">Inspect Artwork ✦</span>
    </div>
  </div>
  
  <div class="card-caption-bar">
    <div class="caption-meta">
      <!-- 4. CHANGE CARD BOTTOM NAME -->
      <div class="caption-name">My Project Title</div>
      <div class="caption-role">Commercial Advertising</div>
    </div>
    <div class="card-expand-btn">→</div>
  </div>
</article>
```

---

### How Category Filters Work:
In the `<article>` tag, change `data-category="..."` to match the project type:
* `data-category="ad"` for **Advertisements**
* `data-category="poster"` for **Collector Posters**
* `data-category="web"` for **Luxury Web UI/UX**

---

### What Happens Automatically:
* **Full-Screen Lightbox**: When a visitor clicks your card, it **automatically** opens in full-screen display with your new image, title, and description. You do **not** need to touch any JavaScript!
* **3D Perspective Tilt & Lighting**: Your new image automatically gets the dynamic 3D tilt and glossy reflection sheen.
* **Safe Local Paths**: Everything stays fast, offline-ready, and uses zero external `https` links in `src`.

---

### How to Play a Looping Video in "UNCOMPROMISING"
Scroll to line **320** in `index.html` (inside the Philosophy & Vision section):

```html
<div class="editorial-poster-frame">
  <!-- Looping HTML5 Video Player: -->
  <video autoplay muted loop playsinline preload="auto" class="editorial-poster-video" poster="img/philosophy.svg">
    <source src="img/intro.mp4" type="video/mp4">
    <!-- Fallback if video is not supported -->
    <img src="img/intro.gif" alt="Uncompromising Visual Hierarchy" class="editorial-poster-img">
  </video>
  
  <!-- Text overlay (you can edit or delete this): -->
  <div class="editorial-poster-overlay">
    <div class="editorial-poster-badge">UNCOMPROMISING</div>
    <div class="editorial-poster-sub">Visual Hierarchy</div>
  </div>
</div>
```

* **Playing Video in Loop**:
  1. Put your video (e.g. `intro.mp4`) inside the `img/` folder.
  2. The code already has `autoplay muted loop playsinline` so it plays continuously in an infinite loop without user interaction.
  3. The **"UNCOMPROMISING VISUAL HIERARCHY"** gold title overlays smoothly over your looping video.
  4. On hover, the video gently zooms with smooth 60fps easing.
* **To Switch Back to an Image Instead**:
  Simply replace the `<video>` block with `<img src="img/your-image.jpg" class="editorial-poster-img">`.
