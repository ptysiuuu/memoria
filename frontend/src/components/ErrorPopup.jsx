import { useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import StarBorder from './StarBorder';

const ErrorPopup = ({ message, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        let timer;
        if (isVisible) {
            timer = setTimeout(() => {
                onClose();
            }, duration);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isVisible, onClose, duration]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 120, duration: 0.3 }}
                    className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 z-50 p-2"
                >
                    <StarBorder className="font-primary">
                        <div
                            className="border-gradient-bottom"
                            style={{ background: 'radial-gradient(ellipse at center, rgba(128,0,128,0.7) 0%,rgba(255,0,255,0) 70%)' }}
                        ></div>
                        <div
                            className="border-gradient-top"
                            style={{ background: 'radial-gradient(ellipse at center, rgba(128,0,128,0.7) 0%,rgba(255,0,255,0) 70%)' }}
                        ></div>

                        <div className="inner-content flex items-center justify-between gap-4">
                            <span className="text-red-400 text-lg">Error!</span>
                            <p className="text-white text-base">{message}</p>
                            <button
                                onClick={onClose}
                                className="text-gray-400 cursor-pointer hover:text-white transition-colors text-xl font-bold"
                                aria-label="Close error message"
                            >
                                &times;
                            </button>
                        </div>
                    </StarBorder>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorPopup;