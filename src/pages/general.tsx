import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { companyAPI, searchAPI } from "../services/api";
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
import { Search, Plus, Users, Edit2 } from "lucide-react";

function General() {
  const { user } = useUser();
  const [company, setCompany] = useState<any>(null);
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

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setDataLoading(true);

      const companies = await companyAPI.getByCompanyId(user.id);
      if (companies && companies.length > 0) {
        const companyData = companies[0];
        setCompany(companyData);
        setCompanyForm({
          name: companyData.name,
          field: companyData.field,
          description: companyData.description,
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user, loadAllData]);

  const createOrUpdateCompany = useCallback(async () => {
    if (!user?.id) return;
    setDataLoading(true)
    try {
      if (company) {
        await companyAPI.update(user.id, company.id, companyForm);
      } else {
        await companyAPI.create(user.id, {
          ...companyForm,
          companyId: user.id,
        });
      }
      setShowEditForm(false);
      loadAllData();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  }, [user?.id, company, companyForm, loadAllData]);

  const handleSearch = useCallback(async () => {
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
  }, [user?.id, searchQuery]);

  const handleSearchQueryChange = useCallback((e: any) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleEditFormChange = useCallback((field: any, value: any) => {
    setCompanyForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleToggleEditForm = useCallback(() => {
    setShowEditForm((prev) => !prev);
  }, []);

  const isSearchDisabled = useMemo(
    () => loading || !searchQuery || !company,
    [loading, searchQuery, company]
  );

  const formattedSearchResults = useMemo(() => {
    return searchResults.map((result: any) => ({
      ...result,
      type: result.metadata?.type?.toUpperCase() || "UNKNOWN",
      matchPercentage: (result.score * 100).toFixed(1),
      title: result.metadata?.name || "Untitled",
      description: result.metadata?.description || "No description available",
      solutions: result.metadata?.solutions,
    }));
  }, [searchResults]);

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            General
          </h1>
          <p className="text-gray-600">
            Manage your company profile and search through your knowledge base
          </p>
        </div>

        <div className="flex flex-col space-y-10">
          <div className="flex gap-3">
            <Input
              placeholder="Search your knowledge base"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="flex-1 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearchDisabled}
              className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 text-white disabled:bg-gray-200 disabled:text-gray-400"
            >
              <Search className="w-4 h-4" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          {!company && (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-gray-600">
                Please create a company profile first to enable knowledge base
                search.
              </p>
            </div>
          )}

          {/* Search Results */}
          {formattedSearchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Search Results
                </h3>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-900/60 border-blue-200"
                >
                  {formattedSearchResults.length} found
                </Badge>
              </div>
              <div className="grid gap-4">
                {formattedSearchResults.map((result: any, index: number) => (
                  <Card
                    key={index}
                    className="bg-white border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700 border-gray-200"
                        >
                          {result.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          {result.matchPercentage}% match
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-900">
                        {result.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {result.description}
                      </p>
                      {result.solutions && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">
                            Solutions:
                          </span>{" "}
                          {result.solutions}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl text-gray-900">
                Company Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your company details and business information
              </CardDescription>
            </div>
            <Button
              onClick={handleToggleEditForm}
              variant={showEditForm ? "outline" : "default"}
              size="sm"
              className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-gray-200 text-white"
            >
              {showEditForm ? (
                "Cancel"
              ) : (
                <>
                  {company ? (
                    <Edit2 className="w-4 h-4" />
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
              <div className="space-y-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Company Name
                    </label>
                    <Input
                      placeholder="Enter company name"
                      value={companyForm.name}
                      onChange={(e) =>
                        handleEditFormChange("name", e.target.value)
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Business Field
                    </label>
                    <Input
                      placeholder="e.g. Technology, Healthcare, Finance"
                      value={companyForm.field}
                      onChange={(e) =>
                        handleEditFormChange("field", e.target.value)
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Company Description
                  </label>
                  <Input
                    placeholder="Describe your company's mission and services"
                    value={companyForm.description}
                    onChange={(e) =>
                      handleEditFormChange("description", e.target.value)
                    }
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <Button
                  onClick={createOrUpdateCompany}
                  className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 text-white"
                >
                  {company ? "Update Profile" : "Create Profile"}
                </Button>
              </div>
            ) : company ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 ">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {company.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="w-fit bg-blue-900/10 text-blue-900/60 border-blue-100"
                    >
                      {company.field}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    <Users className="w-4 h-4" />
                    {company.departments.length} departments
                  </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Description
                  </h4>
                  <p className="text-gray-900 leading-relaxed">
                    {company.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Company Profile
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Create your company profile to get started with managing
                    your business information and departments.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Layout>
  );
}

export default General;