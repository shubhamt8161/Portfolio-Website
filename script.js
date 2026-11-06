/**
 * ==============================================================================
 * SHUBHAM SANTOSH TALEKAR PORTFOLIO — INTERACTIVE ENGINE
 * Pure Vanilla JavaScript (ES6+)
 * Tailored for Python Developer & Data Analyst Portfolio
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (DARK / LIGHT MODE)
     -------------------------------------------------------------------------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  
  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      
      showToast(`Switched to ${newTheme} theme`, 'info');
      
      if (window.updateCanvasColors) {
        window.updateCanvasColors();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. AMBIENT PARTICLES CANVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 45);

    const getThemeColor = () => {
      const isLight = html.getAttribute('data-theme') === 'light';
      return isLight ? 'rgba(99, 102, 241, ' : 'rgba(148, 163, 184, ';
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${getThemeColor()}${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${getThemeColor()}${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.updateCanvasColors = () => {};
  }

  /* --------------------------------------------------------------------------
     3. DYNAMIC TYPING EFFECT (TAILORED FOR SHUBHAM)
     -------------------------------------------------------------------------- */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const phrases = [
      'Python Developer',
      'Data Analyst',
      'Learning Frontend Development',
      'SQL & Database Specialist',
      'Power BI & Analytics Enthusiast',
      'BSc Computer Science Graduate'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 95;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 1900;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 350;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    typeLoop();
  }

  /* --------------------------------------------------------------------------
     4. NAVBAR SCROLL EFFECT & MOBILE MENU
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. SCROLL-SPY ACTIVE NAV HIGHLIGHT
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  
  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + 220;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy);

  /* --------------------------------------------------------------------------
     6. 3D TILT EFFECT ON HERO PYTHON CODE CARD
     -------------------------------------------------------------------------- */
  const heroCard = document.getElementById('hero-card');
  if (heroCard && window.innerWidth > 992) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* --------------------------------------------------------------------------
     7. ANIMATED STAT COUNTERS
     -------------------------------------------------------------------------- */
  const counterElements = document.querySelectorAll('[data-counter]');
  let countersAnimated = false;

  const runCounterAnimation = () => {
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      let count = 0;
      const duration = 1500;
      const stepTime = Math.max(Math.floor(duration / target), 30);

      const timer = setInterval(() => {
        count += 1;
        el.textContent = count;
        if (count >= target) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.about-stats-wrapper');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* --------------------------------------------------------------------------
     8. SKILLS TAB FILTERING & PROGRESS BARS
     -------------------------------------------------------------------------- */
  const skillTabs = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-skill-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Animate skill progress bars when in viewport
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillsObserver.observe(card));

  /* --------------------------------------------------------------------------
     9. PROJECTS CATEGORY FILTER
     -------------------------------------------------------------------------- */
  const projectFilters = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     10. PROJECT DETAILS MODAL SYSTEM (SHUBHAM'S RESUME PROJECTS)
     -------------------------------------------------------------------------- */
  const modalBackdrop = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  // Real projects from Shubham's Resume
  const projectDatabase = {
    primemart: {
      title: 'Prime Mart &mdash; Retail Sales Analytics Dashboard',
      category: 'Data Analytics, SQL & Power BI',
      gradientClass: 'banner-gradient-1',
      icon: 'fa-solid fa-chart-pie',
      desc: 'An end-to-end retail business intelligence project analyzing transaction and customer data to evaluate regional revenue, order volumes, customer behavior, and profit margins.',
      features: [
        'Cleaned, normalized, and preprocessed 10,000+ sales records and 4,000+ customer orders using Python & Excel.',
        'Wrote structured SQL queries to aggregate revenue, customer lifetime value, and order frequencies.',
        'Engineered dynamic DAX measures in Power BI for month-over-month growth calculations and profit tracking.',
        'Built an executive dashboard with interactive drill-down filtering by product category, regional territory, and date range.'
      ],
      tech: ['Power BI', 'SQL', 'Python', 'Microsoft Excel', 'Data Cleaning', 'Data Modeling'],
      liveLink: 'https://github.com/shubhamt8161',
      githubLink: 'https://github.com/shubhamt8161'
    },
    bookstore: {
      title: 'Online Book Store &mdash; SQL Database & Query Analysis',
      category: 'Relational Database Architecture & SQL Analytics',
      gradientClass: 'banner-gradient-2',
      icon: 'fa-solid fa-book-bookmark',
      desc: 'A complete relational database implementation in PostgreSQL modeling an online bookstore ecosystem with comprehensive reporting queries for inventory and customer orders.',
      features: [
        'Designed normalized relational schema covering books, authors, customers, order details, and inventory status.',
        'Wrote 20+ analytical SQL queries using INNER/LEFT joins, GROUP BY, HAVING, and multi-level subqueries to extract business insights.',
        'Analyzed best-selling authors, monthly sales trends, and customer purchase frequency distribution.',
        'Conducted rigorous data validation checks, foreign key integrity constraints, and query optimization.'
      ],
      tech: ['PostgreSQL', 'SQL', 'Database Design', 'Subqueries', 'Relational Modeling'],
      liveLink: 'https://github.com/shubhamt8161',
      githubLink: 'https://github.com/shubhamt8161'
    },
    audioextractor: {
      title: 'Audio Extractor Desktop Application',
      category: 'Python Application & Multithreading',
      gradientClass: 'banner-gradient-3',
      icon: 'fa-solid fa-headphones',
      desc: 'A lightweight and intuitive desktop media utility built in Python that extracts audio tracks from video files and converts them cleanly into high-bitrate MP3 files.',
      features: [
        'Engineered an intuitive graphical user interface (GUI) using Tkinter for seamless file browsing and destination selection.',
        'Integrated MoviePy audio extraction engine supporting various video containers (MP4, MKV, AVI).',
        'Implemented multithreaded background processing so the user interface remains responsive and smooth during large file conversion.',
        'Added custom audio bitrate selection and real-time processing status alerts.'
      ],
      tech: ['Python', 'Tkinter GUI', 'MoviePy', 'Multithreading', 'OOP'],
      liveLink: 'https://github.com/shubhamt8161',
      githubLink: 'https://github.com/shubhamt8161'
    }
  };

  const openModal = (projectId) => {
    const data = projectDatabase[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-header-banner ${data.gradientClass}">
        <i class="${data.icon}"></i>
      </div>
      <span class="modal-proj-subtitle">${data.category}</span>
      <h3 class="modal-proj-title">${data.title}</h3>
      <p class="modal-proj-desc">${data.desc}</p>

      <h4 class="modal-section-title">Key Technical Highlights</h4>
      <div class="modal-features-list">
        ${data.features.map(f => `
          <div class="modal-feature-item">
            <i class="fa-solid fa-check"></i>
            <span>${f}</span>
          </div>
        `).join('')}
      </div>

      <h4 class="modal-section-title">Technologies Used</h4>
      <div class="modal-tags">
        ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="${data.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i class="fa-brands fa-github"></i>
          <span>GitHub Repository</span>
        </a>
        <a href="https://www.linkedin.com/in/shubhamtalekar07/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <i class="fa-brands fa-linkedin-in"></i>
          <span>LinkedIn Profile</span>
        </a>
      </div>
    `;

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      openModal(projId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* --------------------------------------------------------------------------
     11. CONTACT FORM VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 8) {
        messageError.textContent = 'Message must be at least 8 characters.';
        isValid = false;
      }

      if (!isValid) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        formStatus.textContent = '✓ Thank you! Your message has been sent. Shubham will reply to you shortly.';
        formStatus.classList.add('success');
        formStatus.style.display = 'block';

        showToast('Message sent successfully to Shubham! 🚀', 'success');
        contactForm.reset();

        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 7000);
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     12. COPY TO CLIPBOARD BUTTONS (SHUBHAM'S EMAIL)
     -------------------------------------------------------------------------- */
  const emailToCopy = 'shubhamt8161@gmail.com';
  const copyButtons = [
    document.getElementById('copy-email-btn'),
    document.getElementById('btn-copy-email')
  ];

  copyButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(emailToCopy).then(() => {
            showToast('shubhamt8161@gmail.com copied to clipboard! 📋', 'success');
          }).catch(() => {
            fallbackCopy(emailToCopy);
          });
        } else {
          fallbackCopy(emailToCopy);
        }
      });
    }
  });

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('shubhamt8161@gmail.com copied to clipboard! 📋', 'success');
    } catch (err) {
      showToast('Email: ' + text, 'info');
    }
    document.body.removeChild(textArea);
  };

  // Toast System
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' 
      ? '<i class="fa-solid fa-circle-check"></i>' 
      : '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }

  /* --------------------------------------------------------------------------
     13. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay, 10));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     14. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     15. FOOTER DYNAMIC YEAR
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
