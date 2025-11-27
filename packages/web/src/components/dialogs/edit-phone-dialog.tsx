import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePhoneManagement } from "@/hooks/use-phone-management";
import { useCRMStore } from "@/store/crm-store";
import { PHONE_TYPE_LABELS } from "@/lib/constants";
import { Edit, Trash2 } from "lucide-react";

interface EditPhoneDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditPhoneDialog({ open, onOpenChange }: EditPhoneDialogProps) {
	const store = useCRMStore();
	const { updatePhoneNumber, deletePhoneNumber, loading } =
		usePhoneManagement();
	const [invalidReason, setInvalidReason] = useState(
		store.editPhoneInvalidReason || ""
	);

	useEffect(() => {
		setInvalidReason(store.editPhoneInvalidReason || "");
	}, [store.editPhoneInvalidReason, open]);

	const handleUpdate = async () => {
		store.setPhoneState({ editPhoneInvalidReason: invalidReason });
		await updatePhoneNumber(parseInt(store.selectedPhoneType || "0"));
		onOpenChange(false);
	};

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this phone number?")) {
			await deletePhoneNumber();
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Phone Number</DialogTitle>
					<DialogDescription>Update or delete the phone number</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{store.selectedRole && (
						<div className="flex items-center gap-2">
							<Label className="min-w-[60px] shrink-0">
								Role
							</Label>
							<Input
								value={store.selectedRole}
								disabled
								className="flex-1"
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label className="min-w-[60px] shrink-0">
							Phone Number
						</Label>
						<Input value={store.selectedPhoneNo || ""} disabled />
					</div>

					<div className="space-y-2">
						<Label>Phone Type</Label>
						<Input
							value={
								PHONE_TYPE_LABELS[
									parseInt(store.selectedPhoneType || "0")
								]
							}
							disabled
						/>
					</div>

					<div className="space-y-2">
						<Label>Phone Invalid Reason</Label>
						<Input
							value={invalidReason}
							onChange={(e) => setInvalidReason(e.target.value)}
							// placeholder="Reason if invalid"
						/>
					</div>

					<div className="flex justify-start gap-2">
						<Button onClick={handleUpdate} disabled={loading} variant="warning">
							<Edit className="h-4 w-4" />
							{loading ? "Updating..." : "Update Phone"}
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
              <Trash2 className="h-4 w-4" />
							{loading ? "Deleting..." : "Delete Phone"}
						</Button>
						<div className="ml-auto">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
