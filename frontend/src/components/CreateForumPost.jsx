import React, { useState, useEffect } from "react";
import {
    TextInput,
    Textarea,
    Button,
    Box,
    Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import "../styles/createForumPost.css";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import HideModal from "../components/HideModal";
import { getAuth } from "firebase/auth";

const CreateForumPost = ({ onSubmit }) => {
    <HideModal />
    const [forumName, setForumName] = useState("");
    const [description, setDescription] = useState("");
    const [dummyUsers, setDummyUsers] = useState([]);

    // Fetch dummy users once when component mounts
    useEffect(() => {
        async function fetchDummyUsers() {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersArray = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetched dummy users:", usersArray);
                setDummyUsers(usersArray);
            } catch (error) {
                console.error("Error fetching dummy users:", error);
            }
        }
        fetchDummyUsers();
    }, []);

    const handleCreation = async (e) => {
        e.preventDefault();

        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!forumName || !description) {
            showNotification({
                title: "Missing fields",
                message: "Please fill out both the forum name and description.",
                color: "red",
                icon: <IconX />,
            });
            return;
        }

        let creatorId = null;

        if (currentUser) {
            // Use logged-in user's uid
            creatorId = currentUser.uid;
            
        } else {
            // No logged-in user, pick a random dummy user
            if (dummyUsers.length === 0) {
                showNotification({
                    title: "No users available",
                    message: "No users found to assign as creator.",
                    color: "red",
                    icon: <IconX />,
                });
                return;
            }
            const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
            creatorId = randomUser.id;
        }

        const newForum = {
            name: forumName,
            description,
            createdAt: serverTimestamp(),
            creatorId,
        };

        try {
            await addDoc(collection(db, "forums"), newForum);
            showNotification({
                title: "Forum created",
                message: `"${forumName}" has been created successfully!`,
                color: "green",
                icon: <IconCheck />,
            });
            onSubmit();
            setForumName("");
            setDescription("");
        } catch (err) {
            console.error("Error adding document: ", err);
            showNotification({
                title: "Error",
                message: "Something went wrong. Please try again.",
                color: "red",
                icon: <IconX />,
            });
        }
    };

    return (
        <Box className="forum-container" sx={{ maxWidth: 1800, margin: "4rem auto", padding: "0 1rem" }}>
            <Title order={4} className="forum-title">
                Create a New Forum
            </Title>
            <form onSubmit={handleCreation}>
                <TextInput
                    label="Forum Name"
                    placeholder="kendrick"
                    value={forumName}
                    onChange={(e) => setForumName(e.currentTarget.value)}
                    required
                    className="forum-input"
                />
                <Textarea
                    label="Forum Description"
                    placeholder="What is this forum about?"
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    autosize
                    minRows={3}
                    required
                    className="forum-textarea"
                />
                <Button type="submit" color="#1db954" className="forum-button">
                    Create Forum
                </Button>
            </form>
        </Box>
    );
};

export default CreateForumPost;
