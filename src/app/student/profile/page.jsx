import Sidebar from "@/components/dashboard/Sidebar"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileForm from "@/components/profile/ProfileForm"

export default function StudentProfilePage() {
    // In a real app, you'd get this from authentication context
    const userId = "current-user-id"

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <ProfileHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    <ProfileForm userId={userId} />
                </main>
            </div>
        </div>
    )
}
