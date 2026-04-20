document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PASSWORD VISIBILITY TOGGLE ─────────────────────────── */
  const pwInput  = document.getElementById('password-input');
  const pwToggle = document.getElementById('pw-toggle-btn');

  const eyeOpen = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`;

  const eyeOff = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;

  if (pwToggle && pwInput) {
    pwToggle.innerHTML = eyeOpen;
    pwToggle.setAttribute('aria-label', 'Show password');

    pwToggle.addEventListener('click', () => {
      const isHidden = pwInput.type === 'password';
      pwInput.type = isHidden ? 'text' : 'password';
      pwToggle.innerHTML = isHidden ? eyeOff : eyeOpen;
      pwToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  /* ── 2. TOAST HELPER ────────────────────────────────────────── */
  function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('error', 'show');
    if (type === 'error') toast.classList.add('error');

    // force reflow so transition re-triggers
    void toast.offsetWidth;
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ── 3. FORM VALIDATION & SUBMIT ────────────────────────────── */
  const form        = document.getElementById('login-form');
  const emailInput  = document.getElementById('email-input');
  const loginBtn    = document.getElementById('btn-login');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email    = emailInput.value.trim();
      const password = pwInput ? pwInput.value : '';

      // Basic validation
      if (!email) {
        showToast('Please enter your email address.', 'error');
        emailInput.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }
      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        pwInput && pwInput.focus();
        return;
      }

      // Simulate loading state
      loginBtn.textContent = 'Authenticating…';
      loginBtn.disabled = true;
      loginBtn.style.opacity = '0.75';

      setTimeout(() => {
        showToast('✓ Login successful! Redirecting…', 'info');
        loginBtn.textContent = 'Login →';
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
        // TODO: replace with actual redirect
        // window.location.href = './index.html';
      }, 1800);
    });
  }

  /* ── 4. SOCIAL BUTTONS ──────────────────────────────────────── */
  document.getElementById('btn-google')?.addEventListener('click', () => {
    showToast('Google login coming soon…');
  });
  document.getElementById('btn-apple')?.addEventListener('click', () => {
    showToast('Apple login coming soon…');
  });

  /* ── 5. FORGOT PASSWORD ─────────────────────────────────────── */
  document.getElementById('link-forgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset link will be sent to your email.');
  });

  /* ── 6. SUBTLE INPUT LABEL FLOAT (accessibility UX) ─────────── */
  [emailInput, pwInput].forEach(input => {
    if (!input) return;
    input.addEventListener('focus', () => input.setAttribute('data-active', ''));
    input.addEventListener('blur',  () => {
      if (!input.value) input.removeAttribute('data-active');
    });
  });

});
