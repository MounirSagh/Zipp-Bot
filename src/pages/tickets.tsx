import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { ticketsAPI, customersAPI, commonIssuesAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Trash2,
  Edit2,
  Ticket as TicketIcon,
  User,
  AlertCircle,
} from "lucide-react";

interface Ticket {
  id: number;
  customerId: number;
  customer?: any;
  issue?: string;
  commonissueId?: number;
  commonissue?: any;
}

function Tickets() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [commonIssues, setCommonIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    issue: "",
    commonissueId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const [ticketsResponse, customersResponse, issuesResponse] =
        await Promise.all([
          ticketsAPI.getAll(user.id, {
            page: currentPage,
            limit: itemsPerPage,
          }),
          customersAPI.getAll(user.id),
          commonIssuesAPI.getAll(user.id),
        ]);

      console.log("Tickets:", ticketsResponse);

      if (ticketsResponse.tickets && Array.isArray(ticketsResponse.tickets)) {
        setTickets(ticketsResponse.tickets);
        setTotalItems(ticketsResponse.pagination?.total || 0);
        setTotalPages(ticketsResponse.pagination?.totalPages || 1);
      } else if (ticketsResponse.data && Array.isArray(ticketsResponse.data)) {
        setTickets(ticketsResponse.data);
        setTotalItems(ticketsResponse.total || 0);
        setTotalPages(Math.ceil((ticketsResponse.total || 0) / itemsPerPage));
      } else if (Array.isArray(ticketsResponse)) {
        setTickets(ticketsResponse);
        setTotalItems(ticketsResponse.length);
        setTotalPages(1);
      } else {
        setTickets([]);
        setTotalItems(0);
        setTotalPages(1);
      }

      const customersData =
        customersResponse.customers ||
        customersResponse.data ||
        customersResponse;
      const issuesData = issuesResponse.data || issuesResponse;

      setCustomers(Array.isArray(customersData) ? customersData : []);
      setCommonIssues(Array.isArray(issuesData) ? issuesData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      setTickets([]);
      setCustomers([]);
      setCommonIssues([]);
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

  const createTicket = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await ticketsAPI.create(user.id, {
        customerId: parseInt(formData.customerId),
        issue: formData.issue || null,
        commonissueId: formData.commonissueId
          ? parseInt(formData.commonissueId)
          : null,
      });
      setFormData({
        customerId: "",
        issue: "",
        commonissueId: "",
      });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      loadAllData();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  }, [formData, user?.id, loadAllData]);

  const updateTicket = useCallback(async () => {
    if (!selectedTicket || !user?.id) return;
    setLoading(true);
    try {
      await ticketsAPI.update(user.id, selectedTicket.id, {
        customerId: parseInt(formData.customerId),
        issue: formData.issue || null,
        commonissueId: formData.commonissueId
          ? parseInt(formData.commonissueId)
          : null,
      });
      setIsEditDialogOpen(false);
      setSelectedTicket(null);
      setFormData({
        customerId: "",
        issue: "",
        commonissueId: "",
      });
      loadAllData();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  }, [selectedTicket, formData, user?.id, loadAllData]);

  const deleteTicket = useCallback(async () => {
    if (!selectedTicket || !user?.id) return;
    setLoading(true);
    try {
      await ticketsAPI.delete(user.id, selectedTicket.id);
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
      if (tickets.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  }, [selectedTicket, tickets.length, currentPage, user?.id, loadAllData]);

  const openEditDialog = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      customerId: ticket.customerId.toString(),
      issue: ticket.issue || "",
      commonissueId: ticket.commonissueId?.toString() || "",
    });
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
    setFormData({
      customerId: "",
      issue: "",
      commonissueId: "",
    });
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedTicket(null);
    setFormData({
      customerId: "",
      issue: "",
      commonissueId: "",
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

  const customerMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    customers.forEach((customer: any) => {
      map[customer.id] = `${customer.first_name} ${customer.last_name}`;
    });
    return map;
  }, [customers]);

  const issueMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    commonIssues.forEach((issue: any) => {
      map[issue.id] = issue.name;
    });
    return map;
  }, [commonIssues]);

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
              Tickets
            </h1>
            <p className="text-gray-600">
              Manage customer support tickets and issues
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-blue-800/20 text-white">
                <Plus className="w-4 h-4" />
                Add Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  Add New Ticket
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Create a new support ticket for a customer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="add-customer"
                    className="text-sm font-medium text-gray-900"
                  >
                    Customer
                  </Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, customerId: value }))
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {customers.map((customer: any) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                          className="text-gray-900 hover:bg-gray-50"
                        >
                          {customer.first_name} {customer.last_name} (
                          {customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="add-common-issue"
                    className="text-sm font-medium text-gray-900"
                  >
                    Common Issue (Optional)
                  </Label>
                  <Select
                    value={formData.commonissueId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        commonissueId: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Select common issue (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {commonIssues.map((issue: any) => (
                        <SelectItem
                          key={issue.id}
                          value={issue.id.toString()}
                          className="text-gray-900 hover:bg-gray-50"
                        >
                          {issue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="add-issue"
                    className="text-sm font-medium text-gray-900"
                  >
                    Custom Issue Description (Optional)
                  </Label>
                  <Textarea
                    id="add-issue"
                    placeholder="Describe the specific issue if not covered by common issues"
                    value={formData.issue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issue: e.target.value,
                      }))
                    }
                    className="min-h-[120px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  />
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
                  onClick={createTicket}
                  className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
                  disabled={!formData.customerId}
                >
                  Create Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-transparent border-gray-200">
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Tickets Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your first support ticket to start tracking customer
                    issues.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-700">Ticket ID</TableHead>
                    <TableHead className="text-gray-700">Customer</TableHead>
                    <TableHead className="text-gray-700">
                      Common Issue
                    </TableHead>
                    <TableHead className="text-gray-700">
                      Customer Issue
                    </TableHead>
                    <TableHead className="text-right text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <TicketIcon className="w-4 h-4 text-blue-900/60" />#
                          {ticket.id}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {customerMap[ticket.customerId] || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {ticket.commonissueId ? (
                          <Badge
                            variant="secondary"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {issueMap[ticket.commonissueId] || "Unknown Issue"}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">
                        {ticket.issue || (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => openEditDialog(ticket)}
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-white hover:bg-gray-50 border-gray-200"
                          >
                            <Edit2 className="w-4 h-4 text-gray-900" />
                          </Button>
                          <Button
                            onClick={() => openDeleteDialog(ticket)}
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

            {tickets.length > 0 && totalPages > 1 && (
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
              <DialogTitle className="text-gray-900">Edit Ticket</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the ticket information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-customer"
                  className="text-sm font-medium text-gray-900"
                >
                  Customer
                </Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, customerId: value }))
                  }
                >
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {customers.map((customer: any) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                        className="text-gray-900 hover:bg-gray-50"
                      >
                        {customer.first_name} {customer.last_name} (
                        {customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-common-issue"
                  className="text-sm font-medium text-gray-900"
                >
                  Common Issue (Optional)
                </Label>
                <Select
                  value={formData.commonissueId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      commonissueId: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    <SelectValue placeholder="Select common issue (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {commonIssues.map((issue: any) => (
                      <SelectItem
                        key={issue.id}
                        value={issue.id.toString()}
                        className="text-gray-900 hover:bg-gray-50"
                      >
                        {issue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-issue"
                  className="text-sm font-medium text-gray-900"
                >
                  Custom Issue Description (Optional)
                </Label>
                <Textarea
                  id="edit-issue"
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issue: e.target.value,
                    }))
                  }
                  className="min-h-[120px] bg-white border-gray-200 text-gray-900"
                />
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
                onClick={updateTicket}
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
                Delete Ticket
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete ticket #{selectedTicket?.id}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteTicket}
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
              >
                Delete Ticket
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

export default Tickets;
