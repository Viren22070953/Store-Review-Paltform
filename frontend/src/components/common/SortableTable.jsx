import { useState } from "react";

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const thStyle = {
  background: "#333", color: "#fff", padding: "8px 12px",
  textAlign: "left", cursor: "pointer", userSelect: "none",
};
const tdStyle = { padding: "8px 12px", borderBottom: "1px solid #ddd" };

const SortableTable = ({ columns, data }) => {
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={thStyle} onClick={() => handleSort(col.key)}>
              {col.label} {sortKey === col.key ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ ...tdStyle, textAlign: "center" }}>
              No data found.
            </td>
          </tr>
        ) : (
          sorted.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
              {columns.map((col) => (
                <td key={col.key} style={tdStyle}>
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SortableTable;
