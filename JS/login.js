document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. ROLE SELECTOR ──────────────────────────────────────── */
  const roleBtns = document.querySelectorAll('.role-btn');
  const loginTitle = document.getElementById('login-title');
  let currentRole = 'student'; // default

  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      roleBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked
      btn.classList.add('active');
      
      // Update role and title
      currentRole = btn.getAttribute('data-role');
      const roleName = btn.textContent;
      if (loginTitle) {
        loginTitle.textContent = `${roleName} Login`;
      }

      // ─── COMING SOON TOGGLE ───────────────────────────────────
      const loginForm = document.getElementById('login-form');
      let comingSoon = document.getElementById('coming-soon-container');
      
      if (currentRole === 'teacher') {
        if (!comingSoon) {
          comingSoon = document.createElement('div');
          comingSoon.id = 'coming-soon-container';
          comingSoon.className = 'coming-soon-container';
          comingSoon.innerHTML = `
            <div class="cs-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h3>Coming Soon...</h3>
            <p>The ${roleName} portal is currently under development. We're crafting something special!</p>
          `;
          loginForm.parentNode.insertBefore(comingSoon, loginForm.nextSibling);
        } else {
          comingSoon.querySelector('p').textContent = `The ${roleName} portal is currently under development. We're crafting something special!`;
        }
        
        loginForm.style.display = 'none';
        comingSoon.style.display = 'flex';
      } else {
        // Restore login form for student (and admin)
        loginForm.style.display = 'flex';
        if (comingSoon) comingSoon.style.display = 'none';
      }
    });
  });

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

  /* ── 3. SUPABASE CONFIGURATION ──────────────────────────────── */
  const supabaseUrl = 'https://jxvmejhmwjguutvkrerq.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dm1lamhtd2pndXV0dmtyZXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDM1NDcsImV4cCI6MjA5MjMxOTU0N30.3AxL09p0b8L_7ExCkjGXOBkg7xXsztEdSvNRiISPo8c';
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  /* ── 4. FORM VALIDATION & SUBMIT ────────────────────────────── */
  const form        = document.getElementById('login-form');
  const emailInput  = document.getElementById('email-input');
  const loginBtn    = document.getElementById('btn-login');

  if (form) {
    form.addEventListener('submit', async (e) => {
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

      // Show loading state
      loginBtn.textContent = 'Authenticating…';
      loginBtn.disabled = true;
      loginBtn.style.opacity = '0.75';

      console.log('Attempting login for role:', currentRole);

      try {
        if (currentRole === 'admin') {
          // Query the custom 'admins' table
          console.log('Querying Supabase admins table for:', email);
          const { data, error } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .maybeSingle(); // maybeSingle returns null if not found instead of an error

          if (error) {
            console.error('Supabase Error:', error);
            showToast('Database connection error.', 'error');
          } else if (!data) {
            console.log('Login failed: No matching admin found.');
            showToast('Invalid Admin credentials.', 'error');
          } else {
            console.log('Login successful! Admin Data:', data);
            showToast('✓ Admin access granted! Redirecting…', 'info');
            
            // Perform redirect
            const targetUrl = data.redirect_url || 'https://rishilearn-backend.onrender.com/admin';
            setTimeout(() => {
              window.location.href = targetUrl;
            }, 800);
          }
        } else if (currentRole === 'student') {
          // Query the 'students' table (if it has passwords)
          // For now, let's at least check if the user exists
          const { data, error } = await supabaseClient
            .from('students')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (data) {
            showToast('✓ Student login successful!', 'info');
            setTimeout(() => { window.location.href = './dashboard.html'; }, 1000);
          } else {
            showToast('Student record not found.', 'error');
          }
        } else {
          showToast('Feature coming soon for this role.', 'info');
        }
      } catch (err) {
        showToast('An unexpected error occurred.', 'error');
        console.error('Catch Error:', err);
      } finally {
        loginBtn.textContent = 'Login →';
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
      }
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
