import React from "react";
import { Routes, Route } from "react-router-dom";
import EditQuiz from "./EditQuiz";
import Home from "./Home";
import Login from "./Login";
import NewQuiz from "./NewQuiz";
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
        </Routes>
    );
}
