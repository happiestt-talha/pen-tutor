import { Card, CardContent } from "@/components/ui/card"

export default function PerformanceCard() {
  return (
    <Card className="bg-green-500 text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Performance:</span>
          <span className="text-2xl font-bold">70%</span>
        </div>
      </CardContent>
    </Card>
  )
}
