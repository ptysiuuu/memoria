import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from "lucide-react";

export default function ExportPopup({ studySets, onClose, onError }) {
    const [selectedSet, setSelectedSet] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('csv');
    const [selectedSeparator, setSelectedSeparator] = useState(',');
    const [cardSeparator, setCardSeparator] = useState('\n');
    const [customFieldSeparator, setCustomFieldSeparator] = useState('');
    const [customCardSeparator, setCustomCardSeparator] = useState('');

    const getSeparator = (preset, custom) => custom !== '' ? custom : preset;

    const exportAsCsv = (cards, setName, fieldSep, cardSep) => {
        if (!cards || cards.length === 0) {
            onError('The selected set has no flashcards to export.');
            return;
        }

        const actualFieldSep = getSeparator(fieldSep, customFieldSeparator);
        const actualCardSep = getSeparator(cardSep, customCardSeparator);

        const rows = cards.map(card => {
            const q = `"${card.question.replace(/"/g, '""')}"`;
            const a = `"${card.answer.replace(/"/g, '""')}"`;
            return [q, a].join(actualFieldSep);
        });

        const csvContent = rows.join(actualCardSep);

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${setName || 'flashcards'}_export.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportAsJson = (cards, setName) => {
        if (!cards || cards.length === 0) {
            onError('The selected set has no flashcards to export.');
            return;
        }

        const dataToExport = cards.map(card => ({
            question: card.question,
            answer: card.answer
        }));

        const jsonContent = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${setName || 'flashcards'}_export.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = () => {
        const selectedStudySet = studySets.find(set => set.name === selectedSet);
        if (!selectedStudySet) {
            onError('Please select a flashcard set.');
            return;
        }

        if (selectedFormat === 'csv') {
            exportAsCsv(selectedStudySet.cards, selectedStudySet.name, selectedSeparator, cardSeparator);
        } else {
            exportAsJson(selectedStudySet.cards, selectedStudySet.name);
        }

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
                    <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Export Flashcards</h2>

                    <div className="space-y-4">
                        {/* SET SELECTION */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                                Select a set:
                            </label>
                            <select
                                value={selectedSet}
                                onChange={(e) => setSelectedSet(e.target.value)}
                                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-800"
                            >
                                <option value="" disabled>-- Select a set --</option>
                                {studySets.map((set) => (
                                    <option key={set.name} value={set.name}>
                                        {set.name} ({set.cards.length} flashcards)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FORMAT */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                                Select export format:
                            </label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="csv"
                                        checked={selectedFormat === 'csv'}
                                        onChange={() => setSelectedFormat('csv')}
                                        className="form-radio text-pink-600"
                                    />
                                    <span className="ml-2 text-zinc-700 dark:text-zinc-300">CSV</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="json"
                                        checked={selectedFormat === 'json'}
                                        onChange={() => setSelectedFormat('json')}
                                        className="form-radio text-pink-600"
                                    />
                                    <span className="ml-2 text-zinc-700 dark:text-zinc-300">JSON</span>
                                </label>
                            </div>
                        </div>

                        {/* CSV OPTIONS */}
                        {selectedFormat === 'csv' && (
                            <>
                                {/* FIELD SEPARATOR */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                                        Separator between question and answer:
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            [',', 'Comma'],
                                            [';', 'Semicolon'],
                                            ['|', 'Pipe'],
                                            [':', 'Colon'],
                                        ].map(([val, label]) => (
                                            <label key={val} className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="field-separator"
                                                    value={val}
                                                    checked={selectedSeparator === val}
                                                    onChange={() => setSelectedSeparator(val)}
                                                    className="form-radio text-pink-600"
                                                />
                                                <span className="ml-2 text-zinc-700 dark:text-zinc-300">{label} ({val})</span>
                                            </label>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Custom separator (optional)"
                                        value={customFieldSeparator}
                                        onChange={(e) => setCustomFieldSeparator(e.target.value)}
                                        className="mt-2 w-full rounded-md border px-3 py-2 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600"
                                    />
                                </div>

                                {/* CARD SEPARATOR */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                                        Separator between flashcards:
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            ['\n', 'Newline (\\n)'],
                                            ['\n\n', 'Double Newline (\\n\\n)'],
                                            ['---', 'Dashes (---)'],
                                        ].map(([val, label]) => (
                                            <label key={val} className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="card-separator"
                                                    value={val}
                                                    checked={cardSeparator === val}
                                                    onChange={() => setCardSeparator(val)}
                                                    className="form-radio text-pink-600"
                                                />
                                                <span className="ml-2 text-zinc-700 dark:text-zinc-300">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Custom flashcard separator (optional)"
                                        value={customCardSeparator}
                                        onChange={(e) => setCustomCardSeparator(e.target.value)}
                                        className="mt-2 w-full rounded-md border px-3 py-2 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600"
                                    />
                                </div>
                            </>
                        )}

                        {/* EXPORT BUTTON */}
                        <button
                            onClick={handleExport}
                            className="w-full mt-4 px-6 py-3 cursor-pointer rounded-xl font-primary font-medium text-pink-600 border border-pink-400 hover:bg-pink-300 dark:hover:bg-pink-900 transition"
                        >
                            Export
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
