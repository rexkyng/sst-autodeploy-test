import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import type { FollowHistory } from "@openauth/core/models";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import { formatDate, toIsAdhocSearchString } from "@/lib/formatters";
import { StartIE } from "@/lib/external-integrations";
import { Volume2 } from "lucide-react";

interface HistoryCardProps {
	showAll: boolean;
	onToggleShowAll: () => void;
	history: FollowHistory[];
	onRemarkClick?: (remark: string) => void;
	height?: string;
	readOnly?: boolean;
}

export function HistoryCard({
	showAll,
	onToggleShowAll,
	history,
	onRemarkClick,
	height,
	readOnly = false,
}: HistoryCardProps) {
	const renderDateTime = (value: string | Date | null | undefined) => {
		const formatted = formatDate(value)
		if (!formatted) return null

		return (
			<div className="leading-tight whitespace-pre-line">
				{formatted.replace(" ", "\n")}
			</div>
		)
	}

	const handleListen = (record: FollowHistory) => {
		if (!record.RecorderLink) return

		// Generate recording link
		const link = record.RecorderLink
		if (link) {
			StartIE(link)
		}
	}

	const columns = useMemo<ColumnDef<FollowHistory>[]>(() => [
		{
			id: "IsAdhocSearch",
			accessorKey: "IsAdhocSearch",
			header: "",
			cell: ({ row }) => toIsAdhocSearchString(row.original.IsAdhocSearch),
			enableSorting: false,
		},
		{
			accessorKey: "StartTime",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Contact Date/Time" />
			),
			cell: ({ row }) => renderDateTime(row.original.StartTime),
		},
		{
			id: "AccountNumber",
			accessorFn: (row) => `${row.AccountNumber}-${row.LoanSequence}`,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Account Number" />
			),
		},
		{
			accessorKey: "CallMemo",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Call Memo" />
			),
			cell: ({ row }) => (
				<div className="whitespace-normal wrap-break-word max-w-sm">
					{row.original.CallMemo && (
						<Button
							variant="link"
							className="p-0 h-auto text-left justify-start whitespace-normal wrap-break-word"
							onClick={() => onRemarkClick?.(row.original.CallMemo || "")}
						>
							{row.original.CallMemo}
						</Button>
					)}
				</div>
			),
		},
		{
			accessorKey: "CallResult",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Call Result" />
			),
		},
		{
			accessorKey: "AgentId",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Agent ID" />
			),
		},
		{
			accessorKey: "FollowStatus",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Follow Status" />
			),
			cell: ({ row }) => row.original.FollowStatus || "-",
		},
		{
			accessorKey: "NextFollowDateTime",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Next Follow Date/Time" />
			),
			cell: ({ row }) => renderDateTime(row.original.NextFollowDateTime) || "-",
		},
		{
			accessorKey: "ActionDateTime",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Finish Time" />
			),
			cell: ({ row }) => renderDateTime(row.original.ActionDateTime),
		},
		{
			id: "actions",
			header: "Listen",
			cell: ({ row }) => (
				row.original.RecorderLink ? (
					<Button
						variant="outline"
						size="sm"
						onClick={(e) => {
							e.stopPropagation()
							handleListen(row.original)
						}}
						className="h-8 px-2"
					>
						<Volume2 className="h-4 w-4" />
					</Button>
				) : null
			),
			enableSorting: false,
		},
	], [onRemarkClick])

	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Follow History</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-2 flex-1 flex flex-col overflow-hidden">
				<div className={`${height ?? "flex-1"} min-h-0`}>
					<div className="flex justify-start mb-4">
						{!!readOnly && (
							<Button
								size="sm"
								onClick={onToggleShowAll}
								variant="outline"
							>
								{showAll ? "Show All Follow History" : "Show All"}
							</Button>
						)}
					</div>
					<DataTable
						columns={columns}
						data={history}
						getRowId={(record) => `${record.StartTime}-${record.AccountNumber}-${record.LoanSequence}`}
						enablePagination={false}
						enableToolbar={false}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
