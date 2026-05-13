type CardSectionProps = {
  title: string;
  rows: [string, number][];
  total: number;
};

export function CardSection({ title, rows, total }: CardSectionProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-3 py-2 border rounded">
            <span>{label}</span>
            <span>{value} Dokumen</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold bg-muted/40 px-3 py-2 rounded">
          <span>Total Dokumen</span>
          <span>{total} Dokumen</span>
        </div>
      </div>
    </div>
  );
}
