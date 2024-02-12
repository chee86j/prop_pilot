import React from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import GitHubIcon from '../assets/icons/github.svg';

const Register = () => {
  return (
    <div className="container mx-auto">
      <div className="heading text-center font-bold text-3xl text-blue-600 mt-10">Register</div>
      <form action="" className="form mt-8 max-w-md mx-auto space-y-4">
        <div className="flex space-x-4 mb-4">
          <label className="relative flex-1">
            <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="" required />
            <span className="absolute left-2 top-2 text-gray-500 transition-all ease-in-out">Firstname</span>
          </label>
          <label className="relative flex-1">
            <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="" required />
            <span className="absolute left-2 top-2 text-gray-500 transition-all ease-in-out">Lastname</span>
          </label>
        </div>
        <label className="relative">
          <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="email" placeholder="" required />
          <span className="absolute left-2 top-2 text-gray-500 transition-all ease-in-out">Email</span>
        </label>
        <label className="relative">
          <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" placeholder="" required />
          <span className="absolute left-2 top-2 text-gray-500 transition-all ease-in-out">Password</span>
        </label>
        <label className="relative">
          <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" placeholder="" required />
          <span className="absolute left-2 top-2 text-gray-500 transition-all ease-in-out">Confirm password</span>
        </label>
        <button className="submit bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md w-full transition duration-300 ease-in-out">
          Submit
        </button>
      </form>
      <div className="social-account-container mt-4 text-center">
        <span className="title block text-xs text-gray-600">Or Sign up with</span>
        <div className="social-accounts flex justify-center gap-4 mt-2">
          <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:shadow-lg transition duration-300">
            <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
          </button>
          <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:shadow-lg transition duration-300">
            <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
          </button>
          <button className="social-button bg-white border border-white p-2 rounded-full shadow-md hover:shadow-lg transition duration-300">
            <img src={GitHubIcon} alt="GitHub" className="w-6 h-6" />
          </button>
        </div>
      </div>
      <p className="signin text-center mt-4 text-sm text-gray-700">Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
      <span className="agreement block text-center text-xs text-blue-500 mt-4"><a href="#">User Licence Agreement</a></span>
    </div>
  );
};

export default Register;
