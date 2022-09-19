import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api-config";
import { socket } from "./StartQuiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import FaceIcon from "@mui/icons-material/Face";

export default function Game() {
    const { id, pin } = useParams();
    const [user, setUser] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [currNumber, setCurrNumber] = useState(0);
    const [timer, setTimer] = useState(0);
    const [timeEnd, setTimeEnd] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [gameEnd, setGameEnd] = useState(false);
    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        const response = await axiosClient.get("quiz");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const quiz = response.data.find((el) => el._id === id);
            setQuiz(quiz);
            socket.emit("share-details", { quiz, pin });
        }
    };

    const nextQuestion = () => {
        if (currNumber + 1 <= quiz.questions.length - 1) {
            setCurrNumber(currNumber + 1);
            setTimer(0);
            setTimeEnd(false);
            socket.emit("next-question", { pin, curr: currNumber + 1 });
        } else {
            setGameEnd(true);
            socket.emit("game-done", pin);
        }
    };

    useEffect(() => {
        if (timer < 30) {
            const timerFunc = setTimeout(() => {
                setTimer(timer + 1);
                clearTimeout(timerFunc);
            }, 1000);
        } else {
            setTimeEnd(true);
            socket.emit("time-end", pin);
        }
        // eslint-disable-next-line
    }, [timer]);

    useEffect(() => {
        if (gameEnd) {
            const filtered = roomData.users.sort((a, b) => b.score - a.score);
            const top3 = filtered.slice(0, 3);
            console.log(top3);
            socket.emit("results", { pin, chartData: top3 });
            navigate(`/quiz/result/${id}/${pin}`);
        }
        // eslint-disable-next-line
    }, [roomData, gameEnd]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
            fetchQuizzes();

            socket.emit("get-data", pin);

            socket.on("update-data", (data) => {
                console.log(data);
                if (data.users.length === 0) {
                    alert(
                        "No player in this room yet. Please go back to the waiting room."
                    );
                }
                setRoomData(data);
            });
        } else {
            navigate("/");
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Container
            component="main"
            maxWidth="lg"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
            }}
        >
            {user && quiz !== null && currNumber >= 0 && (
                <Card
                    sx={{
                        width: "100%",
                        background: "#ffffffb0",
                        mt: "1em",
                        mb: "1em",
                        display: "flex",
                        p: "2em",
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1em",
                            width: "100%",
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid container spacing={1}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={10}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1em",
                                    }}
                                >
                                    <Avatar
                                        src="/images/QuizLine.webp"
                                        alt="quizline logo"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mb: "1em",
                                        }}
                                    />
                                    <Typography variant="h2">
                                        QuizLine
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={2}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "0.5em",
                                    }}
                                >
                                    <CircularProgress
                                        color="warning"
                                        variant="determinate"
                                        value={Math.floor((timer / 30) * 100)}
                                    />
                                    {!timeEnd && (
                                        <Typography variant="h6">
                                            {30 - timer} second
                                            {30 - timer > 1 ? "s" : ""} left
                                        </Typography>
                                    )}
                                    {timeEnd && (
                                        <Typography variant="h6">
                                            Time's up!
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                xs={12}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "1em",
                                        mb: "3em",
                                    }}
                                >
                                    <Typography variant="h4" align="center">
                                        <strong>
                                            Question {currNumber + 1}
                                        </strong>
                                    </Typography>
                                    <Typography variant="h4" align="center">
                                        {quiz.questions[currNumber].question}
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "1em",
                                        mb: "3em",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={quiz.questions[currNumber].image}
                                        alt="Question image"
                                        sx={{
                                            height: "18em",
                                            width: "20em",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            {quiz.questions[currNumber].type ===
                                "True or False" && (
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Card key="True">
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "1em",
                                                    position: "relative",
                                                }}
                                            >
                                                <CheckCircleIcon
                                                    color="success"
                                                    sx={{ fontSize: "2em" }}
                                                />
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="500"
                                                >
                                                    True
                                                </Typography>
                                                {timeEnd &&
                                                    quiz.questions[currNumber]
                                                        .correctAnswer ===
                                                        0 && (
                                                        <>
                                                            <ArrowRightIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    left: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                            <ArrowLeftIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    right: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card key="False">
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "1em",
                                                    position: "relative",
                                                }}
                                            >
                                                <CancelIcon
                                                    color="warning"
                                                    sx={{ fontSize: "2em" }}
                                                />
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="500"
                                                >
                                                    False
                                                </Typography>
                                                {timeEnd &&
                                                    quiz.questions[currNumber]
                                                        .correctAnswer ===
                                                        1 && (
                                                        <>
                                                            <ArrowRightIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    left: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                            <ArrowLeftIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    right: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                            {quiz.questions[currNumber].type ===
                                "Multiple Choices" && (
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Card key="Choice 1">
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "1em",
                                                    position: "relative",
                                                }}
                                            >
                                                <LooksOneIcon
                                                    color="success"
                                                    sx={{ fontSize: "2em" }}
                                                />
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="500"
                                                >
                                                    {
                                                        quiz.questions[
                                                            currNumber
                                                        ].choices[0].text
                                                    }
                                                </Typography>
                                                {timeEnd &&
                                                    quiz.questions[currNumber]
                                                        .correctAnswer ===
                                                        0 && (
                                                        <>
                                                            <ArrowRightIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    left: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                            <ArrowLeftIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    right: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card key="Choice 2">
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "1em",
                                                    positive: "relative",
                                                }}
                                            >
                                                <LooksTwoIcon
                                                    color="warning"
                                                    sx={{ fontSize: "2em" }}
                                                />
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="500"
                                                >
                                                    {
                                                        quiz.questions[
                                                            currNumber
                                                        ].choices[1].text
                                                    }
                                                </Typography>
                                                {timeEnd &&
                                                    quiz.questions[currNumber]
                                                        .correctAnswer ===
                                                        1 && (
                                                        <>
                                                            <ArrowRightIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    left: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                            <ArrowLeftIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    right: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card key="Choice 3">
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "1em",
                                                    position: "relative",
                                                }}
                                            >
                                                <Looks3Icon
                                                    color="success"
                                                    sx={{ fontSize: "2em" }}
                                                />
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="500"
                                                >
                                                    {
                                                        quiz.questions[
                                                            currNumber
                                                        ].choices[2].text
                                                    }
                                                </Typography>
                                                {timeEnd &&
                                                    quiz.questions[currNumber]
                                                        .correctAnswer ===
                                                        2 && (
                                                        <>
                                                            <ArrowRightIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    left: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                            <ArrowLeftIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    right: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card key="Choice 4">
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "1em",
                                                    position: "relative",
                                                }}
                                            >
                                                <Looks4Icon
                                                    color="warning"
                                                    sx={{ fontSize: "2em" }}
                                                />
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="500"
                                                >
                                                    {
                                                        quiz.questions[
                                                            currNumber
                                                        ].choices[3].text
                                                    }
                                                </Typography>
                                                {timeEnd &&
                                                    quiz.questions[currNumber]
                                                        .correctAnswer ===
                                                        3 && (
                                                        <>
                                                            <ArrowRightIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    left: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                            <ArrowLeftIcon
                                                                sx={{
                                                                    fontSize:
                                                                        "5em",
                                                                    position:
                                                                        "absolute",
                                                                    right: "0",
                                                                    top: "inherit",
                                                                    bottom: "inherit",
                                                                    zIndex: "3",
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                            {!timeEnd && (
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "1em",
                                        mt: "2em",
                                    }}
                                >
                                    {roomData.users.map((user, index) => (
                                        <Chip
                                            icon={<FaceIcon />}
                                            label={user.name}
                                            variant={
                                                user.answers[currNumber] !==
                                                undefined
                                                    ? "contained"
                                                    : "outlined"
                                            }
                                            color={
                                                index % 2 === 0
                                                    ? "success"
                                                    : "warning"
                                            }
                                        />
                                    ))}
                                </Grid>
                            )}
                            {timeEnd && (
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: "2em",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        onClick={nextQuestion}
                                    >
                                        Next question
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
