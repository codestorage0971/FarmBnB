import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

const UploadIdProof = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'approved'>('idle');

  useEffect(() => {
    // Optionally fetch booking to display current status
    const load = async () => {
      try {
        if (!bookingId) return;
        const res = await api.getBooking(bookingId);
        const vs = (res.data?.verification_status as string) || 'pending';
        setStatus(vs === 'approved' ? 'approved' : 'pending');
      } catch {}
    };
    load();
  }, [bookingId]);

  const onUpload = async (files: FileList | null) => {
    if (!bookingId) return;
    if (!files || files.length < 2) {
      toast.error('Please select at least 2 ID proof files');
      return;
    }
    setUploading(true);
    try {
      await api.uploadBookingIdProofs(bookingId, Array.from(files));
      setStatus('pending');
      toast.success('ID proofs uploaded. Awaiting admin approval.');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to upload ID proofs');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Upload ID Proofs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Please upload Government ID proofs (Aadhaar preferred) of at least 2 members. Your booking will be reviewed and approved by admin before payment.</p>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
            <Button variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()} className="w-full">
              {uploading ? 'Uploading...' : 'Select ID Proofs (min 2)'}
            </Button>
            {status === 'pending' && (
              <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900">
                Pending approval. We will notify you once approved.
              </div>
            )}
            {status === 'approved' && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-900">
                Approved. You can proceed to payment.
              </div>
            )}
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => navigate('/bookings')}>Go to My Bookings</Button>
              {status === 'approved' && bookingId && (
                <Button className="flex-1" variant="secondary" onClick={() => navigate(`/payments/${bookingId}`)}>Proceed to Payment</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadIdProof;


