// ================== DOMContentLoaded Initialization ==================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization...');

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        if (scrollTop > lastScrollTop && scrollTop > 200) navbar.style.transform = 'translateY(-100%)';
        else navbar.style.transform = 'translateY(0)';
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    addAnimationClasses();
    highlightActiveNavLink();
    typeWriter();
    lazyLoadImages();
    initThemeToggle();
    initSearch();
    optimizeForPrint();
    setTimeout(() => {
        init3DTiltEffects();
        initParallaxMouse();
        initMagneticButtons();
        initSkillWaveEffect();
        initTimelineProgress();
        initBouncyCounters();
    }, 1000);

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
});

// ================== Animation Classes ==================
function addAnimationClasses() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
    });
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => category.classList.add('fade-in'));
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => item.classList.add('fade-in'));
    const aboutText = document.querySelector('.about-text');
    const aboutContact = document.querySelector('.about-contact');
    if (aboutText) aboutText.classList.add('slide-in-left');
    if (aboutContact) aboutContact.classList.add('slide-in-right');
}

// ================== Navigation Highlight ==================
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
                });
            }
        });
    });
}

// ================== Contact Form ==================
function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch('https://formspree.io/f/xeozbvjv', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            form.style.display = 'none';
            const thankYou = document.getElementById('thankYouMessage');
            if (thankYou) thankYou.style.display = 'block';
            form.reset();
        } else showNotification('Oops! Something went wrong. Please try again.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    })
    .catch(error => {
        console.error(error);
        showNotification('Oops! Something went wrong. Please try again.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// ================== Notifications ==================
function showNotification(message, type='info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: ${type==='success'? '#10b981' : type==='error'? '#ef4444' : '#3b82f6'};
        color: white; padding: 1rem 1.5rem; border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index:1001; transform:translateX(100%); transition: transform 0.3s ease; max-width:400px;
    `;
    document.body.appendChild(notification);
    setTimeout(()=> notification.style.transform='translateX(0)',100);
    notification.querySelector('.notification-close').addEventListener('click',()=>removeNotification(notification));
    setTimeout(()=>removeNotification(notification),5000);
}
function removeNotification(notification) {
    notification.style.transform='translateX(100%)';
    setTimeout(()=>notification.parentNode?.removeChild(notification),300);
}

// ================== Typing Hero ==================
function typeWriter() {
    const textElement = document.querySelector('.hero-title');
    if (!textElement) return;
    const originalText = textElement.innerHTML;
    const text = textElement.textContent;
    textElement.innerHTML = '';
    let i = 0;
    const speed = 50;
    function type() {
        if(i<text.length){ textElement.innerHTML += text.charAt(i); i++; setTimeout(type,speed); }
        else textElement.innerHTML = originalText;
    }
    setTimeout(type,1000);
}

// ================== Lazy Loading ==================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img=>imageObserver.observe(img));
}

// ================== Theme Toggle ==================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if(!themeToggle) return;
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.addEventListener('click',()=>{
        const newTheme = document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ================== Search and Print ==================
function initSearch() {
    const searchInput = document.getElementById('search');
    if(!searchInput) return;
    searchInput.addEventListener('input', e=>{
        const searchTerm = e.target.value.toLowerCase();
        // Implement search logic if needed
    });
}
function optimizeForPrint() {
    window.addEventListener('beforeprint',()=>document.body.classList.add('printing'));
    window.addEventListener('afterprint',()=>document.body.classList.remove('printing'));
}

// ================== All 3D, Parallax, Tilt, Magnetic ==================
function init3DTiltEffects(){const tiltElements=document.querySelectorAll('.timeline-content, .skill-category, .education-item, .about-contact, .contact-form'); tiltElements.forEach(element=>{element.addEventListener('mousemove',handleTilt); element.addEventListener('mouseleave',resetTilt);});}
function handleTilt(e){const element=e.currentTarget;const rect=element.getBoundingClientRect();const x=e.clientX-rect.left;const y=e.clientY-rect.top;const centerX=rect.width/2;const centerY=rect.height/2;const rotateX=(y-centerY)/10;const rotateY=(centerX-x)/10;element.style.transform=`translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`; const shadowX=(x-centerX)/10; const shadowY=(y-centerY)/10;element.style.boxShadow=`${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.1), 0 15px 20px rgba(37,99,235,0.1), 0 0 0 1px rgba(37,99,235,0.1)`;}
function resetTilt(e){const element=e.currentTarget;element.style.transform='translateY(0) rotateX(0) rotateY(0) scale(1)'; element.style.boxShadow='';}
function initParallaxMouse(){const hero=document.querySelector('.hero');if(!hero)return; hero.addEventListener('mousemove',(e)=>{const rect=hero.getBoundingClientRect(); const x=e.clientX-rect.left; const y=e.clientY-rect.top; const centerX=rect.width/2; const centerY=rect.height/2; const moveX=(x-centerX)/50; const moveY=(y-centerY)/50; const heroGraphic=hero.querySelector('.hero-graphic'); if(heroGraphic) heroGraphic.style.transform=`translate(${moveX}px, ${moveY}px)`;});}
function initMagneticButtons(){const buttons=document.querySelectorAll('.btn'); buttons.forEach(button=>{button.addEventListener('mousemove',e=>{const rect=button.getBoundingClientRect(); const x=e.clientX-rect.left-rect.width/2; const y=e.clientY-rect.top-rect.height/2; button.style.transform=`translate(${x*0.1}px, ${y*0.1}px) scale(1.05)`;}); button.addEventListener('mouseleave',()=>{button.style.transform='translate(0,0) scale(1)';});});}
function initSkillWaveEffect(){const skillItems=document.querySelectorAll('.skill-item'); skillItems.forEach((item,index)=>{item.addEventListener('mouseenter',()=>{item.style.animation=`skillWave 0.6s ease ${index*50}ms`;}); item.addEventListener('animationend',()=>{item.style.animation='';});});}
function initTimelineProgress(){const timelineItems=document.querySelectorAll('.timeline-item'); const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.animation='timelineSlideIn 0.8s ease forwards';}});},{threshold:0.5}); timelineItems.forEach(item=>observer.observe(item));}
function initBouncyCounters(){const counters=document.querySelectorAll('.stat-number'); const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const counter=entry.target; const target=parseInt(counter.textContent.replace(/\D/g,'')); const suffix=counter.textContent.replace(/[0-9]/g,''); animateCounterWithBounce(counter,target,suffix); observer.unobserve(counter);}});},{threshold:0.5}); counters.forEach(counter=>observer.observe(counter));}
function animateCounterWithBounce(counter,target,suffix){let current=0; const increment=target/50; const updateCounter=()=>{if(current<target){current+=increment; counter.textContent=Math.floor(current)+suffix; counter.style.transform='scale(1.2)'; setTimeout(()=>{counter.style.transform='scale(1)';},100); requestAnimationFrame(updateCounter);} else{counter.textContent=target+suffix; counter.style.transform='scale(1.1)'; setTimeout(()=>{counter.style.transform='scale(1)';},200);}}; updateCounter();}
