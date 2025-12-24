import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './login/Login'
import Register from './register/Register'





export default function Auth() {
    return (
        <>
            <Routes>
                <Route path="/login" element={< Login />} />
                < Route path="/register" element={< Register />} />
            </Routes>
        </>
    )
}