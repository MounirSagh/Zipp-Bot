import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
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
  const [dataLoading, setDataLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    field: "",
    description: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user?.id) return;

    try {
      setDataLoading(true);

      // Get company data
      const companies = await companyAPI.getByCompanyId(user.id);
      if (companies && companies.length > 0) {
        const companyData = companies[0];
        setCompany(companyData);
        setCompanyForm({
          name: companyData.name,
          field: companyData.field,
          description: companyData.description,
        });

        // Get departments
        const depts = await departmentsAPI.getByCompany(companyData.id);
        setDepartments(depts);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setDataLoading(false);
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
      loadAllData();
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

  if (!user || dataLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            General
          </h1>
          <p className="text-gray-400">
            Manage your company profile and search through your knowledge base
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <User className="w-4 h-4" />
              Company Profile
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <Search className="w-4 h-4" />
              Knowledge Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-xl text-white">
                    Company Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your company details and business information
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowEditForm(!showEditForm)}
                  variant={showEditForm ? "outline" : "default"}
                  size="sm"
                  className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white"
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
                  <div className="space-y-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
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
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
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
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
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
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      onClick={createOrUpdateCompany}
                      className="gap-2 bg-white/10 hover:bg-white/20 text-white"
                    >
                      {company ? "Update Profile" : "Create Profile"}
                    </Button>
                  </div>
                ) : company ? (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold text-white">
                          {company.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="w-fit bg-white/10 text-white border-white/20"
                        >
                          {company.field}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-2 rounded-md border border-white/10">
                        <Users className="w-4 h-4" />
                        {departments.length} departments
                      </div>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400">
                        Description
                      </h4>
                      <p className="text-white leading-relaxed">
                        {company.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-400">
                        No Company Profile
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
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
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Knowledge Base Search
                </CardTitle>
                <CardDescription className="text-gray-400">
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
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading || !searchQuery || !company}
                    className="gap-2 bg-white/10 hover:bg-white/20 text-white disabled:bg-white/5 disabled:text-gray-600"
                  >
                    <Search className="w-4 h-4" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {!company && (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-lg bg-white/5">
                    <p className="text-gray-400">
                      Please create a company profile first to enable knowledge
                      base search.
                    </p>
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-white">
                        Search Results
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-white/10 text-white border-white/20"
                      >
                        {searchResults.length} found
                      </Badge>
                    </div>
                    <div className="grid gap-4">
                      {searchResults.map((result: any, index: number) => (
                        <Card
                          key={index}
                          className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-3">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-white/10 text-white border-white/20"
                              >
                                {result.metadata?.type?.toUpperCase() ||
                                  "UNKNOWN"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs bg-white/10 text-white border-white/20"
                              >
                                {(result.score * 100).toFixed(1)}% match
                              </Badge>
                            </div>
                            <h4 className="font-semibold mb-2 text-white">
                              {result.metadata?.name || "Untitled"}
                            </h4>
                            <p className="text-gray-400 text-sm mb-2">
                              {result.metadata?.description ||
                                "No description available"}
                            </p>
                            {result.metadata?.solutions && (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-400">
                                  Solutions:
                                </span>{" "}
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
