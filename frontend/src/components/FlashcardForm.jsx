// FlashcardForm.jsx
import React, { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Stepper, { Step } from "./Stepper";
import RotatingText from "./RotatingText";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function FlashcardForm({ setCards, setStudySets }) {
    const [formData, setFormData] = useState({
        studySetName: "", // Przeniesione na początek
        language: "en",
        detailLevel: 3,
        keywords: "",
        studyGoal: "understanding",
        file: null, // Przeniesione na koniec
    });
    const [isLoading, setIsLoading] = useState(false);
    const [canProceedToNextStep, setCanProceedToNextStep] = useState(true); // Stan do walidacji bieżącego kroku
    const [currentStepperStep, setCurrentStepperStep] = useState(1); // Dodajemy stan do śledzenia aktualnego kroku Steppera

    // Efekt do walidacji bieżącego kroku
    useEffect(() => {
        let isValid = true;
        if (currentStepperStep === 1) {
            // Walidacja dla kroku 1: Nazwa zestawu
            isValid = formData.studySetName.trim() !== "";
        } else if (currentStepperStep === 3) {
            // Walidacja dla kroku 3 (gdzie teraz będzie plik)
            isValid = !!formData.file;
        }
        // Możesz dodać walidację dla innych kroków, jeśli potrzebujesz
        setCanProceedToNextStep(isValid);
    }, [formData, currentStepperStep]); // Zależności: formData i currentStepperStep

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleDetailLevelChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            detailLevel: Number(value)
        }));
    };

    const handleStepChange = (newStep) => {
        setCurrentStepperStep(newStep);
    };

    const handleSubmit = async () => {
        if (!formData.file) {
            alert("File is missing. Cannot generate flashcards.");
            return;
        }
        setIsLoading(true);

        const dataToSend = new FormData();
        dataToSend.append("file", formData.file);

        try {
            const response = await fetch(`${apiUrl}/upload-generate`, {
                method: "POST",
                body: dataToSend,
                headers: {
                    "language": formData.language,
                    "detail-level": formData.detailLevel.toString(),
                    "keywords": formData.keywords,
                    "study-goal": formData.studyGoal,
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
                    name: formData.studySetName || `Untitled Set ${prevSets.length + 1}`,
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
                <motion.div
                    key="form-stepper"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 items-center w-full max-w-4xl font-primary"
                >
                    <Stepper
                        onFinalStepCompleted={handleSubmit}
                        onStepChange={handleStepChange}
                        nextButtonText="Next"
                        backButtonText="Back"
                        disableStepIndicators={true}
                        canGoNext={canProceedToNextStep}
                    >
                        <Step>
                            <h3 className="text-2xl mb-4 text-gray-200 dark:text-gray-200">
                                Step 1: Study Set Name
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="studySetName" className="text-lg font-medium text-gray-200 block mb-1">
                                        Study Set Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="studySetName"
                                        name="studySetName"
                                        value={formData.studySetName}
                                        onChange={handleInputChange}
                                        placeholder={
                                            currentStepperStep === 1 && formData.studySetName.trim() === ""
                                                ? "Study Set Name is required"
                                                : "e.g., Biology Chapter 1: Photosynthesis"
                                        }
                                        className={`p-3 rounded-md border w-full placeholder-gray-400 bg-gray-700 text-white
        ${currentStepperStep === 1 && formData.studySetName.trim() === ""
                                                ? "border-red-400 placeholder-red-400"
                                                : "border-gray-600"}`}
                                    />
                                    <span className="text-red-400">*required</span>
                                </div>
                            </div>
                        </Step>

                        <Step>
                            <h3 className="text-2xl mb-4 text-gray-200 dark:text-gray-200">
                                Step 2: Language & Goal
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="language" className="text-lg font-medium text-gray-200 block mb-2">
                                        Select a language:
                                    </label>
                                    <select
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-md border border-gray-600 bg-gray-700 text-white w-full"
                                    >
                                        <option value="english">English</option>
                                        <option value="polish">Polish</option>
                                        <option value="deutsch">German</option>
                                        <option value="spanish">Spanish</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="studyGoal" className="text-lg font-medium text-gray-200 block mb-2">
                                        Study Goal:
                                    </label>
                                    <select
                                        id="studyGoal"
                                        name="studyGoal"
                                        value={formData.studyGoal}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-md border border-gray-600 bg-gray-700 text-white w-full"
                                    >
                                        <option value="understanding">Understanding (focus on concepts)</option>
                                        <option value="memorization">Memorization (focus on facts & definitions)</option>
                                        <option value="critical_thinking">Critical Thinking (focus on analysis)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="detailLevel" className="text-lg font-medium text-gray-200 block mb-2">
                                        Detail Level:
                                    </label>
                                    <input
                                        type="range"
                                        id="detailLevel"
                                        name="detailLevel"
                                        min="1"
                                        max="5"
                                        step="1"
                                        value={formData.detailLevel}
                                        onChange={(e) => handleDetailLevelChange(e.target.value)}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                                        <span>1 (General)</span>
                                        <span>2</span>
                                        <span className="mx-7">3 (Standard)</span>
                                        <span>4</span>
                                        <span>5 (Detailed)</span>
                                    </div>
                                </div>
                            </div>
                        </Step>

                        <Step>
                            <h3 className="text-2xl mb-4 text-gray-200 dark:text-gray-200">
                                Step 3: Keywords & File Upload
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="keywords" className="text-lg font-medium text-gray-200 block mb-2">
                                        Keywords/Topics (optional, comma-separated):
                                    </label>
                                    <input
                                        type="text"
                                        id="keywords"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Photosynthesis, Cell structure, DNA"
                                        className="p-3 rounded-md border border-gray-600 bg-gray-700 text-white w-full placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="file" className="text-lg font-medium text-gray-200 block mb-2">
                                        Upload a file: <span className="text-red-400">*required</span>
                                    </label>
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept=".pdf,.docx,.txt"
                                        onChange={handleInputChange}
                                        className="block w-full text-sm text-gray-200
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm
                                            file:cursor-pointer
                                            file:bg-pink-50 file:text-pink-700
                                            hover:file:bg-pink-200 dark:file:bg-pink-800 dark:file:text-white dark:hover:file:bg-pink-600"
                                    />
                                    {currentStepperStep === 3 && !formData.file && (
                                        <p className="text-red-400 text-sm mt-2">
                                            A file is required to generate flashcards.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Step>
                    </Stepper>
                </motion.div>
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
                        mainClassName="px-2 sm:px-2 md:px-3 text-6xl dark:text-white text-center dark:text-white py-0.5 sm:py-5 md:py-10 justify-center rounded-lg font-primary"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                    <LoaderCircle className="w-16 h-16 animate-spin dark:text-white mt-6" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}