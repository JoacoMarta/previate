export function PlayerPicker({ players, exclude = [], onPick, label }: {
  players: string[]
  exclude?: string[]
  onPick: (name: string) => void
  label: string
}) {
  const options = players.filter((p) => !exclude.includes(p))
  return (
    <div className="block">
      <h3>{label}</h3>
      <div className="chips">
        {options.map((p) => (
          <button key={p} className="chip" onClick={() => onPick(p)}>{p}</button>
        ))}
      </div>
    </div>
  )
}
