import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import GitHubIcon from '../assets/icons/github.svg';
import planeIcon from '../assets/icons/plane.svg';
import LogoIcon from '../assets/icons/logo.svg';
import AuthFormImage from '../assets/images/authform02.jpeg';


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        {/* Form Container */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          {/* Logo */}
          <div className="text-center">
            <img src={LogoIcon} alt="App Logo" className="mx-auto h-12" />
          </div>

          <div className="mt-4 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {isLogin ? 'Login to Prop Pilot' : 'Sign up for Prop Pilot'}
            </h1>

            {/* Form */}
            <form action="" className="form mt-8 max-w-md mx-auto space-y-4">
              {!isLogin && (
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <label className="relative flex-1">
                    <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="Firstname" required />
                  </label>
                  <label className="relative flex-1">
                    <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="Lastname" required />
                  </label>
                </div>
              )}
              <label className="relative">
                <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full my-4" type="email" placeholder="Email" required />
              </label>
              <label className="relative">
                <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" placeholder="Password" required />
              </label>
              {!isLogin && (
                <label className="relative">
                  <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-1" type="password" placeholder="Confirm password" required />
                </label>
              )}
              <div className="flex justify-center">
                <button className="submit-button submit">
                    <img src={planeIcon} alt="Plane" className="mr-2" style={{ width: '24px', height: '24px' }} />
                    <span>{isLogin ? 'Sign-In' : 'Submit'}</span>
                </button>
              </div>
            </form>
            <p className="mt-6 text-xs text-gray-600 text-center">
                I agree to abide by Prop Pilot's Terms of Service and its Privacy Policy
            </p>
            <p className="mt-4 text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <button onClick={toggleForm} className="text-blue-600 font-bold">
                {isLogin ? 'Create One Here' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div 
            className="w-full bg-contain bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${AuthFormImage})` }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
