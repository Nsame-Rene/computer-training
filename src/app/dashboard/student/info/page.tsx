"use client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
export default function StudentInfoPage() {
  const { user } = useAuth();
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Student Information</h1>
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div><h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2><p className="text-gray-500">{user?.email}</p><Badge className="mt-1 capitalize">{user?.role}</Badge></div>
          </div>
          <div className="flex items-start gap-3">
            <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5"/>
            <div><p className="text-xs text-gray-400">Program</p><p className="text-sm font-medium">No program information has been published yet.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5"/>
            <div><p className="text-xs text-gray-400">Academic Records</p><p className="text-sm font-medium">No academic timeline has been published yet.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5"/>
            <div><p className="text-xs text-gray-400">Campus</p><p className="text-sm font-medium">No campus information has been published yet.</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
