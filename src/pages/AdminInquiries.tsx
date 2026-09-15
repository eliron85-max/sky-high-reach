import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Search, Eye, RefreshCw, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type InquiryStatus = "new" | "in_progress" | "completed";

interface Inquiry {
  id: string;
  full_name: string;
  company: string | null;
  phone: string;
  email: string;
  project_type: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<InquiryStatus, string> = {
  new: "חדש",
  in_progress: "בטיפול",
  completed: "טופל",
};

const statusColors: Record<InquiryStatus, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
};

const projectTypeLabels: Record<string, string> = {
  restoration: "שיקום ושיפוץ מעטפת",
  stone: "חיפוי ועיגון אבנים",
  sealing: "איטום בגובה",
  birds: "הרחקת מעופפים",
  special: "עבודות גובה מיוחדות",
  other: "אחר",
};

const AdminInquiries = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries((data as Inquiry[]) || []);
      return true;
    } catch (error) {
      console.error("Error fetching inquiries");
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הפניות",
        variant: "destructive",
      });
      return false;

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth", { replace: true });
        }
      }
    );

    const guard = async () => {
      // 1) חייב להיות משתמש מחובר
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      // 2) בדיקת הרשאה מול טבלת התפקידים (נאכף גם בצד השרת ע"י RLS)
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (rolesError || !roles) {
        toast({
          title: "גישה נדחתה",
          description: "אין לך הרשאות לצפות בדף זה",
          variant: "destructive",
        });
        navigate("/", { replace: true });
        return;
      }

      setAuthChecked(true);
      fetchInquiries();

    };

    guard();
    
    return () => subscription.unsubscribe();
  }, [navigate, toast]);


  const updateStatus = async (id: string, newStatus: InquiryStatus) => {
    try {
      const { error } = await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);

      if (error) throw error;

      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));

      toast({
        title: "הסטטוס עודכן",
        description: `הפנייה סומנה כ"${statusLabels[newStatus]}"`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הסטטוס",
        variant: "destructive",
      });
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phone.includes(searchQuery) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openInquiryDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDialogOpen(true);
  };
  if (!authChecked) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowRight size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">לוח בקרה - פניות</h1>
          </div>
          <Button onClick={fetchInquiries} variant="outline" size="sm">
            <RefreshCw size={16} className="ml-2" />
            רענן
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="חיפוש לפי שם, טלפון או אימייל..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="סנן לפי סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="new">חדש</SelectItem>
              <SelectItem value="in_progress">בטיפול</SelectItem>
              <SelectItem value="completed">טופל</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{inquiries.filter((i) => i.status === "new").length}</div>
            <div className="text-sm text-muted-foreground">פניות חדשות</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {inquiries.filter((i) => i.status === "in_progress").length}
            </div>
            <div className="text-sm text-muted-foreground">בטיפול</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {inquiries.filter((i) => i.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">טופלו</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">טוען פניות...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {inquiries.length === 0 ? "אין פניות עדיין" : "לא נמצאו תוצאות"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">טלפון</TableHead>
                  <TableHead className="text-right">סוג פרויקט</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.full_name}</TableCell>
                    <TableCell>
                      <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                        {inquiry.phone}
                      </a>
                    </TableCell>
                    <TableCell>{projectTypeLabels[inquiry.project_type] || inquiry.project_type}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(inquiry.created_at)}</TableCell>
                    <TableCell>
                      <Select
                        value={inquiry.status}
                        onValueChange={(value) => updateStatus(inquiry.id, value as InquiryStatus)}
                      >
                        <SelectTrigger className="w-28 h-8">
                          <Badge className={`${statusColors[inquiry.status]} border`}>
                            {statusLabels[inquiry.status]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">חדש</SelectItem>
                          <SelectItem value="in_progress">בטיפול</SelectItem>
                          <SelectItem value="completed">טופל</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openInquiryDetails(inquiry)}>
                          <Eye size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`tel:${inquiry.phone}`}>
                            <Phone size={18} />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${inquiry.email}`}>
                            <Mail size={18} />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Inquiry Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>פרטי הפנייה</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">שם מלא</label>
                  <p className="font-medium">{selectedInquiry.full_name}</p>
                </div>
                {selectedInquiry.company && (
                  <div>
                    <label className="text-sm text-muted-foreground">חברה</label>
                    <p className="font-medium">{selectedInquiry.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-muted-foreground">טלפון</label>
                  <p className="font-medium">
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">אימייל</label>
                  <p className="font-medium">
                    <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">סוג פרויקט</label>
                  <p className="font-medium">
                    {projectTypeLabels[selectedInquiry.project_type] || selectedInquiry.project_type}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">סטטוס</label>
                  <Badge className={`${statusColors[selectedInquiry.status]} border`}>
                    {statusLabels[selectedInquiry.status]}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">תיאור הפרויקט</label>
                <p className="mt-1 p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                נוצר: {formatDate(selectedInquiry.created_at)}
                {selectedInquiry.updated_at !== selectedInquiry.created_at && (
                  <> | עודכן: {formatDate(selectedInquiry.updated_at)}</>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1">
                  <a href={`tel:${selectedInquiry.phone}`}>
                    <Phone size={16} className="ml-2" />
                    התקשר
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={`mailto:${selectedInquiry.email}`}>
                    <Mail size={16} className="ml-2" />
                    שלח מייל
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInquiries;
