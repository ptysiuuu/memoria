import { useState } from "react";

export default function FlashcardForm({ setCards }) {
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState("en");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/upload-generate", {
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
    };

    return (
        <form
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
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100 dark:file:bg-pink-800 dark:file:text-white dark:hover:file:bg-pink-700"
            />

            <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition cursor-pointer"
            >
                Generate Flashcards
            </button>
        </form>
    );
}
