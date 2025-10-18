'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const soulData = [
  { date: "2025-10-01", value: 10 },
  { date: "2025-10-05", value: 15 },
  { date: "2025-10-10", value: 110 },
  { date: "2025-10-15", value: 30 },
  { date: "2025-10-18", value: 0 },
];
const panData = [
  { date: "2025-10-01", value: 100 },
  { date: "2025-10-05", value: 120 },
  { date: "2025-10-10", value: 0 },
  { date: "2025-10-15", value: 180 },
  { date: "2025-10-18", value: 210 },
];

export default function BalanceSection() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-purple-400/30 to-green-500/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <span>🧠</span> Soul Token (Reputazione)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-purple-600">40</div>
              <div className="text-sm text-gray-400">Totale Reputazione</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">30</div>
              <div className="text-xs text-gray-400">Nel wallet</div>
              <div className="text-lg font-bold text-yellow-500">10</div>
              <div className="text-xs text-gray-400">Da ritirare</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={soulData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-400/30 to-blue-500/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <span>🪙</span> PAN Token
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-yellow-600">210</div>
              <div className="text-sm text-gray-400">Totale PAN</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">180</div>
              <div className="text-xs text-gray-400">Nel wallet</div>
              <div className="text-lg font-bold text-yellow-500">30</div>
              <div className="text-xs text-gray-400">Pending payout</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={panData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#facc15" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
