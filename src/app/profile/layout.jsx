import ProfileSidebar from "@/components/profile/ProfileSidebar";

export default function ProfileLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProfileSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
