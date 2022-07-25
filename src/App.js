import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import Navbar from "./NavBar";
import PrivateRoute from "./components/user/PrivateRoute";
import MainPage from "./pages/MainPage";
import PageLogin from "./pages/PageLogin";
import PageReset from "./pages/PageReset";
import PageRegister from "./pages/PageRegister";
import PageFriends from "./pages/PageFriends";
import Modules from "./components/modules/Modules";
import FocusRoom from "./components/rooms/FocusRoom";
import Scoreboard from "./components/scoreboard/scoreboard";

import Timer from "./pages/Timer";


export default function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route exact path="/login" element={<PageLogin />} />
          <Route exact path="/reset" element={<PageReset />} />
          <Route exact path="/register" element={<PageRegister />} />
          <Route exact path="/friends" element={<PageFriends />} />
          <Route exact path="/modules" element={<Modules />} />
          <Route exact path="/timer" element={<><Timer/></>} />
          <Route exact path="/focusroom" element={<FocusRoom />} />
          <Route exact path="/scoreboard" element={<Scoreboard />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>{" "}
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );


}
