import React, { useState } from "react";
import {
    addDoc,
    collection,
    doc,
    increment,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import PopUpModal from "./PopUpModal";

/* this posts component helps us to count the posts */
const Posts = ({ forumId, initialCount = 0 }) => {
    const [count, setCount] = useState(initialCount);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "forums", forumId, "posts"), {
                comment: text.trim(),
                createdAt: serverTimestamp(),
                creatorId: auth.currentUser ? auth.currentUser.uid : null,
                likes: 0,
            });

            await updateDoc(doc(db, "forums", forumId), {
                commentCount: increment(1),
            });

            setCount((prev) => prev + 1);
            setText("");
            setOpen(false);
        } catch (err) {
            console.error("Error posting comment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="comment-count-display"

                aria-label="Add a comment"
            >
                💬 {count}
            </button >

            <PopUpModal isOpen={open} onClose={() => !submitting && setOpen(false)}>
                <h3>Add a comment</h3>
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        rows="4"
                        placeholder="Write your comment…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Sending…" : "Send"}
                    </button>
                </form>
            </PopUpModal>
        </>
    );
};

export default Posts;
