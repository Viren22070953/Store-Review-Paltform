import { useEffect, useState } from "react";
import API from "../../api/axios";
import StoreCard from "../../components/user/StoreCard";

const inputStyle = { padding: "6px", marginRight: "8px" };

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      const params = {};
      if (search.name) params.name = search.name;
      if (search.address) params.address = search.address;
      const res = await API.get("/stores", { params });
      setStores(res.data);
    } catch {
      setError("Failed to load stores.");
    }
  };

  useEffect(() => { fetchStores(); }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>All Stores</h2>

      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <input placeholder="Search by Name" style={inputStyle} value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })} />
        <input placeholder="Search by Address" style={inputStyle} value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })} />
        <button onClick={fetchStores} style={{ padding: "6px 14px" }}>Search</button>
        <button onClick={() => { setSearch({ name: "", address: "" }); fetchStores(); }}
          style={{ marginLeft: "6px", padding: "6px 14px" }}>Clear</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {stores.length === 0 && !error && <p>No stores found.</p>}
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} onRatingUpdate={fetchStores} />
      ))}
    </div>
  );
};

export default StoreList;
