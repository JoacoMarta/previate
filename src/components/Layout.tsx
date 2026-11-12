import type { ReactNode } from 'react'
import { back } from '../lib/router'
import { IconBack, IconClose } from './Icons'

export function TopBar({ title, onBack, close = false, right }: { title?: string; onBack?: () => void; close?: boolean; right?: ReactNode }) {
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={onBack ?? (() => back())} aria-label={close ? 'Salir' : 'Volver'}>
        {close ? <IconClose /> : <IconBack />}
      </button>
      <h1>{title}</h1>
      {right}
    </header>
  )
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="actions">{children}</div>
}
