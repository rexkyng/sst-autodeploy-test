import { useState, useMemo, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderDialog } from "@/components/dialogs/loader-dialog";
import { ResultDialog } from "@/components/dialogs/alert-dialogs";
import { useCustomerData } from "@/hooks/use-customer-data";
import { useCRMStore } from "@/store/crm-store";
import { crmAPI } from "@/api/crm-api";
import { getQueryStringObject } from "@/lib/query-string";
import { useTableInteraction } from "@/hooks/use-table-interaction";
import { useNavigate } from "@tanstack/react-router";
import { SearchIcon, EraserIcon } from "lucide-react";
import type { SearchFormData } from "@/data/schemas";

interface SearchResultItem {
	ID_TYPE: string;
	CUSTOMER_ID: string;
	NICKNAME: string;
	SURNAME: string;
	GIVEN_NAME: string;
	SEARCH_VALUE?: string;
}

interface SearchPageProps {
	onCustomerLoaded?: () => void;
}

export function SearchPage({ onCustomerLoaded }: SearchPageProps) {
	const store = useCRMStore();
	const { loadCustomer, loading: customerLoading } = useCustomerData();
	const { handleDoubleClick } = useTableInteraction();
	const navigate = useNavigate();

	const searchResults = store.searchResultList || [];
	const currentSearchType = store.selectedSearchType || "";

	// Local UI state
	const [isSearching, setIsSearching] = useState(false);
	const [resultMessage, setResultMessage] = useState("");
	const [showResultDialog, setShowResultDialog] = useState(false);

	// Initialize TanStack Form
	const form = useForm({
		defaultValues: {
			accountNo: store.searchAccountNo || "",
			loanSequence: store.searchValue?.[1] || "",
			hkid: store.searchHKID || "",
			firstName: store.searchCustomerFirstName || "",
			lastName: store.searchCustomerLastName || "",
			phoneNumber: store.searchPhoneNumber || "",
			refName: store.searchRefName || "",
			refPhoneNo: store.searchRefPhoneNo || "",
			companyName: store.searchCompanyName || "",
			customerRefNo: store.searchCustomerReferenceNo || "",
		},
		validators: {
			onSubmit: ({ value }: { value: SearchFormData }) => {
				// Validate that only one search field is filled
				const filledFields = [
					value.accountNo,
					value.hkid,
					value.firstName || value.lastName,
					value.phoneNumber,
					value.refName,
					value.refPhoneNo,
					value.companyName,
					value.customerRefNo,
				].filter((field) => field.trim().length > 0);

				if (filledFields.length === 0) {
					return {
						form: "Please fill in at least one search field",
					};
				}

				if (filledFields.length > 1) {
					return {
						form: "Only one criteria can search",
					};
				}

				return undefined;
			},
		},
		onSubmit: async ({ value }: { value: SearchFormData }) => {
			await handleSearch(value);
		},
	});

	const handleClear = () => {
		form.reset();
		store.setSearchCriteria({
			searchAccountNo: null,
			searchValue: [],
			searchHKID: null,
			searchCustomerFirstName: null,
			searchCustomerLastName: null,
			searchPhoneNumber: null,
			searchRefName: null,
			searchRefPhoneNo: null,
			searchCompanyName: null,
			searchCustomerReferenceNo: null,
			searchResultList: [],
			selectedSearchType: null,
		});
		setResultMessage("");
		setShowResultDialog(false);
	};

	// Mapping from search type values to display names (matching Vue dropdown options)
	const searchTypeDisplayNames: Record<string, string> = {
		account: "Account Number",
		hkid: "HKID/Passport/Reference ID",
		name: "Customer Name",
		phone: "Phone Number",
		ref_name: "Ref Name",
		ref_phone: "Ref Phone Number",
		company: "Company Name",
		customer_ref: "Customer Reference Number",
	};

	const handleSearch = async (value: SearchFormData) => {
		// Determine search type based on filled fields
		let determinedSearchType: string | null = null;
		let searchValue = "";

		// Trim all input values
		const trimmedAccountNo = value.accountNo.trim();
		const trimmedHkid = value.hkid.trim();
		const trimmedFirstName = value.firstName.trim();
		const trimmedLastName = value.lastName.trim();
		const trimmedPhoneNumber = value.phoneNumber.trim();
		const trimmedRefName = value.refName.trim();
		const trimmedRefPhoneNo = value.refPhoneNo.trim();
		const trimmedCompanyName = value.companyName.trim();
		const trimmedCustomerRefNo = value.customerRefNo.trim();

		// Priority order: account > hkid > name > phone > ref_name > ref_phone > company > customer_ref
		if (trimmedAccountNo) {
			determinedSearchType = "account";
		} else if (trimmedHkid) {
			determinedSearchType = "hkid";
		} else if (trimmedFirstName || trimmedLastName) {
			determinedSearchType = "name";
		} else if (trimmedPhoneNumber) {
			determinedSearchType = "phone";
		} else if (trimmedRefName) {
			determinedSearchType = "ref_name";
		} else if (trimmedRefPhoneNo) {
			determinedSearchType = "ref_phone";
		} else if (trimmedCompanyName) {
			determinedSearchType = "company";
		} else if (trimmedCustomerRefNo) {
			determinedSearchType = "customer_ref";
		}

		// Update store with current search criteria
		store.setSearchCriteria({
			searchAccountNo: trimmedAccountNo || null,
			searchValue: [trimmedAccountNo, value.loanSequence || ""],
			searchHKID: trimmedHkid || null,
			searchCustomerFirstName: trimmedFirstName || null,
			searchCustomerLastName: trimmedLastName || null,
			searchPhoneNumber: trimmedPhoneNumber || null,
			searchRefName: trimmedRefName || null,
			searchRefPhoneNo: trimmedRefPhoneNo || null,
			searchCompanyName: trimmedCompanyName || null,
			searchCustomerReferenceNo: trimmedCustomerRefNo || null,
		});

		setIsSearching(true);
		try {
			const querystring = getQueryStringObject();
			const tenantName = querystring.TenantName || "uaf_dc";
			const agentId =
				querystring["Agent.ExternalID"] ||
				querystring["Agent.UserName"];

			const searchParams: any = {
				Tenant: tenantName,
				AgentId: agentId,
			};

			// Build search parameters based on determined type
			switch (determinedSearchType) {
				case "account":
					searchParams.AccountNumber = trimmedAccountNo;
					searchParams.LoanSequence = value.loanSequence || null;
					searchValue = value.loanSequence
						? `${trimmedAccountNo}-${value.loanSequence}`
						: trimmedAccountNo;
					break;
				case "hkid":
					searchParams.NationalIdType = "HK";
					searchParams.NationalId = trimmedHkid;
					searchValue = trimmedHkid;
					break;
				case "name":
					searchParams.Surname = trimmedLastName || null;
					searchParams.GivenName = trimmedFirstName || null;
					searchValue = [trimmedFirstName, trimmedLastName]
						.filter(Boolean)
						.join(" ");
					break;
				case "phone":
					searchParams.PhoneNumber = trimmedPhoneNumber;
					searchValue = trimmedPhoneNumber;
					break;
				case "ref_name":
					searchParams.ReferenceName = trimmedRefName;
					searchValue = trimmedRefName;
					break;
				case "ref_phone":
					searchParams.ReferencePhoneNumber = trimmedRefPhoneNo;
					searchValue = trimmedRefPhoneNo;
					break;
				case "company":
					searchParams.CompanyName = trimmedCompanyName;
					searchValue = trimmedCompanyName;
					break;
				case "customer_ref":
					searchParams.CustomerId = trimmedCustomerRefNo;
					searchValue = trimmedCustomerRefNo;
					break;
			}

			const result = await crmAPI.searchCustomers(searchParams);
			const customers = result?.Customer || [];

			if (customers && customers.length > 0) {
				const searchResults = customers.map((customer: any) => ({
					ID_TYPE: customer.NationalIdType,
					CUSTOMER_ID: customer.NationalId,
					NICKNAME: customer.Nickname,
					SURNAME: customer.Surname,
					GIVEN_NAME: customer.GivenName,
					SEARCH_VALUE: searchValue,
				}));

				store.setSearchCriteria({
					searchResultList: searchResults,
					selectedSearchType: determinedSearchType || null,
				});
			} else {
				store.setSearchCriteria({ searchResultList: [] });
				setResultMessage("No results found");
				setShowResultDialog(true);
			}
		} catch (error) {
			console.error("Search failed:", error);
			setResultMessage("Search failed. Please try again.");
			setShowResultDialog(true);
		} finally {
			setIsSearching(false);
		}
	};

	const handleResultDoubleClick = useCallback(async (result: SearchResultItem) => {
		setIsSearching(true); // Show loading dialog

		store.setSearchCriteria({
			searchedNationalIdType: result.ID_TYPE,
			searchedNationalId: result.CUSTOMER_ID,
			isSearch: true,
		});

		try {
			await loadCustomer(result.ID_TYPE, result.CUSTOMER_ID, true);

			// Wait a tick for state to update
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Get fresh store state
			const currentStore = useCRMStore.getState();

			if (currentStore.customer?.Id) {
				onCustomerLoaded?.();
				// Switch to wrapup tab when customer is loaded (same as old app behavior)
				navigate({ to: '/crm/wrapup' });
			} else {
				setResultMessage("Failed to load customer data");
				setShowResultDialog(true);
			}
		} catch (error) {
			setResultMessage(
				`Error: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
			setShowResultDialog(true);
		} finally {
			setIsSearching(false);
		}
	}, [store, loadCustomer, onCustomerLoaded, navigate]);

	const columns = useMemo<ColumnDef<SearchResultItem>[]>(() => [
		{
			accessorKey: "ID_TYPE",
			header: "ID Type",
		},
		{
			accessorKey: "CUSTOMER_ID",
			header: "Customer ID",
		},
		{
			accessorKey: "SURNAME",
			header: "Surname",
		},
		{
			accessorKey: "GIVEN_NAME",
			header: "Given Name",
		},
		{
			accessorKey: "NICKNAME",
			header: "Nickname",
		},
		{
			accessorKey: "SEARCH_VALUE",
			header: searchTypeDisplayNames[currentSearchType] || "Search Value",
			cell: ({ row }) => {
				if (currentSearchType === "name") {
					return row.original.SEARCH_VALUE?.split(" ")[0] || "";
				}
				return row.original.SEARCH_VALUE || "";
			},
		},
	], [currentSearchType]);

	return (
		<div className="space-y-6 p-6">
			<LoaderDialog open={isSearching || customerLoading} />
			<ResultDialog
				open={showResultDialog}
				onOpenChange={setShowResultDialog}
				title="Search Result"
				message={resultMessage}
			/>

			<Card className="w-full">
				<CardContent className="pt-6">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						{/* Display form-level validation errors */}
						<form.Subscribe
							selector={(state) => [state.errors]}
							children={([errors]) =>
								errors.length > 0 ? (
									<div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
										{errors.join(", ")}
									</div>
								) : null
							}
						/>

						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="accountNo"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Account Number</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Example: 00000000-000"
										/>
									</div>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<form.Field
									name="lastName"
									children={(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>Last Name</Label>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												placeholder="Customer Last Name"
											/>
										</div>
									)}
								/>
								<form.Field
									name="firstName"
									children={(field) => (
										<div className="space-y-2">
											<Label htmlFor={field.name}>First Name</Label>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												placeholder="Customer First Name"
											/>
										</div>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="hkid"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>HKID/Passport/Reference ID</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Example: Y123456-7"
										/>
									</div>
								)}
							/>
							<form.Field
								name="phoneNumber"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Phone Number</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Example: 12345678"
										/>
									</div>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="refName"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Ref Name</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Reference Customer Name"
										/>
									</div>
								)}
							/>
							<form.Field
								name="refPhoneNo"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Ref Phone Number</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Example: 12345678"
										/>
									</div>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="companyName"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Company Name</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Company Name"
										/>
									</div>
								)}
							/>
							<form.Field
								name="customerRefNo"
								children={(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Customer Reference Number</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Reference Customer Number"
										/>
									</div>
								)}
							/>
						</div>

						<div className="flex justify-end gap-2">
							<Button type="button" onClick={handleClear} variant="outline">
								<EraserIcon className="h-4 w-4" />
								Clear
							</Button>
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button type="submit" disabled={!canSubmit || isSubmitting}>
										{isSubmitting ? (
											"Searching..."
										) : (
											<>
												<SearchIcon className="h-4 w-4" />
												Search
											</>
										)}
									</Button>
								)}
							/>
						</div>
					</form>
				</CardContent>
			</Card>

			{searchResults.length > 0 && (
				<Card className="w-full">
					{/* <CardHeader>
						<CardTitle>
							Search Results (Double-click to load customer)
						</CardTitle>
					</CardHeader> */}
					<CardContent>
						<DataTable
							columns={columns}
							data={searchResults}
							getRowId={(result) =>
								`${result.ID_TYPE}-${result.CUSTOMER_ID}`
							}
							onRowDoubleClick={(result) =>
								handleDoubleClick(() =>
									handleResultDoubleClick(result)
								)
							}
							enablePagination={false}
							enableToolbar={false}
						/>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
