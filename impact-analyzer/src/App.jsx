import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulationProvider } from "./hooks/useSimulation";
import { PRProvider } from "./context/PRContext";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import PublicLayout from "./components/layout/PublicLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import GuestRoute from "./components/shared/GuestRoute";
import { Toaster } from "./components/ui/toaster";

// Public Pages
import HomePage from "./pages/HomePage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GithubCallbackPage from "./pages/GithubCallbackPage";

// App Pages
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
    <AuthProvider>
      <SimulationProvider>
        <PRProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Pages with Navbar & Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />

                {/* Redirect logged-in users away from auth pages */}
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
              </Route>

              {/* GitHub callback (standalone — no navbar/footer needed) */}
              <Route
                path="/auth/github/callback"
                element={<GithubCallbackPage />}
              />

              {/* Protected App Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pr/:id" element={<PRDetails />} />
                  <Route
                    path="/pull-requests"
                    element={<PullRequestsPage />}
                  />
                  <Route path="/analysis" element={<AIAnalysisPage />} />
                  <Route
                    path="/test-selection"
                    element={<TestSelectionPage />}
                  />
                  <Route path="/test-runs" element={<TestExecutionPage />} />
                  <Route path="/metrics" element={<MetricsPage />} />
                  <Route path="/logs" element={<LogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </PRProvider>
      </SimulationProvider>
    </AuthProvider>
  );
}

export default App;
