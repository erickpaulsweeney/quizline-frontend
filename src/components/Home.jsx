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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api-config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Home() {
    const [user, setUser] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [category, setCategory] = useState("Quizzes");
    const [logoutDialog, setLogoutDialog] = useState(false);
    const navigate = useNavigate();

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleEditClick = (id) => {
        localStorage.setItem("editQuiz", JSON.stringify(id));
        navigate("/quiz/edit");
    };

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
            const newList = quizList.filter((el) => el._id !== id);
            setQuizList(newList);
            alert("Quiz successfully deleted!");
        }
    };

    const fetchResults = async () => {
        const response = await axiosClient.get("result");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setResultList(response.data);
        }
    };

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
            fetchResults();
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

                        <FormControl>
                            <FormLabel>View:</FormLabel>
                            <RadioGroup
                                row
                                name="category"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <FormControlLabel
                                    value="Quizzes"
                                    control={<Radio />}
                                    label="Quizzes"
                                />
                                <FormControlLabel
                                    value="Results"
                                    control={<Radio />}
                                    label="Results"
                                />
                            </RadioGroup>
                        </FormControl>

                        {category === "Quizzes" && quizList.length === 0 && (
                            <Typography variant="button" align="center">
                                You have no quiz list yet. <br /> Create one
                                now!
                            </Typography>
                        )}

                        {category === "Quizzes" &&
                            quizList.length > 0 &&
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
                                            <Button
                                                onClick={() =>
                                                    handleEditClick(quiz._id)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button>
                                                <Link
                                                    to={`quiz/play/${quiz._id}`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "inherit",
                                                    }}
                                                >
                                                    Start
                                                </Link>
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleDelete(quiz._id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                    </CardActions>
                                </Card>
                            ))}

                        {category === "Results" &&
                            resultList.map((result, index) => (
                                <Accordion key={result._id} sx={{ width: "100%" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${
                                            index + 1
                                        }a-content`}
                                        id={`panel${index + 1}a-header`}
                                    >
                                        <Typography variant="h6">{result.quiz.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {result.results.map((player) => (
                                            <Typography>{player.name}: {player.score}/{result.quiz.questions.length}</Typography>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
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
