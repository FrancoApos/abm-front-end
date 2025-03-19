import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Formulario from "./formulario";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/formulario/:dni" element={<Formulario />} /> {/* ✅ URL con :dni */}
      </Routes>
    </Router>
  );
}

export default App;

