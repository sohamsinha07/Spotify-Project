import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import { Card, Text, Title, Stack, Loader, Box, Button, Group, Input, Container } from "@mantine/core";
import '../styles/forum.css';
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

const Forum = () => {
    const [forums, setForums] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://your-api-endpoint.com/forums'); // Replace with actual API endpoint

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json(); // assuming API returns JSON
                setForums(data);
            } catch (error) {
                setError('Failed to load the forums');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredForums = forums.filter((forum) =>
        forum.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container size="lg" mt="md">
            <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                mb="md"
            />

            {loading && <p>Loading forums...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && filteredForums.length === 0 && (
                <p>No forums found.</p>
            )}

            {!loading && !error && filteredForums.map((forum) => (
                <ForumInfo
                    key={forum.id}
                    forum={forum}
                    onLike={() => console.log("Like clicked", forum.id)}
                    onComment={() => console.log("Comment clicked", forum.id)}
                />
            ))}
        </Container>
    );
};

export default Forum;