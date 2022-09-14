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

export default function Login() {
    const [user, setUser] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const logIn = async (input) => {
        const response = await axiosClient.post("auth/login", input, {
            headers: { "Content-Type": "application/json" },
        });
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            localStorage.setItem("quizUser", JSON.stringify(response.data));
            navigate("/");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailError("Invalid email.");
            return;
        }

        if (password.length < 4) {
            setPasswordError("Password is at least 4 characters long.");
            return;
        }

        setEmailError("");
        setPasswordError("");

        logIn({ email, password });
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
                    <Typography variant="h2" >
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
                            name="email"
                            label="Email"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
                            autoFocus
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
                        <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            sx={{ fontSize: "1.2em", mt: "1em" }}
                        >
                            Log in
                        </Button>
                    </form>
                    <Typography variant="subtitle">
                        No account yet? <Link to="/signup">Sign up here!</Link>{" "}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
