import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import FlashcardHoister from "./FlashcardHoister";
import FlashcardForm from "./FlashcardForm";

const defaultCards = [
    { id: '1', question: "Co to jest React?", answer: "Biblioteka JavaScript do budowania interfejsów użytkownika." },
    { id: '2', question: "Co to jest komponent?", answer: "Niezależna i wielokrotnego użytku część interfejsu." },
    { id: '3', question: "Do czego służy useEffect?", answer: "Do wykonywania efektów ubocznych w komponentach funkcyjnych." },
    { id: '4', question: "Co to jest JSX?", answer: "Składnia rozszerzająca JavaScript, służąca do opisywania struktury UI." },
    { id: '5', question: "W czym pomaga Framer Motion?", answer: "W tworzeniu płynnych animacji w React." },
    { id: '6', question: "Czym jest Prop Drilling?", answer: "Sytuacja, w której dane są przekazywane przez wiele warstw komponentów do miejsca, gdzie są potrzebne." },
    { id: '7', question: "Co to jest useState?", answer: "Hook w React, który pozwala na dodawanie stanu do komponentów funkcyjnych." },
    { id: '8', question: "Do czego służy useRef?", answer: "Hook w React, który pozwala na tworzenie refencji do elementów DOM lub wartości, które nie wywołują ponownego renderowania." },
    { id: '9', question: "Co to jest Virtual DOM?", answer: "Lekka kopia prawdziwego DOM, używana przez React do optymalizacji aktualizacji UI." },
    { id: '10', question: "Czym jest Context API?", answer: "Sposób na przekazywanie danych przez drzewo komponentów bez konieczności przekazywania propsów ręcznie na każdym poziomie." },
    { id: '11', question: "Jakie są korzyści z używania React?", answer: "Deklaratywny interfejs, wydajność dzięki Virtual DOM, komponentowa architektura, duża społeczność." },
    { id: '12', question: "Co to jest callback function?", answer: "Funkcja przekazywana do innej funkcji jako argument, która ma być wykonana później." },
    { id: '13', question: "Co to jest Higher-Order Component (HOC)?", answer: "Funkcja, która przyjmuje komponent jako argument i zwraca nowy komponent z dodatkową funkcjonalnością." },
    { id: '14', question: "Czym różni się 'let' od 'const'?", answer: "'let' pozwala na ponowne przypisanie wartości, 'const' tworzy stałą, której nie można zmienić po deklaracji." },
    { id: '15', question: "Co to jest asynchroniczny JavaScript?", answer: "Kod, który nie blokuje głównego wątku wykonania programu, pozwalając na kontynuowanie innych operacji." },
];

export default function Home() {
    const [cards, setCards] = useState(defaultCards);

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