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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePhoneManagement } from "@/hooks/use-phone-management";
import { useCRMStore } from "@/store/crm-store";
import { PHONE_TYPE_LABELS } from "@/lib/constants";
import { Plus } from "lucide-react";

interface AddPhoneDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	phoneType: number;
	showTypeSelector?: boolean;
}

export function AddPhoneDialog({
	open,
	onOpenChange,
	phoneType: defaultPhoneType,
	showTypeSelector = false,
}: AddPhoneDialogProps) {
	const store = useCRMStore();
	const { addPhoneNumber, loading } = usePhoneManagement();
	const [phoneType, setPhoneType] = useState(defaultPhoneType);
	const [countryCode, setCountryCode] = useState("852");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [extension, setExtension] = useState("");
	const [invalidReason, setInvalidReason] = useState("");

	// Update phoneType when defaultPhoneType changes
	useEffect(() => {
		setPhoneType(defaultPhoneType);
	}, [defaultPhoneType]);

	const handleAdd = async () => {
		if (!phoneNumber) {
			alert("Please enter phone number");
			return;
		}

		// Update store state
		store.setPhoneState({
			addPhoneCountryCode: countryCode,
			addPhoneNumberValue: phoneNumber,
			addPhoneExtension: extension,
			addPhoneInvalidReason: invalidReason,
		});

		await addPhoneNumber(phoneType);

		// Reset form
		setPhoneNumber("");
		setExtension("");
		setInvalidReason("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Phone Number</DialogTitle>
					<DialogDescription>Add a new phone number for this customer</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{store.selectedRole && (
						<div className="space-y-2">
							<Label>Role</Label>
							<Input value={store.selectedRole} disabled />
						</div>
					)}

					{showTypeSelector ? (
						<div className="space-y-2">
							<Label>Phone Type</Label>
							<Select
								value={phoneType.toString()}
								onValueChange={(v) => setPhoneType(parseInt(v))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(PHONE_TYPE_LABELS).map(
										([value, label]) => (
											<SelectItem
												key={value}
												value={value}
											>
												{label}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>
					) : (
						<div className="space-y-2">
							<Label>Phone Type</Label>
							<Input
								value={PHONE_TYPE_LABELS[phoneType]}
								disabled
							/>
						</div>
					)}
					<div className="space-y-2">
						<Label>Phone Number</Label>
						<Input
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							// placeholder="Enter phone number"
						/>
					</div>
					<div className="space-y-2">
						<Label>Phone Country Code</Label>
						<Input
							value={countryCode}
							onChange={(e) => setCountryCode(e.target.value)}
							// placeholder="852"
						/>
					</div>

					<div className="space-y-2">
						<Label>Phone Extension</Label>
						<Input
							value={extension}
							onChange={(e) => setExtension(e.target.value)}
							// placeholder="Extension"
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
						<Button
							onClick={handleAdd}
							disabled={loading}
							variant="success"
						>
							<Plus className="h-4 w-4" />
							{loading ? "Adding..." : "Add Phone"}
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
