// app/page.tsx
"use client";  // ✅ أضف هذا السطر في البداية

import { DashboardCard } from "@/components/DashboardCard";
import { LargeCard } from "@/components/LargeCard";
import {
  Users,
  ShoppingCart,
  DollarSign,
  PieChart,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function Home() {
  // Order breakdown data
  const orderBreakdownData = [
    { label: "Completed", value: 8, color: "green" },
    { label: "Pending", value: 6, color: "yellow" },
    { label: "Shipped", value: 4, color: "blue" },
    { label: "Cancelled", value: 2, color: "red" },
  ];

  // Recent transactions data (Card 1)
  const recentTransactions = [
    { id: "#5019", name: "John Doe", amount: "$80.65", status: "pending", statusColor: "yellow" },
    { id: "#5020", name: "Jane Smith", amount: "$120.30", status: "completed", statusColor: "green" },
    { id: "#5021", name: "Mike Johnson", amount: "$45.20", status: "pending", statusColor: "yellow" },
    { id: "#5022", name: "Sarah Williams", amount: "$200.00", status: "completed", statusColor: "green" },
    { id: "#5023", name: "David Brown", amount: "$95.75", status: "pending", statusColor: "yellow" },
  ];

  // Users data (Card 2)
  const usersData = [
    { name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active", statusColor: "green" },
    { name: "Bob Smith", email: "bob@example.com", role: "User", status: "inactive", statusColor: "red" },
    { name: "Charlie Wilson", email: "charlie@example.com", role: "User", status: "active", statusColor: "green" },
    { name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "active", statusColor: "green" },
    { name: "Eva Martinez", email: "eva@example.com", role: "User", status: "inactive", statusColor: "red" },
  ];

  const cardsData = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <Users className="h-4 w-4" />,
      isBreakdown: false,
    },
    {
      title: "Total Orders",
      value: "856",
      icon: <ShoppingCart className="h-4 w-4" />,
      isBreakdown: false,
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: <DollarSign className="h-4 w-4" />,
      isBreakdown: false,
    },
    {
      title: "Order Breakdown",
      value: "",
      icon: <PieChart className="h-4 w-4" />,
      isBreakdown: true,
      breakdownData: orderBreakdownData,
    },
  ];

  // Handlers
  const handleViewAllTransactions = () => {
    console.log("View all transactions");
    // يمكنك إضافة التنقل إلى صفحة أخرى هنا
    // router.push('/transactions');
  };

  const handleViewAllUsers = () => {
    console.log("View all users");
    // يمكنك إضافة التنقل إلى صفحة أخرى هنا
    // router.push('/users');
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header with stats summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your application.</p>
      </div>

      {/* Small cards grid - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            isBreakdown={card.isBreakdown}
            breakdownData={card.breakdownData}
          />
        ))}
      </div>

      {/* Large cards - 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Recent Transactions */}
        <LargeCard title="RECENT ORDERS" onViewAll={handleViewAllTransactions}>
          <div className="divide-y divide-border">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {transaction.id}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {transaction.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.status === 'pending' ? 'Awaiting confirmation' : 'Payment received'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </LargeCard>

        {/* Card 2: Users Management */}
        <LargeCard title="RECENT USERS" onViewAll={handleViewAllUsers}>
          <div className="divide-y divide-border">
            {usersData.map((user, index) => (
              <div key={index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'Admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {user.status === 'active' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600 dark:text-red-400">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LargeCard>
      </div>
    </div>
  );
}