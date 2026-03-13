import { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, data, onSave, title }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}>
            {Object.keys(formData).map((key) => {
              if (key === "id" || key === "created_at") return null;
              return (
                <div key={key} style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}:</label>
                  <input
                    style={inputStyle}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={saveButtonStyle}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle = { backgroundColor: "white", padding: "20px", borderRadius: "12px", width: "90%", maxWidth: "500px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" };
const inputStyle = { width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" };
const saveButtonStyle = { padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const cancelButtonStyle = { padding: "8px 16px", backgroundColor: "#9ca3af", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };

export default EditModal;