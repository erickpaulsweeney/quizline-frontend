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

export default function Results() {
    const { id, pin } = useParams();
    const [user, setUser] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const navigate = useNavigate();
    console.log(chartData, quiz);

    const submitResult = async () => {
        const resultObj = {
            creator: user.data.id,
            quiz: id,
            results: roomData.users.map((user) => {
                return { name: user.name, score: user.score };
            }),
        };

        const response = await axiosClient.post("/result/new", resultObj);
        if (response.status !== 201) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Results successfully saved!");
            navigate("/");
        }
    };

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

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
            fetchQuizzes();

            socket.emit("get-data", pin);

            socket.on("update-data", (data) => {
                console.log(data);
                setRoomData(data);
                setChartData(data.chartData);
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
                    {user && (
                        <Grid container spacing={1}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
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
                                <Typography variant="h2">QuizLine</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "1em",
                                    mb: "2em",
                                }}
                            >
                                <Typography variant="h3" align="center" fontWeight="600">
                                    Game's Top Three
                                </Typography>
                                {chartData &&
                                    quiz &&
                                    chartData.map((item) => (
                                        <>
                                            <CircularProgress
                                                color="warning"
                                                variant="determinate"
                                                value={Math.round(
                                                    (item.score /
                                                        quiz.questions.length) *
                                                        100
                                                )}
                                            />
                                            <Typography variant="h5" fontWeight="500">
                                                {item.name}: {item.score}/
                                                {quiz.questions.length} ({Math.round(
                                                    (item.score /
                                                        quiz.questions.length) *
                                                        100
                                                )}%)
                                            </Typography>
                                        </>
                                    ))}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h5"
                                    align="center"
                                    gutterBottom
                                >
                                    Congratulations to everyone!
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => submitResult()}
                                >
                                    Save Results
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}
