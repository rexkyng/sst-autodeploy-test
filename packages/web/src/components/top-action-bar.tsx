import { useState } from "react";
import { addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { useCRMStore } from "@/store/crm-store";
import { useWrapup } from "@/hooks/use-wrapup";
import { getQueryStringObject } from "@/lib/query-string";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateTimePicker } from "@/components/datetime-picker/datetime-picker";
import { ResultDialog } from "@/components/dialogs/alert-dialogs";

export function TopActionBar() {
	const store = useCRMStore();
	const [resultMessage, setResultMessage] = useState("");
	const [showResultDialog, setShowResultDialog] = useState(false);

	const handleShowMessage = (message: string) => {
		setResultMessage(message);
		setShowResultDialog(true);
	};

	const { finish, follow, loading } = useWrapup(handleShowMessage);
	const [nextFollowDate, setNextFollowDate] = useState<Date>();

	const querystring = getQueryStringObject();
	const hasInteractionId = !!querystring["Interaction.InteractionId"];

	const handleDateSelect = (date: Date | undefined) => {
		setNextFollowDate(date);
		if (date) {
			const today = new Date().toDateString();
			const selectedDate = date.toDateString();

			if (selectedDate === today) {
				// Store full datetime for today
				store.setNextFollowDateTime(date.toISOString());
			} else {
				// Store only date for future dates
				const dateOnly = new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate()
				);
				store.setNextFollowDateTime(
					dateOnly.toISOString().split("T")[0]
				);
			}
		} else {
			store.setNextFollowDateTime(null);
		}
	};

	const handleFinish = async () => {
		const success = await finish();
		if (success) {
			// Optionally show success message or navigate
		}
	};

	const handleFollow = async () => {
		const success = await follow();
		if (success) {
			// Optionally show success message or navigate
		}
	};

	const handleClean = () => {
		// if (confirm("Are you sure you want to clear all data?")) {
		store.resetData();
		setNextFollowDate(undefined);
		// }
	};

	return (
		<>
			<TooltipProvider>
				<div className="flex items-center gap-4 p-2 border-b bg-background h-16">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={handleFinish}
								disabled={loading || !!store.nextFollowDateTime}
								variant="outline"
							>
								{loading ? "Processing..." : "Finish"}
							</Button>
						</TooltipTrigger>
						{(!hasInteractionId || !!store.nextFollowDateTime) && (
							<TooltipContent>
								<p>
									{!hasInteractionId
										? "Requires active interaction to finish"
										: "Cannot finish when next follow date is set"}
								</p>
							</TooltipContent>
						)}
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={handleFollow}
								// disabled={loading || !hasInteractionId}
								variant="outline"
							>
								{loading ? "Processing..." : "Follow"}
							</Button>
						</TooltipTrigger>
						{!hasInteractionId && (
							<TooltipContent>
								<p>Requires active interaction to follow</p>
							</TooltipContent>
						)}
					</Tooltip>

					<div className="flex items-center gap-2">
						<span className="text-sm font-medium whitespace-nowrap">
							Next Follow Date
						</span>
						<DateTimePicker
							value={nextFollowDate}
							onChange={handleDateSelect}
							min={new Date()}
							max={addMonths(new Date(), 1)}
							// disabled={!hasInteractionId}
						/>
					</div>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button onClick={handleClean} variant="outline">
								Clean
							</Button>
						</TooltipTrigger>
					</Tooltip>
				</div>
			</TooltipProvider>

		<ResultDialog
			open={showResultDialog}
			onOpenChange={setShowResultDialog}
			title="Validation Error"
			message={resultMessage}
			isError={true}
		/>
		</>
	);
}
