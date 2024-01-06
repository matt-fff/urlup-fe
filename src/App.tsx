import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VStack } from "@chakra-ui/react";

import "./App.css";
import Home from "./pages/Home";
import Short from "./pages/Short";
import Header from "./Header";

function App() {
  return (
    <Router>
      <VStack>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/short" element={<Short />} />
        </Routes>
      </VStack>
    </Router>
  );
}

export default App;
