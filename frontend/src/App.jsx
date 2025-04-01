import { Routes, Route } from "react-router-dom"; 
import Dashboard from "./pages/Dashboard";
import GSTIN from "./pages/GSTIN";

function App() {
  return (
    <>
      <Routes>
        <Route path="/GSTIN" element={<GSTIN />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </>
  );
}

export default App;

