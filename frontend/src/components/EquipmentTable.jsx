import React from "react";

const EquipmentTable = ({ data, onEdit, onDelete }) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          fontFamily: "sans-serif",
          fontSize: "14px",
        }}
      >
        <thead style={{ backgroundColor: "#e5e7eb", color: "#111827" }}>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Code</th>
            <th style={cellStyle}>Category</th>
            <th style={cellStyle}>Lab</th>
            <th style={cellStyle}>Total Qty</th>
            <th style={cellStyle}>Available Qty</th>
            <th style={cellStyle}>Status</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                No equipment found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #d1d5db" }}>
                <td style={cellStyle}>{item.id}</td>
                <td style={cellStyle}>{item.name}</td>
                <td style={cellStyle}>{item.code}</td>
                <td style={cellStyle}>{item.category}</td>
                <td style={cellStyle}>{item.lab}</td>
                <td style={cellStyle}>{item.total_qty}</td>
                <td style={cellStyle}>{item.available_qty}</td>
                <td style={cellStyle}>{item.status}</td>
                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => onEdit && onEdit(item)} style={editBtnStyle}>
                      Edit
                    </button>
                    <button onClick={() => onDelete && onDelete(item.id)} style={deleteBtnStyle}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Common Styles
const cellStyle = {
  padding: "10px",
  border: "1px solid #d1d5db",
  textAlign: "left",
};

const editBtnStyle = {
  padding: "4px 10px",
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #6b7280",
  borderRadius: "4px",
  fontSize: "12px",
};

const deleteBtnStyle = {
  padding: "4px 10px",
  cursor: "pointer",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "12px",
};

export default EquipmentTable;