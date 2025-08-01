import { Component } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, ChevronDown, Home, MapPin } from "lucide-react";
import axios from "axios";
import "./index.css";

const welcomeCardStyles = `
.welcome-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  width: 400px;
  z-index: 1000;
  animation: fadeInOut 5s forwards;
  opacity: 0;
}

.welcome-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.75rem;
}

.welcome-card-message {
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.welcome-card-emoji {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
}
`;

(function injectStyles() {
  if (!document.getElementById("welcome-card-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "welcome-card-styles";
    styleElement.innerHTML = welcomeCardStyles;
    document.head.appendChild(styleElement);
  }
})();

class SignupPage extends Component {
  state = {
    name: "",
    email: "",
    role: "",
    // phone: "",
    // profession: "",
    location: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    errors: {},
    isSubmitting: false,
    redirectToLogin: false,
    showWelcomeCard: false,
    agreeToTerms: false,
    isGettingLocation: false,
  };

  // Backend URLs
  backendUrls = [
    "https://voat.onrender.com", // Production/Render
    "http://localhost:5000", // Local development (keep for dev)
  ];

  componentDidMount() {
    // Check if NavBar has already determined the backend URL
    if (!window.backendUrl) {
      this.checkBackendAvailability();
    }
  }

  // Check which backend is available
  checkBackendAvailability = async () => {
    if (window.backendUrl) {
      console.log("Using already detected backend URL:", window.backendUrl);
      return;
    }

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

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  togglePasswordVisibility = (field) => {
    this.setState((prevState) => ({
      [field]: !prevState[field],
    }));
  };

  getCurrentLocation = () => {
    if (!navigator.geolocation) {
      this.setState({
        errors: {
          ...this.state.errors,
          location: "Geolocation is not supported by this browser.",
        },
      });
      return;
    }

    this.setState({ isGettingLocation: true });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Use reverse geocoding to get address from coordinates
        this.reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your current location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred while getting location.";
            break;
        }

        this.setState({
          isGettingLocation: false,
          errors: {
            ...this.state.errors,
            location: errorMessage,
          },
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  reverseGeocode = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get address');
      }

      const data = await response.json();
      
      if (data.display_name) {
        // Extract city, state, and country from the display name
        const addressParts = data.display_name.split(', ');
        let location = '';
        
        // Try to get city, state, and country
        if (addressParts.length >= 3) {
          // Get the city (usually the first part after street)
          const cityIndex = Math.min(2, addressParts.length - 3);
          const city = addressParts[cityIndex];
          
          // Get the state/province (usually the second to last part)
          const stateIndex = addressParts.length - 2;
          const state = addressParts[stateIndex];
          
          // Get the country (last part)
          const country = addressParts[addressParts.length - 1];
          
          location = `${city}, ${state}, ${country}`;
        } else if (addressParts.length >= 2) {
          // Fallback if we only have city and country
          const cityIndex = Math.min(2, addressParts.length - 2);
          const city = addressParts[cityIndex];
          const country = addressParts[addressParts.length - 1];
          location = `${city}, ${country}`;
        } else {
          location = data.display_name;
        }

        this.setState({
          location,
          isGettingLocation: false,
          errors: {
            ...this.state.errors,
            location: null,
          },
        });
      } else {
        throw new Error('No address found');
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      this.setState({
        isGettingLocation: false,
        errors: {
          ...this.state.errors,
          location: "Unable to get address from coordinates. Please enter location manually.",
        },
      });
    }
  };

  validateForm = () => {
    const { name, email, role,  location,  password, confirmPassword } =
      this.state;
    const errors = {};

    if (name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email address";
    }

    if (!role) {
      errors.role = "Please select a role";
    }

    // if (!profession) {
    //   errors.profession = "Please enter your profession";
    // }

    if (!location) {
      errors.location = "Please enter your location";
    }

    // Updated phone validation - more flexible
    // if (!phone) {
    //   errors.phone = "Phone number is required";
    // } else if (phone.length < 10) {
    //   errors.phone = "Phone number must be at least 10 digits";
    // }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    if (!this.state.agreeToTerms) {
      errors.agreeToTerms =
        "Please agree to the Terms & Conditions and Privacy Policy";
    }

    this.setState({ errors });

    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.validateForm()) {
      this.setState({ isSubmitting: true });

      this.setState({
        errors: {
          ...this.state.errors,
          general: "Registration failed. Please try again.",
        },
        isSubmitting: false,
      });

      setTimeout(() => {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            general: null,
          },
        }));
      }, 10000);

      try {
        // Get the current backend URL
        const baseUrl = this.getBackendUrl();
        console.log("Using backend URL for signup:", baseUrl);

        // ONLY use the actual API for signup - no test mode fallback
        console.log("Attempting to sign up with API...");

        const response = await axios.post(
          `${baseUrl}/api/signup`,
          {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role,
            // profession: this.state.profession,
            location: this.state.location,
            // phone: this.state.phone, // Add this line
          },
          {
            withCredentials: true,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("API signup response:", response.data);

        if (response.data && response.data.success && response.data.user) {
          // Success! Use the API response data
          const userData = response.data.user;
          console.log("Successfully signed up with API, user data:", userData);

          // Clear localStorage first to ensure we trigger storage event
          localStorage.removeItem("user");

          // Small delay to ensure removal is processed
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Store user data in localStorage
          console.log("Storing user data in localStorage:", userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // Show welcome message if available
          if (window.showWelcomeMessage) {
            window.showWelcomeMessage();
          } else if (
            window.navbarComponent &&
            typeof window.navbarComponent.showWelcomeMessage === "function"
          ) {
            window.navbarComponent.showWelcomeMessage();
          } else {
            // If no welcome message function is available, trigger login notification as fallback
            if (
              window.navbarComponent &&
              typeof window.navbarComponent.handleLogin === "function"
            ) {
              window.navbarComponent.handleLogin(userData);
            }
          }

          // Show welcome card
          this.setState({ showWelcomeCard: true });

          // Hide welcome card and redirect after 5 seconds
          setTimeout(() => {
            this.setState({
              showWelcomeCard: false,
              redirectToLogin: true,
            });
          }, 5000);
        } else {
          // API response was not as expected
          throw new Error("Invalid response from API");
        }
      } catch (error) {
        console.error("Registration error:", error);

        // Handle error states
        this.setState({
          errors: {
            ...this.state.errors,
            general: "Registration failed. Please try again.",
          },
          isSubmitting: false,
        });
      } finally {
        // Reset submitting state in case redirect doesn't happen
        setTimeout(() => {
          if (this.state.isSubmitting) {
            this.setState({ isSubmitting: false });
          }
        }, 3000);
      }
    }
  };

  render() {
    const {
      errors,
      showPassword,
      showConfirmPassword,
      isSubmitting,
      redirectToLogin,
      showWelcomeCard,
      name,
      isGettingLocation,
    } = this.state;

    // Redirect to login page if registration was successful
    if (redirectToLogin) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="register-screen">
        <Link to="/" className="register-home-button">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <div className="register-container">
          <h2 className="register-title">Create your account</h2>

          <div className="register-form-wrapper">
            <form className="register-form" onSubmit={this.handleSubmit}>
              {/* Two column layout for Name and Email */}
              <div className="register-row">
                {/* Name Input */}
                <div className="register-input-group">
                  <label htmlFor="name" className="register-label">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    className="register-input"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="register-input-error">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="register-input-group">
                  <label htmlFor="email" className="register-label">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    className="register-input"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="register-input-error">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Two column layout for Role and Location */}
              <div className="register-row">
                {/* Role Input */}
                <div className="register-input-group">
                  <label htmlFor="role" className="register-label">
                    Role
                  </label>
                  <div className="register-select-container">
                    <select
                      name="role"
                      value={this.state.role}
                      onChange={this.handleInputChange}
                      className="register-input"
                    >
                      <option value="">Select your role</option>
                      <option value="Freelancer/Service Provider">
                        Freelancer/Service Provider
                      </option>
                      <option value="Client/Individual">
                        Client/Individual
                      </option>
                    </select>
                    <div className="register-select-icon">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.role && (
                    <p className="register-input-error">{errors.role}</p>
                  )}
                </div>

                {/* Location Input */}
                <div className="register-input-group">
                  <label htmlFor="location" className="register-label">
                    Location
                  </label>
                  <div className="register-location-container">
                    <input
                      name="location"
                      type="text"
                      value={this.state.location}
                      onChange={this.handleInputChange}
                      className="register-input"
                      placeholder="Enter your location"
                    />
                    <button
                      type="button"
                      onClick={this.getCurrentLocation}
                      disabled={isGettingLocation}
                      className="register-location-button"
                      title=""
                    >
                      {isGettingLocation ? (
                        <div className="register-location-spinner"></div>
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="register-location-tooltip">Get current location</span>
                    </button>
                  </div>
                  {errors.location && (
                    <p className="register-input-error">{errors.location}</p>
                  )}
                </div>
              </div>

              {/* Two column layout for Profession and Phone Number */}
              <div className="register-row">
                {/* Profession Input */}
                {/* <div className="register-input-group">
                  <label htmlFor="profession" className="register-label">
                    Profession
                  </label>
                  <input
                    name="profession"
                    type="text"
                    value={this.state.profession}
                    onChange={this.handleInputChange}
                    className="register-input"
                    placeholder="Enter your profession"
                  />
                  {errors.profession && (
                    <p className="register-input-error">{errors.profession}</p>
                  )}
                </div> */}

                {/* Phone Number Input */}
                {/* <div className="register-input-group">
                  <label htmlFor="phone" className="register-label">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={this.state.phone}
                    onChange={this.handleInputChange}
                    className="register-input"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="register-input-error">{errors.phone}</p>
                  )}
                </div> */}
              </div>

              {/* Two column layout for Password fields */}
              <div className="register-row">
                {/* Password Input */}
                <div className="register-input-group">
                  <label htmlFor="password" className="register-label">
                    Password
                  </label>
                  <div className="register-password-container">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      className="register-input"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        this.togglePasswordVisibility("showPassword")
                      }
                      className="register-password-toggle"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="register-input-error">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="register-input-group">
                  <label htmlFor="confirmPassword" className="register-label">
                    Confirm Password
                  </label>
                  <div className="register-password-container">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={this.state.confirmPassword}
                      onChange={this.handleInputChange}
                      className="register-input"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        this.togglePasswordVisibility("showConfirmPassword")
                      }
                      className="register-password-toggle"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="register-input-error">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}

              <div className="register-input-group">
                <label className="register-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={this.state.agreeToTerms}
                    onChange={this.handleInputChange}
                    className="register-checkbox"
                  />
                  <span className="register-checkbox-text">
                    I agree to the{" "}
                    <Link to="/terms" target="_blank" className="register-link">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" target="_blank" className="register-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="register-input-error">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="register-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
              {errors.general && (
                <div className="register-error-alert">{errors.general}</div>
              )}
            </form>

            {/* Login Link */}
            <div className="register-divider">
              <div className="register-divider-line"></div>
              <div className="register-divider-text">
                <span className="register-divider-content">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link to="/login" className="register-login-link">
              Login
            </Link>
          </div>
        </div>

        {/* Welcome Card */}
        {showWelcomeCard && (
          <div className="welcome-card">
            <div className="welcome-card-emoji">🚀</div>
            <h2 className="welcome-card-title">Thank You for Registering!</h2>
            <p className="welcome-card-message">
              Welcome to VOAT Network, {name}!
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default SignupPage;
