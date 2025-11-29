import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { customersAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Trash2, Edit2, User, Mail, Phone, MapPin } from "lucide-react";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  key: string;
  country: string;
  city: string;
  cin: string;
  companyId: string;
  tickets?: any[];
  createdAt?: string;
  updatedAt?: string;
}

function Customers() {
  const { user } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    key: "",
    country: "",
    city: "",
    cin: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await customersAPI.getAll(user.id, {
        page: currentPage,
        limit: itemsPerPage,
      });
      console.log(response);

      if (response.customers && Array.isArray(response.customers)) {
        setCustomers(response.customers);
        setTotalItems(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else if (response.data && Array.isArray(response.data)) {
        setCustomers(response.data);
        setTotalItems(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
      } else if (Array.isArray(response)) {
        setCustomers(response);
        setTotalItems(response.length);
        setTotalPages(1);
      } else {
        setCustomers([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setCustomers([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentPage]);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user, loadAllData]);

  const createCustomer = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await customersAPI.create(user.id, {
        ...formData,
        companyId: user.id,
      });
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        key: "",
        country: "",
        city: "",
        cin: "",
      });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      loadAllData();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  }, [formData, user?.id, loadAllData]);

  const updateCustomer = useCallback(async () => {
    if (!selectedCustomer || !user?.id) return;
    setLoading(true);
    try {
      await customersAPI.update(user.id, selectedCustomer.id, {
        ...formData,
        companyId: user.id,
      });
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        key: "",
        country: "",
        city: "",
        cin: "",
      });
      loadAllData();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }, [selectedCustomer, formData, user?.id, loadAllData]);

  const deleteCustomer = useCallback(async () => {
    if (!selectedCustomer || !user?.id) return;
    setLoading(true);
    try {
      await customersAPI.delete(user.id, selectedCustomer.id);
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
      if (customers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  }, [selectedCustomer, customers.length, currentPage, user?.id, loadAllData]);

  const openEditDialog = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: customer.phone_number,
      email: customer.email,
      key: customer.key,
      country: customer.country,
      city: customer.city,
      cin: customer.cin,
    });
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      key: "",
      country: "",
      city: "",
      cin: "",
    });
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
    setFormData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      key: "",
      country: "",
      city: "",
      cin: "",
    });
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const isPreviousDisabled = useMemo(() => currentPage === 1, [currentPage]);

  const isNextDisabled = useMemo(
    () => currentPage === totalPages,
    [currentPage, totalPages]
  );

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Customers
            </h1>
            <p className="text-gray-600">
              Manage your customer database and contact information
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-blue-800/20 text-white">
                <Plus className="w-4 h-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  Add New Customer
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Create a new customer profile for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-first-name"
                      className="text-sm font-medium text-gray-900"
                    >
                      First Name
                    </Label>
                    <Input
                      id="add-first-name"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-last-name"
                      className="text-sm font-medium text-gray-900"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="add-last-name"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-email"
                      className="text-sm font-medium text-gray-900"
                    >
                      Email
                    </Label>
                    <Input
                      id="add-email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-phone"
                      className="text-sm font-medium text-gray-900"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="add-phone"
                      placeholder="+1-555-0123"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-country"
                      className="text-sm font-medium text-gray-900"
                    >
                      Country
                    </Label>
                    <Input
                      id="add-country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-city"
                      className="text-sm font-medium text-gray-900"
                    >
                      City
                    </Label>
                    <Input
                      id="add-city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-cin"
                      className="text-sm font-medium text-gray-900"
                    >
                      CIN
                    </Label>
                    <Input
                      id="add-cin"
                      placeholder="Customer Identification Number"
                      value={formData.cin}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cin: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-key"
                      className="text-sm font-medium text-gray-900"
                    >
                      Key
                    </Label>
                    <Input
                      id="add-key"
                      placeholder="Unique customer key"
                      value={formData.key}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          key: e.target.value,
                        }))
                      }
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleAddDialogClose}
                  className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createCustomer}
                  className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
                >
                  Create Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-transparent border-gray-200">
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Customers Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your first customer to start managing your customer
                    database.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Contact</TableHead>
                    <TableHead className="text-gray-700">Location</TableHead>
                    <TableHead className="text-gray-700">CIN</TableHead>
                    <TableHead className="text-gray-700">Tickets</TableHead>
                    <TableHead className="text-right text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {customer.first_name} {customer.last_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            {customer.phone_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {customer.city}, {customer.country}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {customer.cin}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-900/60 border-blue-900/5"
                        >
                          {customer.tickets?.length || 0} tickets
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => openEditDialog(customer)}
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-white hover:bg-gray-50 border-gray-200"
                          >
                            <Edit2 className="w-4 h-4 text-gray-900" />
                          </Button>
                          <Button
                            onClick={() => openDeleteDialog(customer)}
                            variant="destructive"
                            size="sm"
                            className="gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {customers.length > 0 && totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePreviousPage}
                        className={`cursor-pointer bg-white hover:bg-gray-50 border-gray-200 text-gray-900 ${
                          isPreviousDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {paginationPages.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className={`cursor-pointer ${
                            currentPage === page
                              ? "bg-blue-900/60 text-white"
                              : "bg-white hover:bg-gray-50 text-gray-700"
                          } border-gray-200`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={handleNextPage}
                        className={`cursor-pointer bg-white hover:bg-gray-50 border-gray-200 text-gray-900 ${
                          isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit Customer</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the customer information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-first-name"
                    className="text-sm font-medium text-gray-900"
                  >
                    First Name
                  </Label>
                  <Input
                    id="edit-first-name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-last-name"
                    className="text-sm font-medium text-gray-900"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="edit-last-name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-email"
                    className="text-sm font-medium text-gray-900"
                  >
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-phone"
                    className="text-sm font-medium text-gray-900"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone_number: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-country"
                    className="text-sm font-medium text-gray-900"
                  >
                    Country
                  </Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-city"
                    className="text-sm font-medium text-gray-900"
                  >
                    City
                  </Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-cin"
                    className="text-sm font-medium text-gray-900"
                  >
                    CIN
                  </Label>
                  <Input
                    id="edit-cin"
                    value={formData.cin}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, cin: e.target.value }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-key"
                    className="text-sm font-medium text-gray-900"
                  >
                    Key
                  </Label>
                  <Input
                    id="edit-key"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, key: e.target.value }))
                    }
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleEditDialogClose}
                className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
              >
                Cancel
              </Button>
              <Button
                onClick={updateCustomer}
                className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Delete Customer
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete "{selectedCustomer?.first_name}{" "}
                {selectedCustomer?.last_name}"? This action cannot be undone and
                will also remove all associated tickets.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteCustomer}
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
              >
                Delete Customer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

export default Customers;