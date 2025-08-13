import Loader from "@/components/shared/Loader"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <Loader size="lg" />
    </div>
  )
}
