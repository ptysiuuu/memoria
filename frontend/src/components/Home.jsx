import { useState } from "react";
import Stack from "./Stack";

export default function Home() {
    const [cards, setCards] = useState([
        { id: 1, question: "Stolica Polski?", answer: "Warszawa" },
        { id: 2, question: "2 + 2?", answer: "4" },
        { id: 3, question: "Kolor nieba?", answer: "Niebieski" },
    ]);

    return (
        <div className="flex justify-center items-center max-h-[80vh] pt-30">
            <Stack cards={cards} setCards={setCards} />
        </div>
    );
}