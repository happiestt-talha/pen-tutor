import Image from "next/image"

export default function Loader({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  }

  const fontClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/logo.png" alt="Pen Tutor Logo" width={150} height={150} priority />
        <div className="flex items-center gap-3">
          <div
            className={`animate-spin rounded-full border-solid border-yellow-400 border-t-transparent ${sizeClasses[size]}`}
            style={{ borderTopColor: '#F5BB07' }}
          ></div>
          {text && <p className={`font-semibold text-gray-700 ${fontClasses[size]}`}>{text}</p>}
        </div>
      </div>
    </div>
  )
}
