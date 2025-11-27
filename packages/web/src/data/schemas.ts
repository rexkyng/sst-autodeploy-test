import { z } from "zod";

// Search form validation schema
export const searchFormSchema = z.object({
	accountNo: z.string(),
	loanSequence: z.string(),
	hkid: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phoneNumber: z.string(),
	refName: z.string(),
	refPhoneNo: z.string(),
	companyName: z.string(),
	customerRefNo: z.string(),
});

// Type inference from schema
export type SearchFormData = z.infer<typeof searchFormSchema>;
