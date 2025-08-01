import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import LandingPage from "./components/LandingPage";
import ServicesPage from "./components/ServicesPage";
import CartPage from "./components/CartPage";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import FreelancerPortfolioPage from "./components/FreelancerPortfolioPage";
import FreelancersListPage from "./components/FreelancersListPage";
import PaymentGatewayPage from "./components/PaymentMethod";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsConditionsPage from "./components/TermsandConditionPage";
import ShippingPolicyPage from "./components/ShippingPolicyPage";
import CancellationReturnPolicyPage from "./components/CancellationReturnPolicyPage";


import "./App.css";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/" element={<LandingPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/user-dashboard" element={<UserDashboard />} />
    <Route path="/my-portfolio" element={<FreelancerPortfolioPage />} />
    <Route path="/my-portfolio/:userId" element={<FreelancerPortfolioPage />} />
    <Route path="/portfolio-list" element={<FreelancersListPage />} />
    <Route path="/payment" element={<PaymentGatewayPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/terms" element={<TermsConditionsPage />} />
    <Route path="/Shipping-policy" element={<ShippingPolicyPage />} />
    <Route path="/cancellation-policy" element={<CancellationReturnPolicyPage />} />
  </Routes>
);

export default App;
