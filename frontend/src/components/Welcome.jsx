import { Link } from "react-router-dom";
import Threads from "./Threads";
import Magnet from "./Magnet"

export default function Welcome() {
    return (
        <div className="relative w-full min-h-[80vh] overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Threads
                    color={[0.96, 0.44, 0.71]}
                    amplitude={2.0}
                    distance={0.3}
                    enableMouseInteraction={false}
                    className="w-full h-full"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center
                px-6 py-6 justify-center min-h-[80vh]
                transition-colors duration-500">

                <div className="flex items-center space-x-4 mb-10">
                    <h1 className="text-6xl font-bold text-transparent bg-clip-text
                        bg-gradient-to-r font-primary
                        from-pink-400 via-fuchsia-500 to-purple-600
                        dark:from-pink-300 dark:via-fuchsia-400 dark:to-purple-500">
                        Memoria
                    </h1>
                </div>

                <h2 className="text-3xl md:text-4xl text-center mb-6 text-gray-800 dark:text-gray-100 opacity-0 font-primary animate-fade-in-delay-1">
                    Welcome to the place which will help you remember
                </h2>
                <p className="text-lg md:text-xl text-center max-w-xl text-gray-600 dark:text-gray-300 opacity-0 mb-10 font-primary animate-fade-in-delay-3">
                    Create flashcards with just a few simple, intuitive steps and learn everything you ever dreamed of.
                </p>

                <div className="flex gap-6">
                    <Link to="/auth">
                        <Magnet magnetStrength={8}>
                            <button className="px-6 py-3 cursor-pointer rounded-xl font-medium text-white bg-pink-500 hover:bg-pink-600 opacity-0 shadow-lg transition font-primary animate-fade-in-delay-5">
                                Get Started
                            </button>
                        </Magnet>
                    </Link>
                    <Link to="/about">
                        <button className="px-6 py-3 cursor-pointer rounded-xl font-primary font-medium text-pink-600 border border-pink-400 opacity-0 hover:bg-pink-100 animate-fade-in-delay-5 dark:hover:bg-pink-900 transition">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
