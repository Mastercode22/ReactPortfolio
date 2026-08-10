export const projectsData = [
  {
    id: 'luxoragift',
    title: 'LuxoraGift — Ecommerce Web Application',
    subtitle: 'A modern ecommerce platform for browsing, wish-listing and purchasing gift products.',
    category: 'E-Commerce',
    image: '/images/luxoragift.jpg',
    tags: ['React', 'Vite', 'Tailwind CSS', 'JavaScript', 'PHP', 'MySQL'],
    description: 'LuxoraGift is a full ecommerce web application built with a React frontend and a PHP/MySQL backend, covering product browsing, product collections, cart, wishlist, and checkout flows.',
    features: [
      'Product browsing with collections and category filtering',
      'Cart and wishlist functionality',
      'Checkout flow backed by a database-driven order system',
      'Responsive interfaces built with reusable React components for desktop and mobile'
    ],
    challenges: 'Connecting a React frontend to a PHP/MySQL backend for real, database-driven ecommerce features rather than static mock data.',
    solutions: 'Built REST endpoints in PHP for product, cart and order data, with MySQL handling persistence, and reusable React components keeping the frontend consistent across pages.',
    architecture: 'React (Vite) single-page frontend calling a PHP REST API backed by a MySQL database.',
    gallery: ['/images/luxoragift.jpg'],
    liveDemo: null,
    github: 'https://github.com/Mastercode22',
    featured: true
  },
  {
    id: 'pizzaapp',
    title: 'PizzaApp — Android Ordering Application',
    subtitle: 'An offline-capable Android app for browsing, customizing and ordering pizzas.',
    category: 'Mobile Development',
    image: '/images/pizzaapp.jpg',
    tags: ['Java', 'Android Studio', 'SQLite', 'XML', 'Material Design'],
    description: 'PizzaApp is an Android application for browsing a pizza menu, customizing orders, and managing a shopping cart — fully functional offline using local SQLite storage.',
    features: [
      'Pizza browsing and order customization',
      'Shopping cart with quantity selection',
      'Real-time order-total calculation',
      'Order-history tracking stored locally via SQLite'
    ],
    challenges: 'Making the app fully usable without an internet connection while keeping order data reliable.',
    solutions: 'Used SQLite for local CRUD operations, with Android activities and adapters managing the data flow between the UI and the database.',
    architecture: 'Native Android app (Java) with a local SQLite database and Material Design UI components.',
    gallery: ['/images/pizzaapp.jpg'],
    liveDemo: null,
    github: 'https://github.com/Mastercode22',
    featured: true
  },
  {
    id: 'gym-management',
    title: 'Gym Management System',
    subtitle: 'A live web application for managing gym operations.',
    category: 'Web Application',
    image: '/images/gym-management.jpg',
    tags: ['Web Application'],
    description: 'A gym management system built and deployed live, covering the core administrative interface needed to manage a gym\'s day-to-day operations.',
    features: [
      'Management interface for gym operations',
      'Deployed and publicly accessible online'
    ],
    challenges: 'Designing a management interface that covers real gym-admin workflows end to end.',
    solutions: 'Built and deployed the application as a live, working system rather than a static prototype.',
    architecture: 'Web application, deployed live.',
    gallery: ['/images/gym-management.jpg'],
    liveDemo: null,
    github: 'https://github.com/Mastercode22',
    featured: false
  },
  {
    id: 'portfolio',
    title: 'Personal Developer Portfolio',
    subtitle: 'A responsive portfolio site presenting projects, skills and profile.',
    category: 'Personal Site',
    image: '/images/portfolio.jpg',
    tags: ['React', 'Vite', 'JavaScript', 'CSS3'],
    description: 'A responsive personal portfolio built to present software development projects, technical skills, and a professional profile, deployed live on Netlify.',
    features: [
      'Interactive, responsive UI components',
      'Sections for projects, skills, certifications and experience',
      'Deployed live at emmanuelquarshief.netlify.app'
    ],
    challenges: 'Presenting real, still-growing project work in a way that reads as polished and professional.',
    solutions: 'Focused the design on clear structure and responsive layout rather than overstated claims.',
    architecture: 'React (Vite) single-page application, deployed on Netlify.',
    gallery: ['/images/portfolio.jpg'],
    liveDemo: 'https://emmanuelquarshief.netlify.app',
    github: 'https://github.com/Mastercode22',
    featured: false
  }
];
