// frontend/js/main.js

// ——— AOS Initialization —————————————————————————————————————————
AOS.init({
  duration: 800,
  easing: 'slide',
  once: true
});


// ——— jQuery “document ready” with all your existing UI logic ————————————————————————
jQuery(document).ready(function($) {

  "use strict";

  // ─── your existing functions (siteMenuClone, sitePlusMinus, etc.) ──────────────────────────────
  var siteMenuClone    = function() { /* … existing code … */ };
  var sitePlusMinus    = function() { /* … */ };
  var siteSliderRange  = function() { /* … */ };
  var siteCarousel     = function() { /* … */ };
  var siteStellar      = function() { /* … */ };
  var siteCountDown    = function() { /* … */ };
  var siteDatePicker   = function() { /* … */ };
  var siteSticky       = function() { /* … */ };
  var OnePageNavigation= function() { /* … */ };
  var siteScroll       = function() { /* … */ };

  siteMenuClone();
  // sitePlusMinus();           // if you want to enable
  siteSliderRange();
  siteCarousel();
  siteStellar();
  siteCountDown();
  siteDatePicker();
  siteSticky();
  OnePageNavigation();
  siteScroll();

  // ——— CRUD hookup — after all your existing UI bits —————————————————————————

  // 1) LIST page?
  if ($('#properties-list').length) {
    loadProperties();
  }

  // 2) CREATE form?
  $('#create-form').on('submit', function(e) {
    e.preventDefault();
    handleCreate(this);
  });

  // 3) DETAIL/UPDATE/DELETE page?
  if ($('#prop-detail').length) {
    loadSingle();
    $('#delete-btn').on('click', handleDelete);
    $('#update-form').on('submit', function(e) {
      e.preventDefault();
      handleUpdate(this);
    });
  }

}); // end document.ready



// ——— CRUD FUNCTIONS (plain JS + fetch) ———————————————————————————————————

// Fetch & render all properties into #properties-list
async function loadProperties() {
  try {
    const res = await fetch('/api/properties');
    const props = await res.json();
    const container = document.getElementById('properties-list');
    container.innerHTML = props.map(p => `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${p.imageUrl}" class="card-img-top" alt="${p.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text text-muted mb-4">${p.location} — $${p.price}</p>
            <a href="property-single.html?id=${p._id}" class="mt-auto btn btn-sm btn-primary">View Details</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('properties-list').textContent = 'Failed to load properties.';
  }
}

// Handle “Create” form submission
async function handleCreate(formEl) {
  const feedback = document.getElementById('create-msg');
  feedback.textContent = '';
  const data = Object.fromEntries(new FormData(formEl));

  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const e = await res.json();
      throw new Error(e.error || e.message);
    }
    feedback.textContent = '✅ Property added!';
    formEl.reset();
  } catch (err) {
    console.error(err);
    feedback.textContent = `Error: ${err.message}`;
  }
}

// Fetch & render a single property, and prefill the update form
async function loadSingle() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;

  try {
    const res = await fetch(`/api/properties/${id}`);
    const p = await res.json();
    // Inject with proper margins to avoid overlap
    document.getElementById('prop-detail').innerHTML = `
      <h2 class="mb-3">${p.title}</h2>
      <img src="${p.imageUrl}" 
           alt="${p.title}" 
           class="img-fluid mb-4">
      <p>${p.description}</p>
      <p><strong>${p.location}</strong> — $${p.price}</p>
    `;
    const uf = document.getElementById('update-form');
    if (uf) {
      uf.title.value       = p.title;
      uf.price.value       = p.price;
      uf.location.value    = p.location;
      uf.imageUrl.value    = p.imageUrl;
      uf.description.value = p.description;
    }
  } catch (err) {
    console.error(err);
  }
}

// Handle Delete button
async function handleDelete() {
  if (!confirm('Delete this property?')) return;
  const id = new URLSearchParams(location.search).get('id');
  try {
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    alert('Deleted—redirecting to listings.');
    location.href = 'listings.html';
  } catch (err) {
    console.error(err);
    alert('Failed to delete.');
  }
}

// Handle Update form submission
async function handleUpdate(formEl) {
  const feedback = document.getElementById('update-msg');
  feedback.textContent = '';
  const id   = new URLSearchParams(location.search).get('id');
  const data = Object.fromEntries(new FormData(formEl));

  try {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const e = await res.json();
      throw new Error(e.error || e.message);
    }
    feedback.textContent = '✅ Updated successfully!';
  } catch (err) {
    console.error(err);
    feedback.textContent = `Error: ${err.message}`;
  }
}
