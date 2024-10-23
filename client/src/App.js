import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './Components/Register/Register.js';
import Participants from './Components/Participants/Participants.js';
import Header from './Components/Header/Header.js';

function App() {
  return (
    <Router>
          <Header /> 
          <Routes>
            <Route path="/" element={<RegisterH />} /> 
            <Route path="/participants" element={<ParticipantsH />} /> 
          </Routes>
    </Router>
  );
}

function RegisterH () {
  useDocumentTitle("Register");
  useScrollToTop();
  return <Register />;
}

function ParticipantsH () {
  useDocumentTitle("Participants");
  useScrollToTop();
  return <Participants />;
}

function useDocumentTitle(title) {
  const location = useLocation();
  useEffect(() => {
    document.title = title;
  }, [location, title]);
}

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

export default App;
