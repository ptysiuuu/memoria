import { motion } from 'framer-motion';

export default function StudySetsDropdown({ studySets, setCards, onClose, setActiveSetId }) {
    if (!studySets || studySets.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="
                absolute
                left-20 top-95
                bg-black shadow-xl border border-gray-200 rounded-lg
                min-w-[160px] z-20
                p-2 space-y-1 font-primary
                "
            role="menu"
            aria-orientation="vertical"
        >
            {studySets.map((set, idx) => (
                <button
                    key={idx}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-stone-800 cursor-pointer rounded-md transition duration-150 ease-in-out"
                    onClick={() => {
                        setCards(set.cards);
                        setActiveSetId(set.id);
                        onClose();
                    }}
                    role="menuitem"
                >
                    {set.name}
                </button>
            ))}
        </motion.div>
    );
}