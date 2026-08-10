-- ============================================================
-- Portfolio CMS Initial Seed Data
-- ============================================================

USE `portfolio_cms`;

-- ============================================================
-- CLEAR EXISTING DATA
-- ============================================================
-- Disable foreign-key checks while clearing the database.
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- CHILD TABLES
-- ============================================================

TRUNCATE TABLE `service_features`;

TRUNCATE TABLE `project_images`;
TRUNCATE TABLE `project_features`;
TRUNCATE TABLE `project_technologies`;
TRUNCATE TABLE `project_performance_stats`;

TRUNCATE TABLE `experience_achievements`;
TRUNCATE TABLE `experience_skills`;

-- ============================================================
-- PARENT TABLES
-- ============================================================

TRUNCATE TABLE `services`;
TRUNCATE TABLE `projects`;
TRUNCATE TABLE `experience`;

-- ============================================================
-- OTHER TABLES
-- ============================================================

TRUNCATE TABLE `admins`;
TRUNCATE TABLE `site_settings`;
TRUNCATE TABLE `navigation_items`;
TRUNCATE TABLE `hero_sections`;
TRUNCATE TABLE `about_sections`;
TRUNCATE TABLE `about_stats`;
TRUNCATE TABLE `technologies`;
TRUNCATE TABLE `certifications`;
TRUNCATE TABLE `testimonials`;
TRUNCATE TABLE `contact_settings`;
TRUNCATE TABLE `social_links`;

-- Re-enable foreign-key checks.
SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- ADMIN ACCOUNT
-- ─── Admin Account ──────────────────────────────────────────
-- Email: admin@portfolio.com
-- Password: Admin@1234 (BCRYPT hash)
INSERT INTO `admins` (`id`, `name`, `email`, `password`) VALUES
(1, 'Emmanuel Quarshie', 'admin@portfolio.com', '$2y$10$WHbNtIDXwWJd4tVEMg67wOZIDwLiLdybr2xpJwa.ipm1D2EWPwBaK');


-- ============================================================
-- SITE SETTINGS
-- ============================================================

INSERT INTO `site_settings`
(`setting_key`, `setting_value`)
VALUES
('site_name', 'Rapid Render Portfolio'),
('site_title', 'Rapid Render — Principal Digital Architect & Design Engineer'),
('primary_email', 'quarshie395@gmail.com'),
('phone', '+233 50 000 0000'),
('location', 'Greater Accra, Ghana'),
('short_description', 'Crafting world-class digital experiences blending Neumorphic depth, Glassmorphism, and Apple-grade precision engineering.'),
('copyright_text', '© 2026 Rapid Render. All rights reserved. Crafted with React 19 & Tailwind CSS.'),
('meta_title', 'Rapid Render — Full-Stack & UI/UX Developer'),
('meta_description', 'High-performance React 19 SPAs, Neumorphic/Glassmorphic design systems, and micro-frontend client engineering.');


-- ============================================================
-- NAVIGATION LINKS
-- ============================================================

INSERT INTO `navigation_items`
(`id`, `label`, `path`, `sort_order`, `is_active`)
VALUES
(1, 'Home', '/', 1, 1),
(2, 'About', '/about', 2, 1),
(3, 'Services', '/services', 3, 1),
(4, 'Projects', '/projects', 4, 1),
(5, 'Experience', '/experience', 5, 1),
(6, 'Certifications', '/certifications', 6, 1),
(7, 'Testimonials', '/testimonials', 7, 1),
(8, 'Contact', '/contact', 8, 1),
(9, 'Resume', '/resume', 9, 1);


-- ============================================================
-- HERO SECTION
-- ============================================================

INSERT INTO `hero_sections`
(
    `id`,
    `badge_text`,
    `headline_1`,
    `headline_2`,
    `headline_3`,
    `headline_4`,
    `bio`,
    `availability_text`,
    `is_available`,
    `cta_primary_text`,
    `cta_primary_url`,
    `cta_secondary_text`,
    `cta_secondary_url`,
    `stat_1_label`,
    `stat_1_value`,
    `stat_2_label`,
    `stat_2_value`,
    `is_active`
)
VALUES
(
    1,
    'Available for Selective Client Projects',
    'I Design & Build Premium Web Experiences',
    'React 19 & Tailwind CSS Architect',
    'Neumorphic & Glassmorphic UI Pioneer',
    'Transforming Complexity into Elegant Software',
    'I blend luxury digital aesthetics with ultra-fast React 19 single-page architecture. Specializing in Neumorphism, Glassmorphism, 60 FPS motion design, and high-conversion enterprise interfaces.',
    'Available for Selective Client Projects',
    1,
    'Hire Me',
    '/contact',
    'View Projects',
    '/projects',
    'Clean Code Architecture',
    '99.9%',
    'Lighthouse Score',
    '100%',
    1
);


-- ============================================================
-- ABOUT SECTION
-- ============================================================

INSERT INTO `about_sections`
(
    `id`,
    `badge`,
    `heading`,
    `subheading`,
    `profile_image`,
    `name`,
    `job_title`,
    `location`,
    `availability_text`,
    `is_available`,
    `bio_paragraph_1`,
    `bio_paragraph_2`,
    `engineering_badge_1`,
    `engineering_badge_2`,
    `is_active`
)
VALUES
(
    1,
    'Architectural Philosophy',
    'Engineering Digital Perfection Through Code & Design',
    'Full-Stack Developer & Neumorphic Design System Specialist',
    '/images/profile.png',
    'Emmanuel Quarshie',
    'Principal Digital Architect & Design Engineer',
    'Greater Accra, Ghana / Remote Worldwide',
    'Available for Selective Client Projects',
    1,
    'Specializing in high-performance React 19 SPAs, Neumorphic/Glassmorphic design systems, and micro-frontend client engineering.',
    'Covered structured systems analysis & design (SSAD), programming methods, HTML5, Core Java, C++, MS SQL Server, C#, VB.NET, Python, and rapid application development with PHP/MySQL.',
    'React 19 & Tailwind CSS',
    'PHP 8.3 & MySQL Architecture',
    1
);


-- ============================================================
-- ABOUT STATS
-- ============================================================

INSERT INTO `about_stats`
(
    `id`,
    `label`,
    `value`,
    `icon_name`,
    `color_class`,
    `sort_order`,
    `is_active`
)
VALUES
(1, 'Projects Completed', '45+', 'Briefcase', 'text-amber-500', 1, 1),
(2, 'Years Experience', '6+', 'Award', 'text-indigo-500', 2, 1),
(3, 'Technologies Mastered', '18+', 'Code', 'text-emerald-500', 3, 1),
(4, 'Coffee & Passion', '2.4k', 'Sparkles', 'text-sky-500', 4, 1);


-- ============================================================
-- SERVICES
-- ============================================================

INSERT INTO `services`
(
    `id`,
    `title`,
    `category`,
    `icon_name`,
    `grid_size`,
    `description`,
    `sort_order`,
    `is_published`
)
VALUES
(
    1,
    'Frontend Architecture & Engineering',
    'Core Service',
    'Layout',
    'col-span-12 lg:col-span-7',
    'Building scalable, modular React 19 single-page applications engineered for sub-second page loads and zero layout shift.',
    1,
    1
),
(
    2,
    'Custom React Web Applications',
    'Development',
    'Code',
    'col-span-12 lg:col-span-5',
    'Tailor-made web portals with dynamic state management, custom hooks, and real-time synchronization.',
    2,
    1
),
(
    3,
    'High-Conversion Digital Websites',
    'Design Systems',
    'Globe',
    'col-span-12 lg:col-span-5',
    'Apple-grade landing pages blending soft Neumorphism with sleek glassmorphism to captivate high-value audiences.',
    3,
    1
),
(
    4,
    'Enterprise Analytics & Admin Dashboards',
    'Full-Stack',
    'BarChart3',
    'col-span-12 lg:col-span-7',
    'Dynamic management consoles with chart data visualizations, role-based security, and complete CMS capabilities.',
    4,
    1
),
(
    5,
    'Pixel-Perfect UI/UX Implementation',
    'UI Design',
    'Figma',
    'col-span-12 lg:col-span-6',
    'Transforming complex Figma and Adobe XD prototypes into clean, responsive Tailwind CSS components.',
    5,
    1
),
(
    6,
    'Performance & Web Vitals Optimization',
    'Optimization',
    'Zap',
    'col-span-12 lg:col-span-6',
    'Auditing legacy codebases to achieve 99+ Lighthouse performance ratings, optimized bundle sizes, and 60 FPS motion.',
    6,
    1
);


-- ============================================================
-- SERVICE FEATURES
-- ============================================================

INSERT INTO `service_features`
(
    `service_id`,
    `feature_text`,
    `sort_order`
)
VALUES
(1, 'React 19 & Vite Bundling', 1),
(1, 'State Management & Custom Hooks', 2),
(1, 'Micro-Frontend Modularization', 3),

(2, 'REST & GraphQL Integration', 1),
(2, 'Real-time WebSocket Feeds', 2),
(2, 'Role-Based Auth & Permissions', 3),

(3, 'Neumorphic & Glassmorphic Tokens', 1),
(3, '60 FPS Framer Motion & GSAP', 2),
(3, 'Fully Responsive Across Devices', 3),

(4, 'PHP 8.3 & MySQL Backend API', 1),
(4, 'Interactive Data Visualization', 2),
(4, 'Exportable PDF & CSV Reports', 3),

(5, 'Design Token Mapping', 1),
(5, 'Dark/Light Theme Mechanics', 2),
(5, 'Accessible Component Trees (WCAG)', 3),

(6, 'Sub-Second LCP & Zero CLS', 1),
(6, 'Asset & Code-Splitting Optimization', 2),
(6, 'Memory Leak Prevention', 3);


-- ============================================================
-- TECHNOLOGIES
-- ============================================================

INSERT INTO `technologies`
(
    `id`,
    `name`,
    `category`,
    `icon_key`,
    `color`,
    `description`,
    `level`,
    `sort_order`,
    `is_active`
)
VALUES
(1, 'React', 'Frontend Core', 'FaReact', '#61DAFB', 'React 19, Hooks, Context API, SPA Routing', 98, 1, 1),
(2, 'JavaScript', 'Language', 'SiJavascript', '#F7DF1E', 'ES6+, Async/Await, Modular JS, Functional Programming', 96, 2, 1),
(3, 'Tailwind CSS', 'Styling Engine', 'SiTailwindcss', '#06B6D4', 'Custom Design Tokens, Neumorphism Utilities, Animations', 98, 3, 1),
(4, 'PHP', 'Backend API', 'FaPhp', '#777BB4', 'PHP 8.3 REST Endpoints, OOP, PDO Architecture', 90, 4, 1),
(5, 'MySQL', 'Database', 'SiMysql', '#4479A1', 'Relational Schema Design, Query Optimization, Foreign Keys', 92, 5, 1),
(6, 'Git', 'Version Control', 'FaGitAlt', '#F05032', 'Branching Workflows, Pull Requests, Merge Strategies', 95, 6, 1),
(7, 'Node.js', 'Runtime', 'FaNodeJs', '#5FA04E', 'NPM Automation, Express Microservices, Tooling', 94, 7, 1),
(8, 'REST API', 'Architecture', 'TbApi', '#6C63FF', 'JSON Endpoint Contract Design, Status Codes, Auth', 98, 8, 1),
(9, 'TypeScript', 'Language', 'SiTypescript', '#3178C6', 'Strong Typing, Generic Interfaces, Strict Type Safety', 92, 9, 1),
(10, 'Framer Motion', 'Animation', 'MdAnimation', '#0055FF', 'Smooth Layout Transitions, Keyframe Animations, Gesture Handling', 95, 10, 1),
(11, 'GSAP', 'High-FPS Motion', 'SiGsap', '#88CE02', 'Timeline Orchestration, ScrollTrigger Effects, Canvas Rendering', 90, 11, 1);


-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO `projects`
(
    `id`,
    `slug`,
    `title`,
    `subtitle`,
    `category`,
    `description`,
    `challenges`,
    `solutions`,
    `architecture`,
    `image`,
    `live_demo`,
    `github_url`,
    `is_featured`,
    `is_published`,
    `sort_order`
)
VALUES
(
    1,
    'luxoragift',
    'LuxoraGift E-Commerce Engine',
    'Luxury Gifting & Personalized E-Commerce Experience',
    'Web Application',
    'High-performance React single page application with seamless luxury catalog filtering and instant checkout UI.',
    'Achieving seamless 60FPS transitions on heavy catalog pages with high-resolution media while maintaining fast initial paint.',
    'Implemented dynamic lazy-loading for off-screen product cards, optimized image asset caching, and memoized expensive filter operations.',
    'React 19 SPA + Tailwind CSS + Framer Motion + PHP REST Backend',
    '/images/ecom.jpg',
    'https://luxoragift.dev',
    'https://github.com/RapidRenderquarshie/luxoragift',
    1,
    1,
    1
),
(
    2,
    'pizzaapp',
    'Flame & Crust Artisan Pizzeria',
    'Interactive Food Ordering & Live Kitchen Dispatch System',
    'Full-Stack App',
    'Order customization app with real-time cart computation, topping selector, and order status dashboard.',
    'Handling complex multi-topping pizza permutations without UI lag or stale cart totals.',
    'Built a dedicated pricing engine using memoized React hooks and optimistic UI updates for instant feedback.',
    'React 19 + Context API + PHP MySQL Endpoint API',
    '/images/pizza.jpg',
    'https://flameandcrust.dev',
    'https://github.com/RapidRenderquarshie/pizzaapp',
    1,
    1,
    2
),
(
    3,
    'gym-management',
    'ApexFit Gym & Club OS',
    'Membership Management & Workout Analytics Platform',
    'Dashboard UI',
    'Full-stack management console for fitness centers featuring member check-ins, subscription tiers, and trainer schedules.',
    'Visualizing dense attendance data and financial metrics smoothly across mobile and desktop viewpoints.',
    'Designed glassmorphic dashboard cards using CSS Grid, optimized charting library integration, and decoupled data fetching.',
    'React 19 + Neumorphic Design System + PHP MySQL Backend',
    '/images/gym.jpg',
    'https://apexfit.dev',
    'https://github.com/RapidRenderquarshie/gym-management',
    1,
    1,
    3
),
(
    4,
    'portfolio',
    'Neumorphic Digital Portfolio',
    'Luxury Portfolio & Dynamic Content Management System',
    'CMS & Design System',
    'Bespoke digital architect portfolio driven by a secure custom PHP REST API and React 19 frontend.',
    'Ensuring zero degradation of 60FPS GSAP/Framer animations while connecting every section dynamically to MySQL.',
    'Engineered an in-memory client service cache and asynchronous skeleton loaders for smooth, flicker-free renders.',
    'React 19 + Vite + PHP 8.3 + MySQL + Tailwind CSS',
    '/images/ecom.jpg',
    'https://rapidrender.dev',
    'https://github.com/RapidRenderquarshie/portfolio',
    1,
    1,
    4
);


-- ============================================================
-- PROJECT FEATURES
-- ============================================================

INSERT INTO `project_features`
(
    `project_id`,
    `feature_text`,
    `sort_order`
)
VALUES
(1, 'Real-time cart price calculator', 1),
(1, 'Interactive product modal views', 2),
(1, 'Multi-currency support', 3),

(2, 'Custom pizza topping builder', 1),
(2, 'Live cart recalculation', 2),
(2, 'Kitchen dispatch dashboard UI', 3),

(3, 'Member check-in tracker', 1),
(3, 'Subscription payment management', 2),
(3, 'Trainer schedule calendar', 3),

(4, 'Full PHP/MySQL Admin CMS', 1),
(4, 'Secure CV Upload & Download Analytics', 2),
(4, 'Dynamic Media Library & Icon Pickers', 3);


-- ============================================================
-- PROJECT TECHNOLOGIES
-- ============================================================

INSERT INTO `project_technologies`
(
    `project_id`,
    `tech_name`,
    `sort_order`
)
VALUES
(1, 'React', 1),
(1, 'Tailwind CSS', 2),
(1, 'Framer Motion', 3),
(1, 'PHP', 4),

(2, 'React', 1),
(2, 'Context API', 2),
(2, 'PHP', 3),
(2, 'MySQL', 4),

(3, 'React', 1),
(3, 'Tailwind CSS', 2),
(3, 'Chart.js', 3),
(3, 'PHP', 4),

(4, 'React 19', 1),
(4, 'Vite', 2),
(4, 'PHP 8.3', 3),
(4, 'MySQL', 4);


-- ============================================================
-- PROJECT PERFORMANCE STATS
-- ============================================================

INSERT INTO `project_performance_stats`
(
    `project_id`,
    `label`,
    `value`,
    `sort_order`
)
VALUES
(1, 'Lighthouse Score', '99%', 1),
(1, 'Load Time', '<0.4s', 2),
(1, 'FPS', '60 FPS', 3),

(2, 'Order Time', '3x Faster', 1),
(2, 'Cart Latency', '0ms', 2),
(2, 'Accuracy', '100%', 3),

(3, 'Active Members', '1,200+', 1),
(3, 'Retention', '94%', 2),
(3, 'Daily Checkins', '450+', 3),

(4, 'Core Web Vitals', '100%', 1),
(4, 'API Response', '<50ms', 2),
(4, 'Frame Rate', '60 FPS', 3);


-- ============================================================
-- EXPERIENCE
-- ============================================================

INSERT INTO `experience`
(
    `id`,
    `role`,
    `company`,
    `location`,
    `type`,
    `period`,
    `description`,
    `sort_order`,
    `is_active`
)
VALUES
(
    1,
    'Freelance Software Developer & Systems Architect',
    'Self-Employed / Agency Consulting',
    'Remote Worldwide / Ghana',
    'Contract',
    '2025 — Present',
    'Designing and delivering bespoke web applications, enterprise dashboards, and custom CMS platforms for international clients.',
    1,
    1
),
(
    2,
    'Professional Diploma Software Engineering Student',
    'IPMC Technology Center',
    'Accra, Ghana',
    'Diploma Program',
    'Jan 2024 — Jan 2025',
    'Completed intensive hands-on software engineering coursework covering SSAD, Java, C++, Python, PHP/MySQL, and MS SQL Server with Grade A distinctions.',
    2,
    1
);


-- ============================================================
-- EXPERIENCE ACHIEVEMENTS
-- ============================================================

INSERT INTO `experience_achievements`
(
    `experience_id`,
    `achievement_text`,
    `sort_order`
)
VALUES
(1, 'Engineered high-performance React 19 SPAs integrated with custom PHP/MySQL backend APIs.', 1),
(1, 'Developed reusable Neumorphic & Glassmorphic UI component libraries reducing frontend dev time by 40%.', 2),
(1, 'Achieved 99+ Lighthouse performance ratings on all client web applications.', 3),

(2, 'Graduated with Grade A in HTML5, Structured Systems Analysis & Design (SSAD), C++, Intermediate Python, and PHP/MySQL.', 1),
(2, 'Built 5 full-stack projects including inventory management systems and dynamic Web portals.', 2);


-- ============================================================
-- EXPERIENCE SKILLS
-- ============================================================

INSERT INTO `experience_skills`
(
    `experience_id`,
    `skill_name`,
    `sort_order`
)
VALUES
(1, 'React 19', 1),
(1, 'PHP 8.3', 2),
(1, 'MySQL', 3),
(1, 'Tailwind CSS', 4),
(1, 'REST API', 5),

(2, 'HTML5', 1),
(2, 'C++', 2),
(2, 'Python', 3),
(2, 'PHP/MySQL', 4),
(2, 'SSAD', 5);


-- ============================================================
-- CERTIFICATIONS
-- ============================================================

INSERT INTO `certifications`
(
    `id`,
    `title`,
    `issuer`,
    `issue_date`,
    `credential_id`,
    `icon_name`,
    `verification_url`,
    `description`,
    `sort_order`,
    `is_active`
)
VALUES
(
    1,
    'Professional Diploma in Software Engineering',
    'IPMC Technology Center',
    'Jan 2024 — Jan 2025',
    '0078785',
    'Award',
    'https://www.ipmctraining.com',
    'Covered structured systems analysis & design (SSAD), programming methods, HTML5, Core Java, C++, MS SQL Server, C#, VB.NET, Python, and rapid application development with PHP/MySQL. Graduated with Grade A in HTML5, SSAD, Programming Methods, C++, Intermediate Python and PHP/MySQL.',
    1,
    1
),
(
    2,
    'Advanced Software Engineering',
    'IPMC Technology Center',
    '2025 — 2026 (In Progress)',
    NULL,
    'Code',
    'https://www.ipmctraining.com',
    'Ongoing advanced coursework building on the Software Engineering diploma, deepening application architecture and full-stack development skills.',
    2,
    1
),
(
    3,
    'WASSCE Certificate',
    'Dynamic Success Model SHS',
    '2019 — 2024',
    NULL,
    'GraduationCap',
    NULL,
    'Senior high school certification.',
    3,
    1
);


-- ============================================================
-- TESTIMONIALS
-- ============================================================

INSERT INTO `testimonials`
(
    `id`,
    `name`,
    `role`,
    `company`,
    `avatar`,
    `quote`,
    `stars`,
    `sort_order`,
    `is_published`
)
VALUES
(
    1,
    'Elena Rostova',
    'VP of Digital Product',
    'Apex Digital Works',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'Emmanuel transformed our legacy portal into a lightning-fast React application. His eye for Neumorphic aesthetics coupled with solid PHP API architecture made working with him an absolute pleasure.',
    5,
    1,
    1
),
(
    2,
    'Marcus Vance',
    'Founder & CTO',
    'Vance Tech Labs',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'The speed and precision of his work is unprecedented. The CMS backend he engineered gives us complete control over our content without touching code.',
    5,
    2,
    1
),
(
    3,
    'Sarah Chen',
    'Lead Design Director',
    'Kuro Interactive',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'It is rare to find a developer who understands pixel-perfect UI design as deeply as backend security. Emmanuel delivers both with 60 FPS elegance.',
    5,
    3,
    1
),
(
    4,
    'David Sterling',
    'Head of Engineering',
    'Sterling SaaS Inc.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Outstanding communication, clean modular code, and sub-second page performance. I highly recommend Emmanuel for any complex web application build.',
    5,
    4,
    1
);


-- ============================================================
-- CONTACT SETTINGS
-- ============================================================

INSERT INTO `contact_settings`
(
    `id`,
    `email`,
    `phone`,
    `location`,
    `whatsapp`,
    `timezone_label`,
    `availability_text`,
    `map_embed_url`,
    `map_address_url`,
    `is_active`
)
VALUES
(
    1,
    'quarshie395@gmail.com',
    '+233 50 000 0000',
    'Greater Accra, Ghana / Remote Worldwide',
    '+233500000000',
    'Greenwich Mean Time (GMT / UTC+0)',
    'Currently Accepting New Projects Q3/Q4',
    'https://maps.google.com/maps?q=5.6121596,-0.1320006&z=17&output=embed',
    'https://www.google.com/maps/place/Anbert+Garden/@5.6121596,-0.1320006,17z',
    1
);


-- ============================================================
-- SOCIAL LINKS
-- ============================================================

INSERT INTO `social_links`
(
    `id`,
    `platform`,
    `url`,
    `icon_name`,
    `label`,
    `sort_order`,
    `is_active`
)
VALUES
(1, 'GitHub', 'https://github.com/Mastercode22', 'Github', 'GitHub Profile', 1, 1),
(2, 'LinkedIn', 'https://linkedin.com/in/emmanuelquarshie', 'Linkedin', 'LinkedIn Connection', 2, 1),
(3, 'Twitter', 'https://twitter.com/emmanuelquarshie', 'Twitter', 'Twitter Profile', 3, 1),
(4, 'Email', 'mailto:quarshie395@gmail.com', 'Mail', 'Direct Email', 4, 1);


-- ============================================================
-- FINISHED
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;