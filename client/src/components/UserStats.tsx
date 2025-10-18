'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const aiData = [
  { date: "2025-10-01", value: 2 },
  { date: "2025-10-05", value: 5 },
  { date: "2025-10-10", value: 8 },
  { date: "2025-10-15", value: 12 },
  { date: "2025-10-18", value: 15 },
];

const verifyData = [
  { date: "2025-10-01", value: 1 },
  { date: "2025-10-05", value: 3 },
  { date: "2025-10-10", value: 6 },
  { date: "2025-10-15", value: 9 },
  { date: "2025-10-18", value: 13 },
];

export default function UserStats() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-green-400/30 to-blue-500/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <span>🤖</span> Generazioni AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={aiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-400/30 to-green-500/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <span>✅</span> Messaggi Verificati
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={verifyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
