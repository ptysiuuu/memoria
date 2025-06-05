import { useState } from "react";
import Stack from "./Stack";
import FlashcardForm from "./FlashcardForm";

export default function Home() {
    const [cards, setCards] = useState([]);

    return (
        <div className="flex justify-center items-center max-h-[80vh] pt-30">
            {!cards || cards.length === 0 ?
                <FlashcardForm setCards={setCards} />
                :
                <Stack cards={cards} setCards={setCards} />
            }
        </div>
    );
}