import { use, useState } from "react";
import { useNavigate } from "react-router";

import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Chrome } from "lucide-react";

const SigninForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    }
    catch (error) {
      console.log(error);
    }
  }

  const signInGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="selection:bg-gray-700 selection:text-white">
      <div className="flex justify-center items-center">
        <div className="p-8 flex-1">
          <div className="mx-auto overflow-hidden">
            <div className="p-8">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 dark:bg-gradient-to-r dark:from-pink-300 dark:via-pink-400">
                Welcome back!
              </h1>

              <form className="mt-12" onSubmit={signIn}>
                <div className="relative">
                  <input
                    id="signin-email"
                    name="email"
                    type="text"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                    placeholder="john@doe.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email address
                  </label>
                </div>
                <div className="mt-10 relative">
                  <input
                    id="signin-password"
                    type="password"
                    name="password"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>

                <input
                  type="submit"
                  value="Sign in"
                  className="w-full cursor-pointer mt-4 px-6 py-3 rounded-full font-primary font-medium bg-white text-black border border-black hover:bg-stone-300 dark:hover:bg-stone-400 transition"
                />
              </form>
              <button
                type="button"
                onClick={signInGoogle}
                className="mt-4 px-8 py-4 rounded-full font-medium bg-white text-black border border-black hover:bg-stone-300 dark:hover:bg-stone-400 w-full flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring focus:ring-offset-2 focus:ring-#A9B0C3 focus:ring-opacity-80 transition-colors duration-200"
              >
                <Chrome size={20} />
                <span>Sign in with google</span>
              </button>
              <button
                onClick={handleResetPassword}
                type="button"
                className="mt-4 block text-sm text-center cursor-pointer font-medium text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;