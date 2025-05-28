// import React from "react";
// import { Text, TextInput, Textarea, Button } from "@mantine/core";
// import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
// import '../styles/forumInfo.css';



// const CreateForumPost = ({ onSubmit }) => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [error, setError] = useState("");


//     const clickSubmit = async (e) => {
//         e.preventDefault(); //does not allow refresh

//         //makiing sure the user enters something in each field.

//         if (!title.trim()) {
//             setError("You need to input a title");
//         }

//         if (title.length > 30) {  //can be any number but 30 seems okay to me
//             setError("Title is too long, try reducing it");
//             return;
//         }

//         setError(""); //after showing all errors, remove them so the user can try again

//         const descriptionData = {
//             title: title.trim(),
//             description: description.trim(),
//         };

//         try {
//             await onSubmit(forumData); // You’ll define this where you use the form
//             // Clear form on success
//             setTitle("");
//             setDescription("");
//         } catch (err) {
//             setError("Could not create forum post. Try again.");
//         }
//     };

//     return (
//         <form onSubmit={clickSubmit}>
//             <TextInput
//                 label="Title"
//                 placeholder="Start typing"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//             />

//             <Textarea
//                 label="Description"
//                 placeholder="Start typing"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//             />

//             {error && <Text color="red" mt="sm">{error}</Text>}

//             <Button type="submit">
//                 Add post
//             </Button>
//         </form>
//     );
// };

// export default CreateForumPost


import React, { useState } from "react";
import {
    TextInput,
    Textarea,
    Button,
    Box,
    Title,
    Stack,
    Paper,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import "../styles/createForumPost.css";

const CreateForumPost = ({ onCreate }) => {
    const [forumName, setForumName] = useState("");
    const [description, setDescription] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!forumName || !description) {
            showNotification({
                title: "Missing fields",
                message: "Please fill out both the forum name and description.",
                color: "red",
                icon: <IconX />,
            });
            return;
        }

        const newForum = {
            name: forumName,
            description,
            createdAt: new Date().toISOString(),
        };

        onCreate(newForum);

        showNotification({
            title: "Forum created",
            message: `"${forumName}" has been created successfully!`,
            color: "green",
            icon: <IconCheck />,
        });

        setForumName("");
        setDescription("");
    };

    return (
        <Box className="create-forum-container">
            <Paper className="create-forum-paper">
                <Title order={2} className="create-forum-title">
                    Create a New Forum
                </Title>
                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            label="Forum Name"
                            placeholder="e.g., Indie Rock Discussions"
                            value={forumName}
                            onChange={(e) => setForumName(e.currentTarget.value)}
                            required
                            className="create-forum-input"
                        />
                        <Textarea
                            label="Forum Description"
                            placeholder="What is this forum about?"
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                            autosize
                            minRows={3}
                            required
                            className="create-forum-textarea"
                        />
                        <Button type="submit" color="green" className="create-forum-button">
                            Create Forum
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateForumPost;
