import { useState, useEffect, useMemo } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ListCollapse, SquarePen, CirclePlus, FileDown, LogOut } from 'lucide-react';

import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { getDocs, collection, query, where, } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


import FlashcardHoister from "./FlashcardHoister";
import FlashcardForm from "./FlashcardForm";
import SideDock from "./SideDock";
import StudySetsDropdown from './StudySetsDropdown';
import AddPopup from "./AddPopup";
import ErrorPopup from "./ErrorPopup";
import ExportPopup from "./ExportPopup";
import ConfirmPopup from './ConfirmPopup.jsx';


export default function HomeComponent() {
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [studySets, setStudySets] = useState([]);
    const [activeSetId, setActiveSetId] = useState(null);
    const [showStudySetsDropdown, setShowStudySetsDropdown] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const activeSet = studySets.find(set => set.id === activeSetId);
    const activeSetName = activeSet ? activeSet.name : "";

    useEffect(() => {
        const fetchStudySets = async () => {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) {
                    console.warn("User not logged in");
                    setStudySets([]);
                    return;
                }

                const q = query(
                    collection(db, "studySets"),
                    where("userId", "==", userId)
                );

                const querySnapshot = await getDocs(q);
                const sets = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setStudySets(sets);
            } catch (error) {
                console.error("Failed to fetch study sets:", error);
            }
        };

        fetchStudySets();
    }, []);

    useEffect(() => {
        if (!activeSetId) {
            setCards([]);
            return;
        }

        const fetchCards = async () => {
            try {
                const q = query(collection(db, "cards"), where("studySetId", "==", activeSetId));
                const querySnapshot = await getDocs(q);

                const cardsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setCards(cardsData);
            } catch (err) {
                console.error("Failed to fetch cards:", err);
                setCards([]);
            }
        };

        fetchCards();
    }, [activeSetId]);

    const dockItems = useMemo(() => [
        {
            icon: <CirclePlus size={24} />,
            label: "Add a flashcard",
            onClick: () => {
                console.log("activeSetId:", activeSetId);
                console.log("studySets:", studySets);
                const currentActiveSet = studySets.find(set => set.id === activeSetId);
                console.log("currentActiveSet:", currentActiveSet);

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
            onClick: () => {
                console.log("Clicked Show Study Sets, current studySets:", studySets);
                if (studySets.length !== 0) {
                    setShowStudySetsDropdown(prev => !prev);
                    return;
                }
                setErrorPopupMessage("You don't have any study sets!")
                setShowErrorPopup(true);
            },
        },
        {
            icon: <SquarePen size={24} />,
            label: "Add new study set",
            onClick: () => {
                setCards([]);
                setActiveSetId(null);
            },
        },
        {
            icon: <FileDown size={24} />,
            label: "Export a set",
            onClick: () => setShowExportPopup(prev => !prev),
        },
        {
            icon: <LogOut size={24} />,
            label: "Logout",
            onClick: () => setShowLogoutConfirm(true)
        }
    ], [studySets, activeSetId]);

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
        setErrorPopupMessage('');
    };

    const handleExportError = (message) => {
        setShowErrorPopup(true);
        setErrorPopupMessage(message);
    };

    const handleAddFlashcard = (newCard) => {
        setCards(prev => [...prev, newCard]);
    };


    return (
        <div className="grid grid-cols-[auto_1fr] h-[80vh] overflow-hidden">
            {showAddPopup && (
                <AddPopup
                    onSave={handleAddFlashcard}
                    onClose={() => setShowAddPopup(false)}
                    studySetId={activeSetId}
                />
            )}
            {showExportPopup && (
                <ExportPopup
                    studySets={studySets}
                    cards={cards}
                    onClose={() => setShowExportPopup(false)}
                    onError={handleExportError}
                />
            )}
            <ErrorPopup
                message={errorPopupMessage}
                isVisible={showErrorPopup}
                onClose={closeErrorPopup}
                duration={5000}
            />
            <ConfirmPopup
                isVisible={showLogoutConfirm}
                message="Are you sure you want to log out?"
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={async () => {
                    try {
                        await signOut(auth);
                        navigate('/auth');
                    } catch (e) {
                        console.error("Logout failed", e);
                    }
                }}
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
                            setStudySets={setStudySets}
                            setCards={setCards}
                            setActiveSetId={setActiveSetId}
                            onClose={() => setShowStudySetsDropdown(false)}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {!activeSetId ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-center w-full"
                        >
                            <FlashcardForm setCards={setCards} setStudySets={setStudySets} setActiveSetId={setActiveSetId} />
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