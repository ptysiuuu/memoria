import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmPopup from './ConfirmPopup';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function StudySetsDropdown({ studySets, setStudySets, setCards, onClose, setActiveSetId }) {
    const [setToDelete, setSetToDelete] = useState(null);

    const handleDelete = async () => {
        if (!setToDelete) return;

        try {
            await deleteDoc(doc(db, "studySets", setToDelete.id));

            const updatedSets = studySets.filter(s => s.id !== setToDelete.id);
            setStudySets(updatedSets);

            if (updatedSets.length > 0) {
                setCards(updatedSets[0].cards);
                setActiveSetId(updatedSets[0].id);
            } else {
                setCards([]);
                setActiveSetId(null);
            }

            setSetToDelete(null);
            onClose();
        } catch (err) {
            console.error("Failed to delete study set:", err);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="
                    absolute
                    left-20 top-95
                    bg-black shadow-xl border border-gray-200 rounded-lg
                    min-w-[180px] z-20
                    p-2 space-y-1 font-primary
                "
                role="menu"
                aria-orientation="vertical"
            >
                {studySets.map((set, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-stone-800 rounded-md transition duration-150 ease-in-out"
                    >
                        <button
                            className="text-left w-full mr-2"
                            onClick={() => {
                                setCards(set.cards);
                                setActiveSetId(set.id);
                                onClose();
                            }}
                            role="menuitem"
                        >
                            {set.name}
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => setSetToDelete(set)}
                            title="Delete set"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </motion.div>

            <ConfirmPopup
                isVisible={!!setToDelete}
                message={`Are you sure you want to delete "${setToDelete?.name}"?`}
                onConfirm={handleDelete}
                onCancel={() => {
                    setSetToDelete(null);
                    onClose();
                }}
            />
        </>
    );
}
