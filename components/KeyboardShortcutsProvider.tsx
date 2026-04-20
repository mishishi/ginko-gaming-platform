'use client'

import KeyboardShortcutsHelp, { useKeyboardShortcutsHelp } from './KeyboardShortcutsHelp'

export default function KeyboardShortcutsProvider() {
  const { isOpen, close } = useKeyboardShortcutsHelp()

  return <KeyboardShortcutsHelp isOpen={isOpen} onClose={close} />
}
