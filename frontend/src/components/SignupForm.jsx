import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Chrome } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

import ErrorPopup from './ErrorPopup';

const SignupForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setErrorMessage("The passwords don't match!");
      setShowErrorPopup(true);
      return;
    }
    signIn();
  };

  const signIn = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setShowErrorPopup(true);
    }
  };

  const signInGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  }

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorMessage('');
  };

  return (
    <div className="selection:bg-indigo-500 selection:text-white">
      <div className="flex justify-center items-center h-full w-full">
        <div className="p-8 flex-1">
          <div className="mx-auto overflow-hidden">
            <div className="p-8">
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 dark:bg-gradient-to-r dark:from-pink-300 dark:via-pink-400">
                Create an Account
              </h1>

              <form className="mt-8 sm:mt-12" onSubmit={handleSubmit}>
                <div className="mt-8 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer h-10 w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-transparent"
                    placeholder="john@doe.com"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-400 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>

                <div className="mt-8 relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer h-10 w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-transparent"
                    placeholder="Password"
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-400 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>

                <div className="mt-8 relative">
                  <input
                    id="repeat-password"
                    type="password"
                    name="repeatPassword"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="peer h-10 w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 bg-transparent"
                    placeholder="Repeat Password"
                    required
                  />
                  <label
                    htmlFor="repeat-password"
                    className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-400 peer-focus:text-sm"
                  >
                    Repeat Password
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer mt-4 px-6 py-3 rounded-full font-primary font-medium bg-white text-black border border-black hover:bg-stone-300 dark:hover:bg-stone-400 transition"
                >
                  Register
                </button>
              </form>

              <button
                type="button"
                onClick={signInGoogle}
                className="mt-4 px-8 py-4 rounded-full font-medium bg-white text-black border border-black hover:bg-stone-300 dark:hover:bg-stone-400 w-full flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring focus:ring-offset-2 focus:ring-#A9B0C3 focus:ring-opacity-80 transition-colors duration-200"
              >
                <Chrome size={20} />
                <span>Register with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ErrorPopup
        message={errorMessage}
        isVisible={showErrorPopup}
        onClose={handleCloseErrorPopup}
      />
    </div>
  );
};

export default SignupForm;