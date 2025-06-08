import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import RotatingText from "./RotatingText";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function FlashcardForm({ setCards, setStudySets }) {
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState("en");
    const [detailLevel, setDetailLevel] = useState(3);
    const [keywords, setKeywords] = useState("");
    const [studyGoal, setStudyGoal] = useState("understanding");
    const [studySetName, setStudySetName] = useState("");
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
                    "detail-level": detailLevel.toString(),
                    "keywords": keywords,
                    "study-goal": studyGoal,
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
            setStudySets(prevSets => [
                ...prevSets,
                {
                    name: studySetName || `Untitled Set ${prevSets.length + 1}`,
                    cards: cardsWithIds,
                }
            ]);
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
                    className="flex flex-col gap-6 mb-25 items-center bg-white/60 dark:bg-gray-800/60 p-10 rounded-xl shadow-lg w-full max-w-4xl font-primary"
                >
                    <div className="w-full">
                        <label htmlFor="study-set-name-input" className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
                            Study Set Name:
                        </label>
                        <input
                            type="text"
                            id="study-set-name-input"
                            value={studySetName}
                            onChange={(e) => setStudySetName(e.target.value)}
                            placeholder="e.g., Biology Chapter 1: Photosynthesis"
                            className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="language-select" className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
                                Select a language:
                            </label>
                            <select
                                id="language-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full"
                            >
                                <option value="english">English</option>
                                <option value="polish">Polish</option>
                                <option value="deutsch">German</option>
                                <option value="spanish">Spanish</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="study-goal-select" className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
                                Study Goal:
                            </label>
                            <select
                                id="study-goal-select"
                                value={studyGoal}
                                onChange={(e) => setStudyGoal(e.target.value)}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full"
                            >
                                <option value="understanding">Understanding (focus on concepts)</option>
                                <option value="memorization">Memorization (focus on facts & definitions)</option>
                                <option value="critical_thinking">Critical Thinking (focus on analysis)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="detail-level-slider" className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
                                Detail Level:
                            </label>
                            <input
                                type="range"
                                id="detail-level-slider"
                                min="1"
                                max="5"
                                step="1"
                                value={detailLevel}
                                onChange={(e) => setDetailLevel(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span>1 (General)</span>
                                <span>2</span>
                                <span>3 (Standard)</span>
                                <span>4</span>
                                <span>5 (Detailed)</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="keywords-input" className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
                                Keywords/Topics (optional, comma-separated):
                            </label>
                            <input
                                type="text"
                                id="keywords-input"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., Photosynthesis, Cell structure, DNA"
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="file-upload" className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
                            Upload a file:
                        </label>
                        <input
                            id="file-upload"
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
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition cursor-pointer text-lg w-full"
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
                    className="flex flex-col items-center justify-center mb-50"
                >
                    <RotatingText
                        texts={['Creating', 'Your', 'Flashcards']}
                        mainClassName="px-2 sm:px-2 md:px-3 text-6xl dark:text-white text-center text-black py-0.5 sm:py-5 md:py-10 justify-center rounded-lg font-primary"
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
