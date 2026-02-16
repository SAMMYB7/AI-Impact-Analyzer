import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulationProvider } from "./hooks/useSimulation";
import { PRProvider } from "./context/PRContext";
import MainLayout from "./components/layout/MainLayout";
import { Toaster } from "./components/ui/toaster";

// Pages
import Dashboard from "./pages/Dashboard";
import PRDetails from "./pages/PRDetails";
import PullRequestsPage from "./pages/PullRequestsPage";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import TestSelectionPage from "./pages/TestSelectionPage";
import TestExecutionPage from "./pages/TestExecutionPage";
import MetricsPage from "./pages/MetricsPage";
import LogsPage from "./pages/LogsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <SimulationProvider>
      <PRProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pr/:id" element={<PRDetails />} />
              <Route path="/pull-requests" element={<PullRequestsPage />} />
              <Route path="/analysis" element={<AIAnalysisPage />} />
              <Route path="/test-selection" element={<TestSelectionPage />} />
              <Route path="/test-runs" element={<TestExecutionPage />} />
              <Route path="/metrics" element={<MetricsPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </PRProvider>
    </SimulationProvider>
  );
}

export default App;
