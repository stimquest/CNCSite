export interface ColorOption {
  label: string
  colorKey: string
  hex: string
}

export const COLOR_PALETTE: ColorOption[] = [
  { label: 'Turquoise CNC', colorKey: 'turquoise', hex: '#00A9CE' },
  { label: 'Abysse CNC',    colorKey: 'abysse',    hex: '#002B49' },
  { label: 'Orange',        colorKey: 'orange-500', hex: '#f97316' },
  { label: 'Rose',          colorKey: 'rose-600',   hex: '#e11d48' },
  { label: 'Bleu',          colorKey: 'blue-600',   hex: '#2563eb' },
  { label: 'Ciel',          colorKey: 'sky-500',    hex: '#0ea5e9' },
  { label: 'Émeraude',      colorKey: 'emerald-500',hex: '#10b981' },
  { label: 'Violet',        colorKey: 'violet-600', hex: '#7c3aed' },
  { label: 'Ambre',         colorKey: 'amber-500',  hex: '#f59e0b' },
  { label: 'Sable',         colorKey: 'sand-400',   hex: '#d9a263' },
  { label: 'Rouge',         colorKey: 'red-600',    hex: '#dc2626' },
]
