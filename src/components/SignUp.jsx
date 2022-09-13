import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api-config";

export default function Signup() {
    const [user, setUser] = useState(null);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const navigate = useNavigate();

    const signUp = async (input) => {
        const response = await axiosClient.post("auth/signup", input, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(response)
        if (response.status !== 201) {
            alert(response.response.data.message);
            return;
        } else {
            alert(response.data.message);
            navigate("/");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get("name");
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");

        if (name.length < 4) {
            setNameError("Name must be at least 4 characters long.");
            return;
        }

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailError("Invalid email.");
            return;
        }

        if (password.length < 4) {
            setPasswordError("Password is at least 4 characters long.");
            return;
        }

        if (confirmPassword !== password) {
            setConfirmError("Passwords do not match.");
            return;
        }

        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmError("");

        signUp({ name, email, password, confirmPassword });
    };

    useEffect(() => {
        if (user) navigate("/");
        const data = JSON.parse(localStorage.getItem("quizUser"));
        if (data) {
            setUser(data);
        }
        // eslint-disable-next-line
    }, [user]);

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Card sx={{ width: "100%", background: "#ffffffb0" }}>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1em",
                    }}
                >
                    <Avatar
                        src="./images/QuizLine.webp"
                        alt="quizline logo"
                        sx={{ width: 100, height: 100, mb: "1em" }}
                    />
                    <Typography variant="h2" fontWeight="500">
                        QuizLine
                    </Typography>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5em",
                        }}
                    >
                        <TextField
                            name="name"
                            label="Name"
                            variant="outlined"
                            type="text"
                            fullWidth
                            required
                            autoFocus
                            error={nameError.length > 0}
                            helperText={nameError}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
                            error={emailError.length > 0}
                            helperText={emailError}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            error={passwordError.length > 0}
                            helperText={passwordError}
                        />
                        <TextField
                            name="confirmPassword"
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            error={confirmError.length > 0}
                            helperText={confirmError}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            sx={{ fontSize: "1.2em", mt: "1em" }}
                        >
                            Sign up
                        </Button>
                    </form>
                    <Typography variant="subtitle">
                        Already have an account?{" "}
                        <Link to="/login">Log in here!</Link>{" "}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
