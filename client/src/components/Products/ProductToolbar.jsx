export default function ProductToolbar({ viewFilter, onChangeFilter }) {
  const isActive = (key) =>
    viewFilter === key ? "btn btn-sm btn-primary" : "btn btn-sm btn-outline-primary";

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <button className={isActive("all")} onClick={() => onChangeFilter("all")}>Alle</button>
      <button className={isActive("ok")} onClick={() => onChangeFilter("ok")}>OK</button>
      <button className={isActive("low")} onClick={() => onChangeFilter("low")}>Niedrig</button>
      <button className={isActive("critical")} onClick={() => onChangeFilter("critical")}>Kritisch</button>
    </div>
  );
}
