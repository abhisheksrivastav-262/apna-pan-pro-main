import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListApplications, adminVerifyPayment } from "@/lib/admin.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, ExternalLink, XCircle, Image as ImageIcon, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListApplications);
  const verifyFn = useServerFn(adminVerifyPayment);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => listFn(),
  });

  const verify = useMutation({
    mutationFn: (v: { id: string; verify: boolean }) => verifyFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      toast.success("Updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const rows = data ?? [];

  return (
    <Card className="p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Payments</h2>
        <p className="text-sm text-muted-foreground">
          {rows.filter((r: any) => !r.payment_verified_at).length} awaiting verification
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full opacity-60" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 opacity-60 rounded-md" />
                      <Skeleton className="h-8 w-20 opacity-60 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="p-0">
                  <EmptyState 
                    icon={IndianRupee} 
                    title="No payments found" 
                    description="When customers submit applications with payments, they will appear here." 
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link
                      to="/admin/applications/$id"
                      params={{ id: r.id }}
                      className="font-medium hover:underline"
                    >
                      {r.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>{r.customer_mobile}</TableCell>
                  <TableCell>₹{r.dob_proof_url ? 139 : 199}</TableCell>
                  <TableCell>
                    {r.payment_screenshot_url ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="relative block h-10 w-16 overflow-hidden rounded border bg-muted group">
                            <img 
                              src={r.payment_screenshot_url} 
                              alt="Payment" 
                              className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ImageIcon className="h-4 w-4 text-white" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Payment Screenshot - {r.full_name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center p-4">
                            <img 
                              src={r.payment_screenshot_url} 
                              alt="Payment full size" 
                              className="max-w-full max-h-[70vh] object-contain rounded-md"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.payment_verified_at ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-700 border border-amber-500/30">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to="/admin/applications/$id" params={{ id: r.id }} title="View details">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      {!r.payment_verified_at ? (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => verify.mutate({ id: r.id, verify: true })}
                          disabled={verify.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verify.mutate({ id: r.id, verify: false })}
                          disabled={verify.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Unverify
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
