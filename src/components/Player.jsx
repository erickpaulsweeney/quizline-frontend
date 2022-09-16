import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
// import { useNavigate, useParams } from "react-router-dom";
// import axiosClient from "../api-config";
import { socket } from "./StartQuiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";

export default function Player() {
    const [roomPin, setRoomPin] = useState(null);
    const [input, setInput] = useState("");
    const [askName, setAskName] = useState(false);
    const [name, setName] = useState("");
    const [entered, setEntered] = useState(false);
    const [start, setStart] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [curr, setCurr] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [timeEnd, setTimeEnd] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);
    console.log(curr, quiz);

    const submitPin = () => {
        socket.emit("enter-pin", input);
    };

    const submitName = () => {
        socket.emit("send-name", { roomPin, name });
    };

    const submitAnswer = (answer) => {
        setAnswered(answer);
        socket.emit("answer", { roomPin, input: { question: curr, answer: answer } });
    };

    useEffect(() => {
        socket.on("wrong-pin", () => {
            alert("Wrong PIN. Please try again.");
        });

        socket.on("name-taken", () => {
            alert("Name is already in use! Please use another one!");
        });

        socket.on("already-started", () => {
            alert("Quiz game has already started! Please wait for the next match!");
        });

        socket.on("ask-name", (pin) => {
            setAskName(true);
            setRoomPin(pin);
        });

        socket.on("entered", () => {
            setEntered(true);
        });

        socket.on("start-game", () => {
            setStart(true);
        });

        socket.on("give-data", (data) => {
            setQuiz(data);
        });

        socket.on("time-end", () => {
            setTimeEnd(true);
        });

        socket.on("next-question", (curr) => {
            setCurr(curr);
            setAnswered(false);
            setTimeEnd(false);
        });
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
            {!start && (
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
                                />
                                <Button
                                    variant="contained"
                                    color="warning"
                                    disabled={input.length < 6}
                                    onClick={submitPin}
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
                                    disabled={name.length === 0}
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
                                <Typography variant="h6" align="center">
                                    "Random quote that will be filled later" -
                                    Someone Famous
                                </Typography>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
            {start && (
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
                        {quiz && (
                            <Grid container spacing={1}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h4"
                                            align="center"
                                            gutterBottom
                                        >
                                            Question {curr + 1}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {quiz.questions[curr].type ===
                                    "True or False" &&
                                    answered === false && (
                                        <>
                                            <Grid item xs={6}>
                                                <Card
                                                    onClick={() =>
                                                        submitAnswer(0)
                                                    }
                                                >
                                                    <CardContent align="center">
                                                        <CheckCircleIcon
                                                            color="success"
                                                            sx={{
                                                                fontSize: "3em",
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Card
                                                    onClick={() =>
                                                        submitAnswer(1)
                                                    }
                                                >
                                                    <CardContent align="center">
                                                        <CancelIcon
                                                            color="warning"
                                                            sx={{
                                                                fontSize: "3em",
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </>
                                    )}
                                {quiz.questions[curr].type ===
                                    "Multiple Choices" &&
                                    answered === false && (
                                        <>
                                            <Grid item xs={6}>
                                                <Card
                                                    onClick={() =>
                                                        submitAnswer(0)
                                                    }
                                                >
                                                    <CardContent align="center">
                                                        <LooksOneIcon
                                                            color="success"
                                                            sx={{
                                                                fontSize: "3em",
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Card
                                                    onClick={() =>
                                                        submitAnswer(1)
                                                    }
                                                >
                                                    <CardContent align="center">
                                                        <LooksTwoIcon
                                                            color="warning"
                                                            sx={{
                                                                fontSize: "3em",
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Card
                                                    onClick={() =>
                                                        submitAnswer(2)
                                                    }
                                                >
                                                    <CardContent align="center">
                                                        <Looks3Icon
                                                            color="success"
                                                            sx={{
                                                                fontSize: "3em",
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Card
                                                    onClick={() =>
                                                        submitAnswer(3)
                                                    }
                                                >
                                                    <CardContent align="center">
                                                        <Looks4Icon
                                                            color="warning"
                                                            sx={{
                                                                fontSize: "3em",
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </>
                                    )}
                                {quiz.questions[curr].type ===
                                    "True or False" &&
                                    answered !== false && (
                                        <>
                                            <Grid item xs={12} align="center">
                                                <Typography variant="h5">
                                                    Your answer
                                                </Typography>
                                                {answered === 0 && (
                                                    <CheckCircleIcon
                                                        color="success"
                                                        sx={{ fontSize: "5em" }}
                                                    />
                                                )}
                                                {answered === 1 && (
                                                    <CancelIcon
                                                        color="warning"
                                                        sx={{ fontSize: "5em" }}
                                                    />
                                                )}
                                                {answered === false && (
                                                    <Typography variant="h5">No answer</Typography>
                                                )}
                                            </Grid>
                                        </>
                                    )}
                                {quiz.questions[curr].type ===
                                    "Multiple Choices" &&
                                    answered !== false && (
                                        <>
                                            <Grid item xs={12} align="center">
                                                <Typography variant="h5">
                                                    Your answer
                                                </Typography>
                                                {answered === 0 && (
                                                    <LooksOneIcon
                                                        color="success"
                                                        sx={{ fontSize: "5em" }}
                                                    />
                                                )}
                                                {answered === 1 && (
                                                    <LooksTwoIcon
                                                        color="warning"
                                                        sx={{ fontSize: "5em" }}
                                                    />
                                                )}
                                                {answered === 2 && (
                                                    <Looks3Icon
                                                        color="success"
                                                        sx={{ fontSize: "5em" }}
                                                    />
                                                )}
                                                {answered === 3 && (
                                                    <Looks4Icon
                                                        color="warning"
                                                        sx={{ fontSize: "5em" }}
                                                    />
                                                )}
                                                {answered === false && (
                                                    <Typography variant="h5">No answer</Typography>
                                                )}
                                            </Grid>
                                        </>
                                    )}
                                <Grid item xs={12} align="center" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    {!timeEnd && answered !== false && (
                                        <>
                                            <Typography variant="subtitle" align="center">
                                                Waiting for others...
                                            </Typography>
                                            <CircularProgress color="warning" />
                                        </>
                                    )}
                                    {timeEnd && (
                                        <>
                                            {quiz.questions[curr].correctAnswer === answered && (
                                                <Typography variant="h4" align="center" fontWeight="500">Correct!</Typography>
                                            )}
                                            {quiz.questions[curr].correctAnswer !== answered && (
                                                <Typography variant="h4" align="center" fontWeight="500">Incorrect!</Typography>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        )}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
