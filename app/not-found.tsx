import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          {/* Fog background effect */}
          <div className="fog-bg" />

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            {/* Stylized 404 */}
            <div className="mb-8 animate-fade-in-up">
              <span
                className="text-[6rem] sm:text-[10rem] md:text-[14rem] leading-none font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#d4a574] to-[#8a6d4f] opacity-30 select-none"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                404
              </span>
            </div>

            {/* Main message */}
            <h1
              className="text-2xl md:text-3xl text-[#d4a574] mb-4 animate-fade-in-up stagger-1"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              这个页面不存在
            </h1>

            {/* Sub message */}
            <p className="text-[#8a8680] text-lg md:text-xl mb-12 animate-fade-in-up stagger-2">
              旅人，你走错路了
            </p>

            {/* Decorative line */}
            <div className="flex justify-center mb-12 animate-fade-in stagger-3">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-50" />
            </div>

            {/* Back to home link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-[#d4a574] border border-[#d4a574]/30 rounded hover:bg-[#d4a574]/10 transition-all duration-300 animate-fade-in-up stagger-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              返回银古客栈
            </Link>
          </div>

          {/* Ambient glow effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4a5c4f]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4a574]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </body>
    </html>
  )
}
