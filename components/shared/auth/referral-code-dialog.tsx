"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReferralCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const ReferralCodeDialog = ({
  isOpen,
  onClose,
  onContinue,
}: ReferralCodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Continue without Referral Code?</DialogTitle>
          <DialogDescription>
            You are about to register without joining any team. Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onContinue}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralCodeDialog;
