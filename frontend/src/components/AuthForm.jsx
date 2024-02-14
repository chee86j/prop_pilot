import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import GitHubIcon from '../assets/icons/github.svg';
import planeIcon from '../assets/icons/plane.svg';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mx-auto p-6">
      <div className="tabs flex justify-center mb-8">
        <button className={`tab ${isLogin ? 'text-blue-600' : 'text-gray-500'} text-2xl font-bold mr-4`} onClick={() => setIsLogin(true)}>Sign In</button>
        <button className={`tab ${!isLogin ? 'text-blue-600' : 'text-gray-500'} text-2xl font-bold`} onClick={() => setIsLogin(false)}>Register</button>
      </div>

      {isLogin ? (

        // Login Form
        <div>
          <form action="" className="form mt-8 max-w-md mx-auto">
            <input required className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="email" name="email" id="email" placeholder="E-mail" />
            <input required className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" name="password" id="password" placeholder="Password" />
            <span className="forgot-password block text-sm text-blue-500 ml-1 mb-3"><a href="#">Forgot Password?</a></span>
            <div className="flex justify-center">
              <button className="submit-button submit">
                <img src={planeIcon} alt="Plane" type="submit" className="mr-2" style={{ width: '64px', height: '24px' }} />
                <span>Submit</span>
              </button>
            </div>
          </form>

          <div className="social-account-container mt-4 text-center">
            {/* Social Login Buttons */}
            <span className="title block text-xs text-gray-600">Or Sign in with</span>
            <div className="social-accounts flex justify-center gap-4 mt-2">
              {/* Google Login Button */}
              <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition duration-300">
                <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
              </button>
              {/* Facebook Login Button */}
              <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition duration-300">
                <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
              </button>
              {/* GitHub Login Button */}
              <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition duration-300">
                <img src={GitHubIcon} alt="GitHub" className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="signin text-center mt-4 text-sm text-gray-700">Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-600">Create One Here</button></p>
        </div>
      ) : (

        // Registration Form
        <div>
          <form action="" className="form mt-8 max-w-md mx-auto space-y-4">
            <h1 className="text-center text-gray-400 text-lg mt-4">Signup now and get full access to our app.</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Firstname Input */}
              <label className="relative flex-1">
                <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="Firstname" required />
              </label>
              {/* Lastname Input */}
              <label className="relative flex-1">
                <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="Lastname" required />
              </label>
            </div>
            {/* Email Input */}
            <label className="relative">
              <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full my-4" type="email" placeholder="Email" required />
            </label>
            {/* Password Input */}
            <label className="relative">
              <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" placeholder="Password" required />
            </label>
            {/* Confirm Password Input */}
            <label className="relative">
              <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-1" type="password" placeholder="Confirm password" required />
            </label>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button className="submit-button submit">
                <img src={planeIcon} alt="Plane" className="mr-2" style={{ width: '64px', height: '24px' }} />
                <span>Submit</span>
              </button>
            </div>
          </form>

          {/* Shared Social Login Buttons */}
         <div className="social-account-container mt-4 text-center">
        <span className="title block text-sm text-gray-500">Or Sign up with</span>
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
          <p className="signin text-center mt-4 text-sm text-gray-500">Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-600">Sign in</button></p>
        </div>
      )}

      <span className="agreement block text-center text-xs text-blue-500 mt-4"><a href="#">User Licence Agreement</a></span>
    </div>
  );
};

export default AuthForm;
