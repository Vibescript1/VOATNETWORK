import React, { Component } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import CartPage from "../CartPage";
import {
  User,
  Menu,
  LogOut,
  X,
  Check,
  Search,
  ShoppingCart,
  ChevronDown,
  LogInIcon,
} from "lucide-react";
import "./index.css";

class NavBar extends Component {
  state = {
    isMobile: false,
    isTablet: false,
    menuOpen: false,
    profileDropdownOpen: false,
    isLoggedIn: false,
    user: null,
    showSpecialOffer: true,
    prevScrollPos: window.pageYOffset,
    showLogoutNotification: false,
    showLoginNotification: false,
    showWelcomeMessage: false,
    searchQuery: "",
    activeMenu: "",
    cartSidebarOpen: false,
    currentMessageIndex: 0,
  };

  // Backend URLs - will try both environments
  backendUrls = [
    "https://voat.onrender.com", // Production/Render
    "http://localhost:5000", // Local development (keep for dev)
  ];

  // Initialize class properties for notification timers
  loginNotificationTimer = null;
  logoutNotificationTimer = null;
  redirectTimer = null;
  loginCheckInterval = null;
  welcomeMessageTimer = null;
  storageEventBound = false;
  carouselInterval = null;

  componentDidMount() {
    window.navbarComponent = this;

    this.checkScreenSize();
    this.updateActiveMenu();

    window.addEventListener("resize", this.checkScreenSize);
    document.addEventListener("mousedown", this.handleClickOutside);

    // Ensure we only bind the storage event listener once
    if (!this.storageEventBound) {
      window.addEventListener("storage", this.handleStorageEvent);
      this.storageEventBound = true;
    }

    window.addEventListener("scroll", this.handleScroll);

    // Check which backend is available
    this.checkBackendAvailability();

    // Check initial login status without showing notifications
    this.loadUserData();

    // Set up interval to check for login status changes
    this.loginCheckInterval = setInterval(
      this.checkLoginStatusPeriodically,
      2000
    );

    // Add a direct method to force show login notification
    window.showLoginNotification = this.forceShowLoginNotification;

    // Add a method to show welcome message
    window.showWelcomeMessage = this.showWelcomeMessage;

    // Start the carousel
    this.startCarousel();

    console.log("NavBar mounted with notifications setup");
  }

  // Method to determine active menu based on current path
  updateActiveMenu = () => {
    const { pathname } = window.location;

    if (pathname === "/") {
      this.setState({ activeMenu: "home" });
    } else if (pathname.includes("/services")) {
      this.setState({ activeMenu: "services" });
    } else if (pathname.includes("/portfolio-list")) {
      this.setState({ activeMenu: "portfolio" });
    } else if (pathname.includes("/#contact")) {
      {/* Contact Section Active Menu Detection */}
      this.setState({ activeMenu: "contact" });
    } else {
      this.setState({ activeMenu: "" });
    }
  };

  startCarousel = () => {
    this.carouselInterval = setInterval(() => {
      const messages = this.getSpecialOfferText();
      this.setState((prevState) => ({
        currentMessageIndex: (prevState.currentMessageIndex + 1) % messages.length,
      }));
    }, 4000); // Change message every 4 seconds (increased from 3)
  };

  pauseCarousel = () => {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  };

  resumeCarousel = () => {
    if (!this.carouselInterval) {
      this.startCarousel();
    }
  };

  // Get initials from user name
  getUserInitials = (name) => {
    if (!name) return "U";

    const names = name.split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }
  };

  // Check which backend is available
  checkBackendAvailability = async () => {
    let workingUrl = null;

    for (const url of this.backendUrls) {
      try {
        // Simple ping to see if this backend is responding
        const response = await fetch(`${url}/api/test-connection`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ test: true }),
          // Short timeout to fail fast
          signal: AbortSignal.timeout(2000),
        });

        if (response.ok) {
          console.log(`Backend available at: ${url}`);
          workingUrl = url;
          break;
        }
      } catch (error) {
        console.log(`Backend at ${url} not available:`, error.message);
      }
    }

    // If we found a working URL, save it
    if (workingUrl) {
      window.backendUrl = workingUrl;
      console.log("Using backend at:", workingUrl);
    } else {
      // Default to production URL if none respond
      window.backendUrl = this.backendUrls[0];
      console.log("No backend responding, defaulting to:", window.backendUrl);
    }
  };

  // Get the current backend URL
  getBackendUrl = () => {
    return window.backendUrl || this.backendUrls[0];
  };

  // Load user data directly from localStorage only
  loadUserData = () => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          console.log("User data loaded from localStorage:", userData);

          // Ensure profile image path is properly formatted with full URL if needed
          if (userData && userData.profileImage) {
            // Check if it's a relative path or already has a domain
            if (
              !userData.profileImage.startsWith("http") &&
              !userData.profileImage.startsWith("/")
            ) {
              userData.profileImage = "/" + userData.profileImage;
            }

            // If it's a relative path, ensure it's properly formatted
            if (userData.profileImage.startsWith("/uploads/")) {
              // Check if we need to prepend the backend URL
              const backendUrl = this.getBackendUrl();
              if (!userData.profileImage.includes(backendUrl)) {
                // Remove any duplicate slashes
                const cleanPath = userData.profileImage.replace(/^\/+/, "");
                userData.profileImage = `${backendUrl}/${cleanPath}`;
              }
            }

            console.log("Formatted profile image path:", userData.profileImage);
          }

          // Make sure we have a name and it's not generated
          if (userData && userData.name) {
            // Update state with localStorage data
            this.setState({
              user: userData,
              isLoggedIn: true,
            });
          } else {
            // Handle missing name
            console.error("User data missing name property");
            this.setState({
              isLoggedIn: false,
              user: null,
            });
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          this.setState({
            isLoggedIn: false,
            user: null,
          });
        }
      } else {
        this.setState({
          isLoggedIn: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      this.setState({
        isLoggedIn: false,
        user: null,
      });
    }
  };

  // Show welcome message
  showWelcomeMessage = () => {
    console.log("Showing welcome message");

    // Clear any existing timer
    clearTimeout(this.welcomeMessageTimer);

    // First load user data to make sure we have the latest
    this.loadUserData();

    // Show welcome message
    this.setState({ showWelcomeMessage: true });

    // Set timer to hide it after 8 seconds
    this.welcomeMessageTimer = setTimeout(() => {
      console.log("Hiding welcome message after 8 seconds");
      this.setState({ showWelcomeMessage: false });
    }, 8000);
  };

  // Direct method to force show login notification
  forceShowLoginNotification = () => {
    console.log("Force showing login notification");

    // Clear any existing timer
    clearTimeout(this.loginNotificationTimer);

    // First load user data to make sure we have the latest
    this.loadUserData();

    // Show notification
    this.setState({ showLoginNotification: true });

    // Set timer to hide it after 5 seconds
    this.loginNotificationTimer = setTimeout(() => {
      console.log("Hiding login notification after 5 seconds");
      this.setState({ showLoginNotification: false });
    }, 5000);
  };

  componentWillUnmount() {
    // Remove global reference
    if (window.navbarComponent === this) {
      delete window.navbarComponent;
    }

    // Remove global notification function
    delete window.showLoginNotification;
    delete window.showWelcomeMessage;

    window.removeEventListener("resize", this.checkScreenSize);
    document.removeEventListener("mousedown", this.handleClickOutside);

    if (this.storageEventBound) {
      window.removeEventListener("storage", this.handleStorageEvent);
      this.storageEventBound = false;
    }

    window.removeEventListener("scroll", this.handleScroll);

    // Clean up notification timers and intervals
    clearTimeout(this.loginNotificationTimer);
    clearTimeout(this.logoutNotificationTimer);
    clearTimeout(this.redirectTimer);
    clearTimeout(this.welcomeMessageTimer);
    clearInterval(this.loginCheckInterval);
    clearInterval(this.carouselInterval);
  }

  // Method to check login status periodically
  checkLoginStatusPeriodically = () => {
    try {
      let userData = null;
      try {
        const userDataStr = localStorage.getItem("user");
        userData = userDataStr ? JSON.parse(userDataStr) : null;

        // Format profile image path if exists
        if (userData && userData.profileImage) {
          // If profile image doesn't start with http or /, add /
          if (
            !userData.profileImage.startsWith("http") &&
            !userData.profileImage.startsWith("/")
          ) {
            userData.profileImage = "/" + userData.profileImage;
          }
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        userData = null;
      }

      const wasLoggedIn = this.state.isLoggedIn;
      const isLoggedIn = !!userData;

      // If login state changed to logged in
      if (!wasLoggedIn && isLoggedIn) {
        console.log("Detected login via interval check");
        // Load latest user data from localStorage
        this.loadUserData();
        this.setState({ expectingLogin: false });
      }
      // If logout happened
      else if (wasLoggedIn && !isLoggedIn) {
        console.log("Detected logout via interval check");
        this.handleExternalLogout();
      }
      // Update user data from localStorage if it changed
      else if (isLoggedIn && userData && this.state.user) {
        // Compare current state with localStorage data
        const currentUser = this.state.user;
        if (
          userData.name !== currentUser.name ||
          userData.email !== currentUser.email ||
          userData.id !== currentUser.id ||
          userData.role !== currentUser.role ||
          userData.profileImage !== currentUser.profileImage ||
          userData.voatId !== currentUser.voatId
        ) {
          console.log("User data changed in localStorage, updating state");
          this.setState({ user: userData });
        }
      }
    } catch (error) {
      console.error("Error in periodic login check:", error);
    }
  };

  // Method to prepare for an upcoming login
  prepareForLogin = () => {
    console.log("NavBar is now expecting a login");
    this.setState({ expectingLogin: true });
  };

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const { prevScrollPos } = this.state;

    // Determine whether to show or hide the special offer based on scroll direction and position
    const isScrollingDown = prevScrollPos < currentScrollPos;
    const isScrolledPastThreshold = currentScrollPos > 50;

    this.setState({
      showSpecialOffer: !isScrollingDown && !isScrolledPastThreshold,
      prevScrollPos: currentScrollPos,
    });
  };

  // Handle storage events (login/logout from other tabs or components)
  handleStorageEvent = (event) => {
    if (event.key === "user") {
      console.log(
        "Storage event detected:",
        event.newValue ? "Login" : "Logout"
      );

      // Check if user was added (login) or removed (logout)
      if (event.newValue) {
        // User data was added - login occurred
        try {
          const userData = JSON.parse(event.newValue);

          // Format profile image path if exists
          if (userData && userData.profileImage) {
            // If profile image doesn't start with http or /, add /
            if (
              !userData.profileImage.startsWith("http") &&
              !userData.profileImage.startsWith("/")
            ) {
              userData.profileImage = "/" + userData.profileImage;
            }
          }

          if (!this.state.isLoggedIn) {
            console.log("Handling login from storage event");
            this.handleLogin(userData);
          } else {
            console.log(userData, "userData--userData");
            // Just update user data without notification
            this.setState({ user: userData });
          }
        } catch (e) {
          console.error("Error parsing user data from storage event:", e);
        }
      } else {
        // User data was removed - logout occurred
        if (this.state.isLoggedIn) {
          this.handleExternalLogout();
        }
      }
    }
  };

  // Handle login (show notification and update state)
  handleLogin = (userData) => {
    try {
      let user = userData;

      // If userData is a string, parse it
      if (typeof userData === "string") {
        user = JSON.parse(userData);
      }

      console.log("Handling login for user:", user.name);

      // Format profile image path if exists
      if (user && user.profileImage) {
        // If profile image doesn't start with http or /, add /
        if (
          !user.profileImage.startsWith("http") &&
          !user.profileImage.startsWith("/")
        ) {
          user.profileImage = "/" + user.profileImage;
        }
        console.log("Formatted profile image path:", user.profileImage);
      }

      // Force notification to be visible and update state with user data
      this.setState({
        isLoggedIn: true,
        user: user,
        showLoginNotification: true,
      });

      // Set timer to hide login notification after 5 seconds
      clearTimeout(this.loginNotificationTimer);
      this.loginNotificationTimer = setTimeout(() => {
        console.log("Hiding login notification after 5 seconds");
        this.setState({ showLoginNotification: false });
      }, 5000);
    } catch (error) {
      console.error("Error handling login:", error);
    }
  };

  // Handle logout initiated externally (from storage event)
  handleExternalLogout = () => {
    console.log("External logout detected");

    this.setState({
      isLoggedIn: false,
      user: null,
      showLogoutNotification: true,
    });

    // Set timer to hide logout notification after 3 seconds
    clearTimeout(this.logoutNotificationTimer);
    this.logoutNotificationTimer = setTimeout(() => {
      console.log("Hiding logout notification after 3 seconds");
      this.setState({ showLogoutNotification: false });
    }, 3000);
  };

  // Handle user-initiated logout (clicking the logout button)
  handleLogout = () => {
    console.log("Manual logout initiated");

    // First set state to show the notification
    this.setState({
      isLoggedIn: false,
      user: null,
      profileDropdownOpen: false,
      showLogoutNotification: true,
    });

    // Remove user data from localStorage - this triggers storage event
    localStorage.removeItem("user");

    // Set timer to hide logout notification after 3 seconds
    clearTimeout(this.logoutNotificationTimer);
    this.logoutNotificationTimer = setTimeout(() => {
      console.log("Hiding logout notification after 3 seconds");
      this.setState({ showLogoutNotification: false });

      // Redirect to home after notification is shown
      clearTimeout(this.redirectTimer);
      this.redirectTimer = setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }, 3000);
  };

  profileDropdownRef = React.createRef();

  checkScreenSize = () => {
    this.setState({
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    });
  };

  toggleCartSidebar = () => {
    this.setState((prevState) => ({
      cartSidebarOpen: !prevState.cartSidebarOpen,
    }));
  };

  closeCartSidebar = () => {
    this.setState({ cartSidebarOpen: false });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      menuOpen: !prevState.menuOpen,
    }));
  };

  toggleProfileDropdown = () => {
    this.setState((prevState) => ({
      profileDropdownOpen: !prevState.profileDropdownOpen,
    }));
  };

  handleClickOutside = (event) => {
    if (
      this.profileDropdownRef.current &&
      !this.profileDropdownRef.current.contains(event.target) &&
      this.state.profileDropdownOpen
    ) {
      this.setState({ profileDropdownOpen: false });
    }
  };

  closeNotification = (type) => {
    if (type === "login") {
      clearTimeout(this.loginNotificationTimer);
      this.setState({ showLoginNotification: false });
    } else if (type === "logout") {
      clearTimeout(this.logoutNotificationTimer);
      this.setState({ showLogoutNotification: false });
    } else if (type === "welcome") {
      clearTimeout(this.welcomeMessageTimer);
      this.setState({ showWelcomeMessage: false });
    }
  };

  getSpecialOfferText = () => {
    const { user } = this.state;

    if (!user) {
      return [
        "🎉 Register Now and get 500/-",
        "🚀 Join Waitlist for Passive Leads!",
        "💎 Premium services at unbeatable prices!",
        "🔑 Refer and Earn 1 Month of Premium Membership!",
      ];
    }

    // Check user role to determine the messages
    const role = user.role || "";

    if (
      role === "freelancer" ||
      role === "Freelancer" ||
      role === "service provider" ||
      role === "Service Provider" ||
      role === "Freelancer/Service Provider" ||
      role.toLowerCase().includes("freelancer") ||
      role.toLowerCase().includes("service provider")
    ) {
      return [
        "🚀 Start your freelancing journey today with VOAT!",
        "💼 Grow your business with our platform!",
        "🌟 Connect with clients worldwide!",
        "📈 Boost your freelance career now!",
      ];
    } else {
      return [
        "🔥 Special Launch Offer - 30% off on all services!",
        "📅 Book your consultation today and save big!",
        "🚀 Join thousands of satisfied customers!",
        "💎 Premium services at unbeatable prices!",
      ];
    }
  };

  // Method to create smooth scroll to top function
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle search input change
  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  // Handle search form submission
  handleSearchSubmit = (e) => {
    e.preventDefault();
    const { searchQuery } = this.state;
    if (searchQuery.trim()) {
      window.location.href = `/portfolio-list?profession=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  // Manual update method for testing/debugging
  updateUserFromLocalStorage = () => {
    this.loadUserData();
  };

  render() {
    const {
      isMobile,
      menuOpen,
      profileDropdownOpen,
      isLoggedIn,
      showSpecialOffer,
      user,
      showLogoutNotification,
      showLoginNotification,
      showWelcomeMessage,
      searchQuery,
      activeMenu,
      cartSidebarOpen,
      currentMessageIndex,
    } = this.state;

    // Debug log
    console.log("Current user state in NavBar render:", user);

    // Determine profile image to use - debug the profile image path
    console.log("Profile image path:", user?.profileImage);
    const profileImage = user?.profileImage || null;
    const userInitials = user ? this.getUserInitials(user.name) : "";
    const voatId = user?.voatId || "";

    return (
      <>
        <header className={showSpecialOffer ? "" : "navbar-sticky"}>
          <div className="navbar-container">
            <div 
              className="navbar-special-offer"
              onMouseEnter={this.pauseCarousel}
              onMouseLeave={this.resumeCarousel}
            >
              <div className="carousel-container">
                {this.getSpecialOfferText().map((message, index) => (
                  <div
                    key={index}
                    className={`carousel-message ${
                      index === currentMessageIndex ? "active" : ""
                    }`}
                  >
                    {message}
                  </div>
                ))}
              </div>
            </div>
            <nav
              className={`navbar ${showSpecialOffer ? "" : "navbar-no-offer"}`}
            >
              {/* Desktop Layout */}
              {!isMobile && (
                <>
                  <div className="navbar-left-section">
                    {/* Left-side menu items - UPDATED with active classes */}
                    <ul className="left-menu">
                      <li className={activeMenu === "home" ? "active" : ""}>
                        <Link
                          to="/"
                          onClick={() => {
                            this.scrollToTop();
                            this.setState({ activeMenu: "home" });
                          }}
                        >
                          Home
                        </Link>
                      </li>
                      <li className={activeMenu === "services" ? "active" : ""}>
                        <Link
                          to="/services"
                          onClick={() => {
                            this.scrollToTop();
                            this.setState({ activeMenu: "services" });
                          }}
                        >
                          Services
                        </Link>
                      </li>
                      <li className={activeMenu === "portfolio" ? "active" : ""}>
                        <Link
                          to="/portfolio-list"
                          onClick={() => {
                            this.scrollToTop();
                            this.setState({ activeMenu: "portfolio" });
                          }}
                        >
                          Portfolios
                        </Link>
                      </li>
                      <li className={activeMenu === "blog" ? "active" : ""}>
                        <HashLink
                          smooth
                          to="/#blog"
                          onClick={() => {
                            this.scrollToTop();
                            this.setState({ activeMenu: "blog" });
                          }}
                        >
                          Blog
                        </HashLink>
                      </li>
                      {/* ===== CONTACT SECTION STARTS HERE ===== */}
                      <li className={activeMenu === "contact" ? "active" : ""}>
                        {/* Contact Us Navigation Link */}
                        <HashLink
                          smooth
                          to="/#contact"
                          onClick={() => {
                            this.scrollToTop();
                            this.setState({ activeMenu: "contact" });
                          }}
                        >
                          Contact Us
                        </HashLink>
                      </li>
                      {/* ===== CONTACT SECTION ENDS HERE ===== */}
                    </ul>
                  </div>

                  <div className="navbar-logo">
                    <Link to="/" onClick={this.scrollToTop}>
                      <img
                        src="https://res.cloudinary.com/dffu1ungl/image/upload/v1744606803/VOAT_LOGO_zo7lk5.png"
                        alt="Logo"
                        className="nav-logo"
                      />
                    </Link>
                  </div>

                  <div className="navbar-right-section">
                    {/* Search bar */}
                    <div className="navbar-search">
                      <form onSubmit={this.handleSearchSubmit}>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={this.handleSearchChange}
                          aria-label="Search"
                        />
                        <button type="submit" aria-label="Submit search">
                          <Search size={16} />
                        </button>
                      </form>
                    </div>

                    {/* User profile when logged in with profile image or initials */}
                    {isLoggedIn && user && (
                      <div
                        className="navbar-user-profile"
                        ref={this.profileDropdownRef}
                      >
                        <button
                          className="navbar-cart"
                          onClick={this.toggleCartSidebar}
                          aria-label="Open shopping cart"
                        >
                          <ShoppingCart size={20} />
                        </button>

                        {/* User profile with VOAT ID - REDESIGNED */}
                        <div
                          className="user-profile-container"
                          onClick={this.toggleProfileDropdown}
                        >
                          <div className="user-avatar-wrapper">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt="User"
                                className="navbar-user-image"
                                onError={(e) => {
                                  console.log("Image load error:", e);
                                  e.target.onerror = null;

                                  // Try with backend URL if it's a relative path
                                  if (
                                    !profileImage.startsWith("http") &&
                                    this.getBackendUrl()
                                  ) {
                                    const backendUrl = this.getBackendUrl();
                                    const cleanPath = profileImage.replace(
                                      /^\/+/,
                                      ""
                                    );
                                    e.target.src = `${backendUrl}/${cleanPath}`;
                                    return; // Give it another chance to load
                                  }

                                  e.target.src = ""; // Clear the source if second attempt fails
                                  e.target.style.display = "none"; // Hide the img

                                  // Add initials to the parent element
                                  const parent = e.target.parentNode;
                                  if (
                                    parent &&
                                    !parent.querySelector(".user-initials")
                                  ) {
                                    const initialsElem =
                                      document.createElement("div");
                                    initialsElem.className = "user-initials";
                                    initialsElem.innerText = userInitials;
                                    parent.appendChild(initialsElem);
                                  }
                                }}
                              />
                            ) : (
                              <div className="user-initials">{userInitials}</div>
                            )}
                          </div>

                          {voatId && (
                            <div className="navbar-voat-id">
                              <span title="VOAT ID">{voatId}</span>
                            </div>
                          )}
                        </div>

                        {/* Profile Dropdown Menu */}
                        {profileDropdownOpen && (
                          <div className="profile-dropdown">
                            <Link
                              to="/user-dashboard"
                              className="dropdown-item"
                              onClick={() =>
                                this.setState({ profileDropdownOpen: false })
                              }
                            >
                              <User size={16} />
                              <span>Dashboard</span>
                            </Link>
                            <div
                              className="dropdown-item"
                              onClick={this.handleLogout}
                            >
                              <LogOut size={16} />
                              <span>Logout</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Desktop auth button */}
                    {!isLoggedIn && (
                      <div className="navbar-auth desktop-auth">
                        <Link
                          to="/login"
                          className="get-started-btn"
                          onClick={this.scrollToTop}
                        >
                          Login
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mobile Layout - Three Sections */}
              {isMobile && (
                <>
                  {/* Left Section - Hamburger */}
                  <div className="navbar-hamburger" onClick={this.toggleMenu}>
                    {menuOpen ? null : <Menu size={24} />}
                  </div>

                  {/* Center Section - Logo */}
                  <div className="navbar-logo">
                    <Link to="/" onClick={this.scrollToTop}>
                      <img
                        src="https://res.cloudinary.com/dffu1ungl/image/upload/v1744606803/VOAT_LOGO_zo7lk5.png"
                        alt="Logo"
                        className="nav-logo"
                      />
                    </Link>
                  </div>

                  {/* Right Section - Auth Controls */}
                  <div className="mobile-nav-controls">
                    {!isLoggedIn ? (
                      <Link
                        to="/login"
                        className="mobile-auth"
                        onClick={this.scrollToTop}
                      >
                        <LogInIcon color="#0a385b" size={24} />
                      </Link>
                    ) : (
                      <div className="mobile-auth-container">
                        <button
                          className="mobile-auth-user"
                          onClick={this.toggleCartSidebar}
                        >
                          <ShoppingCart size={20} color="#fff" />
                        </button>
                        <Link
                          to="/user-dashboard"
                          className="mobile-auth-user"
                          onClick={this.scrollToTop}
                        >
                          <User size={20} color="#fff" />
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mobile menu - UPDATED with active classes */}
              <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
                <div className="mobile-menu-header">
                  <div className="mobile-menu-close" onClick={this.toggleMenu}>
                    <X size={24} />
                  </div>
                </div>

                {/* Mobile user profile with VOAT ID */}
                {isLoggedIn && user && (
                  <li className="mobile-user-info">
                    <div className="mobile-user-profile-container">
                      <div className="user-avatar-wrapper-mobile">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="User"
                            className="navbar-user-image-mobile"
                            onError={(e) => {
                              console.log("Mobile image load error:", e);
                              e.target.onerror = null;

                              // Try with backend URL if it's a relative path
                              if (
                                !profileImage.startsWith("http") &&
                                this.getBackendUrl()
                              ) {
                                const backendUrl = this.getBackendUrl();
                                const cleanPath = profileImage.replace(
                                  /^\/+/,
                                  ""
                                );
                                e.target.src = `${backendUrl}/${cleanPath}`;
                                return; // Give it another chance to load
                              }

                              e.target.src = ""; // Clear the source if second attempt fails
                              e.target.style.display = "none"; // Hide the img

                              // Add initials to the parent element
                              const parent = e.target.parentNode;
                              if (
                                parent &&
                                !parent.querySelector(".user-initials-mobile")
                              ) {
                                const initialsElem =
                                  document.createElement("div");
                                initialsElem.className = "user-initials-mobile";
                                initialsElem.innerText = userInitials;
                                parent.appendChild(initialsElem);
                              }
                            }}
                          />
                        ) : (
                          <div className="user-initials-mobile">
                            {userInitials}
                          </div>
                        )}
                      </div>

                      {voatId && <div className="mobile-voat-id">{voatId}</div>}
                    </div>
                  </li>
                )}

                <ul className="mobile-menu-items">
                  <li className={activeMenu === "home" ? "active" : ""}>
                    <Link
                      to="/"
                      onClick={() => {
                        this.scrollToTop();
                        this.setState({ activeMenu: "home" });
                        this.toggleMenu();
                      }}
                    >
                      Home
                    </Link>
                  </li>
                  <li className={activeMenu === "services" ? "active" : ""}>
                    <Link
                      to="/services"
                      onClick={() => {
                        this.scrollToTop();
                        this.setState({ activeMenu: "services" });
                        this.toggleMenu();
                      }}
                    >
                      Services
                    </Link>
                  </li>
                  <li className={activeMenu === "portfolio" ? "active" : ""}>
                    <Link
                      to="/portfolio-list"
                      onClick={() => {
                        this.scrollToTop();
                        this.setState({ activeMenu: "portfolio" });
                        this.toggleMenu();
                      }}
                    >
                      Portfolio
                    </Link>
                  </li>
                  <li className={activeMenu === "blog" ? "active" : ""}>
                    <HashLink
                      smooth
                      to="/#blog"
                      onClick={() => {
                        this.scrollToTop();
                        this.setState({ activeMenu: "blog" });
                        this.toggleMenu();
                      }}
                    >
                      Blog
                    </HashLink>
                  </li>
                  {/* ===== CONTACT SECTION STARTS HERE ===== */}
                  <li className={activeMenu === "contact" ? "active" : ""}>
                    {/* Contact Us Mobile Navigation Link */}
                    <HashLink
                      smooth
                      to="/#contact"
                      onClick={() => {
                        this.setState({ activeMenu: "contact" });
                        this.toggleMenu();
                      }}
                    >
                      Contact Us
                    </HashLink>
                  </li>
                  {/* ===== CONTACT SECTION ENDS HERE ===== */}
                  {isLoggedIn && user && (
                    <>
                      <li>
                        <button
                          className="mobile-cart-btn"
                          onClick={() => {
                            this.toggleCartSidebar();
                            this.toggleMenu();
                          }}
                        >
                          <ShoppingCart size={16} className="menu-icon" />
                          <span>Cart</span>
                        </button>
                      </li>
                      <li>
                        <Link
                          to="/user-dashboard"
                          onClick={() => {
                            this.toggleMenu();
                          }}
                        >
                          <User size={16} className="menu-icon" />
                          <span>Dashboard</span>
                        </Link>
                      </li>
                      <li className="mobile-logout-item">
                        <button
                          className="get-started-btn mobile-auth"
                          onClick={this.handleLogout}
                        >
                          <LogOut size={16} className="logout-icon" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>
          </div>
        </header>

        {/* Notifications Container */}
        <div className="notifications-container">
          {/* Login notification */}
          <div
            className={`notification login-notification ${
              showLoginNotification ? "show" : ""
            }`}
          >
            <span className="notification-icon">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>Successfully logged in!</span>
            <button
              className="notification-close"
              onClick={() => this.closeNotification("login")}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Logout notification */}
          <div
            className={`notification logout-notification ${
              showLogoutNotification ? "show" : ""
            }`}
          >
            <span className="notification-icon">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>Session timeout. Please login again.</span>
            <button
              className="notification-close"
              onClick={() => this.closeNotification("logout")}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Welcome message notification */}
          <div
            className={`notification welcome-notification ${
              showWelcomeMessage ? "show" : ""
            }`}
          >
            <span className="notification-icon">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>
              You have registered successfully. Welcome to VOAT network{" "}
              {user?.name || "new user"}!
            </span>
            <button
              className="notification-close"
              onClick={() => this.closeNotification("welcome")}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <CartPage isOpen={cartSidebarOpen} onClose={this.closeCartSidebar} />
      </>
    );
  }
}

export default NavBar;
