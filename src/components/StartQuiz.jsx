import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { useNavigate, useParams } from "react-router-dom";
// import axiosClient from "../api-config";
import { io } from "socket.io-client";
import FaceIcon from "@mui/icons-material/Face";

export const socket = io("ws://localhost:8000/");

export default function StartQuiz() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [roomPin, setRoomPin] = useState(null);
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

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
        navigator.clipboard.writeText("http://localhost:3000/player");
        alert("Room link copied to clipboard!");
    };

    const startGame = () => {
        socket.emit("start-signal", roomPin);
        navigate(`/quiz/game/${id}/${roomPin}`);
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
            const pin = generatePin();
            setRoomPin(pin);
            socket.emit("create-room", pin);

            socket.on("new-user", (list) => {
                console.log(list);
                setPlayers(list);
            });
        } else {
            navigate("/login");
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
                        <Chip variant="contained" color="success" label="localhost:3000/player" />
                        <Button
                            onClick={copyToClipboard}
                            color="warning"
                            variant="contained"
                        >
                            Copy Game Link
                        </Button>
                        <Typography variant="h4" sx={{ mt: "0.5em" }}>
                            Room Pin
                        </Typography>
                        <Typography variant="h2" sx={{ mb: "0.25em" }}>
                            {roomPin}
                        </Typography>
                        {players.length === 0 && (
                            <>
                                <Typography variant="h5" align="center">
                                    Waiting for players...
                                </Typography>
                                <CircularProgress color="warning" />
                            </>
                        )}
                        {players.length > 0 && (
                            <>
                                {players.map((player, index) => (
                                    <Chip
                                        icon={<FaceIcon />}
                                        label={player.name}
                                        color={
                                            index % 2 === 0
                                                ? "success"
                                                : "warning"
                                        }
                                    />
                                ))}
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ mt: "2em" }}
                                    onClick={startGame}
                                >
                                    Start Game
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
