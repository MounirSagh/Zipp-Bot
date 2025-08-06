import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/admin';
import SignIn from './pages/signin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn /> } />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;