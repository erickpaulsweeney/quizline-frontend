import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api-config";

export default function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data);
        }
        // eslint-disable-next-line
    }, []);
    
    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
            }}
        >
            {user && <Card sx={{ width: "100%", background: "#ffffffb0" }}>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1em",
                    }}
                >
                    <Typography variant="h5" align="center">
                        Welcome to another day of learning, {user.data.name}!
                    </Typography>
                    <Button color="success" sx={{ fontWeight: 600 }}>Log out</Button>
                </CardContent>
            </Card>}
        </Container>
    );
}
