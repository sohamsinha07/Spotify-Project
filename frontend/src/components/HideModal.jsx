import React, { useState } from "react";
import { Button, Box } from "@mantine/core";
import CreateForumPost from "./CreateForumPost";

const HideModal = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <Box sx={{ maxWidth: 600, margin: "2rem auto" }}>
            <Button onClick={() => setShowForm(true)} leftIcon="+">
                Create New Forum
            </Button>

            {showForm && (
                <CreateForumPost
                    onSubmit={() => {
                        setShowForm(false); // Hide form after creation
                    }}
                />
            )}
        </Box>
    );
};

export default HideModal;
