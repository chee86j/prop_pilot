import React from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import GitHubIcon from '../assets/icons/github.svg';

const Login = () => {
  return (
    <div className="container mx-auto">
       <div className="heading text-center font-bold text-3xl text-blue-600 mt-10">Sign In</div>
      <form action="" className="form mt-8 max-w-md mx-auto">
        <input required className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="email" name="email" id="email" placeholder="E-mail" />
        <input required className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full mb-4" type="password" name="password" id="password" placeholder="Password" />
        <span className="forgot-password block text-sm text-blue-500 ml-1"><a href="#">Forgot Password ?</a></span>
        <input className="login-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md w-full" type="submit" value="Sign In" />
      </form>
      <div className="social-account-container mt-4 text-center">
        <span className="title block text-xs text-gray-600">Or Sign in with</span>
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
      <p className="signin text-center mt-4 text-sm text-gray-700">Don't have an account? <Link to="/register" className="text-blue-600">Create One Here</Link></p>
      <span className="agreement block text-center text-xs text-blue-500 mt-4"><a href="#">User Licence Agreement</a></span>
    </div>
  );
};

export default Login;
