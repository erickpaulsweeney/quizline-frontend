import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
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
    const [input, setInput] = useState("");
    const [askName, setAskName] = useState(false);
    const [name, setName] = useState("");
    const [entered, setEntered] = useState(false);
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

    const submitPin = () => {
        socket.emit("enter-pin", { roomLink, input });
    };

    const submitName = () => {
        socket.emit("send-name", { roomLink, name });
    };

    const startGame = () => {
        socket.emit("start-signal");
        navigate(`/quiz/game/${id}`);
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
            const pin = generatePin();
            setRoomPin(pin);
            socket.emit("create-room", { roomLink, pin });

            socket.on("new-user", (list) => {
                console.log(list);
                setPlayers(list);
            });
        } else {
            socket.on("wrong-pin", () => {
                console.log("test");
                alert("Wrong PIN. Please try again.");
                return;
            });

            socket.on("ask-name", () => {
                setAskName(true);
            });

            socket.on("entered", () => {
                setEntered(true);
            });

            socket.on("start-game", () => {
                navigate(`/quiz/game/${id}/player`);
            });
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
            {!user && (
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
                        {!askName && !entered && (
                            <>
                                <Typography variant="h5" align="center">
                                    Enter 6-digit Room PIN:
                                </Typography>
                                <TextField
                                    type="number"
                                    name="room-pin"
                                    value={input}
                                    onChange={(ev) => setInput(ev.target.value)}
                                    sx={{
                                        fontWeight: "600",
                                        "&[type=number]": {
                                            MozAppearance: "textfield",
                                        },
                                        "&::-webkit-outer-spin-button": {
                                            WebkitAppearance: "none",
                                            margin: 0,
                                        },
                                        "&::-webkit-inner-spin-button": {
                                            WebkitAppearance: "none",
                                            margin: 0,
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="warning"
                                    disabled={input.length < 6}
                                    onClick={() => submitPin()}
                                >
                                    Enter
                                </Button>
                            </>
                        )}
                        {askName && !entered && (
                            <>
                                <Typography variant="h5" align="center">
                                    Enter your name:
                                </Typography>
                                <TextField
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="warning"
                                    disabled={name.length < 3}
                                    onClick={() => submitName()}
                                >
                                    Enter
                                </Button>
                            </>
                        )}
                        {askName && entered && (
                            <>
                                <Typography variant="h5" align="center">
                                    Waiting for game to start...
                                </Typography>
                                <CircularProgress color="warning" />
                                <Typography variant="h6" align="center">"Random quote that will be filled later" - Someone Famous</Typography>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
