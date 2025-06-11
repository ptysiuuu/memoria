import { useState } from "react";

import { Chrome } from 'lucide-react';

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", { email, password, repeatPassword });
    if (password !== repeatPassword) {
      console.log("Passwords do not match!");
    }
  };

  const handleGoogleRegister = () => {
    // Mock function for Google registration
    console.log("Initiating Google registration...");
  };

  return (
    <div className="selection:bg-indigo-500 selection:text-white">
      <div className="flex justify-center items-center h-full w-full">
        <div className="p-8 flex-1">
          <div className="mx-auto overflow-hidden">
            <div className="p-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                Create Account
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
                  className="mt-12 px-8 py-4 uppercase rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold text-center w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer transition-colors duration-200"
                >
                  Sign up
                </button>
              </form>

              <button
                type="button"
                onClick={handleGoogleRegister}
                className="mt-4 px-8 py-4 uppercase rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold text-center w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-400 focus:ring-opacity-80 cursor-pointer transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Chrome size={20} />
                <span>Register with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;