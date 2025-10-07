import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { companyAPI, searchAPI, departmentsAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit3, Users, User } from "lucide-react";

function General() {
  const { user } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [departments, setDepartments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    field: "",
    description: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadCompanyInfo();
      loadDepartments();
    }
  }, [user]);

  const loadCompanyInfo = async () => {
    if (!user?.id) return;

    try {
      const data = await companyAPI.getByCompanyId(user.id);
      if (data && data.length > 0) {
        setCompany(data[0]);
        setCompanyForm({
          name: data[0].name,
          field: data[0].field,
          description: data[0].description,
        });
      }
    } catch (error) {
      console.error("Error loading company:", error);
    }
  };

  const loadDepartments = async () => {
    if (!user?.id) return;

    try {
      const companies = await companyAPI.getByCompanyId(user.id);
      if (companies && companies.length > 0) {
        const data = await departmentsAPI.getByCompany(companies[0].id);
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const createOrUpdateCompany = async () => {
    if (!user?.id) return;

    try {
      if (company) {
        await companyAPI.update(company.id, companyForm);
      } else {
        await companyAPI.create({
          ...companyForm,
          companyId: user.id,
        });
      }
      setShowEditForm(false);
      loadCompanyInfo();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  const handleSearch = async () => {
    if (!user?.id || !searchQuery) return;

    setLoading(true);
    try {
      const data = await searchAPI.search(user.id, searchQuery);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">General</h1>
          <p className="text-muted-foreground">
            Manage your company profile and search through your knowledge base
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Company Profile
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Knowledge Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-xl">Company Information</CardTitle>
                  <CardDescription>
                    Manage your company details and business information
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowEditForm(!showEditForm)}
                  variant={showEditForm ? "outline" : "default"}
                  size="sm"
                  className="gap-2"
                >
                  {showEditForm ? (
                    "Cancel"
                  ) : (
                    <>
                      {company ? (
                        <Edit3 className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {company ? "Edit Profile" : "Create Profile"}
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent>
                {showEditForm ? (
                  <div className="space-y-6 p-6 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Company Name
                        </label>
                        <Input
                          placeholder="Enter company name"
                          value={companyForm.name}
                          onChange={(e) =>
                            setCompanyForm({
                              ...companyForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Business Field
                        </label>
                        <Input
                          placeholder="e.g. Technology, Healthcare, Finance"
                          value={companyForm.field}
                          onChange={(e) =>
                            setCompanyForm({
                              ...companyForm,
                              field: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Company Description
                      </label>
                      <Input
                        placeholder="Describe your company's mission and services"
                        value={companyForm.description}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={createOrUpdateCompany} className="gap-2">
                      {company ? "Update Profile" : "Create Profile"}
                    </Button>
                  </div>
                ) : company ? (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold">
                          {company.name}
                        </h3>
                        <Badge variant="secondary" className="w-fit">
                          {company.field}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                        <Users className="w-4 h-4" />
                        {departments.length} departments
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Description
                      </h4>
                      <p className="text-foreground leading-relaxed">
                        {company.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Company Profile
                      </h3>
                      <p className="text-sm text-muted-foreground/75 max-w-md mx-auto">
                        Create your company profile to get started with managing
                        your business information and departments.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Search</CardTitle>
                <CardDescription>
                  Search through your company's departments, services, and
                  information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading || !searchQuery || !company}
                    className="gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {!company && (
                  <div className="text-center py-8 border border-dashed border-muted-foreground/25 rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">
                      Please create a company profile first to enable knowledge
                      base search.
                    </p>
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">Search Results</h3>
                      <Badge variant="outline">
                        {searchResults.length} found
                      </Badge>
                    </div>
                    <div className="grid gap-4">
                      {searchResults.map((result: any, index: number) => (
                        <Card
                          key={index}
                          className="shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {result.metadata?.type?.toUpperCase() ||
                                  "UNKNOWN"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {(result.score * 100).toFixed(1)}% match
                              </Badge>
                            </div>
                            <h4 className="font-semibold mb-2">
                              {result.metadata?.name || "Untitled"}
                            </h4>
                            <p className="text-muted-foreground text-sm mb-2">
                              {result.metadata?.description ||
                                "No description available"}
                            </p>
                            {result.metadata?.solutions && (
                              <p className="text-sm text-muted-foreground/75">
                                <span className="font-medium">Solutions:</span>{" "}
                                {result.metadata.solutions}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default General;
