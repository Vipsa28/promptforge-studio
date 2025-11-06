import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import "./index.css";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PromptForm from "./components/PromptForm";
import PromptList from "./components/PromptList";
import TestPrompt from "./components/TestPrompt";
import MultiModelRunner from "./components/MultiModelRunner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="create" element={<PromptForm />} />
          <Route path="prompts" element={<PromptList />} />
          <Route path="runner" element={<TestPrompt />} />
          <Route path="compare" element={<MultiModelRunner />} />
          <Route path="compare" element={<MultiModelRunner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />

    {/*  Global Toast Notifications */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#4f46e5", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  </React.StrictMode>
);
