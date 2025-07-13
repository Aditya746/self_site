// Enhanced script.js with modern animations and interactions
// Load GSAP from CDN
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      const scrollTriggerScript = document.createElement('script');
      scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      scrollTriggerScript.onload = () => {
        gsap.registerPlugin(ScrollTrigger);
        resolve(gsap);
      };
      document.head.appendChild(scrollTriggerScript);
    };
    document.head.appendChild(script);
  });
};

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Main initialization
class WebsiteEnhancer {
  constructor() {
    this.gsap = null;
    this.isInitialized = false;
    this.typingInterval = null;
    this.backToTopBtn = null;
    
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    try {
      // Load GSAP
      this.gsap = await loadGSAP();
      
      // Initialize all features
      this.setupLazyLoading();
      this.setupHamburgerMenu();
      this.setupSmoothScrolling();
      this.setupParallaxEffect();
      this.setupScrollAnimations();
      this.setupTypingEffect();
      this.setupCopyButtons();
      this.setupBackToTop();
      this.setupAccessibility();
      this.setupPerformanceOptimizations();
      this.setupClock();
      this.setupAboutTabs();
      
      // Initialize navbar state
      this.handleNavbarScroll();
      
      this.isInitialized = true;
      console.log('Website enhancer initialized successfully');
    } catch (error) {
      console.error('Error initializing website enhancer:', error);
      // Fallback to basic functionality
      this.setupFallback();
    }
  }

  // 1. Lazy Loading Implementation
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  // 2. Hamburger Menu with Accessibility
  setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const backBtn = document.querySelector('.back-btn');
    
    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      
      // Update ARIA attributes
      const isOpen = navMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      navMenu.setAttribute('aria-hidden', !isOpen);
      
      // Hide/show back button when menu is open/closed
      if (backBtn) {
        if (isOpen) {
          backBtn.style.opacity = '0';
          backBtn.style.pointerEvents = 'none';
          backBtn.style.transition = 'opacity 0.3s ease';
        } else {
          backBtn.style.opacity = '1';
          backBtn.style.pointerEvents = 'auto';
        }
      }
    };

    // Click handler
    hamburger.addEventListener('click', toggleMenu);
    
    // Keyboard support
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Show back button when menu is closed
        if (backBtn) {
          backBtn.style.opacity = '1';
          backBtn.style.pointerEvents = 'auto';
        }
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // 3. Smooth Scrolling with Enhanced UX
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    const smoothScrollTo = (targetId) => {
      const target = document.querySelector(targetId);
      if (!target) return;
      
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update active nav link
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`[href="${targetId}"]`);
      if (activeLink) activeLink.classList.add('active');
    };

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        const backBtn = document.querySelector('.back-btn');
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          hamburger.classList.remove('active');
          
          // Show back button when menu is closed
          if (backBtn) {
            backBtn.style.opacity = '1';
            backBtn.style.pointerEvents = 'auto';
          }
        }
      });
    });

    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        smoothScrollTo('#about');
      });
    }
  }

  // 4. Enhanced Parallax Effect with Performance Optimization
  setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (!hero || !heroTitle || !heroSubtitle) return;

    const handleParallax = throttle((e) => {
      const { width, height, left, top } = hero.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / width * 30;
      const y = (e.clientY - top - height / 2) / height * 30;
      
      gsap.to(heroTitle, {
        x: x,
        y: y,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(heroSubtitle, {
        x: x / 2,
        y: y / 2,
        duration: 0.3,
        ease: 'power2.out'
      });
    }, 16); // ~60fps

    const resetParallax = () => {
      gsap.to([heroTitle, heroSubtitle], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    hero.addEventListener('mousemove', handleParallax);
    hero.addEventListener('mouseleave', resetParallax);
  }

  // 5. GSAP Scroll Animations
  setupScrollAnimations() {
    if (!this.gsap) return;

    // Hero section entrance animation
    const heroElements = document.querySelectorAll('.animate-on-load');
    gsap.fromTo(heroElements, 
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // Fade-in animations for sections
    const fadeElements = document.querySelectorAll('.fade-in');
    gsap.fromTo(fadeElements,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: fadeElements,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Stat cards animation
    const statCards = document.querySelectorAll('.stat-card');
    gsap.fromTo(statCards,
      {
        opacity: 0,
        y: 40,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // About boxes animation
    const aboutBoxes = document.querySelectorAll('.about-box');
    gsap.fromTo(aboutBoxes,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-text',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (self.progress > 0.1) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
      });
    }
  }

  // 6. Enhanced Typing Effect for Hero Title with GSAP
  setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    // Create individual spans for each character for better animation control
    const characters = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      return span;
    });
    
    characters.forEach(span => heroTitle.appendChild(span));
    
    // Animate each character with GSAP
    if (window.gsap) {
      gsap.to(characters, {
        opacity: 1,
        y: 0,
        duration: 0.1,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.5
      });
      
      // Add cursor after typing animation
      setTimeout(() => {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        heroTitle.appendChild(cursor);
        
        // Animate cursor
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        });
      }, characters.length * 80 + 500);
    } else {
      // Fallback for when GSAP is not available
      let i = 0;
      const typeWriter = () => {
        if (i < characters.length) {
          characters[i].style.opacity = '1';
          characters[i].style.transform = 'translateY(0)';
          i++;
          this.typingInterval = setTimeout(typeWriter, 100);
        } else {
          // Add cursor blink effect
          const cursor = document.createElement('span');
          cursor.className = 'typing-cursor';
          cursor.textContent = '|';
          heroTitle.appendChild(cursor);
        }
      };
      
      setTimeout(typeWriter, 500);
    }
  }

  // 7. Enhanced Copy Buttons with Ripple Effect
  setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(btn => {
      btn.addEventListener('click', this.handleCopyClick.bind(this));
      btn.addEventListener('click', this.createRipple.bind(this));
    });
  }

  async handleCopyClick(e) {
    const btn = e.currentTarget;
    const email = btn.getAttribute('data-email');
    const icon = btn.querySelector('i');
    
    try {
      await navigator.clipboard.writeText(email);
      this.showCopyFeedback(btn, icon, true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showCopyFeedback(btn, icon, true);
    }
  }

  showCopyFeedback(btn, icon, success) {
    btn.classList.add('copied');
    icon.className = success ? 'fas fa-check' : 'fas fa-times';
    
    setTimeout(() => {
      btn.classList.remove('copied');
      icon.className = 'fas fa-copy';
    }, 2000);
  }

  createRipple(e) {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    
    button.appendChild(circle);
    
    circle.addEventListener('animationend', () => {
      circle.remove();
    });
  }

  // 8. Back to Top Button
  setupBackToTop() {
    // Create back to top button
    this.backToTopBtn = document.createElement('button');
    this.backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    this.backToTopBtn.className = 'back-to-top';
    this.backToTopBtn.setAttribute('aria-label', 'Back to top');
    this.backToTopBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 100%);
      border: none;
      color: #111;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(163, 163, 163, 0.3);
    `;

    document.body.appendChild(this.backToTopBtn);

    // Show/hide button on scroll
    const handleScroll = throttle(() => {
      if (window.scrollY > 300) {
        this.backToTopBtn.style.opacity = '1';
        this.backToTopBtn.style.visibility = 'visible';
        this.backToTopBtn.style.transform = 'translateY(0)';
      } else {
        this.backToTopBtn.style.opacity = '0';
        this.backToTopBtn.style.visibility = 'hidden';
        this.backToTopBtn.style.transform = 'translateY(20px)';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Smooth scroll to top
    this.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Hover effects
    this.backToTopBtn.addEventListener('mouseenter', () => {
      this.backToTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
      this.backToTopBtn.style.boxShadow = '0 6px 25px rgba(182, 161, 107, 0.4)';
    });

    this.backToTopBtn.addEventListener('mouseleave', () => {
      this.backToTopBtn.style.transform = 'translateY(0) scale(1)';
      this.backToTopBtn.style.boxShadow = '0 4px 20px rgba(182, 161, 107, 0.3)';
    });
  }

  // 9. Accessibility Features
  setupAccessibility() {
    // Add focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #a3a3a3';
        element.style.outlineOffset = '2px';
      });

      element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });

    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #d4d4d4;
      color: #111;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1001;
      transition: top 0.3s;
    `;

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Show skip link on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    // Add main content landmark
    const mainContent = document.querySelector('.hero') || document.body;
    mainContent.id = 'main-content';
  }

  // 10. Performance Optimizations
  setupPerformanceOptimizations() {
    // Debounce scroll events
    const scrollHandlers = [
      this.handleNavbarScroll.bind(this),
      this.handleScrollProgress.bind(this),
      this.handleClockScroll.bind(this)
    ];

    const debouncedScrollHandler = debounce(() => {
      scrollHandlers.forEach(handler => handler());
    }, 16);

    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

    // Preload critical resources
    this.preloadCriticalResources();

    // Optimize images
    this.optimizeImages();
  }

  handleNavbarScroll() {
    // Navbar is now always transparent, no need to add/remove scrolled class
    return;
  }

  handleScrollProgress() {
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Update scroll indicator if it exists
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 1 - scrollProgress / 20);
    }
  }

  handleClockScroll() {
    const clockElement = document.querySelector('.hero-clock');
    if (!clockElement) {
      console.warn('Clock element not found in handleClockScroll');
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollThreshold = 100; // Hide clock after scrolling 100px
    
    if (scrollTop > scrollThreshold) {
      clockElement.classList.add('hidden');
      console.log('Clock hidden at scroll position:', scrollTop);
    } else {
      clockElement.classList.remove('hidden');
      console.log('Clock shown at scroll position:', scrollTop);
    }
  }

  preloadCriticalResources() {
    const criticalImages = [
      'self_icon.jpeg',
      'lpu_logo.png',
      'sandeepni_logo.png',
      'uva_logo.png',
      'vu_logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
  }

  // Fallback for when GSAP fails to load
  setupFallback() {
    console.log('Using fallback animations');
    
    // Basic fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    fadeElements.forEach(el => observer.observe(el));

    // Basic parallax
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (hero && heroTitle && heroSubtitle) {
      hero.addEventListener('mousemove', throttle(e => {
        const { width, height, left, top } = hero.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / width * 30;
        const y = (e.clientY - top - height / 2) / height * 30;
        heroTitle.style.transform = `translate(${x}px, ${y}px)`;
        heroSubtitle.style.transform = `translate(${x / 2}px, ${y / 2}px)`;
      }, 16));
      
      hero.addEventListener('mouseleave', () => {
        heroTitle.style.transform = '';
        heroSubtitle.style.transform = '';
      });
    }
  }

  // 11. Clock Functionality
  setupClock() {
    const clockTimeElement = document.getElementById('clock-time');
    const clockDateElement = document.getElementById('clock-date');
    const clockElement = document.querySelector('.hero-clock');
    
    if (!clockTimeElement || !clockDateElement || !clockElement) {
      console.warn('Clock elements not found');
      return;
    }

    const updateClock = () => {
      const now = new Date();
      
      // Format time (HH:MM:SS)
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // Format date (DD MMM YYYY)
      const dateString = now.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
      // Update DOM elements
      clockTimeElement.textContent = timeString;
      clockDateElement.textContent = dateString;
    };

    // Update immediately
    updateClock();
    
    // Update every second
    setInterval(updateClock, 1000);
    
    // Add hover effect for better UX
    const clockContainer = document.querySelector('.clock-container');
    if (clockContainer) {
      clockContainer.addEventListener('mouseenter', () => {
        clockContainer.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      clockContainer.addEventListener('mouseleave', () => {
        clockContainer.style.transform = 'translateY(0) scale(1)';
      });
    }
  }

  // About Tabs Functionality
  setupAboutTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons.length || !tabContents.length) return;

    const switchTab = (targetTab) => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to target button and content
      const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
      const targetContent = document.getElementById(targetTab);
      
      if (targetButton && targetContent) {
        targetButton.classList.add('active');
        targetContent.classList.add('active');
        
        // Add entrance animation to the active content
        if (this.gsap) {
          this.gsap.fromTo(targetContent, 
            {
              opacity: 0,
              scale: 0.95,
              y: 20
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out"
            }
          );
        }
      }
    };

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = button.getAttribute('data-tab');
        switchTab(targetTab);
        
        // Add button click animation
        if (this.gsap) {
          this.gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
          });
        }
      });
      
      // Add keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetTab = button.getAttribute('data-tab');
          switchTab(targetTab);
        }
      });
    });

    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      const aboutSection = document.querySelector('.about');
      if (aboutSection) {
        observer.observe(aboutSection);
      }
    }
  }

  // Cleanup method
  destroy() {
    if (this.typingInterval) {
      clearTimeout(this.typingInterval);
    }
    
    if (this.backToTopBtn) {
      this.backToTopBtn.remove();
    }
    
    // Remove event listeners
    window.removeEventListener('scroll', this.handleNavbarScroll);
  }
}

// Initialize the enhancer
const websiteEnhancer = new WebsiteEnhancer();

// Export for potential external use
window.WebsiteEnhancer = WebsiteEnhancer;
