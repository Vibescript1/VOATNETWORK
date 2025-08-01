import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Navbar";
import Footer from "../Footer";
import ErrorBoundary from "../ErrorBoundary";
import "./index.css";
import {
  Code,
  Megaphone,
  Users,
  Palette,
  Globe,
  Rocket,
  Target,
  Zap,
  Shield,
  ArrowRight,
  Calculator,
  Camera,
  Sparkles,
  Lightbulb,
  Award,
  Mail,
  Instagram,
  Linkedin,
  Phone,
  MapPin,
  Youtube,
  CheckCircle,
  Loader,
  Briefcase,
  UserCheck,
  Search,
  Plus,
} from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

class LandingPage extends Component {
  state = {
    currentSlide: 0,
    images: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    ],
    publicImages: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    ],

    freelancerImages: [
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/2_oxsz5t.jpg",
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/1_jfhwai.jpg",
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/2_oxsz5t.jpg",
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/1_jfhwai.jpg",
    ],
    clientImages: [
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/2_oxsz5t.jpg",
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/1_jfhwai.jpg",
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/2_oxsz5t.jpg",
      "https://res.cloudinary.com/dffu1ungl/image/upload/v1752060338/1_jfhwai.jpg", 
    ],
    currentFreelancerSlide: 0,
    currentClientSlide: 0,
    isLoggedIn: false,
    user: null,
    userRole: null,
    servicesInView: false,
    visionInView: false,
    chooseUsInView: false,
    contactInView: false,
    clientCardsInView: false,
        blogInView: false,
    // ===== BLOG SECTION STATE STARTS HERE =====
    expandedBlogs: {},
    // Blog pagination state
    currentBlogPage: 1,
    blogsPerPage: 3,
    // Contact form state
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    message: "",
    // Form submission status
    formStatus: "", // "submitting", "success", "error"
    formMessage: "",
    // Timer for success message
    successTimer: null,
  };

  //scroll animations
  servicesRef = React.createRef();
  visionRef = React.createRef();
  chooseUsRef = React.createRef();
  contactRef = React.createRef();
  clientCardsRef = React.createRef();
   blogRef = React.createRef();

  // Separate intervals for different carousels
  publicSlideInterval = null;
  freelancerSlideInterval = null;
  clientSlideInterval = null;

  // Add helper method to manage slide classes
  updateSlideClasses = (slides, currentIndex) => {
    slides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next");

      if (index === currentIndex) {
        slide.classList.add("active");
      } else if (
        index === currentIndex - 1 ||
        (currentIndex === 0 && index === slides.length - 1)
      ) {
        slide.classList.add("prev");
      } else {
        slide.classList.add("next");
      }
    });
  };

  // Blog data
  blogData = [
      {
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Digital Marketing Trends 2024",
        shortDescription: "Discover the latest trends in digital marketing that are shaping the industry and driving business growth.",
        fullDescription: "Discover the latest trends in digital marketing that are shaping the industry and driving business growth. From AI-powered campaigns to voice search optimization, businesses are leveraging cutting-edge technologies to reach their target audiences more effectively. The integration of artificial intelligence in marketing automation has revolutionized how companies approach customer engagement, while voice search optimization has become crucial as more users rely on voice assistants for their daily searches. Additionally, the rise of video content continues to dominate social media platforms, making it essential for brands to incorporate video marketing strategies into their campaigns. Our comprehensive design and branding solutions help businesses create cohesive visual identities that resonate with their target audience, ensuring that every marketing touchpoint reflects the brand's core values and messaging.",
        author: "VOAT Network",
        date: "March 15, 2024",
        tags: ["Marketing", "Trends", "Digital", "Growth"],
      },
      {
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Web Development Best Practices",
        shortDescription: "Learn the essential best practices for modern web development that ensure scalable and maintainable code.",
        fullDescription: "Learn the essential best practices for modern web development that ensure scalable and maintainable code. Master the art of clean architecture by implementing proper separation of concerns, using design patterns effectively, and writing self-documenting code. Understanding the importance of code reviews, automated testing, and continuous integration can significantly improve your development workflow. Additionally, staying updated with the latest frameworks and tools while maintaining a focus on performance optimization and security best practices will help you build robust applications that stand the test of time. Our design and branding expertise ensures that every web application we develop not only functions flawlessly but also provides an exceptional user experience with intuitive interfaces and compelling visual design that strengthens brand identity.",
        author: "VOAT Network",
        date: "March 10, 2024",
        tags: ["Development", "Code", "Best Practices", "Web"],
      },
      {
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Brand Identity Design Guide",
        shortDescription: "Creative branding solutions that make your business stand out with a memorable and impactful identity.",
        fullDescription: "Creative branding solutions that make your business stand out with a memorable and impactful identity. Understanding the psychology of color, typography, and visual elements is crucial for building a strong brand presence. The process involves thorough market research, competitor analysis, and understanding your target demographic's preferences and behaviors. Successful brand identity design goes beyond just creating a logo; it encompasses the entire visual language that communicates your brand's values, mission, and personality across all touchpoints.",
        author: "VOAT Network",
        date: "March 5, 2024",
        tags: ["Design", "Branding", "Identity", "Creative"],
      },
      {
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "UI/UX Design Principles",
        shortDescription: "Master the fundamental principles of UI/UX design to create intuitive and engaging user experiences.",
        fullDescription: "Master the fundamental principles of UI/UX design to create intuitive and engaging user experiences. Understanding user psychology, information architecture, and interaction design is essential for creating products that users love. The key to successful UI/UX design lies in putting users first, conducting thorough research, and iterating based on feedback. From wireframing to prototyping, every step in the design process should focus on usability, accessibility, and visual appeal. Remember that great design is invisible - users should be able to accomplish their goals without thinking about the interface.",
        author: "VOAT Network",
        date: "March 1, 2024",
        tags: ["UI/UX", "Design", "User Experience", "Interface"],
      },
      {
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Mobile App Development Guide",
        shortDescription: "Professional mobile app development services to create stunning applications for iOS and Android platforms.",
        fullDescription: "Professional mobile app development services to create stunning applications for iOS and Android platforms. Mobile app development requires careful consideration of platform-specific guidelines, performance optimization, and user experience. Whether you're building native apps or using cross-platform frameworks like React Native or Flutter, understanding the fundamentals of mobile development is crucial. Key considerations include app store optimization, push notifications, offline functionality, and security best practices. The mobile landscape is constantly evolving, so staying updated with the latest trends and technologies is essential for success. Our design and branding services ensure that every mobile app we develop features intuitive user interfaces, consistent brand elements, and engaging visual design that enhances user engagement and strengthens brand recognition across all mobile platforms.",
        author: "VOAT Network",
        date: "February 25, 2024",
        tags: ["Mobile", "App Development", "iOS", "Android"],
      },
      {
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        title: "Data Analytics for Business",
        shortDescription: "Strategic data analytics solutions to optimize your business operations and drive informed decision-making.",
        fullDescription: "Strategic data analytics solutions to optimize your business operations and drive informed decision-making. Data analytics has become a cornerstone of modern business strategy, enabling organizations to understand customer behavior, optimize operations, and identify new opportunities. From descriptive analytics that tell you what happened, to predictive analytics that forecast future trends, businesses can use data to gain competitive advantages. Implementing proper data collection, analysis, and visualization tools is essential for extracting meaningful insights from complex datasets. Our design and branding expertise enhances data visualization and reporting, creating compelling dashboards and reports that not only present data clearly but also align with your brand identity, making complex information accessible and engaging for stakeholders.",
        author: "VOAT Network",
        date: "February 20, 2024",
        tags: ["Analytics", "Data", "Business", "Insights"],
      },
    ];

  componentDidMount() {
    this.loadUserData();
    window.addEventListener("storage", this.handleStorageEvent);
    this.loginCheckInterval = setInterval(
      this.checkLoginStatusPeriodically,
      2000
    );

    // Start the appropriate carousel based on user type
    this.startCarousel();

    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();

    // Initialize slide classes for client/freelancer carousels after component mounts
    setTimeout(() => {
      const userType = this.getUserType();
      if (userType === "freelancer") {
        const slides = document.querySelectorAll(
          ".landing-page-client-banner .landing-page-carousel-slide"
        );
        if (slides.length > 0) {
          this.updateSlideClasses(slides, this.state.currentFreelancerSlide);
        }
      } else if (userType === "client") {
        const slides = document.querySelectorAll(
          ".landing-page-client-banner .landing-page-carousel-slide"
        );
        if (slides.length > 0) {
          this.updateSlideClasses(slides, this.state.currentClientSlide);
        }
      }
    }, 100);
  }

  componentWillUnmount() {
    this.clearAllIntervals();
    if (this.loginCheckInterval) {
      clearInterval(this.loginCheckInterval);
    }
    window.removeEventListener("storage", this.handleStorageEvent);
    window.removeEventListener("scroll", this.handleScroll);

    if (this.state.successTimer) {
      clearTimeout(this.state.successTimer);
    }
  }

  // Clear all carousel intervals
  clearAllIntervals = () => {
    if (this.publicSlideInterval) {
      clearInterval(this.publicSlideInterval);
      this.publicSlideInterval = null;
    }
    if (this.freelancerSlideInterval) {
      clearInterval(this.freelancerSlideInterval);
      this.freelancerSlideInterval = null;
    }
    if (this.clientSlideInterval) {
      clearInterval(this.clientSlideInterval);
      this.clientSlideInterval = null;
    }
  };

  // Start the appropriate carousel based on user type
  startCarousel = () => {
    this.clearAllIntervals();

    const userType = this.getUserType();

    if (!this.state.isLoggedIn) {
      // Public carousel - KEEP AS IS
      this.publicSlideInterval = setInterval(() => {
        this.setState({
          currentSlide:
            (this.state.currentSlide + 1) % this.state.publicImages.length,
        });
      }, 5000);
    } else if (userType === "freelancer") {
      // Freelancer carousel - UPDATED
      this.freelancerSlideInterval = setInterval(() => {
        this.nextFreelancerSlide();
      }, 3000);
    } else if (userType === "client") {
      // Client carousel - UPDATED
      this.clientSlideInterval = setInterval(() => {
        this.nextClientSlide();
      }, 3000);
    }
  };

  // Public carousel methods
  nextSlide = () => {
    this.setState({
      currentSlide:
        (this.state.currentSlide + 1) % this.state.publicImages.length,
    });
  };

  setSlide = (index) => {
    if (this.publicSlideInterval) {
      clearInterval(this.publicSlideInterval);
    }
    this.setState({ currentSlide: index });
    this.publicSlideInterval = setInterval(() => {
      this.setState({
        currentSlide:
          (this.state.currentSlide + 1) % this.state.publicImages.length,
      });
    }, 5000);
  };

  // Freelancer carousel methods - UPDATED
  nextFreelancerSlide = () => {
    const newIndex =
      (this.state.currentFreelancerSlide + 1) %
      this.state.freelancerImages.length;
    this.setState({ currentFreelancerSlide: newIndex }, () => {
      // Update slide classes after state update
      const slides = document.querySelectorAll(
        ".landing-page-client-banner .landing-page-carousel-slide"
      );
      if (slides.length > 0) {
        this.updateSlideClasses(slides, newIndex);
      }
    });
  };

  setFreelancerSlide = (index) => {
    if (this.freelancerSlideInterval) {
      clearInterval(this.freelancerSlideInterval);
    }

    this.setState({ currentFreelancerSlide: index }, () => {
      // Update slide classes after state update
      const slides = document.querySelectorAll(
        ".landing-page-client-banner .landing-page-carousel-slide"
      );
      if (slides.length > 0) {
        this.updateSlideClasses(slides, index);
      }
    });

    this.freelancerSlideInterval = setInterval(() => {
      this.nextFreelancerSlide();
    }, 3000);
  };

  // Client carousel methods - UPDATED
  nextClientSlide = () => {
    const newIndex =
      (this.state.currentClientSlide + 1) % this.state.clientImages.length;
    this.setState({ currentClientSlide: newIndex }, () => {
      // Update slide classes after state update
      const slides = document.querySelectorAll(
        ".landing-page-client-banner .landing-page-carousel-slide"
      );
      if (slides.length > 0) {
        this.updateSlideClasses(slides, newIndex);
      }
    });
  };

  setClientSlide = (index) => {
    if (this.clientSlideInterval) {
      clearInterval(this.clientSlideInterval);
    }

    this.setState({ currentClientSlide: index }, () => {
      // Update slide classes after state update
      const slides = document.querySelectorAll(
        ".landing-page-client-banner .landing-page-carousel-slide"
      );
      if (slides.length > 0) {
        this.updateSlideClasses(slides, index);
      }
    });

    this.clientSlideInterval = setInterval(() => {
      this.nextClientSlide();
    }, 3000);
  };

  isElementInViewport = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  };

  handleScroll = () => {
    this.setState({
      servicesInView: this.isElementInViewport(this.servicesRef.current),
      visionInView: this.isElementInViewport(this.visionRef.current),
      chooseUsInView: this.isElementInViewport(this.chooseUsRef.current),
      contactInView: this.isElementInViewport(this.contactRef.current),
      clientCardsInView: this.isElementInViewport(this.clientCardsRef.current),
      blogInView: this.isElementInViewport(this.blogRef.current),
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    // Set form status to submitting
    this.setState({
      formStatus: "submitting",
      formMessage: "Submitting your message...",
    });

    // Create form data
    const formData = new FormData();
    formData.append("access_key", "0930f5ef-f569-409a-ba8b-f084d8167fb2");
    formData.append("name", this.state.fullName);
    formData.append("email", this.state.email);
    formData.append("phone", this.state.phone);
    formData.append("profession", this.state.profession);
    formData.append("message", this.state.message);

    formData.append("botcheck", "");

    formData.append("subject", "New message from VOAT NETWORK website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        this.setState({
          fullName: "",
          email: "",
          phone: "",
          profession: "",
          message: "",
          formStatus: "success",
          formMessage:
            "Thank you! Your message has been submitted successfully.",
        });

        // Set a timer to clear the success message after 5 seconds
        const timer = setTimeout(() => {
          this.setState({
            formStatus: "",
            formMessage: "",
          });
        }, 5000);

        // Store the timer in state so we can clear it if component unmounts
        this.setState({ successTimer: timer });
      } else {
        // On API error
        this.setState({
          formStatus: "error",
          formMessage:
            data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      // On network error
      this.setState({
        formStatus: "error",
        formMessage:
          "Network error. Please check your connection and try again.",
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
    toggleBlogExpansion = (blogIndex) => {
    this.setState(prevState => ({
      expandedBlogs: {
        ...prevState.expandedBlogs,
        [blogIndex]: !prevState.expandedBlogs[blogIndex]
      }
    }));
  };

  handleBlogPageChange = (pageNumber) => {
    this.setState({
      currentBlogPage: pageNumber,
      expandedBlogs: {} // Reset expanded blogs when changing pages
    });
  };



  loadUserData = () => {
    try {
      const userDataString = localStorage.getItem("user");

      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.name) {
          this.setState(
            {
              isLoggedIn: true,
              user: userData,
              userRole: userData.role || null,
            },
            () => {
              // Start the appropriate carousel after state is updated
              this.startCarousel();
            }
          );
        }
      } else {
        this.setState(
          {
            isLoggedIn: false,
            user: null,
            userRole: null,
          },
          () => {
            // Start public carousel
            this.startCarousel();
          }
        );
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      this.setState(
        {
          isLoggedIn: false,
          user: null,
          userRole: null,
        },
        () => {
          this.startCarousel();
        }
      );
    }
  };

  handleStorageEvent = (event) => {
    if (event.key === "user") {
      if (event.newValue) {
        try {
          const userData = JSON.parse(event.newValue);
          if (!this.state.isLoggedIn) {
            this.setState(
              {
                isLoggedIn: true,
                user: userData,
                userRole: userData.role || null,
              },
              () => {
                this.startCarousel();
              }
            );
          } else {
            this.setState(
              {
                user: userData,
                userRole: userData.role || null,
              },
              () => {
                this.startCarousel();
              }
            );
          }
        } catch (e) {
          console.error("Error parsing user data from storage event:", e);
        }
      } else {
        if (this.state.isLoggedIn) {
          this.setState(
            {
              isLoggedIn: false,
              user: null,
              userRole: null,
            },
            () => {
              this.startCarousel();
            }
          );
        }
      }
    }
  };

  // Check login status periodically
  checkLoginStatusPeriodically = () => {
    try {
      let userData = null;
      try {
        const userDataStr = localStorage.getItem("user");
        userData = userDataStr ? JSON.parse(userDataStr) : null;
      } catch (e) {
        userData = null;
      }

      const wasLoggedIn = this.state.isLoggedIn;
      const isLoggedIn = !!userData;

      if (!wasLoggedIn && isLoggedIn) {
        this.loadUserData();
      } else if (wasLoggedIn && !isLoggedIn) {
        this.setState(
          {
            isLoggedIn: false,
            user: null,
            userRole: null,
          },
          () => {
            this.startCarousel();
          }
        );
      } else if (isLoggedIn && userData && this.state.user) {
        const currentUser = this.state.user;
        if (
          userData.name !== currentUser.name ||
          userData.email !== currentUser.email ||
          userData.role !== currentUser.role
        ) {
          this.setState(
            {
              user: userData,
              userRole: userData.role || null,
            },
            () => {
              this.startCarousel();
            }
          );
        }
      }
    } catch (error) {
      console.error("Error in periodic login check:", error);
    }
  };

  // Determine user type
  getUserType = () => {
    const { user, userRole } = this.state;
    if (!user || !userRole) return null;

    const role = userRole || "";

    if (
      role === "freelancer" ||
      role === "Freelancer" ||
      role === "service provider" ||
      role === "Service Provider" ||
      role === "Freelancer/Service Provider" ||
      role.toLowerCase().includes("freelancer") ||
      role.toLowerCase().includes("service provider")
    ) {
      return "freelancer";
    } else if (
      role === "client" ||
      role === "Client" ||
      role === "individual" ||
      role === "Individual" ||
      role.toLowerCase().includes("client") ||
      role.toLowerCase().includes("individual")
    ) {
      return "client";
    }

    return null;
  };

  // Method to render different hero content based on user type
  renderHeroContent = () => {
    const { isLoggedIn } = this.state;
    const userType = this.getUserType();

    if (!isLoggedIn) {
      return {
        title: (
          <>
            Empowering
            <br />
            Innovation <span className="landing-page-text-gradient">&</span>
            <br />
            <span className="landing-page-text-gradient">Growth</span>
          </>
        ),
        description:
          "We help startups and businesses transform their ideas into successful realities with our comprehensive digital solutions.",
        buttons: (
          <div className="landing-page-hero-buttons">
            <a
              href="#services"
              className="landing-page-button landing-page-button-primary"
            >
              Our Services
              <ArrowRight className="landing-page-button-icon" />
            </a>
            <a
              href="#contact"
              className="landing-page-button landing-page-button-outline"
            >
              Get In Touch
            </a>
          </div>
        ),
      };
    } else if (userType === "freelancer") {
      return {
        title: null, // No title for freelancer
        description: null, // No description for freelancer
        buttons: null, // No buttons for freelancer
      };
    } else if (userType === "client") {
      return {
        title: null, // No title for client
        description: null, // No description for client
        buttons: null, // No buttons for client
      };
    } else {
      return {
        title: (
          <>
            Welcome Back,
            <br />
            <span className="landing-page-text-gradient">User!</span>
            <br />
            Explore <span className="landing-page-text-gradient">VOAT</span>
          </>
        ),
        description:
          "Discover opportunities and connect with our community of professionals.",
        buttons: (
          <div className="landing-page-hero-buttons">
            <Link
              to="/services"
              className="landing-page-button landing-page-button-primary"
            >
              Explore Services
              <ArrowRight className="landing-page-button-icon" />
            </Link>
            <Link
              to="/user-dashboard"
              className="landing-page-button landing-page-button-outline"
            >
              <Briefcase className="landing-page-button-icon" />
              My Dashboard
            </Link>
          </div>
        ),
      };
    }
  };

  render() {
    const servicesData = [
      {
        icon: <Code size={28} />,
        title: "Web Development",
        description:
          "Custom websites and web applications built with cutting-edge technology that deliver exceptional user experiences.",
        filterValue: "Web Developer",
      },
      {
        icon: <Megaphone size={28} />,
        title: "Digital Marketing",
        description:
          "Strategic digital marketing solutions to boost your online presence and reach your target audience effectively.",
        filterValue: "Digital Marketer",
      },
      {
        icon: <Globe size={28} />,
        title: "SEO & SMM",
        description:
          "Optimize your search rankings and social media presence to connect with your audience and drive organic growth.",
        filterValue: "SEO Specialist",
      },
      {
        icon: <Palette size={28} />,
        title: "Brand Development",
        description:
          "Creative branding solutions that make your business stand out with a memorable and impactful identity.",
        filterValue: "Brand Designer",
      },
      {
        icon: <Calculator size={28} />,
        title: "Taxation",
        description:
          "Expert tax planning and preparation services to optimize your financial position and ensure compliance.",
        filterValue: "Tax Consultant",
      },
      {
        icon: <Camera size={28} />,
        title: "Photo & Video Editing",
        description:
          "Professional photo and video editing services to create stunning visual content for your brand.",
        filterValue: "Video Editor",
      },
    ];

    const visionPoints = [
      {
        icon: <Rocket />,
        title: "Innovation",
        description:
          "Fostering groundbreaking ideas and solutions that push boundaries and create new possibilities.",
      },
      {
        icon: <Users />,
        title: "Collaboration",
        description:
          "Building strong partnerships for mutual growth, sharing knowledge and resources for success.",
      },
      {
        icon: <Target />,
        title: "Growth",
        description:
          "Driving sustainable business expansion through strategic planning and market adaptation.",
      },
      {
        icon: <Lightbulb />,
        title: "Creativity",
        description:
          "Encouraging fresh perspectives and unique approaches to solve complex business challenges.",
      },
      {
        icon: <Award />,
        title: "Excellence",
        description:
          "Striving for the highest standards in everything we do to deliver superior results.",
      },
      {
        icon: <Sparkles />,
        title: "Inspiration",
        description:
          "Motivating teams and businesses to reach their full potential through visionary leadership.",
      },
    ];

    const chooseUsPoints = [
      {
        icon: <Zap />,
        title: "Innovative Approach",
        description:
          "We combine creativity with strategic thinking to deliver unique solutions that set your business apart.",
      },
      {
        icon: <Shield />,
        title: "Proven Expertise",
        description:
          "Our team brings years of experience and a track record of successful business transformations.",
      },
      {
        icon: <Users />,
        title: "Dedicated Support",
        description:
          "We're committed to your success with personalized guidance every step of the way.",
      },
    ];

    const carouselServices = [
      {
        title: "Web Development",
        description:
          "Custom websites and applications with cutting-edge technology",
      },
      {
        title: "Digital Marketing",
        description: "Strategic solutions to boost your online presence",
      },
      {
        title: "Brand Design",
        description: "Creative branding that makes your business stand out",
      },
    ];

    // Client services cards data
    const clientServices = [
      {
        icon: <Palette size={28} />,
        title: "Brand Development",
        description:
          "Comprehensive branding solutions to establish your unique identity in the market.",
      },
      {
        icon: <Megaphone size={28} />,
        title: "Digital Marketing",
        description:
          "Strategic digital marketing campaigns to boost your online presence and reach.",
      },
      {
        icon: <Code size={28} />,
        title: "Web Development",
        description:
          "Custom websites and applications built with cutting-edge technology.",
      },
      {
        icon: <Globe size={28} />,
        title: "SEO Optimization",
        description:
          "Improve your search rankings and drive organic traffic to your business.",
      },
      {
        icon: <Calculator size={28} />,
        title: "Taxation Services",
        description:
          "Expert tax planning and preparation services to optimize your financial position and ensure compliance.",
      },
      {
        icon: <Camera size={28} />,
        title: "Photo & Video Editing",
        description:
          "Professional photo and video editing services to create stunning visual content for your brand.",
      },
    ];

    const userType = this.getUserType();
    const isClient = userType === "client";

    // Form submission status
    const formStatusDisplay = () => {
      if (this.state.formStatus === "submitting") {
        return (
          <div className="landing-page-form-status submitting">
            <Loader size={20} className="landing-page-spinner" />
            <span>{this.state.formMessage}</span>
          </div>
        );
      } else if (this.state.formStatus === "success") {
        return (
          <div className="landing-page-form-status success">
            <CheckCircle size={20} />
            <span>
              Thank you! Your message has been submitted successfully.
            </span>
          </div>
        );
      } else if (this.state.formStatus === "error") {
        return (
          <div className="landing-page-form-status error">
            <span>{this.state.formMessage}</span>
          </div>
        );
      }
      return null;
    };

    return (
      <>
        <ErrorBoundary>
          <NavBar />
        </ErrorBoundary>
        <div className="landing-page">
          <section
            className={`landing-page-hero ${
              this.getUserType() === "client" ? "client-hero" : ""
            }`}
          >
            {/* Conditional Banner Rendering */}

            {!this.state.isLoggedIn ? (
              // Public users - carousel slides
              <>
                <div className="landing-page-carousel-slides-container">
                  {this.state.publicImages.map((image, index) => (
                    <div
                      key={index}
                      className={`landing-page-carousel-slide ${
                        index === this.state.currentSlide ? "active" : ""
                      }`}
                    >
                      <div className="landing-page-carousel-overlay"></div>
                      <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="landing-page-carousel-indicators">
                  {this.state.publicImages.map((_, index) => (
                    <button
                      key={index}
                      className={`landing-page-indicator ${
                        index === this.state.currentSlide ? "active" : ""
                      }`}
                      onClick={() => this.setSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : this.getUserType() === "freelancer" ? (
              // Freelancer carousel
              <div className="landing-page-client-banner">
                <div className="landing-page-carousel-slides-container">
                  {this.state.freelancerImages.map((image, index) => (
                    <div key={index} className="landing-page-carousel-slide">
                      <img
                        src={image}
                        alt={`Freelancer Banner ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="landing-page-carousel-indicators">
                  {this.state.freelancerImages.map((_, index) => (
                    <button
                      key={index}
                      className={`landing-page-indicator ${
                        index === this.state.currentFreelancerSlide
                          ? "active"
                          : ""
                      }`}
                      onClick={() => this.setFreelancerSlide(index)}
                      aria-label={`Go to freelancer slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : this.getUserType() === "client" ? (
              // Client carousel
              <div className="landing-page-client-banner">
                <div className="landing-page-carousel-slides-container">
                  {this.state.clientImages.map((image, index) => (
                    <div key={index} className="landing-page-carousel-slide">
                      <img
                        src={image}
                        alt={`Client Banner ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="landing-page-carousel-indicators">
                  {this.state.clientImages.map((_, index) => (
                    <button
                      key={index}
                      className={`landing-page-indicator ${
                        index === this.state.currentClientSlide ? "active" : ""
                      }`}
                      onClick={() => this.setClientSlide(index)}
                      aria-label={`Go to client slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Default logged-in user banner
              <div className="landing-page-single-banner">
                <div className="landing-page-carousel-overlay"></div>
                <img src={this.state.publicImages[0]} alt="Welcome Dashboard" />
              </div>
            )}

            {/* Hero Content - Only show for non-client users */}
            {this.getUserType() !== "client" && (
              <div className="landing-page-hero-content-wrapper">
                <div className="landing-page-hero-content">
                  <h1 className="landing-page-hero-title">
                    {this.renderHeroContent().title}
                  </h1>
                  <p className="landing-page-hero-description">
                    {this.renderHeroContent().description}
                  </p>
                  {this.renderHeroContent().buttons}
                </div>
              </div>
            )}

            {/* Service content card - only show for public users */}
            {!this.state.isLoggedIn && (
              <div className="landing-page-service-content-card">
                <h2>{carouselServices[this.state.currentSlide].title}</h2>
                <p>{carouselServices[this.state.currentSlide].description}</p>
              </div>
            )}
          </section>

          {/* Client Services Cards Section - Only show for clients */}
          {isClient && (
            <section
              className={`landing-page-client-services-section ${
                this.state.clientCardsInView ? "in-view" : ""
              }`}
              ref={this.clientCardsRef}
            >
              <div className="landing-page-container">
                <div className="landing-page-section-header">
                  <h2 className="landing-page-section-title">Dear Client</h2>
                  <p className="landing-page-client-services-description">
                    Discover our comprehensive range of professional services.
                  </p>
                </div>

                <div className="landing-page-client-services-grid">
                  {clientServices.map((service, index) => (
                    <Link
                      key={index}
                      to="/services"
                      className={`landing-page-client-service-card landing-page-client-service-card-${
                        index + 1
                      }`}
                    >
                      <div className="landing-page-client-service-content">
                        <div className="landing-page-client-service-icon-wrapper">
                          {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Services Section - Only show for non-clients */}
          {!isClient && (
            <section
              className={`landing-page-services-section ${
                this.state.servicesInView ? "in-view" : ""
              }`}
              ref={this.servicesRef}
              id="services"
            >
              <div className="landing-page-services-blob landing-page-services-blob-1"></div>
              <div className="landing-page-services-blob landing-page-services-blob-2"></div>

              <div className="landing-page-container">
                <div className="landing-page-section-header">
                  <h2 className="landing-page-section-title">Our Services</h2>
                  <p className="landing-page-services-description">
                    We offer a comprehensive range of digital services to help
                    your business.
                  </p>
                </div>

                <div className="landing-page-services-grid">
                  {servicesData.map((service, index) => (
                    <Link
                      key={index}
                      to={`/portfolio-list?profession=${encodeURIComponent(
                        service.filterValue
                      )}`}
                      className={`landing-page-service-card landing-page-service-card-${
                        index + 1
                      }`}
                    >
                      <div className="landing-page-service-content">
                        <div className="landing-page-service-icon-wrapper">
                          {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="landing-page-services-view-all">
                  <Link
                    to={"/services"}
                    className="landing-page-button landing-page-button-primary"
                  >
                    View more
                    <ArrowRight className="landing-page-button-icon" />
                  </Link>
                </div>
              </div>
            </section>
          )}
                   <section
            className={`landing-page-blog-section ${
              this.state.blogInView ? "in-view" : ""
            }`}
            ref={this.blogRef}
            id="blog"
          >
            <div className="landing-page-container">
              <div className="landing-page-section-header">
                <h2 className="landing-page-section-title">Latest Blog Posts</h2>
                <p className="landing-page-blog-description">
                  Stay updated with the latest insights, trends, and tips from our industry experts.
                </p>
              </div>

              <div className="landing-page-blog-grid">
                {this.blogData
                  .slice(
                    (this.state.currentBlogPage - 1) * this.state.blogsPerPage,
                    this.state.currentBlogPage * this.state.blogsPerPage
                  )
                  .map((blog, index) => {
                    const actualIndex = (this.state.currentBlogPage - 1) * this.state.blogsPerPage + index;
                    return (
                      <div
                        key={actualIndex}
                        className={`landing-page-blog-card landing-page-blog-card-${
                          (actualIndex % 3) + 1
                        } ${actualIndex % 2 === 1 ? 'alt' : ''}`}
                      >
                        <div className="meta">
                          <div 
                            className="photo" 
                            style={{ backgroundImage: `url(${blog.image})` }}
                          ></div>
                          <ul className="details">
                            <li className="author">
                              <a href="#">{blog.author}</a>
                            </li>
                            <li className="date">{blog.date}</li>
                            <li className="tags">
                              <ul>
                                {blog.tags.map((tag, tagIndex) => (
                                  <li key={tagIndex}>
                                    <a href="#">{tag}</a>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div className="description">
                          <h1>{blog.title}</h1>
                          <p className={this.state.expandedBlogs[actualIndex] ? 'expanded' : 'collapsed'}>
                            {this.state.expandedBlogs[actualIndex] ? blog.fullDescription : blog.shortDescription}
                          </p>
                          <div className="read-more">
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                this.toggleBlogExpansion(actualIndex);
                              }}
                            >
                              {this.state.expandedBlogs[actualIndex] ? 'Read Less' : 'Read More'}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Blog Pagination */}
              <div className="landing-page-blog-pagination">
                <div className="landing-page-pagination-info">
                  Showing {((this.state.currentBlogPage - 1) * this.state.blogsPerPage) + 1} to {Math.min(this.state.currentBlogPage * this.state.blogsPerPage, this.blogData.length)} of {this.blogData.length} posts
                </div>
                <div className="landing-page-pagination-controls">
                  <button
                    className={`landing-page-pagination-btn ${this.state.currentBlogPage === 1 ? 'disabled' : ''}`}
                    onClick={() => this.handleBlogPageChange(this.state.currentBlogPage - 1)}
                    disabled={this.state.currentBlogPage === 1}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.ceil(this.blogData.length / this.state.blogsPerPage) }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={`landing-page-pagination-btn ${this.state.currentBlogPage === pageNum ? 'active' : ''}`}
                      onClick={() => this.handleBlogPageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    className={`landing-page-pagination-btn ${this.state.currentBlogPage === Math.ceil(this.blogData.length / this.state.blogsPerPage) ? 'disabled' : ''}`}
                    onClick={() => this.handleBlogPageChange(this.state.currentBlogPage + 1)}
                    disabled={this.state.currentBlogPage === Math.ceil(this.blogData.length / this.state.blogsPerPage)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section - Modernized */}
          <section
            className={`landing-page-choose-us-section ${
              this.state.chooseUsInView ? "in-view" : ""
            }`}
            ref={this.chooseUsRef}
            id="why-choose-us"
          >
            <div className="landing-page-container">
              <h2 className="landing-page-section-title">Why Choose Us</h2>

              <div className="landing-page-choose-us-content">
                <div className="landing-page-choose-us-statement">
                  <h3>What Sets Us Apart</h3>
                  <p>
                    At VOAT NETWORK, we have a unique approach that focuses on
                    fostering creativity and innovation. We believe in
                    empowering individuals and businesses by providing them with
                    the support they need to thrive.
                  </p>
                  <p>
                    Our platform is designed to connect people with fresh ideas
                    to the resources and expertise they need to bring those
                    ideas to life.
                  </p>
                  <a
                    href="#contact"
                    className="landing-page-button landing-page-button-light"
                  >
                    Partner With Us <ArrowRight size={18} />
                  </a>
                </div>

                <div className="landing-page-choose-us-points">
                  {chooseUsPoints.map((point, index) => (
                    <div
                      key={index}
                      className={`landing-page-choose-us-point landing-page-choose-us-point-${
                        index + 1
                      }`}
                    >
                      <div className="landing-page-choose-us-icon-wrapper">
                        {point.icon}
                      </div>
                      <div className="landing-page-choose-us-point-content">
                        <h3>{point.title}</h3>
                        <p>{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="landing-page-choose-us-shape"></div>
          </section>

          {/* Vision Section*/}
          <section
            className={`landing-page-vision-section-new ${
              this.state.visionInView ? "in-view" : ""
            }`}
            ref={this.visionRef}
            id="vision"
          >
            <div className="landing-page-vision-waves"></div>

            <div className="landing-page-vision-orb orb-2"></div>
            <div className="landing-page-vision-orb orb-3"></div>

            <div className="landing-page-container">
              <div className="landing-page-section-header">
                <h2 className="landing-page-section-title landing-page-vision-title">
                  Our Vision
                </h2>
                <div className="landing-page-vision-subtitle-container">
                  <span className="landing-page-vision-subtitle-line"></span>
                  <p className="landing-page-vision-subtitle">
                    Shaping the future together
                  </p>
                  <span className="landing-page-vision-subtitle-line"></span>
                </div>
                <p className="landing-page-vision-description">
                  To empower startups by fostering innovation, collaboration,
                  and growth, creating a thriving ecosystem where entrepreneurs
                  uplift each other and achieve sustainable success together.
                </p>
              </div>

              <div className="landing-page-vision-cards-grid">
                {visionPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`landing-page-vision-card-new landing-page-vision-card-${
                      index + 1
                    }`}
                  >
                    <div className="landing-page-vision-card-inner">
                      <div className="landing-page-vision-icon-wrapper-new">
                        {point.icon}
                      </div>
                      <h3>{point.title}</h3>
                      <p>{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== CONTACT SECTION STARTS HERE ===== */}
          <section
            className={`landing-page-contact-section ${
              this.state.contactInView ? "in-view" : ""
            }`}
            ref={this.contactRef}
            id="contact"
          >
            {/* Background Animation Elements */}
            <div className="landing-page-contact-blob landing-page-contact-blob-1"></div>
            <div className="landing-page-contact-blob landing-page-contact-blob-2"></div>

            <div className="landing-page-container">
              {/* Contact Section Header */}
              <div className="landing-page-section-header">
                <h2 className="landing-page-section-title">Contact Us</h2>
                <p className="landing-page-contact-description">
                  Get in touch with our team of experts today. We're here to
                  help answer your questions and create solutions tailored to
                  your business needs.
                </p>
              </div>

              {/* ===== CONTACT CARDS SECTION ===== */}
              <div className="landing-page-contact-cards-container">
                <div className="landing-page-contact-cards">
                  {/* Email Contact Card */}
                  <div className="landing-page-contact-card landing-page-contact-card-1">
                    <div className="landing-page-contact-card-content">
                      <div className="landing-page-contact-card-content-inner">
                        <div className="landing-page-contact-icon-wrapper">
                          <Mail size={20} />
                        </div>
                        <div className="landing-page-contact-card-content-wrapper">
                          <h3>Email</h3>
                          <a
                            href="mailto:voatnetwork@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#5c4df4",
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: 500,
                              margin: "2px 0 0 0",
                              letterSpacing: "0.01em",
                              wordBreak: "break-word",
                              textAlign: "left",
                              lineHeight: 1.4,
                              display: "block"
                            }}
                          >
                            voatnetwork@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                    <a
                      href="mailto:voatnetwork@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send Email <ArrowRight size={16} />
                    </a>
                  </div>

                  {/* Phone Contact Card */}
                  <div className="landing-page-contact-card landing-page-contact-card-1">
                    <div className="landing-page-contact-card-content">
                      <div className="landing-page-contact-card-content-inner">
                        <div className="landing-page-contact-icon-wrapper">
                          <Phone size={20} />
                        </div>
                        <div className="landing-page-contact-card-content-wrapper">
                          <h3>Phone</h3>
                          <a
                            href="tel:+917799770919"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#5c4df4",
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: 500,
                              margin: "2px 0 0 0",
                              letterSpacing: "0.01em",
                              wordBreak: "break-word",
                              textAlign: "left",
                              lineHeight: 1.4,
                              display: "block"
                            }}
                          >
                            +91 7799770919
                          </a>
                        </div>
                      </div>
                    </div>
                    <a
                      href="tel:+917799770919"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Call Now <ArrowRight size={16} />
                    </a>
                  </div>

                  {/* Address Contact Card */}
                  <div className="landing-page-contact-card landing-page-contact-card-1 landing-page-contact-card-mapping">
                    <div className="landing-page-contact-card-content">
                      <div className="landing-page-contact-card-content-inner">
                        <div className="landing-page-contact-icon-wrapper">
                          <MapPin size={20} />
                        </div>
                        <div className="landing-page-contact-card-content-wrapper">
                          <h3>Address</h3>
                          <a
                            href="https://maps.app.goo.gl/QeVzKgkZp5htyUUn7"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#5c4df4",
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: 500,
                              margin: "2px 0 0 0",
                              letterSpacing: "0.01em",
                              wordBreak: "break-word",
                              textAlign: "left",
                              lineHeight: 1.4,
                              display: "block"
                            }}
                          >
                            Vishakapatnam<br />Andhra Pradesh, 531019
                          </a>
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/QeVzKgkZp5htyUUn7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Map <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
              {/* ===== CONTACT CARDS SECTION ENDS HERE ===== */}

              {/* ===== CONTACT FORM SECTION ===== */}
              <div className="landing-page-contact-form-container">
                <div className="landing-page-contact-form-panel">
                  <h3 className="landing-page-contact-form-title">
                    Send us a Message
                  </h3>
                  <form
                    onSubmit={this.handleSubmit}
                    className="landing-page-contact-form"
                  >
                    {/* Form Row 1: Full Name and Email */}
                    <div className="landing-page-contact-form-row">
                      <div className="landing-page-contact-form-group">
                        <label
                          htmlFor="fullName"
                          className="landing-page-contact-form-label"
                        >
                          Full Name{" "}
                          <span className="landing-page-contact-required">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          required
                          value={this.state.fullName}
                          onChange={this.handleChange}
                          className="landing-page-contact-form-input"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="landing-page-contact-form-group">
                        <label
                          htmlFor="email"
                          className="landing-page-contact-form-label"
                        >
                          Email{" "}
                          <span className="landing-page-contact-required">
                            *
                          </span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={this.state.email}
                          onChange={this.handleChange}
                          className="landing-page-contact-form-input"
                          placeholder="example@gmail.com"
                        />
                      </div>
                    </div>

                    {/* Form Row 2: Phone Number and Profession */}
                    <div className="landing-page-contact-form-row">
                      <div className="landing-page-contact-form-group">
                        <label
                          htmlFor="phone"
                          className="landing-page-contact-form-label"
                        >
                          Phone Number{" "}
                          <span className="landing-page-contact-required">
                            *
                          </span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={this.state.phone}
                          onChange={this.handleChange}
                          className="landing-page-contact-form-input"
                          placeholder="+91 "
                        />
                      </div>

                      <div className="landing-page-contact-form-group">
                        <label
                          htmlFor="profession"
                          className="landing-page-contact-form-label"
                        >
                          Profession{" "}
                          <span className="landing-page-contact-required">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="profession"
                          name="profession"
                          required
                          value={this.state.profession}
                          onChange={this.handleChange}
                          className="landing-page-contact-form-input"
                          placeholder="Web Developer"
                        />
                      </div>
                    </div>

                    {/* Form Row 3: Message */}
                    <div className="landing-page-contact-form-group">
                      <label
                        htmlFor="message"
                        className="landing-page-contact-form-label"
                      >
                        Message{" "}
                        <span className="landing-page-contact-required">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={this.state.message}
                        onChange={this.handleChange}
                        rows={5}
                        className="landing-page-contact-form-textarea"
                        placeholder="Your message here..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="landing-page-button landing-page-button-primary landing-page-contact-submit-button"
                      disabled={this.state.formStatus === "submitting"}
                    >
                      <span>
                        {this.state.formStatus === "submitting"
                          ? "Sending..."
                          : "Send Message"}
                      </span>
                      {this.state.formStatus !== "submitting" && (
                        <ArrowRight className="landing-page-button-icon" />
                      )}
                    </button>

                    {/* Form Status Message Display */}
                    {this.state.formStatus && (
                      <div className="landing-page-form-status-container">
                        {formStatusDisplay()}
                      </div>
                    )}
                  </form>
                </div>
              </div>
              {/* ===== CONTACT FORM SECTION ENDS HERE ===== */}

              {/* Honeypot Field for Bot Protection */}
              <div
                className="landing-page-honeypot"
                style={{ position: "absolute", left: "-9999px" }}
              >
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* ===== SOCIAL MEDIA LINKS SECTION ===== */}
              <div className="landing-page-contact-social-container">
                <h3 className="landing-page-contact-social-title">
                  Connect With Us
                </h3>
                <div className="landing-page-contact-social-icons">
                  {/* Email Social Link */}
                  <a
                    href="mailto:voatnetwork@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-page-contact-social-link"
                  >
                    <Mail className="landing-page-contact-social-icon" />
                  </a>
                  
                  {/* WhatsApp Social Link */}
                  <a
                    href="https://wa.me/917799770919"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-page-contact-social-link"
                  >
                    <FaWhatsapp className="landing-page-contact-social-icon" />
                  </a>
                  
                  {/* Instagram Social Link */}
                  <a
                    href="https://instagram.com/voatnetwork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-page-contact-social-link"
                  >
                    <Instagram className="landing-page-contact-social-icon" />
                  </a>
                  
                  {/* LinkedIn Social Link */}
                  <a
                    href="https://linkedin.com/company/voatnetwork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-page-contact-social-link"
                  >
                    <Linkedin className="landing-page-contact-social-icon" />
                  </a>
                  
                  {/* Twitter/X Social Link */}
                  <a
                    href="https://x.com/voatnetwork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-page-contact-social-link"
                  >
                    <FaXTwitter className="landing-page-contact-social-icon" />
                  </a>
                  
                  {/* YouTube Social Link */}
                  <a
                    href="https://youtube.com/@voatnetwork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-page-contact-social-link"
                  >
                    <Youtube className="landing-page-contact-social-icon" />
                  </a>
                </div>
              </div>
              {/* ===== SOCIAL MEDIA LINKS SECTION ENDS HERE ===== */}
            </div>
          </section>
          {/* ===== CONTACT SECTION ENDS HERE ===== */}

          {/* Call to Action */}
          <section className="landing-page-cta-section">
            <div className="landing-page-container">
              <div className="landing-page-cta-content">
                <h2>Ready to Transform Your Business?</h2>
                <p>
                  Let's work together to bring your vision to life and take your
                  business to the next level.
                </p>
                <a
                  href="#contact"
                  className="landing-page-button landing-page-button-cta"
                >
                  Get Started Today <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }
}

export default LandingPage;
