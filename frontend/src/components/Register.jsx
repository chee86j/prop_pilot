import React from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import GitHubIcon from '../assets/icons/github.svg';
import planeIcon from '../assets/icons/plane.svg';

const Register = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="heading text-center font-bold text-3xl text-blue-600 mt-0">Register</div>
      
      <form action="" className="form mt-8 max-w-md mx-auto space-y-4">
      <h1 className="text-center text-gray-400 text-lg mt-4">Signup now and get full access to our app.</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <label className="relative flex-1">
            <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="Firstname" required />
          </label>
          <label className="relative flex-1">
            <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full" type="text" placeholder="Lastname" required />
          </label>
        </div>
        <label className="relative">
          <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full my-4" type="email" placeholder="Email" required />
        </label>
        <label className="relative">
          <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" placeholder="Password" required />
        </label>
        <label className="relative">
          <input className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-1" type="password" placeholder="Confirm password" required />
        </label>
        <div className="flex justify-center">
            <button className="submit-button submit">
                <img src={planeIcon} alt="Plane" className="mr-2" style={{ width: '64px', height: '24px' }} />
                <span>Submit to Register</span>
            </button>
        </div>



      </form>
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
      <p className="signin text-center mt-4 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
      <span className="agreement block text-center text-xs text-blue-500 mt-4"><a href="#">User Licence Agreement</a></span>
    </div>
  );
};

export default Register;
