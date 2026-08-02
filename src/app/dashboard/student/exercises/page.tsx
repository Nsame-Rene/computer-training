"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookMarked } from "lucide-react";

const EX: Array<{ id: number; title: string; course: string; dueDate: string; status: string; marks: string | null; type: string }> = [];

export default function ExercisesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? EX : EX.filter((e) => e.status === filter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2"><BookMarked className="h-6 w-6 text-primary"/><h1 className="text-2xl font-bold">Exercises & Assignments</h1></div>
      <div className="flex gap-2">{["all", "pending", "submitted", "overdue"].map((f) => (
        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>
      ))}</div>
      {filtered.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-gray-500">No exercises or assignments have been published yet.</CardContent></Card>
      ) : null}
    </div>
  );
}
