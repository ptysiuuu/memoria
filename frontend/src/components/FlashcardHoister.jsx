import { useState } from "react";

import { Switch } from '@headlessui/react';
import { motion, AnimatePresence } from "framer-motion";

import Stack from "./Stack";
import AnimatedList from "./AnimatedList";
import EditPopup from "./EditPopup";

export default function FlashcardHoister({ cards, setCards, activeSetName }) {
    const [enabled, setEnabled] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedCardToEdit, setSelectedCardToEdit] = useState(null);

    const handleSwitchChange = (newEnabledState) => {
        setEnabled(newEnabledState);
    };

    const currentMode = enabled ? "learn" : "list";

    const handleEditFlashcard = (card) => {
        setSelectedCardToEdit(card);
        setIsEditPopupOpen(true);
    };

    const handleCloseEditPopup = () => {
        setIsEditPopupOpen(false);
        setSelectedCardToEdit(null);
    };

    const handleSaveEditedFlashcard = (updatedCard) => {
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === updatedCard.id ? updatedCard : card
            )
        );
        handleCloseEditPopup();
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center font-primary">
            {activeSetName && (
                <h2 className="text-2xl font-primary mb-4 text-gray-800 dark:text-gray-200 text-center">
                    Set: {activeSetName}
                </h2>
            )}
            <div className="mb-2 flex items-center space-x-4">
                <span className={`text-lg font-medium ${!enabled ? 'text-green-700' : 'text-gray-400'}`}>
                    Mode: List
                </span>

                <Switch
                    checked={enabled}
                    onChange={handleSwitchChange}
                    className="group inline-flex cursor-pointer h-6 w-11 items-center rounded-full bg-green-700 transition data-[checked]:bg-blue-600"
                >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                </Switch>

                <span className={`text-lg font-medium ${enabled ? 'text-blue-600' : 'text-gray-400'}`}>
                    Mode: Learn
                </span>
            </div>

            <AnimatePresence mode="wait">
                {currentMode === "list" ? (
                    <motion.div
                        key="list-mode"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <AnimatedList
                            cards={cards}
                            onItemSelect={handleEditFlashcard}
                            displayScrollbar={false}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="learn-mode"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Stack cards={cards} setCards={setCards} />
                    </motion.div>
                )}
            </AnimatePresence>

            {isEditPopupOpen && selectedCardToEdit && (
                <EditPopup
                    initialData={selectedCardToEdit}
                    onSave={handleSaveEditedFlashcard}
                    onClose={handleCloseEditPopup}
                />
            )}
        </div>
    );
}