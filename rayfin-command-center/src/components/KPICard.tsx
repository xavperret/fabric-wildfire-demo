interface Props {
  label: string;
  value: string | number;
  className?: string;
  sub?: string;
}

export function KPICard({ label, value, className, sub }: Props) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${className || ""}`}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}
