import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api-config";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8000/");

export default function StartQuiz() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [roomPin, setRoomPin] = useState(null);
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();
    const roomLink = window.location.href;

    const generatePin = () => {
        return (
            Math.floor(Math.random() * 10).toString() +
            Math.floor(Math.random() * 10).toString() +
            Math.floor(Math.random() * 10).toString() +
            Math.floor(Math.random() * 10).toString() +
            Math.floor(Math.random() * 10).toString() +
            Math.floor(Math.random() * 10).toString()
        );
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomLink);
        alert("Room link copied to clipboard!");
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
            const pin = generatePin();
            setRoomPin(pin);
            socket.emit("join-room", pin);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
            }}
        >
            {user && (
                <Card
                    sx={{
                        width: "100%",
                        background: "#ffffffb0",
                        mt: "1em",
                        mb: "1em",
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1em",
                        }}
                    >
                        <Avatar
                            src="/images/QuizLine.webp"
                            alt="quizline logo"
                            sx={{ width: 100, height: 100, mb: "1em" }}
                        />
                        <Typography variant="h2">QuizLine</Typography>
                        <Button
                            onClick={copyToClipboard}
                            color="warning"
                            variant="contained"
                        >
                            Copy Room Link
                        </Button>
                        <Typography variant="h4" sx={{ mt: "0.5em" }}>
                            Room Pin
                        </Typography>
                        <Typography variant="h2">{roomPin}</Typography>
                        {players.length === 0 && (
                            <>
                                <Typography variant="h5" align="center">
                                    Waiting for players...
                                </Typography>
                                <CircularProgress />
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
