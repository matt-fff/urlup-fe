import { lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VStack } from "@chakra-ui/react";

import Header from "./Header";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Short = lazy(() => import("./pages/Short"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Router>
      <VStack>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/short" element={<Short />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </VStack>
    </Router>
  );
}

export default App;
