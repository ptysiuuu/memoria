import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";

function CardRotate({ children, onSendToBack, sensitivity }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [showLabel, setShowLabel] = useState(false);
    const [isDragQualified, setIsDragQualified] = useState(false);

    const actionThreshold = sensitivity * 0.3;

    useEffect(() => {
        const unsubscribeX = x.on("change", (latestX) => {
            const absX = Math.abs(latestX);

            if (absX >= actionThreshold) {
                setShowLabel(true);
                setIsDragQualified(true);
            } else {
                setShowLabel(false);
                setIsDragQualified(false);
            }
        });

        return () => {
            unsubscribeX();
        };
    }, [x, actionThreshold]);

    function handleDragEnd(_, info) {
        const verticalDragLimit = sensitivity * 0.4;
        const isVerticalDragDominant = Math.abs(info.offset.y) > verticalDragLimit &&
            Math.abs(info.offset.y) > Math.abs(info.offset.x);

        if (isDragQualified && !isVerticalDragDominant) {
            onSendToBack();
        } else {
            x.set(0);
            y.set(0);
        }
        setShowLabel(false);
        setIsDragQualified(false);
    }

    return (
        <motion.div
            className="absolute cursor-grab"
            style={{ x, y }}
            drag
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={0.2}
            whileTap={{ cursor: "grabbing" }}
            onDragEnd={handleDragEnd}
        >
            {children}

            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: showLabel ? 1 : 0 }}
                transition={{ duration: 0.15 }}
            >
                <span className="text-white bg-black/70 px-4 py-2 rounded-full text-lg font-bold">
                    Move to the back
                </span>
            </motion.div>
        </motion.div>
    );
}

export default CardRotate;