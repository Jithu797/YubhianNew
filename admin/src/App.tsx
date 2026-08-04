import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ContentEditor from "./pages/ContentEditor";
import ServicesManager from "./pages/ServicesManager";
import ProductManager from "./pages/ProductManager";
import TeamManager from "./pages/TeamManager";
import BlogList from "./pages/BlogList";
import BlogEditor from "./pages/BlogEditor";
import TestimonialsManager from "./pages/TestimonialsManager";
import ClientsManager from "./pages/ClientsManager";
import CareersManager from "./pages/CareersManager";
import CareerApplicationsInbox from "./pages/CareerApplicationsInbox";
import LeadsInbox from "./pages/LeadsInbox";
import Settings from "./pages/Settings";

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/content" element={<Protected><ContentEditor /></Protected>} />
      <Route path="/services" element={<Protected><ServicesManager /></Protected>} />
      <Route path="/product" element={<Protected><ProductManager /></Protected>} />
      <Route path="/team" element={<Protected><TeamManager /></Protected>} />
      <Route path="/blogs" element={<Protected><BlogList /></Protected>} />
      <Route path="/blogs/new" element={<Protected><BlogEditor /></Protected>} />
      <Route path="/blogs/edit/:id" element={<Protected><BlogEditor /></Protected>} />
      <Route path="/testimonials" element={<Protected><TestimonialsManager /></Protected>} />
      <Route path="/clients" element={<Protected><ClientsManager /></Protected>} />
      <Route path="/careers" element={<Protected><CareersManager /></Protected>} />
      <Route path="/career-applications" element={<Protected><CareerApplicationsInbox /></Protected>} />
      <Route path="/leads" element={<Protected><LeadsInbox /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
