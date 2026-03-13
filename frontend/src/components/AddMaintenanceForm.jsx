import { useState } from "react";

const AddMaintenanceForm = ({ apiBase, onSuccess }) => {
  const [form, setForm] = useState({
    equipment_id: "",
    fault_description: "",
    fault_date: "",
    sent_for_repair_date: "",
    return_from_repair_date: "",
    status: "pending",
    remarks: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setDebugInfo("");

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError("You need to be logged in to add maintenance records");
      alert("Please login first!");
      setLoading(false);
      return;
    }

    // Validate equipment_id is a number
    const equipmentId = parseInt(form.equipment_id);
    if (isNaN(equipmentId) || equipmentId <= 0) {
      setError("Equipment ID must be a valid positive number");
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!form.fault_description.trim()) {
      setError("Fault description is required");
      setLoading(false);
      return;
    }

    if (!form.fault_date.trim()) {
      setError("Fault date is required");
      setLoading(false);
      return;
    }

    // Prepare payload exactly as backend expects
    const payload = {
      equipment_id: equipmentId,
      fault_description: form.fault_description.trim(),
      fault_date: form.fault_date.trim(),
      sent_for_repair_date: form.sent_for_repair_date.trim() || null,
      return_from_repair_date: form.return_from_repair_date.trim() || null,
      status: form.status,
      remarks: form.remarks.trim() || null,
    };

    console.log("📤 Sending payload to backend:", payload);
    console.log("🔗 API URL:", `${apiBase}/maintenance`);

    try {
      const res = await fetch(`${apiBase}/maintenance`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);

      // Try to parse response
      let responseData;
      try {
        responseData = await res.json();
        console.log("Response data:", responseData);
      } catch (parseError) {
        console.error("Could not parse JSON response:", parseError);
        responseData = null;
      }

      if (!res.ok) {
        let errorMsg = `Failed to add maintenance record (HTTP ${res.status})`;
        
        if (responseData) {
          // Extract error message from response
          if (typeof responseData.detail === 'string') {
            errorMsg = responseData.detail;
          } else if (Array.isArray(responseData.detail)) {
            errorMsg = responseData.detail.map(d => {
              if (typeof d === 'object' && d.msg) {
                return `${d.loc ? d.loc.join('.') + ': ' : ''}${d.msg}`;
              }
              return String(d);
            }).join(', ');
          } else if (responseData.message) {
            errorMsg = responseData.message;
          } else if (typeof responseData === 'string') {
            errorMsg = responseData;
          }
        } else {
          errorMsg = await res.text().catch(() => errorMsg);
        }
        
        setError(errorMsg);
        setDebugInfo(JSON.stringify({ status: res.status, error: errorMsg, payload }, null, 2));
        alert(`Failed to add maintenance record:\n${errorMsg}`);
        return;
      }

      // Success!
      console.log("Success! Created maintenance record:", responseData);

      alert("Maintenance record added successfully!");
      
      // Reset form
      setForm({
        equipment_id: "",
        fault_description: "",
        fault_date: "",
        sent_for_repair_date: "",
        return_from_repair_date: "",
        status: "pending",
        remarks: "",
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Network error:", err);
      const errorMsg = err.message || "Network error. Please check your connection.";
      setError(errorMsg);
      setDebugInfo(`Network Error: ${err.message}\n\nStack: ${err.stack}`);
      alert("Error while adding maintenance record: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        maxWidth: "650px",
        margin: "40px auto",
        padding: "28px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "22px",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        Add Maintenance Record
      </h2>

      {/* Error Display */}
      {error && (
        <div style={{
          background: "#fee",
          border: "1px solid #f99",
          color: "#c00",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 2 Column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          {/* Equipment ID */}
          <div style={fieldCol}>
            <label style={label}>
              Equipment ID *
            </label>
            <input
              type="number"
              name="equipment_id"
              value={form.equipment_id}
              onChange={handleChange}
              style={{...input, borderColor: form.equipment_id ? (parseInt(form.equipment_id) > 0 ? "#10b981" : "#ef4444") : "#cbd5e1"}}
              required
              disabled={loading}
              min="1"
              step="1"
              placeholder=""
            />
            <small style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              
            </small>
          </div>

          {/* Fault Date */}
          <div style={fieldCol}>
            <label style={label}>Fault Date *</label>
            <input
              type="text"
              name="fault_date"
              value={form.fault_date}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
              style={input}
              required
              disabled={loading}
              pattern="\d{2}-\d{2}-\d{4}"
              title="Enter date in MM-DD-YYYY format"
            />
            <small style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              
            </small>
          </div>

          {/* Fault Description full width */}
          <div style={{ gridColumn: "1 / span 2", display: "flex", flexDirection: "column" }}>
            <label style={label}>Fault Description *</label>
            <input
              name="fault_description"
              value={form.fault_description}
              onChange={handleChange}
              placeholder=""
              style={input}
              required
              disabled={loading}
            />
          </div>

          {/* Sent for Repair */}
          <div style={fieldCol}>
            <label style={label}>Sent for Repair (optional)</label>
            <input
              type="text"
              name="sent_for_repair_date"
              value={form.sent_for_repair_date}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
              style={input}
              disabled={loading}
              pattern="\d{2}-\d{2}-\d{4}"
              title="Enter date in MM-DD-YYYY format"
            />
          </div>

          {/* Return from Repair */}
          <div style={fieldCol}>
            <label style={label}>Returned from Repair (optional)</label>
            <input
              type="text"
              name="return_from_repair_date"
              value={form.return_from_repair_date}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
              style={input}
              disabled={loading}
              pattern="\d{2}-\d{2}-\d{4}"
              title="Enter date in MM-DD-YYYY format"
            />
          </div>

          {/* Status full width */}
          <div style={{ gridColumn: "1 / span 2", display: "flex", flexDirection: "column" }}>
            <label style={label}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={input}
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="repairing">Repairing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Remarks full width */}
          <div style={{ gridColumn: "1 / span 2", display: "flex", flexDirection: "column" }}>
            <label style={label}>Remarks (optional)</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Additional notes, repair details, costs, etc..."
              style={{...input, minHeight: "80px", resize: "vertical"}}
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "26px",
            width: "100%",
            padding: "12px",
            background: loading ? "#94a3b8" : "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease",
            position: "relative",
            ":hover": !loading && {
              background: "#0284c7",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
            }
          }}
        >
          {loading ? (
            <>
              <span style={{ display: "inline-block", marginRight: "8px" }}>
              </span>
              Saving...
            </>
          ) : (
            <>
              <span style={{ display: "inline-block", marginRight: "8px" }}>
              </span>
              Save Maintenance Record
            </>
          )}
        </button>
      </form>
      
      {/* Debug Info Panel */}
      <details style={{ 
        marginTop: "20px", 
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <summary style={{
          padding: "12px 16px",
          background: "#f8fafc",
          cursor: "pointer",
          fontWeight: 600,
          color: "#475569",
          fontSize: "14px"
        }}>
          🔧 Debug Information (Click to expand)
        </summary>
        <div style={{ 
          padding: "16px",
          background: "#f1f5f9",
          fontSize: "12px",
          color: "#475569",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          maxHeight: "200px",
          overflowY: "auto"
        }}>
          <div><strong>API Base:</strong> {apiBase || "Not set"}</div>
          <div><strong>Token:</strong> {localStorage.getItem('token') ? "✓ Present" : "✗ Missing (Login required)"}</div>
          <div><strong>User:</strong> {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : "Not logged in"}</div>
          <div><strong>Form Data:</strong> {JSON.stringify(form, null, 2)}</div>
          {debugInfo && (
            <>
              <div><strong>Last Error:</strong></div>
              <div>{debugInfo}</div>
            </>
          )}
        </div>
      </details>

      {/* Quick Help */}
      <div style={{ 
        marginTop: "20px", 
        padding: "12px 16px",
        background: "#f0f9ff",
        border: "1px solid #bae6fd",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#0369a1"
      }}>
        <strong>💡 Quick Tips:</strong>
        <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
          <li>Make sure Equipment ID exists in your equipment list</li>
          <li>Use date format: MM-DD-YYYY (e.g., 12-05-2025)</li>
          <li>You must be logged in to add records</li>
          <li>Check browser console (F12) for detailed error messages</li>
        </ul>
      </div>
    </div>
  );
};

// Shared Styling
const fieldCol = { display: "flex", flexDirection: "column" };

const label = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "6px",
  color: "#475569",
  display: "flex",
  alignItems: "center"
};

const input = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "white",
  transition: "border-color 0.2s ease",
  ":focus": {
    borderColor: "#0ea5e9",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)"
  },
  ":disabled": {
    backgroundColor: "#f8fafc",
    cursor: "not-allowed"
  }
};

export default AddMaintenanceForm;