import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/Login';
import Home from './page/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen min-w-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;