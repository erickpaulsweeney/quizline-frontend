import React from "react";
import { Routes, Route } from "react-router-dom";
import EditQuiz from "./EditQuiz";
import Game from "./Game";
import Home from "./Home";
import Login from "./Login";
import NewQuiz from "./NewQuiz";
import Player from "./Player";
import Signup from "./SignUp";
import StartQuiz from "./StartQuiz";

export default function App() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/quiz/new" element={<NewQuiz />} />
            <Route path="/quiz/edit" element={<EditQuiz />} />
            <Route path="/quiz/play/:id" element={<StartQuiz />} />
            <Route path="/quiz/game/:id/:pin" element={<Game />} />
            <Route path="/player" element={<Player />} />
        </Routes>
    );
}
