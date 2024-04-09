import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import InteractiveMap from "./InteractiveMap";
import BackupsPage from "./BackupsPage";
import { GlobalStateProvider } from './GlobalState';

const App = () => {
  return (
    <GlobalStateProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interactive_map" element={<InteractiveMap />} />
        <Route path="/backups" element={<BackupsPage/>}/>
      </Routes>
    </Router>
    </GlobalStateProvider>
  );
};

export default App;
