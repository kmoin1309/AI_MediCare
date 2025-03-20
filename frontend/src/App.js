import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={Home}
        />
        <Route
          path="/patient"
          component={PatientDashboard}
        />
        <Route
          path="/doctor"
          component={DoctorDashboard}
        />
        <Route
          path="/auth"
          component={Auth}
        />
      </Switch>
    </Router>
  );
}
export default App;
