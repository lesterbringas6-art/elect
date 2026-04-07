const CapoSlider = ({ value, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-foreground">
        Capo Position
      </label>
      <span className="text-sm font-bold text-primary">
        {value === 0 ? 'No Capo' : `Fret ${value}`}
      </span>
    </div>
    
    <input 
      type="range" 
      min={0} 
      max={12} 
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary accent-primary" 
      style={{ accentColor: 'hsl(42, 92%, 56%)' }} 
    />
    
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>0</span>
      <span>6</span>
      <span>12</span>
    </div>
  </div>
);

export default CapoSlider;