import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddEquipmentForm from "./components/AddEquipmentForm";
import AddIssueForm from "./components/AddIssueForm";
import AddMaintenanceForm from "./components/AddMaintenanceForm";
import EditModal from "./components/EditModal";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { getEquipments, getIssues, getMaintenance, createEquipment, updateEquipment, deleteEquipment, createIssue, updateIssue, deleteIssue, createMaintenance, updateMaintenance, deleteMaintenance, logout } from "./utils/api";
import { isAuthenticated, getUserInfo } from "./utils/auth";

// API Base URL
const API_BASE_URL = "http://localhost:8000";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [equipment, setEquipment] = useState([]);
  const [issues, setIssues] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editType, setEditType] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userData = getUserInfo();
    setUser(userData);
    
    if (isAuthenticated()) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const [eqRes, issRes, maintRes] = await Promise.all([
        getEquipments(),
        getIssues(),
        getMaintenance(),
      ]);

      setEquipment(eqRes.data);
      setIssues(issRes.data);
      setMaintenance(maintRes.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const handleDataChanged = () => {
    loadData();
  };

  const openEditModal = (item, type) => {
    setCurrentEditItem(item);
    setEditType(type);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      if (editType === "equipment") {
        await updateEquipment(updatedData.id, updatedData);
      } else if (editType === "issue") {
        await updateIssue(updatedData.id, updatedData);
      } else if (editType === "maintenance") {
        await updateMaintenance(updatedData.id, updatedData);
      }

      alert(`${editType} updated successfully!`);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error while updating record");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type} record?`)) return;

    try {
      if (type === "equipment") {
        await deleteEquipment(id);
      } else if (type === "issue") {
        await deleteIssue(id);
      } else if (type === "maintenance") {
        await deleteMaintenance(id);
      }

      loadData();
    } catch (err) {
      console.error(err);
      alert("Error while deleting record");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarButtonStyle = (tabName) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    marginBottom: "8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: activeTab === tabName ? "#60a5fa" : "transparent",
    color: "#f9fafb",
    fontWeight: activeTab === tabName ? "bold" : "normal",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f3f4f6" }}>
      {/* LEFT SIDEBAR */}
      <aside style={{ width: "230px", background: "linear-gradient(180deg,#1f2937,#111827)", color: "#f9fafb", padding: "20px 16px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Lab Inventory</h2>
        
        {/* User Info */}
        {user && (
          <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}>
            <p style={{ fontSize: "14px", marginBottom: "5px" }}>Logged in as:</p>
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>{user.username}</p>
            <p style={{ fontSize: "12px", opacity: 0.8 }}>{user.email}</p>
          </div>
        )}
        
        <button style={sidebarButtonStyle("dashboard")} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button style={sidebarButtonStyle("addEquipment")} onClick={() => setActiveTab("addEquipment")}>Add Equipment</button>
        <button style={sidebarButtonStyle("addIssue")} onClick={() => setActiveTab("addIssue")}>Add Issue Record</button>
        <button style={sidebarButtonStyle("addMaintenance")} onClick={() => setActiveTab("addMaintenance")}>Add Maintenance</button>
        
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button 
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "24px 32px" }}>
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Department Lab Inventory</h1>
        </header>

        {activeTab === "dashboard" && (
          <Dashboard
            equipment={equipment}
            issues={issues}
            maintenance={maintenance}
            onEditEquipment={(item) => openEditModal(item, "equipment")}
            onDeleteEquipment={(id) => handleDelete(id, "equipment")}
            onEditIssue={(item) => openEditModal(item, "issue")}
            onDeleteIssue={(id) => handleDelete(id, "issue")}
            onEditMaintenance={(item) => openEditModal(item, "maintenance")}
            onDeleteMaintenance={(id) => handleDelete(id, "maintenance")}
          />
        )}

        {activeTab === "addEquipment" && <AddEquipmentForm apiBase={API_BASE_URL} onSuccess={handleDataChanged} />}
        {activeTab === "addIssue" && <AddIssueForm apiBase={API_BASE_URL} onSuccess={handleDataChanged} />}
        {activeTab === "addMaintenance" && <AddMaintenanceForm apiBase={API_BASE_URL} onSuccess={handleDataChanged} />}

        {/* EDIT MODAL */}
        <EditModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          data={currentEditItem} 
          onSave={handleSaveEdit}
          title={`Update ${editType}`}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;