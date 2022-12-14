import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api-config";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function EditQuiz() {
    const [user, setUser] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [curr, setCurr] = useState(null);
    const [questionType, setQuestionType] = useState("Multiple Choices");
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [list, setList] = useState([
        "Choice 1",
        "Choice 2",
        "Choice 3",
        "Choice 4",
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestionDialog, setNewQuestionDialog] = useState(false);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const [cancelDialog, setCancelDialog] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleCancelOpen = () => {
        setCancelDialog(true);
    };

    const handleCancelClose = () => {
        setCancelDialog(false);
    };

    const handleCancel = () => {
        localStorage.removeItem("editQuiz");
        navigate("/");
    };

    const handleNewQuestionOpen = () => {
        setNewQuestionDialog(true);
    };

    const handleNewQuestionClose = () => {
        setNewQuestionDialog(false);
        setCorrectAnswer(0);
    };

    const handleMcListOpen = (ev) => {
        setAnchorEl(ev.currentTarget);
    };

    const handleMcListClick = (event, index) => {
        setCorrectAnswer(index);
        setAnchorEl(null);
    };

    const handleMcListClose = () => {
        setAnchorEl(null);
    };

    const handleSelectedClick = (index) => {
        setSelected(index);
        setCorrectAnswer(questions[index].correctAnswer);
        setQuestionType(questions[index].type);
    };

    const swapQuizzes = (index, direction) => {
        const newQuestions = [...questions];
        [newQuestions[index], newQuestions[index + direction]] = [
            newQuestions[index + direction],
            newQuestions[index],
        ];
        setQuestions(newQuestions);
    };

    const handleTypeChange = (ev) => {
        setQuestionType(ev.target.value);
        if (ev.target.value === "Multiple Choices") {
            setList(["Choice 1", "Choice 2", "Choice 3", "Choice 4"]);
        } else {
            setList(["True", "False"]);
        }
    };

    const submitQuestion = async (input) => {
        const response = await axiosClient.post("question/new", input);
        if (response.status !== 201) {
            alert(response.response.data.message);
        } else {
            console.log(response.data);
            const newQuestions = [...questions];
            setQuestions(newQuestions.concat(response.data));
            alert("Question successfully added!");
            handleNewQuestionClose();
        }
    };

    const handleQuestionSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append("type", questionType);
        data.append("correctAnswer", correctAnswer);
        if (questionType === "Multiple Choices") {
            const choice1 = data.get("choice1");
            const choice2 = data.get("choice2");
            const choice3 = data.get("choice3");
            const choice4 = data.get("choice4");
            const choices = JSON.stringify([
                choice1,
                choice2,
                choice3,
                choice4,
            ]);
            data.append("choices", choices);
        } else if (questionType === "True or False") {
            const choices = JSON.stringify(["True", "False"]);
            data.append("choices", choices);
        }

        submitQuestion(data);
    };

    const deleteQuestion = async (id) => {
        const response = await axiosClient.delete(`/question/${id}`);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const newQuestions = questions.filter((el) => el._id !== id);
            setQuestions(newQuestions);
            alert("Question successfully deleted!");
            return;
        }
    };

    const submitEdit = async (input) => {
        const id = questions[selected]._id;
        const response = await axiosClient.post(`/question/${id}`, input);
        if (response.status !== 200) {
            alert(response.response.data.message);
        } else {
            const newQuestions = [...questions];
            newQuestions.splice(selected, 1, response.data);
            setQuestions(newQuestions);
            alert("Question successfully edited!");
        }
    };

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append("correctAnswer", correctAnswer);
        if (questionType === "Multiple Choices") {
            const choice1 = data.get("choice1");
            const choice2 = data.get("choice2");
            const choice3 = data.get("choice3");
            const choice4 = data.get("choice4");
            const choices = JSON.stringify([
                choice1,
                choice2,
                choice3,
                choice4,
            ]);
            data.append("choices", choices);
        } else if (questionType === "True or False") {
            const choices = JSON.stringify(["True", "False"]);
            data.append("choices", choices);
        }

        submitEdit(data);
    };

    const submitQuiz = async (input) => {
        const response = await axiosClient.post(
            `/quiz/edit/${curr._id}`,
            input
        );
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Quiz successfully edited!");
            localStorage.removeItem("editQuiz");
            navigate("/");
        }
    };

    const handleSubmitQuiz = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get("title");
        const subject = data.get("subject");
        const list = questions.map((el) => el._id);
        const reqBody = {
            title,
            subject,
            questions: list,
        };

        submitQuiz(reqBody);
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
        const quizId = JSON.parse(localStorage.getItem("editQuiz"));
        if (!data) {
            navigate("/login");
        } else if (!quizId) {
            navigate("/");
        } else {
            setUser(data);
            fetchQuizzes();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const quizId = JSON.parse(localStorage.getItem("editQuiz"));
        if (!curr && quizList.length > 0) {
            console.log(quizList);
            const currQuiz = quizList.filter((el) => el._id === quizId)[0];
            setCurr(currQuiz);
            setQuestions(currQuiz.questions);
        }
        // eslint-disable-next-line
    }, [quizList]);

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
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    {user && curr && (
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

                                <Typography variant="h5" align="center">
                                    Edit quiz
                                </Typography>

                                <form
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5em",
                                    }}
                                    onSubmit={handleSubmitQuiz}
                                >
                                    <TextField
                                        name="title"
                                        label="Title"
                                        variant="standard"
                                        defaultValue={curr.title}
                                        required
                                        fullWidth
                                        autoFocus
                                    />
                                    <TextField
                                        name="subject"
                                        label="Subject"
                                        variant="standard"
                                        defaultValue={curr.subject}
                                        required
                                        fullWidth
                                        sx={{
                                            mb: "2em",
                                        }}
                                    />

                                    {questions.length > 0 &&
                                        questions.map((item, index) => (
                                            <Card
                                                key={item._id}
                                                sx={{
                                                    position: "relative",
                                                    width: "100%",
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="500"
                                                        sx={{ mb: "0.5em" }}
                                                    >
                                                        Question:{" "}
                                                        {item.question}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{ mb: "0.5em" }}
                                                    >
                                                        Answer:{" "}
                                                        {
                                                            item.choices[
                                                                item
                                                                    .correctAnswer
                                                            ].text
                                                        }
                                                    </Typography>
                                                </CardContent>
                                                <ButtonGroup
                                                    sx={{
                                                        alignSelf: "flex-end",
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <IconButton
                                                        color="warning"
                                                        disabled={index === 0}
                                                        onClick={() => {
                                                            swapQuizzes(
                                                                index,
                                                                -1
                                                            );
                                                        }}
                                                    >
                                                        <ArrowCircleUpIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            deleteQuestion(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="success"
                                                        onClick={() =>
                                                            handleSelectedClick(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="warning"
                                                        disabled={
                                                            index ===
                                                            questions.length - 1
                                                        }
                                                        onClick={() => {
                                                            swapQuizzes(
                                                                index,
                                                                1
                                                            );
                                                        }}
                                                    >
                                                        <ArrowCircleDownIcon />
                                                    </IconButton>
                                                </ButtonGroup>
                                            </Card>
                                        ))}
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={handleNewQuestionOpen}
                                    >
                                        Add Question to Quiz
                                    </Button>
                                    <ButtonGroup
                                        variant="contained"
                                        color="success"
                                        sx={{ alignSelf: "center", mt: "1em" }}
                                    >
                                        <Button onClick={handleCancelOpen}>
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={questions.length === 0}
                                            type="submit"
                                        >
                                            Save Quiz
                                        </Button>
                                    </ButtonGroup>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {selected === null && (
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
                                <Typography variant="h5" align="center">
                                    Questions can be edited as you please!
                                </Typography>

                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ width: "90%" }}
                                >
                                    <Grid item xs={1}>
                                        <ArrowCircleUpIcon color="warning" />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="subtitle">
                                            Move the question higher in the list
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <DeleteIcon color="error" />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="subtitle">
                                            Remove the question from the quiz
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <VisibilityIcon color="success" />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="subtitle">
                                            View and edit the details of the
                                            question
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <ArrowCircleDownIcon color="warning" />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="subtitle">
                                            Move the question lower in the list
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                    {selected !== null && (
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
                                <form
                                    onSubmit={handleSubmitEdit}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1em",
                                        width: "100%",
                                    }}
                                >
                                    <TextField
                                        type="text"
                                        variant="standard"
                                        name="question"
                                        label="Question"
                                        fullWidth
                                        required
                                        defaultValue={
                                            questions[selected].question
                                        }
                                    />
                                    <FormControl required sx={{ mb: "1em" }}>
                                        <FormLabel id="type" name="type">
                                            Quiz Type
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            name="type"
                                            onChange={handleTypeChange}
                                            value={questionType}
                                            defaultValue={
                                                questions[selected].type
                                            }
                                        >
                                            <FormControlLabel
                                                value="Multiple Choices"
                                                control={<Radio />}
                                                label="Multiple Choices"
                                            />
                                            <FormControlLabel
                                                value="True or False"
                                                control={<Radio />}
                                                label="True or False"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    {questionType === "Multiple Choices" && (
                                        <>
                                            <Typography
                                                variant="body1"
                                                fontWeight="500"
                                                align="center"
                                            >
                                                Choices
                                            </Typography>
                                            <TextField
                                                name="choice1"
                                                label="Choice 1"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                defaultValue={
                                                    questions[selected]
                                                        ?.choices[0].text
                                                }
                                            />
                                            <TextField
                                                name="choice2"
                                                label="Choice 2"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                defaultValue={
                                                    questions[selected]
                                                        ?.choices[1].text
                                                }
                                            />
                                            <TextField
                                                name="choice3"
                                                label="Choice 3"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                defaultValue={
                                                    questions[selected]
                                                        ?.choices[2].text
                                                }
                                            />
                                            <TextField
                                                name="choice4"
                                                label="Choice 4"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                defaultValue={
                                                    questions[selected]
                                                        ?.choices[3].text
                                                }
                                            />
                                            <List component="nav">
                                                <ListItem
                                                    button
                                                    id="lock-button"
                                                    aria-haspopup="listbox"
                                                    aria-expanded={open}
                                                    onClick={handleMcListOpen}
                                                >
                                                    <ListItemText
                                                        primary="Select the correct answer"
                                                        secondary={
                                                            list[correctAnswer]
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                            <Menu
                                                id="lock-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleMcListClose}
                                                MenuListProps={{
                                                    "aria-labelledby":
                                                        "lock-button",
                                                    role: "listbox",
                                                }}
                                            >
                                                <MenuItem
                                                    key="Choice 1"
                                                    selected={
                                                        list[correctAnswer] ===
                                                        "Choice 1"
                                                    }
                                                    onClick={(event) =>
                                                        handleMcListClick(
                                                            event,
                                                            0
                                                        )
                                                    }
                                                >
                                                    Choice 1
                                                </MenuItem>
                                                <MenuItem
                                                    key="Choice 2"
                                                    selected={
                                                        list[correctAnswer] ===
                                                        "Choice 2"
                                                    }
                                                    onClick={(event) =>
                                                        handleMcListClick(
                                                            event,
                                                            1
                                                        )
                                                    }
                                                >
                                                    Choice 2
                                                </MenuItem>
                                                <MenuItem
                                                    key="Choice 3"
                                                    selected={
                                                        list[correctAnswer] ===
                                                        "Choice 3"
                                                    }
                                                    onClick={(event) =>
                                                        handleMcListClick(
                                                            event,
                                                            2
                                                        )
                                                    }
                                                >
                                                    Choice 3
                                                </MenuItem>
                                                <MenuItem
                                                    key="Choice 4"
                                                    selected={
                                                        list[correctAnswer] ===
                                                        "Choice 4"
                                                    }
                                                    onClick={(event) =>
                                                        handleMcListClick(
                                                            event,
                                                            3
                                                        )
                                                    }
                                                >
                                                    Choice 4
                                                </MenuItem>
                                            </Menu>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                component="label"
                                                name="image"
                                            >
                                                Upload Image for Question
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    hidden
                                                />
                                            </Button>
                                        </>
                                    )}
                                    {questionType === "True or False" && (
                                        <>
                                            <List component="nav">
                                                <ListItem
                                                    button
                                                    id="lock-button"
                                                    aria-haspopup="listbox"
                                                    aria-expanded={open}
                                                    onClick={handleMcListOpen}
                                                >
                                                    <ListItemText
                                                        primary="Select the correct answer"
                                                        secondary={
                                                            list[correctAnswer]
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                            <Menu
                                                id="lock-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleMcListClose}
                                                MenuListProps={{
                                                    "aria-labelledby":
                                                        "lock-button",
                                                    role: "listbox",
                                                }}
                                            >
                                                <MenuItem
                                                    key="True"
                                                    selected={
                                                        list[correctAnswer] ===
                                                        "True"
                                                    }
                                                    onClick={(event) =>
                                                        handleMcListClick(
                                                            event,
                                                            0
                                                        )
                                                    }
                                                >
                                                    True
                                                </MenuItem>
                                                <MenuItem
                                                    key="False"
                                                    selected={
                                                        list[correctAnswer] ===
                                                        "False"
                                                    }
                                                    onClick={(event) =>
                                                        handleMcListClick(
                                                            event,
                                                            1
                                                        )
                                                    }
                                                >
                                                    False
                                                </MenuItem>
                                            </Menu>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                component="label"
                                                name="image"
                                            >
                                                Upload Image for Question
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    hidden
                                                />
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        color="success"
                                        type="submit"
                                        variant="contained"
                                    >
                                        Save
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>

            <Dialog
                open={newQuestionDialog}
                onClose={handleNewQuestionClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle variant="h5">Create a quiz question</DialogTitle>
                <form onSubmit={handleQuestionSubmit}>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1em",
                        }}
                    >
                        <TextField
                            type="text"
                            variant="standard"
                            name="question"
                            label="Question"
                            fullWidth
                            required
                        />
                        <FormControl required sx={{ mb: "1em" }}>
                            <FormLabel id="type" name="type">
                                Quiz Type
                            </FormLabel>
                            <RadioGroup
                                row
                                name="type"
                                onChange={handleTypeChange}
                                value={questionType}
                            >
                                <FormControlLabel
                                    value="Multiple Choices"
                                    control={<Radio />}
                                    label="Multiple Choices"
                                />
                                <FormControlLabel
                                    value="True or False"
                                    control={<Radio />}
                                    label="True or False"
                                />
                            </RadioGroup>
                        </FormControl>
                        {questionType === "Multiple Choices" && (
                            <>
                                <Typography
                                    variant="body1"
                                    fontWeight="500"
                                    align="center"
                                >
                                    Choices
                                </Typography>
                                <TextField
                                    name="choice1"
                                    label="Choice 1"
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    name="choice2"
                                    label="Choice 2"
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    name="choice3"
                                    label="Choice 3"
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    name="choice4"
                                    label="Choice 4"
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                                <List component="nav">
                                    <ListItem
                                        button
                                        id="lock-button"
                                        aria-haspopup="listbox"
                                        aria-expanded={open}
                                        onClick={handleMcListOpen}
                                    >
                                        <ListItemText
                                            primary="Select the correct answer"
                                            secondary={list[correctAnswer]}
                                        />
                                    </ListItem>
                                </List>
                                <Menu
                                    id="lock-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMcListClose}
                                    MenuListProps={{
                                        "aria-labelledby": "lock-button",
                                        role: "listbox",
                                    }}
                                >
                                    <MenuItem
                                        key="Choice 1"
                                        selected={
                                            list[correctAnswer] === "Choice 1"
                                        }
                                        onClick={(event) =>
                                            handleMcListClick(event, 0)
                                        }
                                    >
                                        Choice 1
                                    </MenuItem>
                                    <MenuItem
                                        key="Choice 2"
                                        selected={
                                            list[correctAnswer] === "Choice 2"
                                        }
                                        onClick={(event) =>
                                            handleMcListClick(event, 1)
                                        }
                                    >
                                        Choice 2
                                    </MenuItem>
                                    <MenuItem
                                        key="Choice 3"
                                        selected={
                                            list[correctAnswer] === "Choice 3"
                                        }
                                        onClick={(event) =>
                                            handleMcListClick(event, 2)
                                        }
                                    >
                                        Choice 3
                                    </MenuItem>
                                    <MenuItem
                                        key="Choice 4"
                                        selected={
                                            list[correctAnswer] === "Choice 4"
                                        }
                                        onClick={(event) =>
                                            handleMcListClick(event, 3)
                                        }
                                    >
                                        Choice 4
                                    </MenuItem>
                                </Menu>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    component="label"
                                    name="image"
                                >
                                    Upload Image for Question
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        hidden
                                    />
                                </Button>
                            </>
                        )}
                        {questionType === "True or False" && (
                            <>
                                <List component="nav">
                                    <ListItem
                                        button
                                        id="lock-button"
                                        aria-haspopup="listbox"
                                        aria-expanded={open}
                                        onClick={handleMcListOpen}
                                    >
                                        <ListItemText
                                            primary="Select the correct answer"
                                            secondary={list[correctAnswer]}
                                        />
                                    </ListItem>
                                </List>
                                <Menu
                                    id="lock-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMcListClose}
                                    MenuListProps={{
                                        "aria-labelledby": "lock-button",
                                        role: "listbox",
                                    }}
                                >
                                    <MenuItem
                                        key="True"
                                        selected={
                                            list[correctAnswer] === "True"
                                        }
                                        onClick={(event) =>
                                            handleMcListClick(event, 0)
                                        }
                                    >
                                        True
                                    </MenuItem>
                                    <MenuItem
                                        key="False"
                                        selected={
                                            list[correctAnswer] === "False"
                                        }
                                        onClick={(event) =>
                                            handleMcListClick(event, 1)
                                        }
                                    >
                                        False
                                    </MenuItem>
                                </Menu>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    component="label"
                                    name="image"
                                >
                                    Upload Image for Question
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        hidden
                                    />
                                </Button>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNewQuestionClose} color="error">
                            Cancel
                        </Button>
                        <Button color="success" type="submit">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={cancelDialog} onClose={handleCancelClose}>
                <DialogTitle>
                    Are you sure you want to cancel creating this quiz?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Once confirmed, all your current progress will be lost
                        and cannot be retrieved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelClose}>
                        Return to editing
                    </Button>
                    <Button onClick={handleCancel}>
                        Confirm cancel creating quiz
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
