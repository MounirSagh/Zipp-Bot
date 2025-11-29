import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Departments from "./pages/departments";
import Services from "./pages/services";
import Issues from "./pages/issues";
import NotFound from "./pages/notfound";
import General from "./pages/general";
import Company from "./pages/Common/company";
import Pricing from "./pages/Common/pricing";
import Customers from "./pages/customers";
import Tickets from "./pages/tickets";
import Test from "./pages/Common/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/company" element={<Company />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/general"
          element={<General />}
        />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments"
          element={<Departments />}
        />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services"
          element={<Services />}
        />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/common-issues"
          element={<Issues />}
        />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/customers"
          element={<Customers />}
        />
        <Route
          path="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/tickets"
          element={<Tickets />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
