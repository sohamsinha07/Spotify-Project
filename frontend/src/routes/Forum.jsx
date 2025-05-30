import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";

import ForumList from "../components/ForumList";
import PopUpModal from "../components/PopUpModal"
import "../styles/forum.css";


/* this is the forums page where users can navigate to a specific post and see the comments under those
* You can see the forums list, the search bar and a add forum button */
const Forum = () => {

    const [forums, setForums] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newForumName, setNewForumName] = useState("");
    const [newForumDescription, setNewForumDescription] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    //get the forums
    const fetchForums = async () => {
        try {
            const forumsInFirebase = collection(db, "forums");
            const q = query(forumsInFirebase, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const forumList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setForums(forumList);
        } catch (error) {
            console.error("Error fetching forums:", error);
        }
    };

    //get the users
    const fetchUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersArray = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const map = {};
            usersArray.forEach((user) => {
                map[user.id] = user;
            });
            setUsersMap(map);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchForums();
        fetchUsers();
    }, []);

    // read Spotify-login data from localStorage so it gives us the same person who logs in
    useEffect(() => {
        const spotifyUserId = localStorage.getItem("currentUserId");
        const spotifyUserName = localStorage.getItem("currentUserName");
        if (spotifyUserId) {
            setCurrentUser({ uid: spotifyUserId, displayName: spotifyUserName });
        }
    }, []);

    //this is the search by name feature of forums
    const filteredForums = forums.filter((forum) =>
        forum.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //from here we can handle the form creation 
    // from here we can handle the form creation 
    const handleCreateForum = async (e) => {
        e.preventDefault();
        if (!newForumName || !newForumDescription) return;

        if (!currentUser) {
            alert("Please log in with Spotify first.");
            return;
        }

        const creatorId = currentUser.uid;
        const creatorName = currentUser.displayName || "Anonymous";

        try {
            await addDoc(collection(db, "forums"), {
                name: newForumName,
                description: newForumDescription,
                creatorId,
                createdAt: serverTimestamp(),
                likes: 0,
                commentCount: 0,
            });

            setNewForumName("");
            setNewForumDescription("");
            setIsModalOpen(false);
            fetchForums();
        } catch (err) {
            console.error("Error creating forum:", err);
        }
    };

    return (
        <div className="forums-container">
            <div className="forums-header">
                <input
                    type="text"
                    placeholder="Search forums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="forum-search-input"
                />
                <button onClick={() => setIsModalOpen(true)} className="add-forum-button">
                    + New Forum
                </button>
            </div>


            <ForumList forums={filteredForums} usersMap={usersMap} />
            <PopUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleCreateForum} className="create-forum-form">
                    <h3>Create New Forum</h3>

                    <label htmlFor="forumName">Forum Name</label>
                    <input
                        id="forumName"
                        type="text"
                        value={newForumName}
                        onChange={(e) => setNewForumName(e.target.value)}
                        placeholder="Enter forum name"
                        required
                    />

                    <label htmlFor="forumDescription">Description</label>
                    <textarea
                        id="forumDescription"
                        value={newForumDescription}
                        onChange={(e) => setNewForumDescription(e.target.value)}
                        placeholder="Enter forum description"
                        required
                    />

                    <div className="modal-buttons">
                        <button type="submit" className="submit-button">Create</button>

                    </div>
                </form>
            </PopUpModal>
        </div>
    );
};

export default Forum;