import { motion, useMotionValue } from "framer-motion";

function CardRotate({ children, onSendToBack, sensitivity }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    function handleDragEnd(_, info) {
        if (
            Math.abs(info.offset.x) > sensitivity ||
            Math.abs(info.offset.y) > sensitivity
        ) {
            onSendToBack();
        } else {
            x.set(0);
            y.set(0);
        }
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
        </motion.div>
    );
}

export default CardRotate;
