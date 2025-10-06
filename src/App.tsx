import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/signin'
import Dashboard from './pages/dashboard';
import Departments from './pages/departments';
import Services from './pages/services';
import Issues from './pages/issues';
import NotFound from './pages/notfound';
import General from './pages/general';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn /> } />
        <Route path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" element={<Dashboard />} />
        <Route path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/general" element={<General />} />
        <Route path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments" element={<Departments />} />
        <Route path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services" element={<Services />} />
        <Route path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/common-issues" element={<Issues />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;