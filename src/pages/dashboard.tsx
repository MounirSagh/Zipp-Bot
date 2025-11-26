import { Layout } from "@/components/Layout";
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
  ClipboardList,
  Plus,
  ArrowRight,
  Activity,
  Users,
  Ticket,
  Phone,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Zap,
  Target,
  MapPin,
  Sparkles,
  RefreshCw,
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
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = {
  primary: ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6", "#4C1D95"],
  gradient: ["#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"],
  success: ["#10B981", "#059669"],
  warning: ["#F59E0B", "#D97706"],
  danger: ["#EF4444", "#DC2626"],
  info: ["#3B82F6", "#2563EB"],
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

  // Chart data preparations
  const ticketDistributionData = [
    {
      name: "Resolved",
      value: analytics?.overview?.ticketsWithIssue || 0,
      color: COLORS.success[0],
    },
    {
      name: "Pending",
      value: analytics?.overview?.ticketsWithoutIssue || 0,
      color: COLORS.warning[0],
    },
  ];

  const departmentData =
    analytics?.insights?.departmentBreakdown?.slice(0, 6).map((dept: any) => ({
      name:
        dept.name.length > 15 ? dept.name.substring(0, 15) + "..." : dept.name,
      tickets: dept.tickets,
      services: dept.services,
      issues: dept.issues,
    })) || [];

  const topIssuesData =
    analytics?.insights?.topIssues?.slice(0, 5).map((issue: any) => ({
      name:
        issue.name.length > 20
          ? issue.name.substring(0, 20) + "..."
          : issue.name,
      count: issue.ticketCount,
    })) || [];

  const geoData =
    analytics?.insights?.topCountries?.slice(0, 5).map((location: any) => ({
      country: location.country,
      customers: location.count,
    })) || [];

  const performanceData = [
    {
      metric: "Resolution",
      score: Math.round(resolutionRate),
      fullMark: 100,
    },
    {
      metric: "Activity",
      score: activityScore,
      fullMark: 100,
    },
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
        ? Math.min(100, analytics.overview.totalServices * 10)
        : 0,
      fullMark: 100,
    },
  ];

  const mainStats = [
    {
      title: "Total Customers",
      value: loading
        ? "..."
        : (analytics?.overview?.totalCustomers || 0).toLocaleString(),
      change: analytics?.trends?.customerGrowthRate
        ? `+${analytics.trends.customerGrowthRate}%`
        : "+0%",
      trend:
        (analytics?.trends?.customerGrowthRate || 0) > 0 ? "up" : "neutral",
      icon: Users,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgPattern: "bg-gradient-to-br from-violet-500/10 to-purple-500/5",
      iconBg: "bg-violet-500/20",
      detail: `${analytics?.trends?.newCustomersThisMonth || 0} this month`,
    },
    {
      title: "Active Tickets",
      value: loading
        ? "..."
        : (analytics?.overview?.totalTickets || 0).toLocaleString(),
      change: `${analytics?.overview?.ticketsWithIssue || 0} resolved`,
      trend: resolutionRate > 50 ? "up" : "down",
      icon: Ticket,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgPattern: "bg-gradient-to-br from-cyan-500/10 to-blue-500/5",
      iconBg: "bg-cyan-500/20",
      detail: `${Math.round(resolutionRate)}% resolution rate`,
    },
    {
      title: "Activity Score",
      value: loading ? "..." : activityScore,
      change: activityScore > 70 ? "Excellent" : "Good",
      trend: activityScore > 70 ? "up" : "neutral",
      icon: Zap,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgPattern: "bg-gradient-to-br from-amber-500/10 to-orange-500/5",
      iconBg: "bg-amber-500/20",
      detail: "Overall engagement",
    },
    {
      title: "Departments",
      value: loading
        ? "..."
        : (analytics?.overview?.totalDepartments || 0).toLocaleString(),
      change: analytics?.insights?.busiestDepartment || "N/A",
      trend: "neutral",
      icon: Building,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgPattern: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5",
      iconBg: "bg-emerald-500/20",
      detail: "Active divisions",
    },
  ];

  const secondaryStats = [
    {
      label: "Services",
      value: analytics?.overview?.totalServices || 0,
      icon: HandHelping,
      color: "text-cyan-400",
      bg: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      label: "Common Issues",
      value: analytics?.overview?.totalCommonIssues || 0,
      icon: Target,
      color: "text-orange-400",
      bg: "from-orange-500/20 to-orange-500/5",
    },
    {
      label: "Total Calls",
      value: analytics?.overview?.totalCalls || 0,
      icon: Phone,
      color: "text-pink-400",
      bg: "from-pink-500/20 to-pink-500/5",
    },
    {
      label: "Avg. Tickets",
      value: analytics?.overview?.avgTicketsPerCustomer?.toFixed(1) || "0.0",
      icon: BarChart3,
      color: "text-purple-400",
      bg: "from-purple-500/20 to-purple-500/5",
    },
  ];

  return (
    <Layout>
      <div className="max-w-[1920px] mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-base ml-14">
              Real-time insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-violet-500/50">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${stat.bgPattern}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend !== "neutral" && (
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                        stat.trend === "up"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p
                    className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-gray-500" />
                    <p className="text-xs text-gray-500">{stat.detail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {secondaryStats.map((stat, index) => (
            <Card
              key={index}
              className={`group border-white/10 bg-gradient-to-br ${stat.bg} backdrop-blur-xl hover:scale-105 transition-all duration-300`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-white">
                      {loading ? "..." : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ticket Distribution Pie Chart */}
          <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Ticket Resolution
              </CardTitle>
              <CardDescription className="text-gray-400">
                Distribution of resolved vs pending tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketDistributionData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Performance Radar Chart */}
          <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Performance Metrics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Multi-dimensional performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "#6B7280" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Department Performance Bar Chart */}
          <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Building className="w-5 h-5 text-white" />
                </div>
                Department Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Ticket volume by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: "#9CA3AF" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar
                      dataKey="tickets"
                      fill="#06B6D4"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="services"
                      fill="#8B5CF6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Issues Chart */}
          <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                Top Issues
              </CardTitle>
              <CardDescription className="text-gray-400">
                Most frequent customer problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topIssuesData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis type="number" tick={{ fill: "#9CA3AF" }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                      width={150}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" fill="#F59E0B" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Geographic Chart */}
          <Card className="lg:col-span-1 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                Global Reach
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customer distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {geoData.map((location: any, index: number) => (
                    <div
                      key={location.country}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                          style={{
                            background: `linear-gradient(135deg, ${
                              COLORS.gradient[index]
                            }, ${
                              COLORS.gradient[
                                (index + 1) % COLORS.gradient.length
                              ]
                            })`,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {location.country}
                          </p>
                          <p className="text-xs text-gray-400">
                            {location.customers} customers
                          </p>
                        </div>
                      </div>
                      <MapPin className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                  {geoData.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No data available
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-400">
                Frequently used operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments"
                  className="group relative p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 hover:from-blue-500/20 hover:to-blue-500/10 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4">
                    <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4">
                    <Building className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Add Department
                  </h3>
                  <p className="text-sm text-gray-400">
                    Create new organizational division
                  </p>
                </a>

                <a
                  href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services"
                  className="group relative p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/50 hover:from-emerald-500/20 hover:to-emerald-500/10 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4">
                    <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/20 w-fit mb-4">
                    <HandHelping className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Create Service
                  </h3>
                  <p className="text-sm text-gray-400">
                    Define new service offering
                  </p>
                </a>

                <a
                  href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/common-issues"
                  className="group relative p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:border-orange-500/50 hover:from-orange-500/20 hover:to-orange-500/10 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4">
                    <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/20 w-fit mb-4">
                    <ClipboardList className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Report Issue
                  </h3>
                  <p className="text-sm text-gray-400">
                    Document common problem & solution
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Latest customer interactions and tickets
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tickets */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                    <Ticket className="w-4 h-4 text-orange-400" />
                    Recent Tickets
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-white/10 text-white border-white/20"
                    >
                      {analytics?.recentActivity?.recentTickets?.length || 0}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {analytics?.recentActivity?.recentTickets
                      ?.slice(0, 5)
                      .map((ticket: any) => (
                        <div
                          key={ticket.id}
                          className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 hover:from-orange-500/20 transition-all duration-300"
                        >
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {ticket.customer
                                ? `${ticket.customer.first_name} ${ticket.customer.last_name}`
                                : "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {ticket.issue ||
                                ticket.commonissue?.name ||
                                "No description"}
                            </p>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 shrink-0">
                            #{ticket.id}
                          </Badge>
                        </div>
                      ))}
                    {!analytics?.recentActivity?.recentTickets?.length && (
                      <p className="text-center text-gray-500 py-8">
                        No recent tickets
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Customers */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-blue-400" />
                    Recent Customers
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-white/10 text-white border-white/20"
                    >
                      {analytics?.recentActivity?.recentCustomers?.length || 0}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {analytics?.recentActivity?.recentCustomers
                      ?.slice(0, 5)
                      .map((customer: any) => (
                        <div
                          key={customer.id}
                          className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 transition-all duration-300"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {customer.first_name[0]}
                            {customer.last_name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {customer.first_name} {customer.last_name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {customer.city}, {customer.country}
                            </p>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 shrink-0">
                            {customer._count?.tickets || 0} tickets
                          </Badge>
                        </div>
                      ))}
                    {!analytics?.recentActivity?.recentCustomers?.length && (
                      <p className="text-center text-gray-500 py-8">
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
    </Layout>
  );
}

export default Dashboard;
