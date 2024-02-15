/*  This component is used to create a login & registration form. 
    It uses the useState hook to manage form state & fetch to send 
    form data to server. The form has two modes: login & registration. 
    The mode can be toggled by clicking "Create One Here" or "Sign in" 
    link at bottom of form. This form also includes social media sign-in 
    buttons for Google, Facebook, & GitHub OAuth which will be later integrated.
*/

import { useState } from "react";
import GoogleIcon from "../assets/icons/google.svg";
import FacebookIcon from "../assets/icons/facebook.svg";
import GitHubIcon from "../assets/icons/github.svg";
import planeIcon from "../assets/icons/plane.svg";
import LogoIcon from "../assets/icons/logo.svg";
import AuthFormImage from "../assets/images/authform02.jpeg";

// Component for handling user authentication (login & registration)
const AuthForm = () => {
  // State variables for form fields & error messages
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Toggle between login & registration form
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  // Function to handlle login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // API call to backend login endpoint
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store access token & handle successful login
        localStorage.setItem("accessToken", data.access_token);
      } else {
        // Handlelogin errors
        setErrorMessage(data.message || "Login failed.");
      }
    } catch (error) {
      // Handle unexpected errors
      setErrorMessage("An error occurred during login.");
    }
  };

  // Function to handle registration
  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      // API call to backend registration endpoint
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Handle successful registration
      } else {
        // Handle registration errors
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      // Handle unexpected errors
      setErrorMessage("An error occurred during registration.");
    }
  };

  // Render authentication form
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        {/* Logo & title */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img src={LogoIcon} alt="App Logo" className="mx-auto h-12" />
          </div>

          <div className="mt-4 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {isLogin ? "Login to Prop Pilot" : "Sign up for Prop Pilot"}
            </h1>

            {/* Social Media Sign-In Options */}
            <div className="social-account-container mt-4 text-center">
              <div className="social-accounts flex justify-center gap-4 mt-2">
                <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition duration-300">
                  <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
                </button>
                <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition duration-300">
                  <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
                </button>
                <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition duration-300">
                  <img src={GitHubIcon} alt="GitHub" className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Login/Registration Form */}
            <form
              onSubmit={isLogin ? handleLogin : handleRegister}
              className="form mt-8 max-w-md mx-auto space-y-4"
            >
              {!isLogin && (
                // Registration fields
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <label className="relative flex-1">
                    <input
                      className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                      type="text"
                      placeholder="Firstname"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  <label className="relative flex-1">
                    <input
                      className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                      type="text"
                      placeholder="Lastname"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </div>
              )}

              {/* Email & password fields */}
              <label className="relative">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full my-4"
                  type="email"
                  placeholder="Email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="relative">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4"
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {!isLogin && (
                // Confirm password field for registration
                <label className="relative">
                  <input
                    className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-1"
                    type="password"
                    placeholder="Confirm password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              )}
              {/* Display error messages */}
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}

              {/* Submit button */}
              <div className="flex justify-center">
                <button className="submit-button submit bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
                  <img
                    src={planeIcon}
                    alt="Plane"
                    className="mr-2"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <span>{isLogin ? "Sign-In" : "Submit"}</span>
                </button>
              </div>
            </form>

            {/* Footer Text */}
            <p className="mt-6 text-xs text-gray-600 text-center">
              I agree to abide by Prop Pilot&apos;s Terms of Service and its
              Privacy Policy
            </p>

            {/* Toggle between login & registration */}
            <p className="mt-4 text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleForm}
                className="ml-1 text-blue-600 font-bold"
              >
                {isLogin ? "Create One Here" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Background image container */}
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${AuthFormImage})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
