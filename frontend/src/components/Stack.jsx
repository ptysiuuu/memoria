import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { useState } from "react";

import CardRotate from "./CardRotate";
import EditPopup from "./EditPopup";

export default function Stack({
    cards,
    setCards,
    sensitivity = 200,
    cardDimensions = { width: 808, height: 408 },
    sendToBackOnClick = false,
}) {
    const [flippedCards, setFlippedCards] = useState({});
    const [editingCard, setEditingCard] = useState(null);

    const updateCard = (id, newData) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, ...newData } : card
            )
        );
    };

    const toggleFlip = (id) => {
        setFlippedCards((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const sendToBack = (id) => {
        setCards((prev) => {
            const newCards = [...prev];
            const index = newCards.findIndex((card) => card.id === id);
            const [card] = newCards.splice(index, 1);
            newCards.unshift(card);
            return newCards;
        });
    };

    return (
        <div
            className="relative font-primary"
            style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
                perspective: 1000,
            }}
        >
            {cards.map((card, index) => {
                const isFlipped = flippedCards[card.id] || false;

                return (
                    <CardRotate
                        key={card.id}
                        onSendToBack={() => sendToBack(card.id)}
                        sensitivity={sensitivity}
                    >
                        <motion.div
                            className="relative w-full h-full"
                            onClick={() => {
                                toggleFlip(card.id);
                                if (sendToBackOnClick) sendToBack(card.id);
                            }}
                            animate={{
                                rotateY: isFlipped ? 180 : 0,
                            }}
                            transition={{
                                duration: 0.4,
                                ease: "easeInOut",
                            }}
                            style={{
                                width: cardDimensions.width,
                                height: cardDimensions.height,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* Front */}
                            <div
                                className="absolute w-full h-full bg-white dark:bg-violet-950 rounded-2xl border-2 border-black dark:border-white flex items-center justify-center p-4 shadow-lg text-3xl text-gray-800 dark:text-white"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <div className="absolute top-2 left-4 text-sm text-gray-400 dark:text-gray-200">
                                    Question
                                </div>
                                <button
                                    className="absolute top-2 right-2 z-10 bg-stone-200 hover:bg-stone-300 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-full p-1 shadow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCard(card);
                                    }}
                                >
                                    <Pencil className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                                </button>
                                {card.question}
                            </div>

                            {/* Back */}
                            <div
                                className="absolute w-full h-full bg-gray-100 dark:bg-violet-950 rounded-2xl border-2 dark:border-white border-black flex items-center justify-center p-4 shadow-lg text-gray-800 dark:text-white text-3xl font-medium"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                <div className="absolute top-2 left-4 text-sm text-gray-500 dark:text-gray-200">
                                    Answer
                                </div>
                                <button
                                    className="absolute top-2 right-4 z-10 bg-stone-200 hover:bg-stone-300 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-full p-1 shadow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCard(card);
                                    }}
                                >
                                    <Pencil className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                                </button>
                                {card.answer}
                            </div>
                        </motion.div>
                    </CardRotate>
                );
            })}
            {editingCard && (
                <EditPopup
                    isOpen={!!editingCard}
                    initialData={editingCard}
                    onClose={() => setEditingCard(null)}
                    onSave={(newData) => updateCard(editingCard.id, newData)}
                />
            )}
        </div>
    );
}
