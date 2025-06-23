import { useState, useEffect, useCallback } from "react";
import { LoaderCircle } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase.js";

import Stepper, { Step } from "./Stepper";
import RotatingText from "./RotatingText";
import ElasticSlider from "./ElasticSlider";
import ErrorPopup from "./ErrorPopup";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function FlashcardForm({ setCards, setStudySets, setActiveSetId }) {
    const [formData, setFormData] = useState({
        studySetName: "",
        language: "en",
        detailLevel: 3,
        keywords: "",
        file: null,
        studyGoal: "understanding",
    });

    const [generationMethod, setGenerationMethod] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [canProceedToNextStep, setCanProceedToNextStep] = useState(false);
    const [currentStepperStep, setCurrentStepperStep] = useState(0);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isValid = false;

        if (currentStepperStep === 0) {
            isValid = generationMethod !== null;
        }
        else if (currentStepperStep === 1) {
            isValid = formData.studySetName.trim() !== "";
        }
        else if (currentStepperStep === 2) {
            if (generationMethod === 'document' || generationMethod === 'import') {
                isValid = !!formData.file && !showErrorPopup;
            } else if (generationMethod === 'empty') {
                isValid = true;
            }
        }
        setCanProceedToNextStep(isValid);
    }, [formData, currentStepperStep, generationMethod, showErrorPopup]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files[0]) {
            const file = files[0];
            const fileName = file.name;
            const fileExtension = '.' + fileName.split('.').pop().toLowerCase();

            let allowedExtensionsForMethod = [];
            if (generationMethod === 'document') {
                allowedExtensionsForMethod = ['.pdf', '.docx', '.txt'];
            } else if (generationMethod === 'import') {
                allowedExtensionsForMethod = ['.csv', '.json'];
            }

            if (!allowedExtensionsForMethod.includes(fileExtension)) {
                setErrorMessage(`For '${generationMethod === 'document' ? 'document generation' : 'file import'}', allowed formats are: ${allowedExtensionsForMethod.join(', ')}.`);
                setShowErrorPopup(true);
                e.target.value = null;
                setFormData(prevData => ({
                    ...prevData,
                    [name]: null
                }));
                return;
            } else {
                setErrorMessage('');
                setShowErrorPopup(false);
            }
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleMethodSelect = (method) => {
        setGenerationMethod(method);
        setFormData(prevData => ({
            ...prevData,
            file: null
        }));
        setErrorMessage('');
        setShowErrorPopup(false);
    };

    const handleStepperStepChange = useCallback((newStep) => {
        setCurrentStepperStep(newStep - 1);
    }, []);

    const handleCloseErrorPopup = () => {
        setShowErrorPopup(false);
        setErrorMessage('');
    };

    const parseCsv = (csvContent, fieldSep = ',', cardSep = '\n') => {
        const realFieldSep = fieldSep.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const realCardSep = cardSep.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

        const cards = [];
        const lines = csvContent.split(realCardSep);
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                const parts = trimmedLine.split(realFieldSep).map(p =>
                    p.replace(/^"|"$/g, '').replace(/""/g, '"')
                );
                if (parts.length >= 2) {
                    cards.push({ question: parts[0], answer: parts[1] });
                }
            }
        }
        return cards;
    };

    const parseJson = (jsonContent) => {
        try {
            const data = JSON.parse(jsonContent);
            if (Array.isArray(data)) {
                return data.filter(item => item.question && item.answer);
            }
            return [];
        } catch (error) {
            console.error("Error parsing JSON:", error);
            setErrorMessage("Invalid JSON file format. Please ensure it's an array of objects with 'question' and 'answer' fields.");
            setShowErrorPopup(true);
            return [];
        }
    };

    const handleSubmit = async () => {
        const user = auth.currentUser;

        if (!user) {
            setErrorMessage("You must be logged in to create flashcards.");
            setShowErrorPopup(true);
            return;
        }

        setIsLoading(true);
        const userId = user.uid;

        try {
            let flashcardsToSave = [];
            let studySetDisplayName = formData.studySetName || `Untitled Set`;

            if (generationMethod === 'document') {
                if (!formData.file) {
                    setErrorMessage("A document file is missing for generation.");
                    setShowErrorPopup(true);
                    setIsLoading(false);
                    return;
                }
                const dataToSend = new FormData();
                dataToSend.append("file", formData.file);

                const token = await user.getIdToken();
                const response = await fetch(`${apiUrl}/upload-generate`, {
                    method: "POST",
                    body: dataToSend,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "language": formData.language,
                        "detail-level": formData.detailLevel.toString(),
                        "keywords": formData.keywords,
                        "study-goal": formData.studyGoal,
                    },
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || "Flashcard generation failed.");
                }
                const data = await response.json();
                flashcardsToSave = data.flashcards;

            } else if (generationMethod === 'empty') {
                flashcardsToSave = [
                    { question: "Example Question", answer: "Example Answer" }
                ];
                studySetDisplayName = formData.studySetName || `My First Flashcard Set`;

            } else if (generationMethod === 'import') {
                if (!formData.file) {
                    setErrorMessage("A file is missing for import.");
                    setShowErrorPopup(true);
                    setIsLoading(false);
                    return;
                }
                const file = formData.file;
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

                const fileContent = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsText(file);
                });

                if (fileExtension === '.csv') {
                    flashcardsToSave = parseCsv(fileContent, formData.csvFieldSeparator, formData.csvCardSeparator);
                } else if (fileExtension === '.json') {
                    flashcardsToSave = parseJson(fileContent);
                }

                if (flashcardsToSave.length === 0) {
                    setErrorMessage("No valid flashcards found in the imported file. Please check its format.");
                    setShowErrorPopup(true);
                    setIsLoading(false);
                    return;
                }
            }

            const studySetRef = await addDoc(collection(db, "studySets"), {
                userId,
                name: studySetDisplayName,
                createdAt: new Date(),
            });

            const addedCards = [];
            for (const card of flashcardsToSave) {
                const docRef = await addDoc(collection(db, "cards"), {
                    userId,
                    studySetId: studySetRef.id,
                    question: card.question,
                    answer: card.answer,
                    createdAt: new Date(),
                });
                addedCards.push({ id: docRef.id, ...card });
            }

            setCards(addedCards);
            setStudySets(prev => [
                ...prev,
                {
                    id: studySetRef.id,
                    name: studySetDisplayName,
                    cards: addedCards,
                },
            ]);
            setActiveSetId(studySetRef.id);

        } catch (error) {
            console.error("Flashcard creation/import error:", error.message);
            setErrorMessage(error.message || "An unexpected error occurred during flashcard creation.");
            setShowErrorPopup(true);
        } finally {
            setIsLoading(false);
        }
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
                    <h2 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 dark:bg-gradient-to-r dark:from-pink-300 dark:via-pink-400 text-center">
                        Create a New Study Set
                    </h2>
                    <Stepper
                        onFinalStepCompleted={handleSubmit}
                        onStepChange={handleStepperStepChange}
                        nextButtonText="Next"
                        backButtonText="Back"
                        disableStepIndicators={true}
                        canGoNext={canProceedToNextStep}
                    >
                        {/* Step 1: Choose Creation Method (Internal Step 0) */}
                        <Step>
                            <h3 className="text-2xl mb-6 gradient-text text-center">
                                Step 1: Choose how to create your flashcards
                            </h3>
                            <div className="space-y-4">
                                {/* Option 1: Generate from Document */}
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center p-5 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                                        ${generationMethod === "document"
                                            ? "border-pink-500 bg-pink-900/30 shadow-md text-pink-200"
                                            : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="generationMethod"
                                        value="document"
                                        checked={generationMethod === "document"}
                                        onChange={() => handleMethodSelect("document")}
                                        className="form-radio text-pink-500 w-6 h-6 mr-4 focus:ring-pink-500"
                                    />
                                    <span className="text-lg font-medium">Use AI to automaticaly generate flashcards from a document (PDF, DOCX, TXT)</span>
                                </motion.label>

                                {/* Option 2: Create Empty Set */}
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center p-5 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                                        ${generationMethod === "empty"
                                            ? "border-purple-500 bg-purple-900/30 shadow-md text-purple-200"
                                            : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="generationMethod"
                                        value="empty"
                                        checked={generationMethod === "empty"}
                                        onChange={() => handleMethodSelect("empty")}
                                        className="form-radio text-purple-500 w-6 h-6 mr-4 focus:ring-purple-500"
                                    />
                                    <span className="text-lg font-medium">Create an empty set with one example flashcard</span>
                                </motion.label>

                                {/* Option 3: Import from File */}
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center p-5 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                                        ${generationMethod === "import"
                                            ? "border-blue-500 bg-blue-900/30 shadow-md text-blue-200"
                                            : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="generationMethod"
                                        value="import"
                                        checked={generationMethod === "import"}
                                        onChange={() => handleMethodSelect("import")}
                                        className="form-radio text-blue-500 w-6 h-6 mr-4 focus:ring-blue-500"
                                    />
                                    <span className="text-lg font-medium">Import from file (CSV, JSON)</span>
                                </motion.label>
                            </div>
                        </Step>

                        {/* Step 2: Study Set Name & Conditional Details (Internal Step 1) */}
                        <Step>
                            <h3 className="text-2xl mb-2 gradient-text">
                                Step 2: Study Set Name & {generationMethod === 'document' ? 'Generation Details' : generationMethod === 'import' ? 'File Upload' : 'Confirmation'}
                            </h3>
                            <div className="space-y-2">
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
                                        placeholder="e.g., Biology Chapter 1: Photosynthesis"
                                        className={`p-3 rounded-md border w-full placeholder-gray-400 bg-gray-700 text-white ${formData.studySetName.trim() === "" ? "border-red-400 placeholder-red-400" : "border-gray-600"}`}
                                    />
                                </div>

                                {/* Conditional fields for 'document' generation */}
                                {generationMethod === 'document' && (
                                    <>
                                        <div>
                                            <label htmlFor="language" className="text-lg font-medium text-gray-200 block mb-1">
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
                                            <label htmlFor="studyGoal" className="text-lg font-medium text-gray-200 block mb-1">
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
                                            <label htmlFor="detailLevel" className="text-lg font-medium text-gray-200 block mb-1">
                                                Detail Level:
                                            </label>
                                            <ElasticSlider
                                                defaultValue={formData.detailLevel}
                                                startingValue={1}
                                                maxValue={5}
                                                isStepped={true}
                                                stepSize={1}
                                                leftIcon={<span className="text-white text-sm">General</span>}
                                                rightIcon={<span className="text-white text-sm">Detailed</span>}
                                                className="w-full"
                                                onChange={(value) => setFormData(prev => ({ ...prev, detailLevel: value }))}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Conditional fields for 'import' file upload */}
                                {generationMethod === 'import' && (
                                    <>
                                        <div>
                                            <label htmlFor="file" className="text-lg font-medium text-gray-200 block mb-2">
                                                Upload a CSV or JSON file: <span className="text-red-400">*required</span>
                                            </label>
                                            <input
                                                id="file"
                                                name="file"
                                                type="file"
                                                accept=".csv,.json"
                                                onChange={handleInputChange}
                                                className="block w-full text-sm text-gray-200
                                                    file:mr-4 file:py-3 file:px-6
                                                    file:rounded-full file:border-0
                                                    file:text-base
                                                    file:cursor-pointer
                                                    file:bg-pink-100 file:text-pink-700
                                                    hover:file:bg-pink-200 dark:file:bg-pink-800 dark:file:text-white dark:hover:file:bg-pink-600 transition duration-200 ease-in-out"
                                            />
                                            {!formData.file && (
                                                <p className="text-red-400 text-sm mt-2">
                                                    A file is required to import flashcards.
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label htmlFor="csvFieldSeparator" className="text-lg font-medium text-gray-200 block mb-2">
                                                    Question/Answer Separator (CSV):
                                                </label>
                                                <input
                                                    type="text"
                                                    id="csvFieldSeparator"
                                                    name="csvFieldSeparator"
                                                    value={formData.csvFieldSeparator}
                                                    onChange={handleInputChange}
                                                    maxLength="1"
                                                    placeholder="e.g., ,"
                                                    className="p-4 rounded-lg border border-gray-600 bg-gray-700 text-white w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="csvCardSeparator" className="text-lg font-medium text-gray-200 block mb-2">
                                                    Flashcard Separator (CSV):
                                                </label>
                                                <input
                                                    type="text"
                                                    id="csvCardSeparator"
                                                    name="csvCardSeparator"
                                                    value={formData.csvCardSeparator}
                                                    onChange={handleInputChange}
                                                    maxLength="4"
                                                    placeholder="e.g., \n"
                                                    className="p-4 rounded-lg border border-gray-600 bg-gray-700 text-white w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Message for 'empty' method */}
                                {generationMethod === 'empty' && (
                                    <p className="text-lg text-gray-300">
                                        Click 'Complete' to create an empty study set with one example flashcard. You can add more flashcards later.
                                    </p>
                                )}
                            </div>
                        </Step>

                        {/* Step 3: Keywords & File Upload (Conditional based on method) (Internal Step 2) */}
                        {((generationMethod === 'document' || generationMethod === 'import') || (generationMethod === 'empty' && currentStepperStep === 2)) && (
                            <Step>
                                <h3 className="text-2xl mb-4 gradient-text">
                                    Step 3: {generationMethod === 'document' ? 'Keywords & File Upload' : generationMethod === 'import' ? 'Confirm Import File' : 'Ready to Create?'}
                                </h3>
                                <div className="space-y-6">
                                    {generationMethod === 'document' && (
                                        <>
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
                                                    Upload a document (.pdf, .docx, .txt): <span className="text-red-400">*required</span>
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
                                                {!formData.file && (
                                                    <p className="text-red-400 text-sm mt-2">
                                                        A file is required to generate flashcards.
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {generationMethod === 'import' && (
                                        <>
                                            <p className="text-lg text-gray-300">
                                                You're about to import flashcards into a new study set called "<strong>{formData.studySetName || "Untitled Set"}</strong>" using the file "<strong>{formData.file?.name || "No file selected"}</strong>".
                                            </p>
                                            {!formData.file && (
                                                <p className="text-red-400 text-sm mt-2">
                                                    A file is required to import flashcards. Please go back to Step 2 to upload a file.
                                                </p>
                                            )}
                                        </>
                                    )}

                                    {generationMethod === 'empty' && (
                                        <p className="text-lg text-gray-300">
                                            You're about to create a new study set called "<strong>{formData.studySetName || "My First Flashcard Set"}</strong>" with one example flashcard.
                                            You can easily add more cards once it's created.
                                        </p>
                                    )}
                                </div>
                            </Step>
                        )}
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
                    <LayoutGroup>
                        <motion.p layout className="flex items-center justify-center text-6xl text-black dark:text-stone-200 font-primary">
                            <RotatingText
                                texts={["Creating", "Personalising", "Improving"]}
                                mainClassName="inline-block overflow-hidden"
                                staggerFrom={"last"}
                                initial={{ y: "100%", x: "30%", opacity: 0 }}
                                animate={{ y: 0, x: 0, opacity: 1 }}
                                exit={{ y: "-120%", x: "-10%", opacity: 0 }}
                                staggerDuration={0.025}
                                splitLevelClassName="inline-block pb-1"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                            <motion.span
                                layout
                                className="ml-3 px-4 py-2 rounded-xl bg-purple-500 text-white dark:text-black shadow-lg"
                            >
                                your flashcards
                            </motion.span>
                        </motion.p>
                    </LayoutGroup>
                    <LoaderCircle className="w-16 h-16 animate-spin dark:text-white mt-6" />
                </motion.div>
            )}
            <ErrorPopup
                message={errorMessage}
                isVisible={showErrorPopup}
                onClose={handleCloseErrorPopup}
            />
        </AnimatePresence>
    );
}
