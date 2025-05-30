import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    increment,
    updateDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";
import LikeButton, { formatNumber } from "../components/Likes";
import "../styles/forumDetails.css";

/* this is going to help us so once we click the forum card, it should let view all the comments and we can like it too */

const ForumDetail = () => {
    const navigate = useNavigate();
    const { forumId } = useParams();
    const [forum, setForum] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        // forum changes anytime we made an update
        const forumDocRef = doc(db, "forums", forumId);
        const unsubscribeForum = onSnapshot(forumDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setForum({ id: docSnap.id, ...docSnap.data() });
            }
        });

        const q = query(
            collection(db, "forums", forumId, "posts"),
            orderBy("createdAt", "asc")
        );
        const unsubscribePosts = onSnapshot(q, (querySnapshot) => {
            setComments(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubscribeForum();
            unsubscribePosts();
        };
    }, [forumId]);


    //we can add comments to the forum we click */

    const handleAddComment = async (e) => {
        e.preventDefault(); //prevent refresh
        const trimmedComment = newComment.trim();
        if (!trimmedComment) return;

        //adding the comment
        const tempId = `temp-${Date.now()}`;
        const comment1 = {
            id: tempId,
            comment: trimmedComment,
            createdAt: new Date(),
            creatorId: auth.currentUser ? auth.currentUser.uid : null,
            likes: 0,
        };
        setComments((prev) => [...prev, comment1]);
        setNewComment(""); // clear input 

        try {
            //now we will add to our database
            const docRef = await addDoc(collection(db, "forums", forumId, "posts"), {
                comment: trimmedComment,
                createdAt: serverTimestamp(),
                creatorId: auth.currentUser ? auth.currentUser.uid : null,
                likes: 0,
            });

            // Update forum's comment count
            await updateDoc(doc(db, "forums", forumId), {
                commentCount: increment(1),
            });
        } catch (err) {
            console.error("Error adding comment:", err);

            setComments((prev) => prev.filter((c) => c.id !== tempId));
        }
    };

    //show user that some info so they know something will happen
    if (!forum) return <div className="center-text">Loading…</div>;



    return (
        <div className="detail-wrapper">
            <button
                //takes us back to the forum page
                onClick={() => navigate(-1)}
                className="back-button"
            >   ← Back
            </button>

            <div className="forum-detail-card">
                <h2>{forum.name}</h2>
                <p className="forum-desc">{forum.description}</p>
                    <div className="stats-row">
                        <LikeButton
                            forumId={forumId}
                            initialLikes={forum.likes ?? 0}
                            className="forum-like-button"
                            formatNumber={formatNumber}  // Pass the formatter if needed
                        />
                        <div className="comment-count-display" aria-label="Number of comments">
                            💬 {formatNumber(comments.length)}
                        </div>
                    </div>
            </div>

            <form onSubmit={handleAddComment} className="new-comment-form">
                <textarea
                    placeholder="Add a public comment…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    required
                />
                <button type="submit">Post</button>
            </form>

            <div className="comments-list">
                {comments.map((c) => (
                    <div className="comment-card" key={c.id}>
                        <p className="comment-body">{c.comment}</p>
                        <LikeButton
                            forumId={forumId}
                            commentId={c.id}
                            initialLikes={c.likes ?? 0}
                        />
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ForumDetail;
