/* Active script: js/ecojs.js
   Purpose: animations, AOS init, and contact WhatsApp helper.
*/
console.debug('Loaded active script: js/ecojs.js');

// Simple animation trigger on scroll
document.addEventListener("scroll", () => {
  document.querySelectorAll(".animate-fade, .animate-slide").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }
  });
});

// Contact helpers
function showAlert() {
  alert("Thank you! Your message has been sent successfully.");
}

function showMessage() {
  const msg = document.getElementById("thankYou");
  if (!msg) return;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 4000);
}

// DOM ready: AOS, intersection observer and contact send handler
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ once: true, duration: 800 });

  const elements = document.querySelectorAll('.animate-fade');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 1s ease';
    observer.observe(el);
  });

  // WhatsApp send button (Contact page)
  const sendWhats = document.getElementById('sendWhats');
  if (sendWhats) {
    // click handler (works if button is type='button')
    sendWhats.addEventListener('click', (e) => {
      e.preventDefault();
      handleWhatsAppSend();
    });
  }

  // Also attach to the form submit so it works even if the button is a submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleWhatsAppSend();
    });
  }

  // shared handler used by both click and submit
  function handleWhatsAppSend() {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    const thankBox = document.getElementById('thankBox');

    if (!name || !email || !message) {
      alert('Please fill all fields before sending.');
      return;
    }

    const text = `Hi ABC BANNER LTD! I'm ${name} (${email}). Message: ${message}`;
    const url = `https://wa.me/919080574774?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    if (thankBox) thankBox.style.display = 'block';
  }
  
  /* Offer sidebar: show on scroll, allow close, session persistence */
  (function() {
  const SHOW_AFTER_PX = 150; // scroll distance before showing (lowered)
  const AUTO_SHOW_MS = 5000;  // auto-show after 5 seconds
  const AUTO_HIDE_MS = 12000; // auto-hide after 12 seconds once shown
    const STORAGE_KEY = 'eco_offer_closed';

    function initOfferSidebar() {
      const offer = document.getElementById('offerSidebar');
      const closeBtn = document.getElementById('offerCloseBtn');
      if (!offer) return;

      // don't show if user already closed in this session
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

  let shown = false;
  let autoHideTimer = null;

      function showOffer() {
        if (shown) return;
        offer.classList.add('visible');
        offer.setAttribute('aria-hidden', 'false');
        shown = true;
        // start auto-hide timer (does not persist the close)
        if (AUTO_HIDE_MS) {
          if (autoHideTimer) clearTimeout(autoHideTimer);
          autoHideTimer = setTimeout(() => {
            hideOffer(false); // auto-hide but don't persist
          }, AUTO_HIDE_MS);
        }
      }

      function hideOffer(persist = true) {
        offer.classList.remove('visible');
        offer.setAttribute('aria-hidden', 'true');
        // clear auto-hide timer if set
        if (autoHideTimer) { clearTimeout(autoHideTimer); autoHideTimer = null; }
        if (persist) sessionStorage.setItem(STORAGE_KEY, '1');
      }

      function onScroll() {
        if (window.scrollY > SHOW_AFTER_PX) {
          showOffer();
          window.removeEventListener('scroll', onScroll);
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });

      if (closeBtn) closeBtn.addEventListener('click', function() { hideOffer(true); });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') hideOffer(true);
      });

      const cta = document.getElementById('offerCTA');
      if (cta) {
        cta.addEventListener('click', function() { hideOffer(true); });
      }
    }

      // initialize immediately (we're already in DOMContentLoaded)
    initOfferSidebar();

    // auto-show after a delay unless user already closed in session
    if (sessionStorage.getItem(STORAGE_KEY) !== '1') {
      setTimeout(() => {
        try {
          const offer = document.getElementById('offerSidebar');
          if (!offer) return;
          if (!offer.classList.contains('visible')) {
            // directly show the offer (don't rely on synthetic scroll events)
            offer.classList.add('visible');
            offer.setAttribute('aria-hidden', 'false');
            console.debug('Offer auto-shown after', AUTO_SHOW_MS, 'ms');
          }
        } catch (err) {
          console.error('Error auto-showing offer:', err);
        }
      }, AUTO_SHOW_MS);
    }
  })();
});
