import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import "../styles/commentsList.css"

const CommentsList = () => {
    const { forumId } = useParams();
    const [forum, setForum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchForum() {
            const forumDoc = await getDoc(doc(db, 'forums', forumId));
            if (forumDoc.exists()) {
                setForum(forumDoc.data());
            }
            setLoading(false);
        }
        fetchForum();
    }, [forumId]);

    if (loading) return <div className="loading">Loading comments...</div>;
    if (!forum) return <div className="error">Forum not found</div>;

    return (
        <div className="comments-container">
            <h1 className="comments-title"> {forum.name}</h1>
            {forum.comments?.length ? (
                <ul className="comments-list">
                    {forum.comments.map((comment, i) => {
                        const createdAt = comment.createdAt;
                        const date = createdAt && createdAt.seconds
                            ? new Date(createdAt.seconds * 1000).toLocaleString()
                            : "Unknown date";

                        return (
                            <li key={i} className="comment-item">
                                <p className="comment-author"><strong>{comment.createdBy}</strong>:</p>
                                <p className="comment-text">{comment.description}</p>
                                <p className="comment-date"><small>{date}</small></p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="no-comments">No comments yet.</p>
            )}
        </div>
    );
};

export default CommentsList;
