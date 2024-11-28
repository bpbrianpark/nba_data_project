import Landing from './pages/Landing';
import MainPage from './pages/MainPage';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/database" element={<MainPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
