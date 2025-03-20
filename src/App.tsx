import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Documents from './pages/Documents';
import { RootState } from './store';
import { AuthState } from './features/auth/authSlice';

const App: React.FC = () => {
  const auth = useSelector<RootState, AuthState>((state) => state.auth);

  
  if (!auth.token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/" element={<Documents />} />
      </Routes>
    </Router>
  );
};

export default App;