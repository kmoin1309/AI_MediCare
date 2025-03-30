import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import PatientDashboard from "./pages/PatientDashboard";
// import DoctorDashboard from "./pages/DoctorDashboard";
// import Auth from "./pages/Auth";
import CreateBot from "./pages/chatbot";

function App() {
  return (
    <Router>
      <Routes> 
        {/* <Route
          exact
          path="/"
          element={<Home />}
        />
        <Route
          path="/patient"
          element={<PatientDashboard />}
        />
        <Route
          path="/doctor"
          element={<DoctorDashboard />}
        />
        <Route
          path="/auth"
          element={<Auth />}
        /> */}
        <Route
          path="/doctor/chatbot"
          element={<CreateBot />}
        />
      </Routes>
    </Router>
  );
}
export default App;