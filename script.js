// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Header scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Active nav link =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${id}`) {
          item.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', highlightNav);

// ===== Reveal on scroll (supports multiple variants) =====
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-title');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => observer.observe(el));

// ===== Timeline line draw + skill bars =====
const timeline = document.querySelector('.timeline');
const skillCards = document.querySelectorAll('.skill-card');

const inViewObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  { threshold: 0.25 }
);

if (timeline) inViewObserver.observe(timeline);
skillCards.forEach(card => inViewObserver.observe(card));

// ===== Counter animation =====
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-target');
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach(c => counterObserver.observe(c));

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Custom cursor (desktop only) =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .btn, .nav-link, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '52px';
      follower.style.height = '52px';
      follower.style.background = 'rgba(255,255,255,0.1)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.background = 'transparent';
    });
  });
}

// ===== Contact form (Web3Forms + Validation) =====
const form = document.getElementById('contactForm');
if (form) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const btn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, message) {
    input.classList.remove('valid');
    input.classList.add('error');
    const errorEl = document.getElementById(`error-${input.name}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function showValid(input) {
    input.classList.remove('error');
    input.classList.add('valid');
    const errorEl = document.getElementById(`error-${input.name}`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearState(input) {
    input.classList.remove('error', 'valid');
    const errorEl = document.getElementById(`error-${input.name}`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      showError(nameInput, 'Por favor, informe seu nome.');
      return false;
    }
    if (value.length < 2) {
      showError(nameInput, 'Nome deve ter pelo menos 2 caracteres.');
      return false;
    }
    showValid(nameInput);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      showError(emailInput, 'Por favor, informe seu e-mail.');
      return false;
    }
    if (!emailRegex.test(value)) {
      showError(emailInput, 'Digite um e-mail válido.');
      return false;
    }
    showValid(emailInput);
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) {
      showError(messageInput, 'Por favor, escreva uma mensagem.');
      return false;
    }
    if (value.length < 10) {
      showError(messageInput, 'Mensagem muito curta (mín. 10 caracteres).');
      return false;
    }
    showValid(messageInput);
    return true;
  }

  // Validação ao sair do campo
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  // Limpa erro enquanto digita
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) clearState(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        form.querySelectorAll('.form-group, #submitBtn, #formNote').forEach(el => {
          el.style.display = 'none';
        });
        formSuccess.hidden = false;
        form.reset();
        [nameInput, emailInput, messageInput].forEach(clearState);
      } else {
        throw new Error(data.message || 'Erro ao enviar');
      }
    } catch (err) {
      btn.textContent = 'Erro. Tente novamente';
      btn.style.background = '#ef4444';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Smooth scroll for anchor links (extra safety) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
