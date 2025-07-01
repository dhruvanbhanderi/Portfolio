// Core configuration
const CONFIG = {
    animationDuration: 800,
    threshold: 0.2,
    projectsPerPage: 6
};

// Project data
const projects = [
    {
        title: 'Delivery Routes Optimization',
        description: 'Java-based delivery route optimization using greedy algorithm, Dijkstra\'s & A* algorithms',
        image: 'route-opt.jpg',
        tags: ['Java', 'Algorithms', 'Optimization'],
        link: 'https://github.com/dhruvanbhanderi'
    },
    {
        title: 'Inflation Prediction Model',
        description: 'Python-based linear regression model to forecast inflation using historical data',
        image: 'inflation.jpg',
        tags: ['Python', 'Machine Learning', 'Data Analysis'],
        link: 'https://github.com/dhruvanbhanderi'
    },
    {
        title: 'E-Commerce Site',
        description: 'Full-stack e-commerce website with user authentication and management',
        image: 'ecommerce.jpg',
        tags: ['HTML', 'PHP', 'MySQL', 'JavaScript'],
        link: 'https://github.com/dhruvanbhanderi'
    },
    {
        title: 'Lunar Terrain Surveyor',
        description: 'YOLOv8x object detection model for lunar rocks with 80.8% mAP@0.5',
        image: 'lunar.jpg',
        tags: ['Python', 'AI/ML', 'Computer Vision'],
        link: 'https://github.com/dhruvanbhanderi'
    }
];

// Animation Controller
class AnimationController {
    static transitions = {
        fadeUp: element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            setTimeout(() => {
                element.style.transition = 'all 0.7s cubic-bezier(.77,0,.18,1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 30);
        },
        scaleIn: element => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0.97)';
            setTimeout(() => {
                element.style.transition = 'all 0.5s cubic-bezier(.77,0,.18,1)';
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, 30);
        }
    };

    static init() {
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupCursorEffect();
    }

    static setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const animation = target.dataset.animation || 'fadeUp';
                    this.transitions[animation](target);
                    observer.unobserve(target);
                }
            });
        }, { threshold: CONFIG.threshold });

        document.querySelectorAll('[data-animation]')
            .forEach(el => observer.observe(el));
    }

    static setupParallax() {
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = el.dataset.parallax || 0.1;
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                el.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }

    static setupCursorEffect() {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        // Only highlight cursor for links and buttons, not project cards
        document.querySelectorAll('a, button, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }
}

// Project Controller
class ProjectController {
    static displayProjects() {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;
        grid.innerHTML = '';
        projects.forEach((project, index) => {
            const card = this.createProjectCard(project);
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });
    }
    static createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.animation = 'scaleIn';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${project.image}" alt="${project.title}">
                    <h3>${project.title}</h3>
                </div>
                <div class="card-back">
                    <p>${project.description}</p>
                    <div class="tags">
                        ${project.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <a href="${project.link}" class="project-link" target="_blank">
                        View Project <span>→</span>
                    </a>
                </div>
            </div>
        `;
        return card;
    }
    static filterProjects(type) {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;
        grid.innerHTML = '';
        let filtered = projects;
        if (type && type !== 'all') {
            // Filter by main category: 'web' or 'ml'
            if (type === 'web') {
                filtered = projects.filter(p => p.tags.some(tag => ['html','php','javascript','web'].includes(tag.toLowerCase())));
            } else if (type === 'ml') {
                filtered = projects.filter(p => p.tags.some(tag => ['ml','ai/ml','machine learning','ai','data analysis','computer vision','python'].includes(tag.toLowerCase())));
            }
        }
        filtered.forEach((project, index) => {
            const card = this.createProjectCard(project);
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    AnimationController.init();
    ProjectController.displayProjects();
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    // Project filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const type = this.dataset.filter;
            ProjectController.filterProjects(type);
        });
    });

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        // Optional: close sidebar when a link is clicked (mobile UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }
});
