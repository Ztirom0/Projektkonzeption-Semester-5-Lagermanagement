export default function ProductSearch({ value, onChange }) {
  return (
    <div className="input-group">
      <span className="input-group-text">🔍</span>
      <input
        type="text"
        className="form-control"
        placeholder="Produkte oder SKU suchen..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
