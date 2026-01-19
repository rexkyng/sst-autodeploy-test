import { z } from "zod";

export const HealthSchema = z.object({
	status: z.string(),
	timestamp: z.string(),
	service: z.string(),
	version: z.string(),
});

export const UserSchema = z.object({
	userId: z.string(),
	name: z.string(),
});

export const ErrorSchema = z.object({
	error: z.string(),
	message: z.string().optional(),
});

export const StoredProcedureRequestSchema = z.object({
	Provider: z.string(),
	Command: z.object({
		Parameters: z.array(z.any()),
		Type: z.string(),
		Text: z.string(),
	}),
});

export const StoredProcedureResponseSchema = z
	.object({
		Result: z.record(z.any()).optional(),
		Parameters: z.array(z.any()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const CustomerAddressSchema = z
	.object({
		CustomerId: z.string(),
		AddressType: z.string(),
		AddressLine1: z.string(),
		AddressLine2: z.string(),
		AddressLine3: z.string(),
		AddressLine4: z.string(),
		PhoneNumber: z.string(),
		PhoneCountryCode: z.string().optional(),
		PhoneExtension: z.string().optional(),
		Country: z.string(),
		PostalCode: z.string(),
		Address: z.string().optional(),
	})
	.passthrough();

export const CallResultCodeSchema = z
	.object({
		Id: z.string(),
		Code: z.string(),
		Description: z.string(),
	})
	.passthrough();

export const FollowStatusCodeSchema = z
	.object({
		Id: z.string(),
		Code: z.string(),
		Description: z.string(),
	})
	.passthrough();

export const CustomerPhoneSchema = z
	.object({
		PhoneId: z.string(),
		CustomerId: z.string(),
		PhoneType: z.number(),
		PhoneCountryCode: z.string(),
		PhoneNumber: z.string(),
		PhoneExtension: z.string(),
		PhoneInvalidReason: z.string().nullable(),
		AccountNumber: z.string(),
		LoanSequence: z.string(),
		Role: z.string(),
	})
	.passthrough();

export const ContactAmendmentHistorySchema = z
	.object({
		CustomerId: z.string(),
		AccountNumber: z.string(),
		LoanSequence: z.string(),
		Role: z.string(),
		PhoneType: z.number(),
		PhoneNumber: z.string(),
		PhoneExtension: z.string(),
		PhoneInvalidReason: z.string(),
		ActionDatetime: z.string(),
		ActionType: z.string(),
		AgentId: z.string(),
	})
	.passthrough();

export const FollowHistorySchema = z
	.object({
		Id: z.string(),
		CustomerId: z.string(),
		AccountNumber: z.string(),
		LoanSequence: z.string(),
		StartTime: z.string(),
		ActionDateTime: z.string(),
		CallResult: z.string(),
		CallMemo: z.string(),
		ConnId: z.string(),
		AgentId: z.string(),
		RecorderLink: z.string(),
		IsAdhocSearch: z.boolean().optional(),
		FollowStatus: z.string().optional(),
		NextFollowDateTime: z.string().optional(),
	})
	.passthrough();

export const LoanSchema = z
	.object({
		AccountNumber: z.string(),
		LoanSequence: z.string(),
		LoanStatus: z.string(),
		LoanBalance: z.number(),
		OverdueDay: z.number(),
		NetOverdueAmount: z.number(),
		LateCharge: z.number(),
		AdminCharge: z.number(),
		AnnualCharge: z.number(),
		NextDueDate: z.string(),
		SpecialRemarks: z.string().nullable(),
		CenterRemarks: z.string().nullable(),
		TotalNumberOfInstallment: z.number().optional(),
		TotalNumberOfPaidInstallment: z.number().optional(),
		InstallmentAmount: z.number().optional(),
		RepayMethod: z.string().optional(),
		RejectReason: z.string().optional(),
		LoanType: z.string().optional(),
		Group: z.string().optional(),
		CampaignType: z.string().optional(),
		LoanAmount: z.number().optional(),
		IfAmount: z.number().optional(),
		LoanDate: z.string().optional(),
		ExpiryDate: z.string().optional(),
		CutOffDate: z.string().optional(),
		LastPayDate: z.string().optional(),
		LastPayAmount: z.number().optional(),
		Score: z.number().optional(),
		FollowStatus: z.string().optional(),
		TotalDeferDay: z.number().optional(),
		C: z.number().optional(),
		C1: z.number().optional(),
		C2: z.number().optional(),
		DirectSalesReferral: z.string().optional(),
		EStatement: z.string().optional(),
		ApBankAccountNumber: z.string().optional(),
		DeferDay: z.number().optional(),
		DiRate: z.number().optional(),
		LoanExpiryDate: z.string().optional(),
		PdStatus: z.string().optional(),
		EarlySettleAmount: z.number().optional(),
		InstallmentAmountMinPaid: z.number().optional(),
		LastRepayMethod: z.string().optional(),
		WaivedAdminCharge: z.number().optional(),
		WaivedLateCharge: z.number().optional(),
		Debtors: z.array(z.any()),
	})
	.passthrough();

export const ReferenceSchema = z
	.object({
		Role: z.string(),
		GivenName: z.string(),
		Surname: z.string(),
		GivenNameChinese: z.string().optional(),
		SurnameChinese: z.string().optional(),
		Age: z.number().optional(),
		RelationshipCode: z.string().optional(),
		MobilePhoneNumber: z.string(),
		MobilePhoneCountryCode: z.string().optional(),
		ResidentialPhoneNumber: z.string(),
		ResidentialPhoneCountryCode: z.string().optional(),
		BusinessPhoneNumber: z.string(),
		BusinessPhoneCountryCode: z.string().optional(),
		OtherPhoneNumber: z.string(),
		OtherPhoneCountryCode: z.string().optional(),
		Company: z.string().optional(),
		Position: z.string().optional(),
		HasActiveLoans: z.boolean().optional(),
		CustomerId: z.string().optional(),
	})
	.passthrough();

export const DebtorSchema = z
	.object({
		CustomerId: z.string().optional(),
		AccountNumber: z.string(),
		LoanSequence: z.string(),
		Role: z.string(),
		NationalId: z.string(),
		NationalIdType: z.string(),
		GivenName: z.string(),
		Surname: z.string(),
		MobilePhoneNumber: z.string(),
		ResidentialPhoneNumber: z.string(),
		BusinessPhoneNumber: z.string(),
		OtherPhoneNumber: z.string(),
		References: z.array(ReferenceSchema),
		CustomerInfo: z.any().optional(),
	})
	.passthrough();

export const MobilePhoneSchema = z
	.object({
		mobile: z.string(),
	})
	.passthrough();

export const CustomerDetailsResponseSchema = z
	.object({
		Customer: z.object({
			CustomerResidentials: z.array(CustomerAddressSchema),
			CustomerBusinesses: z.array(CustomerAddressSchema),
			Loans: z.array(LoanSchema),
			PagerNumber: z.string(),
			OtherPhoneNumber: z.string(),
			MobilePhoneNumber: z.string(),
			MobilePhone2Number: z.string(),
			Email: z.string(),
			DateOfBirth: z.string(),
			Nickname: z.string(),
			SurnameChinese: z.string(),
			GivenNameChinese: z.string(),
			Surname: z.string(),
			GivenName: z.string(),
			NationalIdType: z.string(),
			NationalId: z.string(),
			Id: z.string(),
		}),
		CustomerBusinessesForEdit: z.array(CustomerAddressSchema),
		CustomerResidentialsForEdit: z.array(CustomerAddressSchema),
		ActionCodes: z.record(z.any()),
		BankAccountCodes: z.record(z.any()),
		BankInMethodCodes: z.record(z.any()),
		CallResultCodes: z.array(CallResultCodeSchema),
		ContactAmendmentHistory: z.array(ContactAmendmentHistorySchema),
		CustomerPhone: z.array(CustomerPhoneSchema),
		FollowHistory: z.array(FollowHistorySchema),
		FollowStatusCodes: z.array(FollowStatusCodeSchema),
		Debtors: z.array(DebtorSchema),
		References: z.array(ReferenceSchema),
		mobile_phones: z.array(MobilePhoneSchema),
		CustomerNickname: z.string(),
	})
	.passthrough();

export const CustomerInfoSchema = z
	.object({
		CustomerBusinesses: z.array(CustomerAddressSchema),
		CustomerResidentials: z.array(CustomerAddressSchema),
		SpouseBusinessPhoneCountryCode: z.string(),
		SpouseBusinessPhoneNumber: z.string(),
		SpouseCompanyAddress: z.string(),
		SpouseAge: z.string(),
		SpouseCompanyName: z.string(),
		SpouseComplain: z.string().nullable(),
		SpouseMobilePhoneCountryCode: z.string(),
		SpouseMobilePhoneNumber: z.string(),
		SpouseName: z.string(),
		SpouseNameChinese: z.string(),
		SpouseNickname: z.string(),
		SpousePosition: z.string(),
		OverseasWorkerLoanAddress: z.string(),
		OverseasWorkerLoanDependantName: z.string(),
		OverseasWorkerLoanEmployerName: z.string(),
		OverseasWorkerLoanEmployerPhone: z.string(),
		OverseasWorkerLoanPhoneNumber: z.string(),
		OverseasWorkerLoanRelationship: z.string(),
		GivenName: z.string(),
		Surname: z.string(),
		GivenNameChinese: z.string(),
		SurnameChinese: z.string(),
		Id: z.string(),
		NationalIdType: z.string(),
		DateOfMatch: z.string(),
		PartialIdMatched: z.boolean(),
		Nationality: z.string(),
		MaritalStatus: z.string(),
		DateOfBirth: z.string(),
		Email: z.string(),
	})
	.passthrough();

export const CustomerSearchResponseSchema = z.object({
	Customer: z.array(
		z.object({
			GivenName: z.string(),
			Surname: z.string(),
			Nickname: z.string(),
			NationalId: z.string(),
			NationalIdType: z.string(),
		}),
	),
});

export const WrapupResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	processedAt: z.string(),
	accountsProcessed: z.number(),
});

export const DebtorRequestSchema = z.object({
	Tenant: z.string().optional(),
	IdType: z.string(),
	NationalId: z.string(),
});

export const SearchRequestSchema = z.object({
	Tenant: z.string(),
	AccountNumber: z.string().nullable().optional(),
	LoanSequence: z.string().nullable().optional(),
	NationalIdType: z.string().nullable().optional(),
	NationalId: z.string().nullable().optional(),
	Surname: z.string().nullable().optional(),
	GivenName: z.string().nullable().optional(),
	ReferenceName: z.string().nullable().optional(),
	CompanyName: z.string().nullable().optional(),
	PhoneNumber: z.string().nullable().optional(),
	ReferencePhoneNumber: z.string().nullable().optional(),
	CustomerId: z.string().nullable().optional(),
	AgentId: z.string().nullable().optional(),
});

export const CustomerRequestSchema = z.object({
	Tenant: z.string(),
	IdType: z.string(),
	NationalId: z.string(),
	ForceLatest: z.boolean().optional(),
});

export const WrapupRequestSchema = z.object({
	TenantName: z.string(),
	IsAdhocSearch: z.boolean(),
	CallInfo: z.object({
		StartTime: z.string(),
		Duration: z.number(),
		Accounts: z.array(z.any()),
		InteractionId: z.string().optional(),
		InteractionType: z.string().optional(),
		CallUUID: z.string().optional(),
		ConnId: z.string().optional(),
		CallResultCodeId: z.string(),
		CallListName: z.string().optional(),
		AgentId: z.string().optional(),
		CustomerId: z.string().optional(),
		NextFollowDatetime: z.string().optional(),
	}),
});
