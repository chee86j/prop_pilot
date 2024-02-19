import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleIcon from "../assets/icons/google.svg";
import FacebookIcon from "../assets/icons/facebook.svg";
import GitHubIcon from "../assets/icons/github.svg";
import PlaneIcon from "../assets/icons/plane.svg";
import LogoIcon from "../assets/icons/logo.svg";
import AuthFormImage from "../assets/images/authform02.jpeg";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const currentTime = new Date().getTime();
        const expiryTime = currentTime + 1 * 24 * 60 * 60 * 1000; // token expires after 1 day locally
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("expiryTime", expiryTime);
        navigate("/propertylist");
      } else {
        setErrorMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login.");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const currentTime = new Date().getTime();
        const expiryTime = currentTime + 1 * 24 * 60 * 60 * 1000;
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("expiryTime", expiryTime);
        navigate("/home");
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center flex items-center justify-center">
            <Link
              to="/home"
              className="text-gray-800 text-3xl font-bold hover:text-blue-600 flex items-center"
            >
              <img
                src={LogoIcon}
                alt="Logo"
                className="mr-2"
                style={{ width: "76px", height: "76px" }}
              />
              Prop Pilot
            </Link>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {isLogin ? "Login to Prop Pilot" : "Sign up for Prop Pilot"}
            </h1>

            <form
              onSubmit={isLogin ? handleLogin : handleRegister}
              className="form mt-8 max-w-md mx-auto space-y-4"
            >
              {!isLogin && (
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <label className="relative flex-1">
                    <input
                      className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                      type="text"
                      placeholder="Firstname"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
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
                      autoComplete="family-name"
                    />
                  </label>
                </div>
              )}

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
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}

              <div className="flex justify-center">
                <button className="submit-button submit bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
                  <img
                    src={PlaneIcon}
                    alt="Plane"
                    className="mr-2"
                    style={{ width: "128px", height: "24px" }}
                  />
                  <span className="">{isLogin ? "Sign-In" : "Submit"}</span>
                </button>
              </div>
            </form>

            {isLogin && (
              <div className="social-account-container mt-7 text-center">
                <p className="text-xs text-gray-600 text-center mb-4">
                  Or Sign In with
                </p>
                <div className="social-accounts flex justify-center gap-4">
                  <button className="social-button bg-white border border-white p-2 rounded-full shadow-lg hover:scale-110 hover:shadow-lg transition duration-300">
                    <img
                      src={GoogleIcon}
                      alt="Google"
                      className="w-8 h-8 md:w-10 h-10"
                    />
                  </button>
                  <button className="social-button bg-white border border-white p-2 rounded-full shadow-lg hover:scale-110 hover:shadow-lg transition duration-300">
                    <img
                      src={FacebookIcon}
                      alt="Facebook"
                      className="w-8 h-8 md:w-10 h-10"
                    />
                  </button>
                  <button className="social-button bg-white border border-white p-2 rounded-full shadow-lg hover:scale-110 hover:shadow-lg transition duration-300">
                    <img
                      src={GitHubIcon}
                      alt="GitHub"
                      className="w-8 h-8 md:w-10 h-10"
                    />
                  </button>
                </div>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleForm}
                className="text-xl ml-1 text-blue-600 font-semi md:text-lg hover:underline focus:outline-none"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>

            <p className="mt-7 text-xs text-gray-600 text-center">
              I agree to abide by Prop Pilot&apos;s <br /> Terms of Service &
              its Privacy Policy
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 xl:w-5/12 flex-1 text-center hidden lg:flex">
          <div
            className="w-full bg-contain bg-center bg-no-repeat h-full"
            style={{ backgroundImage: `url(${AuthFormImage})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
