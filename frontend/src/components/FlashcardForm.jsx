import { useState } from "react";

import { LoaderCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import RotatingText from "../components/RotatingText";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function FlashcardForm({ setCards }) {
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState("en");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${apiUrl}/upload-generate`, {
                method: "POST",
                body: formData,
                headers: {
                    "language": language,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Upload failed");
            }

            const data = await response.json();
            const cardsWithIds = data.flashcards.map((card, index) => ({
                id: index + 1,
                ...card,
            }));
            setCards(cardsWithIds);
        } catch (error) {
            console.error("Upload error:", error.message);
        }
        setIsLoading(false);
    };

    return (
        <AnimatePresence mode="wait">
            {!isLoading ? (
                <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 items-center bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl shadow-lg w-full max-w-md font-primary"
                >
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-200">
                        Select a language:
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="english">English</option>
                        <option value="polish">Polish</option>
                        <option value="deutsch">German</option>
                        <option value="spanish">Spanish</option>
                    </select>

                    <label className="text-lg font-medium text-gray-700 dark:text-gray-200 w-full text-left">
                        Upload a file:
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm
            file:cursor-pointer
            file:bg-pink-50 file:text-pink-700
            hover:file:bg-pink-200 dark:file:bg-pink-800 dark:file:text-white dark:hover:file:bg-pink-600"
                    />

                    <button
                        type="submit"
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition cursor-pointer"
                    >
                        Generate Flashcards
                    </button>
                </motion.form>
            ) : (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center"
                >
                    <RotatingText
                        texts={['Creating', 'Your', 'Flashcards']}
                        mainClassName="px-2 sm:px-2 md:px-3 text-6xl dark:text-white text-center text-black overflow-hidden py-0.5 sm:py-5 md:py-20 justify-center rounded-lg font-primary"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                    <LoaderCircle className="w-16 h-16 animate-spin text-black dark:text-white mt-6" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
