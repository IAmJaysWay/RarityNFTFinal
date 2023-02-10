import "./App.css";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home"
import Collection from "./components/Collection"
import {Routes, Route} from "react-router-dom";



function App() {
  return (
    <Layout className="mainWindow">
      <Sidebar />
      <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection/:contract" element={<Collection />} />
      </Routes>
    </Layout>
  );
}

export default App;
