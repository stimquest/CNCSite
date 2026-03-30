import React, { useState, useEffect } from 'react'
import { Card, Stack, Flex, Box, Text, Button, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'

// ─── Palette ──────────────────────────────────────────────────────────────────

const SHADES = [200, 300, 400, 500, 600, 700, 800] as const

// Couleurs CNC personnalisées (une seule teinte par clé)
const CNC_COLORS: { label: string; colorKey: string; hex: string }[] = [
  { label: 'Turquoise CNC', colorKey: 'turquoise', hex: '#00A9CE' },
  { label: 'Abysse CNC',    colorKey: 'abysse',    hex: '#002B49' },
  { label: 'Sable 200',     colorKey: 'sand-200',  hex: '#f3dfc1' },
  { label: 'Sable 400',     colorKey: 'sand-400',  hex: '#d9a263' },
  { label: 'Sable 600',     colorKey: 'sand-600',  hex: '#b36b33' },
  { label: 'Taupe 200',     colorKey: 'taupe-200', hex: '#e1dacd' },
  { label: 'Taupe 500',     colorKey: 'taupe-500', hex: '#9e8a71' },
  { label: 'Taupe 700',     colorKey: 'taupe-700', hex: '#715f4e' },
  { label: 'Blanc',         colorKey: 'white',     hex: '#ffffff' },
]

// Couleurs Tailwind standard avec les 7 teintes
const TAILWIND_ROWS: { label: string; name: string; shades: Record<number, string> }[] = [
  { label: 'Rouge',     name: 'red',     shades: { 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b' } },
  { label: 'Orange',    name: 'orange',  shades: { 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412' } },
  { label: 'Ambre',     name: 'amber',   shades: { 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e' } },
  { label: 'Jaune',     name: 'yellow',  shades: { 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e' } },
  { label: 'Citron',    name: 'lime',    shades: { 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212' } },
  { label: 'Vert',      name: 'green',   shades: { 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534' } },
  { label: 'Émeraude',  name: 'emerald', shades: { 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46' } },
  { label: 'Teal',      name: 'teal',    shades: { 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59' } },
  { label: 'Cyan',      name: 'cyan',    shades: { 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75' } },
  { label: 'Ciel',      name: 'sky',     shades: { 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985' } },
  { label: 'Bleu',      name: 'blue',    shades: { 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af' } },
  { label: 'Indigo',    name: 'indigo',  shades: { 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3' } },
  { label: 'Violet',    name: 'violet',  shades: { 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6' } },
  { label: 'Pourpre',   name: 'purple',  shades: { 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8' } },
  { label: 'Fuchsia',   name: 'fuchsia', shades: { 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f' } },
  { label: 'Rose',      name: 'rose',    shades: { 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239' } },
  { label: 'Ardoise',   name: 'slate',   shades: { 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b' } },
  { label: 'Gris',      name: 'gray',    shades: { 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937' } },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHexForClass(cls: string): string | null {
  if (!cls) return null
  // CNC colors
  const cnc = CNC_COLORS.find(c => cls.endsWith(`-${c.colorKey}`) || cls === c.colorKey)
  if (cnc) return cnc.hex
  // Tailwind: extract color name + shade
  const match = cls.match(/(?:bg|text)-([a-z]+)-(\d+)$/)
  if (match) {
    const [, name, shade] = match
    const row = TAILWIND_ROWS.find(r => r.name === name)
    if (row) return row.shades[parseInt(shade)] ?? null
  }
  if (cls === 'bg-white' || cls === 'text-white') return '#ffffff'
  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

const ColorSwatchInput = (props: any, prefix: 'bg' | 'text') => {
  const { value = '', onChange, readOnly } = props
  const [inputValue, setInputValue] = useState<string>(value ?? '')

  // Sync if Sanity value changes externally
  useEffect(() => {
    setInputValue(value ?? '')
  }, [value])

  const commit = (cls: string) => {
    const trimmed = cls.trim()
    if (!trimmed) {
      onChange(unset())
    } else {
      onChange(set(trimmed))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value
    setInputValue(v)
  }

  const handleInputBlur = () => {
    commit(inputValue)
  }

  const handleSwatchClick = (colorKey: string) => {
    if (readOnly) return
    const newClass = `${prefix}-${colorKey}`
    if (newClass === value) {
      setInputValue('')
      onChange(unset())
    } else {
      setInputValue(newClass)
      commit(newClass)
    }
  }

  const hex = getHexForClass(value)
  const isLight = hex ? isLightColor(hex) : false

  return (
    <Card padding={3} border radius={3}>
      <Stack space={4}>

        {/* ── Champ texte éditable ── */}
        <Flex align="center" gap={2}>
          <Box
            style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: hex ?? '#e2e8f0',
              border: '2px solid #e2e8f0',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
            }}
          />
          <Box flex={1}>
            <TextInput
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              readOnly={readOnly}
              placeholder={`${prefix}-orange-500`}
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
          </Box>
          {value && (
            <Button
              fontSize={1} padding={2} mode="bleed" tone="critical"
              text="✕" disabled={readOnly}
              onClick={() => { setInputValue(''); onChange(unset()) }}
            />
          )}
        </Flex>

        {/* ── Couleurs CNC ── */}
        <Stack space={2}>
          <Text size={0} weight="semibold" muted>Couleurs CNC</Text>
          <Flex gap={1} wrap="wrap">
            {CNC_COLORS.map(({ label, colorKey, hex: h }) => {
              const cls = `${prefix}-${colorKey}`
              const selected = cls === value
              return (
                <Swatch
                  key={colorKey}
                  hex={h}
                  label={label}
                  selected={selected}
                  readOnly={readOnly}
                  onClick={() => handleSwatchClick(colorKey)}
                />
              )
            })}
          </Flex>
        </Stack>

        {/* ── Grille Tailwind ── */}
        <Stack space={2}>
          <Text size={0} weight="semibold" muted>Couleurs Tailwind standard</Text>
          <Box style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: '2px 2px' }}>
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: 'left', paddingRight: 6, fontSize: 10, color: '#94a3b8', fontWeight: 600 }} />
                  {SHADES.map(s => (
                    <th key={s} style={{ width: 28, textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 600, paddingBottom: 4 }}>
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TAILWIND_ROWS.map(({ label, name, shades }) => (
                  <tr key={name}>
                    <td style={{ fontSize: 10, color: '#64748b', fontWeight: 600, paddingRight: 6, whiteSpace: 'nowrap' }}>
                      {label}
                    </td>
                    {SHADES.map(shade => {
                      const colorKey = `${name}-${shade}`
                      const cls = `${prefix}-${colorKey}`
                      const selected = cls === value
                      return (
                        <td key={shade}>
                          <Swatch
                            hex={shades[shade]}
                            label={`${label} ${shade}`}
                            selected={selected}
                            readOnly={readOnly}
                            onClick={() => handleSwatchClick(colorKey)}
                            size={26}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Stack>

        <Text size={0} muted>
          Cliquer sur une pastille ou saisir manuellement (ex: <code style={{ fontFamily: 'monospace' }}>{prefix}-blue-700</code>)
        </Text>
      </Stack>
    </Card>
  )
}

// ─── Swatch sub-component ─────────────────────────────────────────────────────

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}

const Swatch = ({
  hex, label, selected, readOnly, onClick, size = 28,
}: {
  hex: string; label: string; selected: boolean
  readOnly?: boolean; onClick: () => void; size?: number
}) => (
  <button
    type="button"
    title={label}
    disabled={readOnly}
    onClick={onClick}
    aria-label={label}
    aria-pressed={selected}
    style={{
      display: 'block',
      width: size, height: size,
      borderRadius: 4,
      background: hex,
      border: selected ? '2px solid #0f172a' : '1.5px solid rgba(0,0,0,0.1)',
      outline: selected ? '2px solid white' : 'none',
      outlineOffset: selected ? '-3px' : '0',
      cursor: readOnly ? 'not-allowed' : 'pointer',
      transform: selected ? 'scale(1.18)' : 'scale(1)',
      transition: 'transform 0.1s, box-shadow 0.1s',
      boxShadow: selected ? '0 0 0 2px #0f172a' : 'none',
      padding: 0,
    }}
  />
)

// ─── Named exports ────────────────────────────────────────────────────────────

export const BgColorSwatchInput   = (props: any) => ColorSwatchInput(props, 'bg')
export const TextColorSwatchInput = (props: any) => ColorSwatchInput(props, 'text')
