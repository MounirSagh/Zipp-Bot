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
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Departments",
      value: "12",
      change: "+2 this month",
      icon: Building,
      color: "text-blue-600",
    },
    {
      title: "Active Services",
      value: "48",
      change: "+5 this week",
      icon: HandHelping,
      color: "text-green-600",
    },
    {
      title: "Common Issues",
      value: "23",
      change: "Updated today",
      icon: ClipboardList,
      color: "text-orange-600",
    },
    {
      title: "Knowledge Base",
      value: "156",
      change: "entries total",
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Add Department",
      description: "Create a new department for your organization",
      icon: Building,
      href: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      title: "Create Service",
      description: "Define a new service offering",
      icon: HandHelping,
      href: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services",
      color: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    {
      title: "Report Issue",
      description: "Add a common issue and solution",
      icon: ClipboardList,
      href: "/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/common-issues",
      color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your company's AI knowledge base
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to manage your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`h-auto p-4 flex flex-col items-start gap-3 text-left ${action.color}`}
                  asChild
                >
                  <a href={action.href}>
                    <div className="flex items-center gap-2 w-full">
                      <action.icon className="w-5 h-5" />
                      <span className="font-medium">{action.title}</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </div>
                    <p className="text-sm opacity-75">{action.description}</p>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates to your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New department added</p>
                  <p className="text-xs text-muted-foreground">
                    Customer Support - 2 hours ago
                  </p>
                </div>
                <Badge variant="secondary">Department</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service updated</p>
                  <p className="text-xs text-muted-foreground">
                    Technical Support - 4 hours ago
                  </p>
                </div>
                <Badge variant="secondary">Service</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Common issue resolved</p>
                  <p className="text-xs text-muted-foreground">
                    Login Problems - 6 hours ago
                  </p>
                </div>
                <Badge variant="secondary">Issue</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default Dashboard;
