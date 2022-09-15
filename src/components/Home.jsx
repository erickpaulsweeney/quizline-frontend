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
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api-config";

export default function Home() {
    const [user, setUser] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [logoutDialog, setLogoutDialog] = useState(false);

    const handleEditClick = (id) => {
        localStorage.setItem("editQuiz", JSON.stringify(id));
        navigate("/quiz/edit");
    }

    const navigate = useNavigate();

    const handleLogoutOpen = () => {
        setLogoutDialog(true);
    };

    const handleLogoutClose = () => {
        setLogoutDialog(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("quizUser");
        localStorage.removeItem("editQuiz");
        setUser(null);
        navigate("/login");
    };

    const handleDelete = async (id) => {
        const response = await axiosClient.delete(`quiz/delete/${id}`);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const newList = quizList.filter(el => el._id !== id);
            setQuizList(newList);
            alert("Quiz successfully deleted!");
        }
    }

    const fetchQuizzes = async () => {
        const response = await axiosClient.get("quiz");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setQuizList(response.data);
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data);
            fetchQuizzes();
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
                        <Typography variant="h2">QuizLine</Typography>

                        <Typography variant="h5" align="center">
                            Welcome to another day of learning,{" "}
                            <strong>{user.data.name}</strong>!
                        </Typography>

                        {quizList.length === 0 && (
                            <Typography variant="button" align="center">
                                You have no quiz list yet. <br /> Create one
                                now!
                            </Typography>
                        )}

                        {quizList.length > 0 &&
                            quizList.map((quiz) => (
                                <Card
                                    key={quiz._id}
                                    elevation={5}
                                    sx={{ width: "100%" }}
                                >
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            align="center"
                                            sx={{ fontSize: "2em" }}
                                        >
                                            {quiz.title}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {quiz.subject}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            mb: "1em",
                                        }}
                                    >
                                        <ButtonGroup
                                            variant="contained"
                                            color="success"
                                        >
                                            <Button onClick={() => handleEditClick(quiz._id)}>Edit</Button>
                                            <Button><Link to={`quiz/play/${quiz._id}`} style={{ textDecoration: "none", color: "inherit" }}>Start</Link></Button>
                                            <Button onClick={() => handleDelete(quiz._id)}>Delete</Button>
                                        </ButtonGroup>
                                    </CardActions>
                                </Card>
                            ))}

                        <Button
                            variant="contained"
                            color="warning"
                            href="/quiz/new"
                        >
                            Add new quiz
                        </Button>

                        <Button
                            color="success"
                            sx={{ fontWeight: 600 }}
                            onClick={handleLogoutOpen}
                        >
                            Log out
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Dialog open={logoutDialog} onClose={handleLogoutClose}>
                <DialogTitle>Are you sure you want to logout?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleLogoutClose}>Close</Button>
                    <Button onClick={handleLogout} color="error">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
