'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-20">
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] max-w-sm text-center">
            {/* Error icon */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl" />
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error message */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[var(--text-primary)] text-lg font-medium">
                游戏加载失败
              </span>
              <span className="text-[var(--text-secondary)] text-sm leading-relaxed">
                发生了未知错误，请尝试重新加载
              </span>
            </div>

            {/* Retry button */}
            <button
              onClick={this.handleRetry}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95 bg-[#ef4444] hover:bg-[#dc2626]"
            >
              重试
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
