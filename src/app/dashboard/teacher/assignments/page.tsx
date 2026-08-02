"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ASSIGNMENTS: Array<{ id: number; title: string; course: string; due: string; submissions: number; total: number; status: string }> = [];

export default function TeacherAssignmentsPage() {
  const { toast } = useToast();
  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold">Assignments</h1><Button onClick={() => toast({ title: "Feature coming soon" })}><Plus className="h-4 w-4 mr-2"/>New Assignment</Button></div>
      {ASSIGNMENTS.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-gray-500">No assignments have been published yet.</CardContent></Card>
      ) : null}
    </div>
  );
}
