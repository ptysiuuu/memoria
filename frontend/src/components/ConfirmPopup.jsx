import { X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmPopup({ isVisible, message, onConfirm, onCancel }) {
    if (!isVisible) return null;

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
                        onClick={onCancel}
                    >
                        <X />
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Confirm Action</h2>
                    <p className="text-zinc-700 dark:text-zinc-300 mb-6">{message}</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 cursor-pointer rounded-lg border border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 cursor-pointer rounded-lg border border-pink-400 text-pink-600 hover:bg-pink-300 dark:hover:bg-pink-900 transition"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
