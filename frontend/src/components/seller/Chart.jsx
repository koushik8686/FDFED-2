import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 300 },
  { name: "Product D", value: 200 },
];

const priceData = [
  { name: "Jan", price: 200 },
  { name: "Feb", price: 300 },
  { name: "Mar", price: 250 },
  { name: "Apr", price: 400 },
  { name: "May", price: 350 },
];

const SalesAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold dark:text-gray-200">Sales Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="hsl(var(--chart-1))"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--chart-2))" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Card component structure
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold dark:text-gray-100">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="text-gray-800 dark:text-gray-300">{children}</div>
);

const ChartContainer = ({ children, className }) => (
  <div className={`relative ${className}`}>{children}</div>
);

export default SalesAnalytics;
