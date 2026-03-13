import React from "react";
import EquipmentTable from "./EquipmentTable";

const cardBase = {
  flex: 1,
  padding: "20px",
  borderRadius: "12px",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minWidth: "150px",
};

const Dashboard = ({
  equipment = [],
  issues = [],
  maintenance = [],
  onEditEquipment,
  onDeleteEquipment,
  onEditIssue,
  onDeleteIssue,
  onEditMaintenance,
  onDeleteMaintenance,
}) => {
  const totalEquipment = equipment.length;
  const faultyCount = equipment.filter((e) => e.status === "faulty").length;
  const totalIssues = issues.length;
  const totalMaintenance = maintenance.length;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Colorful Stat Cards */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexDirection: "row",
          overflowX: "auto",
          marginBottom: "40px",
        }}
      >
        <div style={{ ...cardBase, background: "linear-gradient(135deg, #1976D2, #42A5F5)" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Total Items</div>
          <div style={{ fontSize: "32px", fontWeight: "800" }}>{totalEquipment}</div>
        </div>

        <div style={{ ...cardBase, background: "linear-gradient(135deg, #D32F2F, #EF5350)" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Faulty Equipment</div>
          <div style={{ fontSize: "32px", fontWeight: "800" }}>{faultyCount}</div>
        </div>

        <div style={{ ...cardBase, background: "linear-gradient(135deg, #00796B, #26A69A)" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Issue Records</div>
          <div style={{ fontSize: "32px", fontWeight: "800" }}>{totalIssues}</div>
        </div>

        <div style={{ ...cardBase, background: "linear-gradient(135deg, #6A1B9A, #AB47BC)" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Maintenance Records</div>
          <div style={{ fontSize: "32px", fontWeight: "800" }}>{totalMaintenance}</div>
        </div>
      </div>

      {/* Equipment Table Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>All Equipment</h2>
        <EquipmentTable
          data={equipment}
          onEdit={onEditEquipment}
          onDelete={onDeleteEquipment}
        />
      </section>

      {/* Issue Records Table */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>Issue Records</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={commonTableStyle}>
            <thead style={commonHeaderStyle}>
              <tr>
                <th style={commonCellStyle}>ID</th>
                <th style={commonCellStyle}>Equip ID</th>
                <th style={commonCellStyle}>Issued To</th>
                <th style={commonCellStyle}>Lab</th>
                <th style={commonCellStyle}>Qty</th>
                <th style={commonCellStyle}>Date</th>
                <th style={commonCellStyle}>Return</th>
                <th style={commonCellStyle}>Status</th>
                <th style={commonCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>No issue records yet</td></tr>
              ) : (
                issues.map((x) => (
                  <tr key={x.id} style={{ borderBottom: "1px solid #d1d5db" }}>
                    <td style={commonCellStyle}>{x.id}</td>
                    <td style={commonCellStyle}>{x.equipment_id}</td>
                    <td style={commonCellStyle}>{x.issued_to}</td>
                    <td style={commonCellStyle}>{x.issued_lab}</td>
                    <td style={commonCellStyle}>{x.quantity}</td>
                    <td style={commonCellStyle}>{x.issue_date}</td>
                    <td style={commonCellStyle}>{x.return_date || "-"}</td>
                    <td style={commonCellStyle}>{x.status}</td>
                    <td style={commonCellStyle}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => onEditIssue && onEditIssue(x)} style={editBtnStyle}>Edit</button>
                        <button onClick={() => onDeleteIssue && onDeleteIssue(x.id)} style={deleteBtnStyle}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Maintenance Records Table */}
      <section>
        <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>Maintenance Records</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={commonTableStyle}>
            <thead style={commonHeaderStyle}>
              <tr>
                <th style={commonCellStyle}>ID</th>
                <th style={commonCellStyle}>Equip ID</th>
                <th style={commonCellStyle}>Fault</th>
                <th style={commonCellStyle}>Date</th>
                <th style={commonCellStyle}>Repair</th>
                <th style={commonCellStyle}>Return</th>
                <th style={commonCellStyle}>Status</th>
                <th style={commonCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No records yet</td></tr>
              ) : (
                maintenance.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #d1d5db" }}>
                    <td style={commonCellStyle}>{m.id}</td>
                    <td style={commonCellStyle}>{m.equipment_id}</td>
                    <td style={commonCellStyle}>{m.fault_description}</td>
                    <td style={commonCellStyle}>{m.fault_date}</td>
                    <td style={commonCellStyle}>{m.sent_for_repair_date || "-"}</td>
                    <td style={commonCellStyle}>{m.return_from_repair_date || "-"}</td>
                    <td style={commonCellStyle}>{m.status}</td>
                    <td style={commonCellStyle}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => onEditMaintenance && onEditMaintenance(m)} style={editBtnStyle}>Edit</button>
                        <button onClick={() => onDeleteMaintenance && onDeleteMaintenance(m.id)} style={deleteBtnStyle}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Common Styles for Consistency
const commonTableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff", border: "1px solid #ccc" };
const commonHeaderStyle = { backgroundColor: "#e5e7eb", color: "#151f36ff" };
const commonCellStyle = { padding: "10px", border: "1px solid #d1d5db", textAlign: "left", fontSize: "14px" };
const editBtnStyle = { padding: "4px 10px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #6b7280", borderRadius: "4px", fontSize: "12px" };
const deleteBtnStyle = { padding: "4px 10px", cursor: "pointer", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "4px", fontSize: "12px" };

export default Dashboard;