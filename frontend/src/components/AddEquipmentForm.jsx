import { useState } from "react";

const AddEquipmentForm = ({ apiBase, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    lab: "",
    total_qty: "1",
    available_qty: "1",
    status: "available",
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
      total_qty: Number(form.total_qty),
      available_qty: Number(form.available_qty),
    };

    try {
      const res = await fetch(`${apiBase}/equipments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to add equipment: ${errorData.detail || 'Unknown error'}`);
        return;
      }

      alert("Equipment record added");
      setForm({
        name: "",
        code: "",
        category: "",
        lab: "",
        total_qty: "1",
        available_qty: "1",
        status: "available",
      });
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error while adding equipment: " + err.message);
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
        Add Equipment Record
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
          {/* Equipment Name */}
          <div style={fieldCol}>
            <label style={label}>Equipment Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Equipment Code */}
          <div style={fieldCol}>
            <label style={label}>Equipment Code</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Category */}
          <div style={fieldCol}>
            <label style={label}>Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              style={input}
            />
          </div>

          {/* Lab */}
          <div style={fieldCol}>
            <label style={label}>Lab Location</label>
            <input
              type="text"
              name="lab"
              value={form.lab}
              onChange={handleChange}
              style={input}
            />
          </div>

          {/* Total Quantity */}
          <div style={fieldCol}>
            <label style={label}>Total Quantity</label>
            <input
              type="number"
              name="total_qty"
              value={form.total_qty}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* Available Quantity */}
          <div style={fieldCol}>
            <label style={label}>Available Quantity</label>
            <input
              type="number"
              name="available_qty"
              value={form.available_qty}
              onChange={handleChange}
              style={input}
              required
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
              <option value="available">available</option>
              <option value="issued">issued</option>
              <option value="faulty">faulty</option>
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
          Save Equipment Record
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

export default AddEquipmentForm;