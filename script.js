// Sticky header
window.onscroll = () => {
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);
};

// Mobile menu toggle
document.querySelector("#menu-icon").onclick = () => {
  let navbar = document.querySelector(".navbar");
  navbar.classList.toggle("active");
};

// Close menu when clicking on a nav link
document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".navbar").classList.remove("active");
  });
});

// Typing animation for the subtitle
const textAnimate = document.querySelector(".text-animate h3");
if (textAnimate) {
  const text = textAnimate.textContent;
  textAnimate.textContent = "";

  let charIndex = 0;
  function typeText() {
    if (charIndex < text.length) {
      textAnimate.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 100);
    } else {
      setTimeout(eraseText, 2000);
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      textAnimate.textContent = text.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseText, 50);
    } else {
      setTimeout(typeText, 1000);
    }
  }

  // Start typing animation after a delay
  setTimeout(typeText, 1500);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: "smooth"
      });
    }
  });
});

// Animation on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.3 }
);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

// Form validation
const contactForm = document.querySelector(".contact form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = this.querySelector('input[type="text"]');
    const emailInput = this.querySelector('input[type="email"]');
    const messageInput = this.querySelector("textarea");

    let isValid = true;

    if (!nameInput.value.trim()) {
      isValid = false;
      nameInput.style.boxShadow = "0 0 15px red";
    } else {
      nameInput.style.boxShadow = "0 0 15px var(--accent)";
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      isValid = false;
      emailInput.style.boxShadow = "0 0 15px red";
    } else {
      emailInput.style.boxShadow = "0 0 15px var(--accent)";
    }

    if (!messageInput.value.trim()) {
      isValid = false;
      messageInput.style.boxShadow = "0 0 15px red";
    } else {
      messageInput.style.boxShadow = "0 0 15px var(--accent)";
    }

    if (isValid) {
      // If valid, you would normally send the form data to a server
      alert("Thank you for your message! I will get back to you soon.");
      this.reset();
    }
  });
}

// Email validation helper function
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Add CSS class for animations
document
  .querySelectorAll(".skills-box, .projects-box, .about-img, .about-text")
  .forEach((element) => {
    element.classList.add("animate-on-scroll");
  });

document.addEventListener("DOMContentLoaded", () => {
  // Create particles
  const createParticles = () => {
    const container = document.querySelector(".particle-container");
    if (!container) return;
    const colors = ["#917fb3", "#e5beec", "#fde2f3"];

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      // Random position
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;

      // Random size
      const size = Math.random() * 5 + 1;

      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Random animation delay
      const delay = Math.random() * 5;

      // Random animation duration
      const duration = Math.random() * 5 + 5;

      // Apply styles
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;

      container.appendChild(particle);
    }
  };
  createParticles();

  // Add this CSS to your existing styles
  const style = document.createElement("style");
  style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.show, section.show .animate-on-scroll {
            opacity: 1;
            transform: translateY(0);
        }
        
        section {
            opacity: 0.8;
            transition: opacity 0.6s ease;
        }
        
        section.show {
            opacity: 1;
        }
    `;
  document.head.appendChild(style);

  // Chatbot functionality
  const chatPopup = document.getElementById("chatPopup");
  const chatOpenButton = document.getElementById("chatOpenButton");
  const chatClose = document.getElementById("chatClose");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  if (chatPopup && chatOpenButton && chatClose && chatMessages && chatInput && chatSend) {
    let firstOpen = true;

    const toggleChat = () => {
      chatPopup.classList.toggle("open");
      if (firstOpen && chatPopup.classList.contains("open")) {
        firstOpen = false;
        greetUser();
      }
    };

    chatOpenButton.addEventListener("click", toggleChat);
    chatClose.addEventListener("click", toggleChat);

    const greetUser = () => {
      addMessage("bot", "Hi there! I'm a chatbot. What service are you looking for? You can ask me about 'website', 'app', 'price', or 'contact'.");
    };

    const addMessage = (sender, text) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", sender);
      messageElement.innerHTML = text;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTypingIndicator = () => {
      const typingIndicator = document.createElement("div");
      typingIndicator.classList.add("message", "bot", "typing");
      typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return typingIndicator;
    };

    const sendMessage = async () => {
      const messageText = chatInput.value.trim();
      if (messageText === "") return;

      addMessage("user", messageText);
      chatInput.value = "";

      const typingIndicator = showTypingIndicator();

      try {
        const response = await fetch("chatbot.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `message=${encodeURIComponent(messageText)}`,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const botResponse = await response.text();
        
        chatMessages.removeChild(typingIndicator);
        addMessage("bot", botResponse);

      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        chatMessages.removeChild(typingIndicator);
        addMessage("bot", "Sorry, something went wrong. Please try again later.");
      }
    };

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Theme Toggle Functionality
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const moonIcon = "fa-moon";
  const sunIcon = "fa-sun";

  if (themeToggle && body) {
    const setIcon = (theme) => {
      if (theme === "dark") {
        themeToggle.innerHTML = `<i class="fas ${sunIcon}"></i>`;
      } else {
        themeToggle.innerHTML = `<i class="fas ${moonIcon}"></i>`;
      }
    };

    const applyTheme = (theme) => {
      body.setAttribute("data-theme", theme);
      setIcon(theme);
      localStorage.setItem("theme", theme);
    };

    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });

    // Check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (prefersDark) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }
});