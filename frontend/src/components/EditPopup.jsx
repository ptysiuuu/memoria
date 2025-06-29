import { X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

export default function EditPopup({ initialData, onSave, onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const question = e.target.elements.question.value.trim();
        const answer = e.target.elements.answer.value.trim();

        if (!question || !answer) return;

        onSave({ ...initialData, question, answer });
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center font-primary"
            >
                <motion.div
                    initial={{ y: -50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 120 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-full max-w-md relative shadow-2xl border dark:border-zinc-700"
                >
                    <button
                        className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 cursor-pointer"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Edit Flashcard</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="question"
                                className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300"
                            >
                                Question
                            </label>
                            <input
                                id="question"
                                name="question"
                                defaultValue={initialData.question}
                                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-800"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="answer"
                                className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300"
                            >
                                Answer
                            </label>
                            <textarea
                                id="answer"
                                name="answer"
                                defaultValue={initialData.answer}
                                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-800"
                                rows={3}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer mt-4 px-6 py-3 rounded-xl font-primary font-medium text-pink-600 border border-pink-400 hover:bg-pink-300 dark:hover:bg-pink-900 transition"
                        >
                            Save
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
