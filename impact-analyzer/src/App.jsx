import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulationProvider } from "./hooks/useSimulation";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import PullRequestsPage from "./pages/PullRequestsPage";
import AnalysisPage from "./pages/AnalysisPage";
import TestSelectionPage from "./pages/TestSelectionPage";
import TestExecutionPage from "./pages/TestExecutionPage";
import MetricsPage from "./pages/MetricsPage";
import LogsPage from "./pages/LogsPage";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pull-requests" element={<PullRequestsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/test-selection" element={<TestSelectionPage />} />
            <Route path="/test-runs" element={<TestExecutionPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </SimulationProvider>
  );
}

export default App;
