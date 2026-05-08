const StarRating = ({ value, onChange, readonly = false }) => {
  return (
    <div style={{ display: "inline-flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          style={{
            fontSize: "22px",
            cursor: readonly ? "default" : "pointer",
            color: star <= value ? "#f5a623" : "#ccc",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
