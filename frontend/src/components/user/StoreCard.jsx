import { useState } from "react";
import StarRating from "../common/StarRating";
import API from "../../api/axios";
import "./StoreCard.css";

const StoreCard = ({ store, onRatingUpdate }) => {
  const [selected, setSelected] = useState(store.user_rating || 0);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSubmit = async () => {
    try {
      if (store.user_rating_id) {
        await API.put(`/ratings/${store.user_rating_id}`, { rating: selected });
        setMsg("Rating updated!");
      } else {
        await API.post("/ratings", { store_id: store.id, rating: selected });
        setMsg("Rating submitted!");
      }
      setEditing(false);
      if (onRatingUpdate) onRatingUpdate();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error saving rating.");
    }
  };

  return (
    <div className="store-card">
      <div className="store-card-top">
        <div>
          <h3>{store.name}</h3>
          <p className="store-address">{store.address}</p>
        </div>

        <div className="store-rating-pill">
          {store.avg_rating || "New"}
        </div>
      </div>

      <div className="store-meta">
        <p>
          Overall Rating
          <strong>{store.avg_rating || "No ratings yet"}</strong>
        </p>

        <p>
          Your Rating
          {store.user_rating ? (
            <span className="store-stars">
              <StarRating value={store.user_rating} readonly />
            </span>
          ) : (
            <span className="not-rated">Not rated yet</span>
          )}
        </p>
      </div>

      {(editing || !store.user_rating) && (
        <div className="rating-editor">
          <StarRating value={selected} onChange={setSelected} />

          <div className="store-actions">
            <button onClick={handleSubmit} className="primary-action">
              {store.user_rating ? "Update" : "Submit"}
            </button>

            {editing && (
              <button onClick={() => setEditing(false)} className="secondary-action">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {store.user_rating && !editing && (
        <button onClick={() => setEditing(true)} className="edit-rating">
          Edit Rating
        </button>
      )}

      {msg && <p className="store-message">{msg}</p>}
    </div>
  );
};

export default StoreCard;
