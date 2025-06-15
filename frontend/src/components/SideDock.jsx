// components/SideDock.jsx
"use client";

import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import {
    Children,
    cloneElement,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

function DockItem({
    children,
    className = "",
    onClick,
    mouseY,
    spring,
    distance,
    magnification,
    baseItemSize,
}) {
    const ref = useRef(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseY, (val) => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            y: 0,
            height: baseItemSize,
        };
        return val - rect.y - baseItemSize / 2;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, magnification, baseItemSize]
    );
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size,
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`relative inline-flex items-center text-primary cursor-pointer justify-center rounded-full bg-[#060606] border-neutral-700 border-2 shadow-md ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, (child) =>
                cloneElement(child, { isHovered })
            )}
        </motion.div>
    );
}

function DockLabel({ children, className = "", ...rest }) {
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = isHovered.on("change", (latest) => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 10 }}
                    exit={{ opacity: 0, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${className} absolute top-1/2 left-full ml-2 w-fit font-primary whitespace-pre rounded-md border border-neutral-700 bg-[#060606] px-2 py-0.5 text-md text-white transform -translate-y-1/2`}
                    role="tooltip"
                    style={{ x: "0%" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className = "" }) {
    return (
        <div className={`flex items-center justify-center text-white ${className}`}>
            {children}
        </div>
    );
}

export default function SideDock({
    items,
    setShowStudySetsDropdown,
    className = "",
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelWidth = 64,
    baseItemSize = 50,
}) {
    const mouseY = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const memoizedItems = useMemo(() => {
        return items;
    }, [items]);

    return (
        <motion.div
            style={{ scrollbarWidth: "none" }}
            className="flex items-center justify-center h-full text-primary"
        >
            <motion.div
                onMouseMove={({ pageY }) => {
                    isHovered.set(1);
                    mouseY.set(pageY);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseY.set(Infinity);
                }}
                className={`${className} absolute top-1/2 left-2 transform max-w-16 -translate-y-1/2 flex flex-col items-center justify-center h-fit gap-4 rounded-2xl border-neutral-700 border-2 py-4`}
                style={{ width: panelWidth }}
                role="toolbar"
                aria-label="Application dock"
            >
                {memoizedItems.map((item, index) => (
                    <DockItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                        mouseY={mouseY}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </motion.div>
    );
}