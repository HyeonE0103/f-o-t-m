import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Hi</div>} />
      <Route path="/hi" element={<div>Bye</div>} />
      <Route path="/bye" element={<div>Birthday</div>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
