import { motion } from 'framer-motion';
import { FileText, Brain, Download, PlusCircle } from 'lucide-react';
import { Link } from "react-router-dom";

import Magnet from "./Magnet"
import Threads from './Threads';

export default function About() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            className="container mx-auto p-8 max-w-4xl font-primary text-gray-200"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            <motion.h1
                className="text-4xl md:text-5xl font-bold text-center mb-8 text-pink-400 drop-shadow-md"
                variants={sectionVariants}
            >
                About Memoria
            </motion.h1>

            <motion.p
                className="text-lg md:text-xl text-center text-black dark:text-white mb-12 leading-relaxed"
                variants={sectionVariants}
            >
                Memoria is an innovative tool that transforms your documents into interactive flashcards. We created it to revolutionize your approach to learning and memorization, making the process more efficient and enjoyable.
            </motion.p>

            <div className="space-y-12">
                <motion.section
                    className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
                    variants={sectionVariants}
                >
                    <h2 className="text-3xl font-semibold mb-4 text-purple-400 flex items-center gap-3">
                        <FileText className="text-pink-400" size={32} /> Generate Flashcards from Documents
                    </h2>
                    <motion.p className="text-md leading-relaxed" variants={itemVariants}>
                        With Memoria, simply upload your PDF, DOCX, or TXT file, and our system will automatically extract key information and transform it into ready-to-study flashcards. Say goodbye to manual transcribing and wasted time!
                    </motion.p>
                </motion.section>

                <motion.section
                    className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
                    variants={sectionVariants}
                >
                    <h2 className="text-3xl font-semibold mb-4 text-purple-400 flex items-center gap-3">
                        <Brain className="text-pink-400" size={32} /> Personalize Your Learning
                    </h2>
                    <motion.p className="text-md leading-relaxed mb-4" variants={itemVariants}>
                        Memoria allows you to customize the detail level of your generated flashcards and specify your study goal (understanding, memorization, critical thinking) to perfectly tailor the material to your individual needs.
                    </motion.p>
                    <motion.p className="text-md leading-relaxed" variants={itemVariants}>
                        Add your own keywords to precisely guide the flashcard creation process and ensure they cover the topics most important to you.
                    </motion.p>
                </motion.section>

                <motion.section
                    className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
                    variants={sectionVariants}
                >
                    <h2 className="text-3xl font-semibold mb-4 text-purple-400 flex items-center gap-3">
                        <Download className="text-pink-400" size={32} /> Full Control Over Sets
                    </h2>
                    <motion.p className="text-md leading-relaxed mb-4" variants={itemVariants}>
                        With Memoria, you can easily manage your flashcard sets. Browse, edit, and manually add new flashcards, or delete those you no longer need.
                    </motion.p>
                    <motion.p className="text-md leading-relaxed" variants={itemVariants}>
                        Need your flashcards in another program? Export them to popular formats like CSV or JSON, giving you full flexibility.
                    </motion.p>
                </motion.section>

                <motion.section
                    className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
                    variants={sectionVariants}
                >
                    <h2 className="text-3xl font-semibold mb-4 text-purple-400 flex items-center gap-3">
                        <PlusCircle className="text-pink-400" size={32} /> Expand and Update Knowledge
                    </h2>
                    <motion.p className="text-md leading-relaxed mb-4" variants={itemVariants}>
                        Beyond generating from files, Memoria allows you to manually add new flashcards to complement your sets with additional information or to create entirely new sets from scratch.
                    </motion.p>
                    <motion.p className="text-md leading-relaxed" variants={itemVariants}>
                        Editing and deleting functionalities give you full control over your study material, allowing you to easily update and adapt your flashcards as your learning progresses.
                    </motion.p>
                </motion.section>

            </div>

            <motion.p
                className="text-lg md:text-xl text-center mt-12 text-black dark:text-white"
                variants={sectionVariants}
            >
                Join the Memoria community and discover a new era of effective learning!
            </motion.p>
            <div className="flex justify-center mt-8">
                <Link to="/register">
                    <Magnet magnetStrength={8}>
                        <button className="px-6 py-3 cursor-pointer rounded-xl font-medium text-white bg-pink-500 hover:bg-pink-600 opacity-0 shadow-lg transition font-primary animate-fade-in-delay-5">
                            Get Started
                        </button>
                    </Magnet>
                </Link>
            </div>
        </motion.div>
    );
}