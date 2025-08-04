import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

const resources = [
  {
    id: "RES001",
    title: "Key Book",
    color: "bg-yellow-500",
    icon: "📚",
    files: 15,
    downloads: 120,
  },
  {
    id: "RES002",
    title: "Past Papers",
    color: "bg-cyan-500",
    icon: "📄",
    files: 25,
    downloads: 200,
  },
  {
    id: "RES003",
    title: "Important Notes",
    color: "bg-red-500",
    icon: "📝",
    files: 30,
    downloads: 180,
  },
]

export default function OnlineResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 text-center">My Online Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className={`${resource.color} text-white rounded-lg p-6 text-center`}>
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="text-lg font-bold mb-4">{resource.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="text-sm opacity-90">{resource.files} Files</div>
                <div className="flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">{resource.downloads} Downloads</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Files
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
