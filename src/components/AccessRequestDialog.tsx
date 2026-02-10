import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AccessRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetName: string;
}

const AccessRequestDialog = ({ open, onOpenChange, datasetName }: AccessRequestDialogProps) => {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    company: "",
    email: "",
    mobile: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.designation || !form.company || !form.email || !form.mobile) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);

    /**
     * BACKEND INTEGRATION POINT: Access Request Form Submission
     * 
     * Replace the setTimeout below with an API call:
     * POST /api/access-requests
     * Body: { ...form, datasetName }
     * 
     * The backend should store the request and notify the admin team
     * (e.g., via email). On success, show the toast and close the dialog.
     */
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Your request has been submitted. Our team will get in touch with you shortly.");
      onOpenChange(false);
      setForm({ name: "", designation: "", company: "", email: "", mobile: "" });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <DialogTitle>Access Required</DialogTitle>
          </div>
          <DialogDescription>
            You haven't purchased the <span className="font-medium text-foreground">{datasetName}</span> dataset. Please fill this form and our team will get in touch with you for providing access to the dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="access-name">Name</Label>
            <Input
              id="access-name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-designation">Designation</Label>
            <Input
              id="access-designation"
              placeholder="Your designation"
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-company">Company</Label>
            <Input
              id="access-company"
              placeholder="Your company name"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-email">Official Email</Label>
            <Input
              id="access-email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-mobile">Mobile Number</Label>
            <Input
              id="access-mobile"
              type="tel"
              placeholder="+1 234 567 890"
              value={form.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              maxLength={20}
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessRequestDialog;
