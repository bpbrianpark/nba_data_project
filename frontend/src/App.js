import Landing from './pages/Landing';
import MainPage from './pages/MainPage';
import QueryPage from './pages/QueryPage';
import GraphPage from './pages/GraphPage';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import PlayerPage from './pages/PlayerPage';
import PlayerOutlookPage from './pages/PlayerOutlookPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/database" element={<MainPage/>} />
        <Route path="/query" element={<QueryPage/>} />
        <Route path="/graph" element={<GraphPage/>} />
        <Route path="/playerpage" element={<PlayerPage/>} />
        <Route path="/playeroutlook" element={<PlayerOutlookPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
