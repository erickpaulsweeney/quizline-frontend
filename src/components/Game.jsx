import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import axiosClient from "../api-config";
import { socket } from "./StartQuiz";

export default function Game() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [quiz, setQuiz] = useState([]);
    const [currNumber, setCurrNumber] = useState(-1);

    const fetchQuizzes = async () => {
        const response = await axiosClient.get("quiz");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const quiz = response.data.filter((el) => el.id === id)[0];
            setQuiz(quiz);
            setCurrNumber(0);
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
            fetchQuizzes();
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
            {user && quiz && currNumber >= 0 && (
                <Card
                    sx={{
                        width: "100%",
                        background: "#ffffffb0",
                        mt: "1em",
                        mb: "1em",
                        minHeight: "80vh",
                        display: "flex",
                        alignItems: "center",
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
                        <Typography variant="h2">QuizLine</Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
