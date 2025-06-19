import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

import ConfirmPopup from "./ConfirmPopup";


const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
    return (
        <motion.div
            ref={ref}
            data-index={index}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2, delay }}
            className="mb-4 cursor-pointer"
        >
            {children}
        </motion.div>
    );
};

const AnimatedList = ({
    cards = [],
    onItemSelect,
    enableArrowNavigation = true,
    className = '',
    itemClassName = '',
    displayScrollbar = true,
    initialSelectedIndex = -1,
    onCardDeleteSuccess
}) => {
    const listRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
    const [keyboardNav, setKeyboardNav] = useState(false);

    const [showTopArrow, setShowTopArrow] = useState(false);
    const [showBottomArrow, setShowBottomArrow] = useState(true);

    const [cardToDelete, setCardToDelete] = useState(null);

    const handleDeleteCard = async (cardId) => {
        try {
            await deleteDoc(doc(db, "cards", cardId));
            if (onCardDeleteSuccess) {
                onCardDeleteSuccess(cardId);
            }
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;

        setShowTopArrow(scrollTop > 0);
        setShowBottomArrow(scrollHeight - scrollTop > clientHeight);
    };

    useEffect(() => {
        if (listRef.current) {
            handleScroll();
        }
    }, [cards]);

    useEffect(() => {
        if (!enableArrowNavigation) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                e.preventDefault();
                setKeyboardNav(true);
                setSelectedIndex((prev) => Math.min(prev + 1, cards.length - 1));
            } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                e.preventDefault();
                setKeyboardNav(true);
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && selectedIndex < cards.length) {
                    e.preventDefault();
                    if (onItemSelect) {
                        onItemSelect(cards[selectedIndex], selectedIndex);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cards, selectedIndex, onItemSelect, enableArrowNavigation]);

    useEffect(() => {
        if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
        const container = listRef.current;
        const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
        if (selectedItem) {
            const extraMargin = 50;
            const containerScrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            const itemTop = selectedItem.offsetTop;
            const itemBottom = itemTop + selectedItem.offsetHeight;
            if (itemTop < containerScrollTop + extraMargin) {
                container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
            } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
                container.scrollTo({
                    top: itemBottom - containerHeight + extraMargin,
                    behavior: 'smooth',
                });
            }
        }
        setKeyboardNav(false);
    }, [selectedIndex, keyboardNav]);

    return (
        <>
            <div className={`relative w-full max-w-5xl mx-auto ${className} font-primary`}>
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[50px] flex items-center justify-center pointer-events-none z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={showTopArrow ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <ArrowUp size={32} className="text-violet-500 dark:text-white animate-bounce" />
                </motion.div>

                <div
                    ref={listRef}
                    className={`h-[65vh] overflow-y-auto p-4 ${displayScrollbar
                        ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060606] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]"
                        : "scrollbar-hide"
                        }`}
                    onScroll={handleScroll}
                    style={{
                        scrollbarWidth: displayScrollbar ? "thin" : "none",
                        scrollbarColor: "#222 #060606",
                    }}
                >
                    {cards.map((card, index) => (
                        <AnimatedItem
                            key={index}
                            delay={0.1}
                            index={index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => {
                                setSelectedIndex(index);
                                if (onItemSelect) {
                                    onItemSelect(card, index);
                                }
                            }}
                        >
                            <div className={`p-6 md:p-8 lg:p-10 bg-[#111] rounded-lg ${selectedIndex === index ? 'bg-[#222]' : ''} ${itemClassName} w-full h-auto min-h-[120px] flex flex-col justify-center`}>
                                <div className="flex justify-between items-start">
                                    <p className="text-white text-lg mb-2">{card.question}</p>
                                    <button
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        title="Delete card"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCardToDelete(card);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-gray-400 text-md">{card.answer}</p>
                            </div>
                        </AnimatedItem>
                    ))}
                </div>

                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[50px] flex items-center justify-center pointer-events-none z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={showBottomArrow ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <ArrowDown size={32} className="text-violet-500 dark:text-white animate-bounce" />
                </motion.div>
            </div>
            <ConfirmPopup
                isVisible={!!cardToDelete}
                message={`Are you sure you want to delete this card?\n\n"${cardToDelete?.question}"`}
                onConfirm={async () => {
                    await handleDeleteCard(cardToDelete.id);
                    setCardToDelete(null);
                }}
                onCancel={() => setCardToDelete(null)}
            />
        </>
    );
};

export default AnimatedList;