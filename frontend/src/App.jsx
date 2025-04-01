import { Routes, Route } from "react-router-dom"; 
import Dashboard from "./pages/Dashboard";
import GSTIN from "./pages/GSTIN";
import { Provider } from "react-redux";
import store from "./store/store.js";

function App() {
  return (
    <>
      <Provider store={store}>
      <Routes>
        <Route path="/GSTIN" element={<GSTIN />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
      </Provider>
      
    </>
  );
}

export default App;

