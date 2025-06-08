import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ListCollapse, SquarePen, CirclePlus } from 'lucide-react';

import FlashcardHoister from "./FlashcardHoister";
import FlashcardForm from "./FlashcardForm";
import SideDock from "./SideDock";
import StudySetsDropdown from './StudySetsDropdown';
import AddPopup from "./AddPopup";
import ErrorPopup from "./ErrorPopup";


const defaultCards1 = [
    { id: '1', question: "Co to jest React?", answer: "Biblioteka JavaScript do budowania interfejsów użytkownika." },
    { id: '2', question: "Co to jest komponent?", answer: "Niezależna i wielokrotnego użytku część interfejsu." },
    { id: '3', question: "Do czego służy useEffect?", answer: "Do wykonywania efektów ubocznych w komponentach funkcyjnych." },
    { id: '4', question: "Co to jest JSX?", answer: "Składnia rozszerzająca JavaScript, służąca do opisywania struktury UI." },
    { id: '5', question: "W czym pomaga Framer Motion?", answer: "W tworzeniu płynnych animacji w React." },
    { id: '6', question: "Czym jest Prop Drilling?", answer: "Sytuacja, w której dane są przekazywane przez wiele warstw komponentów do miejsca, gdzie są potrzebne." },
    { id: '7', question: "Co to jest useState?", answer: "Hook w React, który pozwala na dodawanie stanu do komponentów funkcyjnych." },
    { id: '8', question: "Do czego służy useRef?", answer: "Hook w React, który pozwala na tworzenie refencji do elementów DOM lub wartości, które nie wywołują ponownego renderowania." },
];

const defaultCards2 = [
    { id: '9', question: "Co to jest Virtual DOM?", answer: "Lekka kopia prawdziwego DOM, używana przez React do optymalizacji aktualizacji UI." },
    { id: '10', question: "Czym jest Context API?", answer: "Sposób na przekazywanie danych przez drzewo komponentów bez konieczności przekazywania propsów ręcznie na każdym poziomie." },
    { id: '11', question: "Jakie są korzyści z używania React?", answer: "Deklaratywny interfejs, wydajność dzięki Virtual DOM, komponentowa architektura, duża społeczność." },
    { id: '12', question: "Co to jest callback function?", answer: "Funkcja przekazywana do innej funkcji jako argument, która ma być wykonana później." },
    { id: '13', question: "Co to jest Higher-Order Component (HOC)?", answer: "Funkcja, która przyjmuje komponent jako argument i zwraca nowy komponent z dodatkową funkcjonalnością." },
    { id: '14', question: "Czym różni się 'let' od 'const'?", answer: "'let' pozwala na ponowne przypisanie wartości, 'const' tworzy stałą, której nie można zmienić po deklaracji." },
    { id: '15', question: "Co to jest asynchroniczny JavaScript?", answer: "Kod, który nie blokuje głównego wątku wykonania programu, pozwalając na kontynuowanie innych operacji." },
]

const defaultSets = [
    { name: "Podstawy Reacta", cards: defaultCards1 },
    { name: "Zaawansowany React", cards: defaultCards2 },
];

export default function HomeComponent() {
    const [cards, setCards] = useState(defaultCards1);
    const [studySets, setStudySets] = useState(defaultSets)
    const [activeSetName, setActiveSetName] = useState("Podstawy Reacta");
    const [showStudySetsDropdown, setShowStudySetsDropdown] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');

    const dockItems = [
        {
            icon: <CirclePlus size={24} />,
            label: "Add a flashcard",
            onClick: () => {
                const currentActiveSet = studySets.find(set => set.name === activeSetName);

                if (!currentActiveSet) {
                    setErrorPopupMessage("Choose a study set.");
                    setShowErrorPopup(true);
                    return;
                }

                setShowAddPopup(true);
            }
        },
        {
            icon: <ListCollapse size={24} />,
            label: "Show study sets",
            onClick: () => setShowStudySetsDropdown(prev => !prev),
        },
        {
            icon: <SquarePen size={24} />,
            label: "Add new study set",
            onClick: () => {
                setCards([]);
                setActiveSetName("");
            },
        },
    ];

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
        setErrorPopupMessage('');
    };

    const handleAddFlashcard = (newCard) => {
        setCards(prev => [...prev, newCard]);
        setStudySets(prev =>
            prev.map(set =>
                set.name === activeSetName
                    ? { ...set, cards: [...set.cards, newCard] }
                    : set
            )
        );
    };

    return (
        <div className="grid grid-cols-[auto_1fr] h-[80vh] overflow-hidden">
            {showAddPopup && (
                <AddPopup
                    onSave={handleAddFlashcard}
                    onClose={() => setShowAddPopup(false)}
                />
            )}
            <ErrorPopup
                message={errorPopupMessage}
                isVisible={showErrorPopup}
                onClose={closeErrorPopup}
                duration={5000}
            />
            <div className="relative flex justify-center items-center h-full py-4">
                <SideDock
                    items={dockItems}
                    setShowStudySetsDropdown={setShowStudySetsDropdown}
                />
            </div>

            <div className="flex justify-center items-center w-full h-full p-4 overflow-auto">
                <AnimatePresence>
                    {showStudySetsDropdown && (
                        <StudySetsDropdown
                            studySets={studySets}
                            setCards={setCards}
                            setActiveSetName={setActiveSetName}
                            onClose={() => setShowStudySetsDropdown(false)}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {!cards || cards.length === 0 ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-center w-full"
                        >
                            <FlashcardForm setCards={setCards} setStudySets={setStudySets} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="stack"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-center w-full"
                        >
                            <FlashcardHoister cards={cards} setCards={setCards} activeSetName={activeSetName} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}