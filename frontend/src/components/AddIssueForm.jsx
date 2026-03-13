import { useState } from "react";

const AddIssueForm = ({ apiBase, onSuccess }) => {
  const [form, setForm] = useState({
    equipment_id: "",
    issued_to: "",
    issued_lab: "",
    quantity: "1",
    issue_date: "",
    return_date: "",
    status: "issued",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login first!");
      return;
    }

    const payload = {
      ...form,
      equipment_id: Number(form.equipment_id),
      quantity: Number(form.quantity),
      return_date: form.return_date || null,
    };

    try {
      const res = await fetch(`${apiBase}/issues`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        try {
          const errorData = await res.json();
          alert(`Failed to add issue record: ${errorData.detail || 'Unknown error'}`);
        } catch (parseError) {
          alert(`Failed to add issue record (HTTP ${res.status})`);
        }
        return;
      }

      // Handle success response
      try {
        const successData = await res.json();
        console.log("Issue record added:", successData);
      } catch (parseError) {
        console.log("Note: Response was successful but no JSON data returned");
      }

      alert("Issue record added successfully!");
      setForm({
        equipment_id: "",
        issued_to: "",
        issued_lab: "",
        quantity: "1",
        issue_date: "",
        return_date: "",
        status: "issued",
      });
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Network error:", err);
      alert("Error while adding issue record: " + err.message);
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
        Add Issue Record
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 2 Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          {/* Equipment ID */}
          <div style={fieldCol}>
            <label style={label}>Equipment ID</label>
            <input
              type="number"
              name="equipment_id"
              value={form.equipment_id}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Issued To */}
          <div style={fieldCol}>
            <label style={label}>Issued To</label>
            <input
              name="issued_to"
              value={form.issued_to}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Issued Lab */}
          <div style={fieldCol}>
            <label style={label}>Issued Lab</label>
            <input
              name="issued_lab"
              value={form.issued_lab}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Quantity */}
          <div style={fieldCol}>
            <label style={label}>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Issue Date */}
          <div style={fieldCol}>
            <label style={label}>Issue Date</label>
            <input
              name="issue_date"
              value={form.issue_date}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
              style={input}
              required
            />
          </div>

          {/* Return Date */}
          <div style={fieldCol}>
            <label style={label}>Return Date (optional)</label>
            <input
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              placeholder="MM-DD-YYYY"
              style={input}
            />
          </div>

          {/* Status Full Width */}
          <div style={{ gridColumn: "1 / span 2", display: "flex", flexDirection: "column" }}>
            <label style={label}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={input}
            >
              <option value="issued">issued</option>
              <option value="returned">returned</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "26px",
            width: "100%",
            padding: "12px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Save Issue Record
        </button>
      </form>
    </div>
  );
};

// Shared Styling
const fieldCol = { display: "flex", flexDirection: "column" };

const label = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "4px",
  color: "#475569",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
};

export default AddIssueForm;