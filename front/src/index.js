import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
//? Pages
import Auth from './Pages/Auth/Page';
import Categories from './Pages/Categories/Page';
import Tasks from './Pages/Tasks/Page';
//? Components
import Navbar from './Components/Navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<><h2>Error 404</h2><br /><p>Page not found</p></>} />
                <Route path="/auth" element={<><Navbar /><Auth /></>} />
                <Route path="/categories" element={<><Navbar /><Categories /></>} />
                <Route path="/tasks" element={<><Navbar /><Tasks /></>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);