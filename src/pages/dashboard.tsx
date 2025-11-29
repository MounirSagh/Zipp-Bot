"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  HandHelping,
  ArrowRight,
  Activity,
  Users,
  Ticket,
  Phone,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  MapPin,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsAPI } from "@/services/api";
import { useUser } from "@clerk/clerk-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import { Layout } from "@/components/Layout";

const CHART_COLORS = {
  blue: "#2563eb",
  cyan: "#0891b2",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
};

function Dashboard() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await analyticsAPI.getDashboard(user.id);
        console.log("Analytics data:", data);
        if (data?.data) {
          setAnalytics(data.data);
        } else {
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user?.id]);

  const resolutionRate = analytics?.overview?.issueResolutionRate || 0;
  const activityScore = analytics?.overview?.activityScore || 0;

  const ticketDistributionData = [
    {
      name: "Resolved",
      value: analytics?.overview?.ticketsWithIssue || 0,
      color: CHART_COLORS.emerald,
    },
    {
      name: "Pending",
      value: analytics?.overview?.ticketsWithoutIssue || 0,
      color: CHART_COLORS.amber,
    },
  ];

  const departmentData =
    analytics?.insights?.departmentBreakdown?.slice(0, 5).map((dept: any) => ({
      name:
        dept.name.length > 12 ? dept.name.substring(0, 12) + "..." : dept.name,
      tickets: dept.tickets,
      services: dept.services,
    })) || [];

  const topIssuesData =
    analytics?.insights?.topIssues?.slice(0, 5).map((issue: any) => ({
      name:
        issue.name.length > 18
          ? issue.name.substring(0, 18) + "..."
          : issue.name,
      count: issue.ticketCount,
    })) || [];

  const geoData =
    analytics?.insights?.topCountries?.slice(0, 5).map((location: any) => ({
      country: location.country,
      customers: location.count,
    })) || [];

  const performanceData = [
    { metric: "Resolution", score: Math.round(resolutionRate), fullMark: 100 },
    { metric: "Activity", score: activityScore, fullMark: 100 },
    {
      metric: "Engagement",
      score: analytics?.overview?.avgTicketsPerCustomer
        ? Math.min(100, analytics.overview.avgTicketsPerCustomer * 20)
        : 0,
      fullMark: 100,
    },
    {
      metric: "Coverage",
      score: analytics?.overview?.totalServices
        ? Math.min(100, analytics.overview.totalServices * 2)
        : 0,
      fullMark: 100,
    },
  ];

  const mainStats = [
    {
      title: "Total Customers",
      value: loading
        ? "—"
        : (analytics?.overview?.totalCustomers || 0).toLocaleString(),
      change: analytics?.trends?.customerGrowthRate
        ? `+${analytics.trends.customerGrowthRate}%`
        : "+0%",
      trend:
        (analytics?.trends?.customerGrowthRate || 0) > 0 ? "up" : "neutral",
      icon: Users,
      detail: `${analytics?.trends?.newCustomersThisMonth || 0} new this month`,
    },
    {
      title: "Active Tickets",
      value: loading
        ? "—"
        : (analytics?.overview?.totalTickets || 0).toLocaleString(),
      change: `${analytics?.overview?.ticketsWithIssue || 0} resolved`,
      trend: resolutionRate > 50 ? "up" : "down",
      icon: Ticket,
      detail: `${Math.round(resolutionRate)}% resolution rate`,
    },
    {
      title: "Activity Score",
      value: loading ? "—" : activityScore,
      change: activityScore > 70 ? "Excellent" : "Good",
      trend: activityScore > 70 ? "up" : "neutral",
      icon: Zap,
      detail: "Overall engagement",
    },
    {
      title: "Departments",
      value: loading
        ? "—"
        : (analytics?.overview?.totalDepartments || 0).toLocaleString(),
      change: analytics?.insights?.busiestDepartment || "N/A",
      trend: "neutral",
      icon: Building,
      detail: "Active divisions",
    },
  ];

  const secondaryStats = [
    {
      label: "Services",
      value: analytics?.overview?.totalServices || 0,
      icon: HandHelping,
    },
    {
      label: "Common Issues",
      value: analytics?.overview?.totalCommonIssues || 0,
      icon: Target,
    },
    {
      label: "Total Calls",
      value: analytics?.overview?.totalCalls || 0,
      icon: Phone,
    },
    {
      label: "Avg. Tickets",
      value: analytics?.overview?.avgTicketsPerCustomer?.toFixed(1) || "0.0",
      icon: BarChart3,
    },
  ];

  const tooltipStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#1f2937",
    fontSize: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Analytics Overview
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Calendar className="w-4 h-4" />
                Last 12 hours
              </Button> */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              {/* <Button size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Export
              </Button> */}
            </div>
          </header>

          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStats.map((stat, index) => (
              <Card
                key={index}
                className="group duration-200 bg-white border border-neutral-200"
              >
                <CardContent className="p-5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-black">{stat.title}</p>
                      {stat.trend !== "neutral" && (
                        <div
                          className={`flex items-center gap-1 text-xs font-medium ${
                            stat.trend === "up"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {stat.change}
                        </div>
                      )}
                    </div>

                    <p className="text-3xl font-semibold tracking-tight text-black">
                      {stat.value}
                    </p>
                    <p className="text-xs text-neutral-900">{stat.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {secondaryStats.map((stat, index) => (
              <Card
                key={index}
                className="duration-200 bg-white border border-neutral-200"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-black mb-1">{stat.label}</p>
                    <p className="text-xl font-semibold text-black">
                      {loading ? "—" : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg">
                    <stat.icon className="w-4 h-4 text-black" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Distribution */}
            <Card className="bg-white border border-neutral-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium text-black">
                      Ticket Resolution
                    </CardTitle>
                    <CardDescription className="text-gray-900">
                      Distribution of resolved vs pending
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ResponsiveContainer width="50%" height={280}>
                      <PieChart>
                        <Pie
                          data={ticketDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {ticketDistributionData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-4">
                      {ticketDistributionData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                              <span className="text-sm text-gray-600">
                                {item.name}
                              </span>
                              <span className="text-lg font-semibold text-black">
                                {item.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Radar */}
            <Card className="bg-white border border-neutral-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium text-black">
                      Performance Metrics
                    </CardTitle>
                    <CardDescription className="text-gray-900">
                      Multi-dimensional analysis
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={performanceData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke={CHART_COLORS.blue}
                        fill={CHART_COLORS.blue}
                        fillOpacity={0.2}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Department Activity */}
            <Card className="bg-white border border-neutral-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium text-black">
                      Department Activity
                    </CardTitle>
                    <CardDescription className="text-gray-900">
                      Ticket volume by department
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={departmentData}>
                      <defs>
                        <linearGradient
                          id="ticketGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={CHART_COLORS.blue}
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="100%"
                            stopColor={CHART_COLORS.blue}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area
                        type="monotone"
                        dataKey="tickets"
                        stroke={CHART_COLORS.blue}
                        fill="url(#ticketGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Issues */}
            <Card className="bg-white border border-neutral-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium text-black">
                      Top Issues
                    </CardTitle>
                    <CardDescription className="text-gray-900">
                      Most frequent customer problems
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={topIssuesData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        width={130}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar
                        dataKey="count"
                        fill={CHART_COLORS.amber}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Global Reach */}
            <Card className="bg-white border border-neutral-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-medium text-black">
                    Global Reach
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-900">
                  Customer distribution by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {geoData.map((location: any, index: number) => (
                      <div
                        key={location.country}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-neutral-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-black w-5">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-black">
                            {location.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">
                            {location.customers}
                          </span>
                          <MapPin className="w-3 h-3 text-black" />
                        </div>
                      </div>
                    ))}
                    {geoData.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No data available
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2 bg-white border border-neutral-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-black">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-900">
                  Frequently used operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button className="group text-left p-5 rounded-xl border border-neutral-300 hover:border-blue-500/50 hover:bg-blue-50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg"></div>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                    </div>
                    <h3 className="font-medium mb-1 text-black">
                      Add Department
                    </h3>
                    <p className="text-xs text-gray-900">
                      Create new organizational division
                    </p>
                  </button>

                  <button className="group text-left p-5 rounded-xl border border-neutral-300 hover:border-emerald-500/50 hover:bg-emerald-50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg "></div>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                    </div>
                    <h3 className="font-medium mb-1 text-black">
                      Create Service
                    </h3>
                    <p className="text-xs text-gray-900">
                      Define new service offering
                    </p>
                  </button>

                  <button className="group text-left p-5 rounded-xl border border-neutral-300 hover:border-amber-500/50 hover:bg-amber-50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg "></div>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
                    </div>
                    <h3 className="font-medium mb-1 text-black">
                      Report Issue
                    </h3>
                    <p className="text-xs text-gray-900">
                      Document common problem & solution
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white border border-neutral-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-black" />
                  <div className="text-black">
                    <CardTitle className="text-base font-medium">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-900">
                      Latest customer interactions
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Tickets */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Ticket className="w-4 h-4 text-black" />
                      <span className="text-sm font-medium text-black">
                        Recent Tickets
                      </span>
                      <Badge variant="outline" className="ml-auto text-black">
                        {analytics?.recentActivity?.recentTickets?.length || 0}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {analytics?.recentActivity?.recentTickets
                        ?.slice(0, 4)
                        .map((ticket: any) => (
                          <div
                            key={ticket.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-neutral-200 transition-colors"
                          >
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-black truncate">
                                {ticket.customer
                                  ? `${ticket.customer.first_name} ${ticket.customer.last_name}`
                                  : "Unknown"}
                              </p>
                              <p className="text-xs text-gray-900 truncate">
                                {ticket.issue ||
                                  ticket.commonissue?.name ||
                                  "No description"}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="shrink-0 text-xs text-black"
                            >
                              #{ticket.id}
                            </Badge>
                          </div>
                        ))}
                      {!analytics?.recentActivity?.recentTickets?.length && (
                        <p className="text-center text-muted-foreground py-8">
                          No recent tickets
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Recent Customers */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-black" />
                      <span className="text-sm font-medium text-black">
                        Recent Customers
                      </span>
                      <Badge variant="outline" className="ml-auto text-black">
                        {analytics?.recentActivity?.recentCustomers?.length ||
                          0}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {analytics?.recentActivity?.recentCustomers
                        ?.slice(0, 4)
                        .map((customer: any) => (
                          <div
                            key={customer.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-neutral-200 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                              {customer.first_name[0]}
                              {customer.last_name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-black truncate">
                                {customer.first_name} {customer.last_name}
                              </p>
                              <p className="text-xs text-gray-900 truncate">
                                {customer.city}, {customer.country}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="shrink-0 text-xs text-black"
                            >
                              {customer._count?.tickets || 0} tickets
                            </Badge>
                          </div>
                        ))}
                      {!analytics?.recentActivity?.recentCustomers?.length && (
                        <p className="text-center text-black py-8">
                          No recent customers
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
