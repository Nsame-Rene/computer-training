"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const TRANSCRIPT: Array<{ semester: string; courses: Array<{ code: string; title: string; credits: number; grade: string; points: number }> }> = [];

export default function TranscriptPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Academic Transcript</h1><Button><Download className="h-4 w-4 mr-2"/>Download PDF</Button></div>
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-4 flex items-center gap-3 text-gray-500">
          <FileText className="h-8 w-8 text-slate-500"/>
          <div><p className="font-bold text-slate-900">Student Portal · Transcript</p><p className="text-sm">No transcript records have been published yet.</p></div>
        </CardContent>
      </Card>
      {TRANSCRIPT.length === 0 ? null : null}
    </div>
  );
}
