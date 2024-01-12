import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VStack } from "@chakra-ui/react";

import "./App.css";
import Home from "./pages/Home";
import Short from "./pages/Short";
import Header from "./Header";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <VStack>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/short" element={<Short />} />
          <Route path="/app/404" element={<NotFound />} />
          <Route path="/:shortcode" element={<Redirect />} />
        </Routes>
      </VStack>
    </Router>
  );
}

export default App;
