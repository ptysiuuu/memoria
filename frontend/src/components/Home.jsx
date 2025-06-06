import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import FlashcardHoister from "./FlashcardHoister";
import FlashcardForm from "./FlashcardForm";


export default function Home() {
    const [cards, setCards] = useState([]);

    return (
        <div className="flex justify-center items-center max-h-[80vh] pt-30">
            <AnimatePresence mode="wait">
                {!cards || cards.length === 0 ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md flex justify-center"
                    >
                        <FlashcardForm setCards={setCards} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="stack"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-3xl flex justify-center"
                    >
                        <FlashcardHoister cards={cards} setCards={setCards} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}