import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function PaymentsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Payments</CardTitle>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-600 text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Due Payment:</span>
            <span className="font-bold text-lg">1500 RS</span>
          </div>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Paid:</span>
            <span className="font-bold text-lg">2500 RS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
