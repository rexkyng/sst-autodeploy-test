/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MainController } from './../controllers/MainController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DataController } from './../controllers/DataController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CrmController } from './../controllers/CrmController';
import { expressAuthentication } from './../controllers/auth';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "HealthResponse": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "timestamp": {"dataType":"string","required":true},
            "service": {"dataType":"string","required":true},
            "version": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserResponse": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"string","required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StoredProcedureResponse": {
        "dataType": "refObject",
        "properties": {
            "Result": {"dataType":"nestedObjectLiteral","nestedProperties":{"Column1":{"dataType":"string"},"Table1":{"dataType":"array","array":{"dataType":"any"}},"Table":{"dataType":"array","array":{"dataType":"any"}}}},
            "Parameters": {"dataType":"array","array":{"dataType":"any"}},
            "error": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StoredProcedureRequest": {
        "dataType": "refObject",
        "properties": {
            "Provider": {"dataType":"string","required":true},
            "Command": {"dataType":"nestedObjectLiteral","nestedProperties":{"Parameters":{"dataType":"array","array":{"dataType":"any"},"required":true},"Type":{"dataType":"string","required":true},"Text":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerAddress": {
        "dataType": "refObject",
        "properties": {
            "CustomerId": {"dataType":"string","required":true},
            "AddressType": {"dataType":"string","required":true},
            "AddressLine1": {"dataType":"string","required":true},
            "AddressLine2": {"dataType":"string","required":true},
            "AddressLine3": {"dataType":"string","required":true},
            "AddressLine4": {"dataType":"string","required":true},
            "PhoneNumber": {"dataType":"string","required":true},
            "PhoneCountryCode": {"dataType":"string"},
            "PhoneExtension": {"dataType":"string"},
            "Country": {"dataType":"string","required":true},
            "PostalCode": {"dataType":"string","required":true},
            "Address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerInfo": {
        "dataType": "refObject",
        "properties": {
            "CustomerBusinesses": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerAddress"},"required":true},
            "CustomerResidentials": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerAddress"},"required":true},
            "SpouseBusinessPhoneCountryCode": {"dataType":"string","required":true},
            "SpouseBusinessPhoneNumber": {"dataType":"string","required":true},
            "SpouseCompanyAddress": {"dataType":"string","required":true},
            "SpouseAge": {"dataType":"string","required":true},
            "SpouseCompanyName": {"dataType":"string","required":true},
            "SpouseComplain": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "SpouseMobilePhoneCountryCode": {"dataType":"string","required":true},
            "SpouseMobilePhoneNumber": {"dataType":"string","required":true},
            "SpouseName": {"dataType":"string","required":true},
            "SpouseNameChinese": {"dataType":"string","required":true},
            "SpouseNickname": {"dataType":"string","required":true},
            "SpousePosition": {"dataType":"string","required":true},
            "OverseasWorkerLoanAddress": {"dataType":"string","required":true},
            "OverseasWorkerLoanDependantName": {"dataType":"string","required":true},
            "OverseasWorkerLoanEmployerName": {"dataType":"string","required":true},
            "OverseasWorkerLoanEmployerPhone": {"dataType":"string","required":true},
            "OverseasWorkerLoanPhoneNumber": {"dataType":"string","required":true},
            "OverseasWorkerLoanRelationship": {"dataType":"string","required":true},
            "GivenName": {"dataType":"string","required":true},
            "Surname": {"dataType":"string","required":true},
            "GivenNameChinese": {"dataType":"string","required":true},
            "SurnameChinese": {"dataType":"string","required":true},
            "Id": {"dataType":"string","required":true},
            "NationalIdType": {"dataType":"string","required":true},
            "DateOfMatch": {"dataType":"string","required":true},
            "PartialIdMatched": {"dataType":"boolean","required":true},
            "Nationality": {"dataType":"string","required":true},
            "MaritalStatus": {"dataType":"string","required":true},
            "DateOfBirth": {"dataType":"string","required":true},
            "Email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DebtorRequest": {
        "dataType": "refObject",
        "properties": {
            "Tenant": {"dataType":"string"},
            "IdType": {"dataType":"string","required":true},
            "NationalId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerSearchResponse": {
        "dataType": "refObject",
        "properties": {
            "Customer": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"GivenName":{"dataType":"string","required":true},"Surname":{"dataType":"string","required":true},"Nickname":{"dataType":"string","required":true},"NationalId":{"dataType":"string","required":true},"NationalIdType":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchRequest": {
        "dataType": "refObject",
        "properties": {
            "Tenant": {"dataType":"string","required":true},
            "AccountNumber": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "LoanSequence": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "NationalIdType": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "NationalId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "Surname": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "GivenName": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "ReferenceName": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "CompanyName": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "PhoneNumber": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "ReferencePhoneNumber": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "CustomerId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "AgentId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Reference": {
        "dataType": "refObject",
        "properties": {
            "Role": {"dataType":"string","required":true},
            "GivenName": {"dataType":"string","required":true},
            "Surname": {"dataType":"string","required":true},
            "GivenNameChinese": {"dataType":"string"},
            "SurnameChinese": {"dataType":"string"},
            "Age": {"dataType":"double"},
            "RelationshipCode": {"dataType":"string"},
            "MobilePhoneNumber": {"dataType":"string","required":true},
            "MobilePhoneCountryCode": {"dataType":"string"},
            "ResidentialPhoneNumber": {"dataType":"string","required":true},
            "ResidentialPhoneCountryCode": {"dataType":"string"},
            "BusinessPhoneNumber": {"dataType":"string","required":true},
            "BusinessPhoneCountryCode": {"dataType":"string"},
            "OtherPhoneNumber": {"dataType":"string","required":true},
            "OtherPhoneCountryCode": {"dataType":"string"},
            "Company": {"dataType":"string"},
            "Position": {"dataType":"string"},
            "HasActiveLoans": {"dataType":"boolean"},
            "CustomerId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Debtor": {
        "dataType": "refObject",
        "properties": {
            "CustomerId": {"dataType":"string"},
            "AccountNumber": {"dataType":"string","required":true},
            "LoanSequence": {"dataType":"string","required":true},
            "Role": {"dataType":"string","required":true},
            "NationalId": {"dataType":"string","required":true},
            "NationalIdType": {"dataType":"string","required":true},
            "GivenName": {"dataType":"string","required":true},
            "Surname": {"dataType":"string","required":true},
            "MobilePhoneNumber": {"dataType":"string","required":true},
            "ResidentialPhoneNumber": {"dataType":"string","required":true},
            "BusinessPhoneNumber": {"dataType":"string","required":true},
            "OtherPhoneNumber": {"dataType":"string","required":true},
            "References": {"dataType":"array","array":{"dataType":"refObject","ref":"Reference"},"required":true},
            "CustomerInfo": {"ref":"CustomerInfo"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Loan": {
        "dataType": "refObject",
        "properties": {
            "AccountNumber": {"dataType":"string","required":true},
            "LoanSequence": {"dataType":"string","required":true},
            "LoanStatus": {"dataType":"string","required":true},
            "LoanBalance": {"dataType":"double","required":true},
            "OverdueDay": {"dataType":"double","required":true},
            "NetOverdueAmount": {"dataType":"double","required":true},
            "LateCharge": {"dataType":"double","required":true},
            "AdminCharge": {"dataType":"double","required":true},
            "AnnualCharge": {"dataType":"double","required":true},
            "NextDueDate": {"dataType":"string","required":true},
            "SpecialRemarks": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "CenterRemarks": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "TotalNumberOfInstallment": {"dataType":"double"},
            "TotalNumberOfPaidInstallment": {"dataType":"double"},
            "InstallmentAmount": {"dataType":"double"},
            "RepayMethod": {"dataType":"string"},
            "RejectReason": {"dataType":"string"},
            "LoanType": {"dataType":"string"},
            "Group": {"dataType":"string"},
            "Role": {"dataType":"string"},
            "CampaignType": {"dataType":"string"},
            "LoanAmount": {"dataType":"double"},
            "IfAmount": {"dataType":"double"},
            "LoanDate": {"dataType":"string"},
            "ExpiryDate": {"dataType":"string"},
            "CutOffDate": {"dataType":"string"},
            "LastPayDate": {"dataType":"string"},
            "LastPayAmount": {"dataType":"double"},
            "Score": {"dataType":"double"},
            "FollowStatus": {"dataType":"string"},
            "TotalDeferDay": {"dataType":"double"},
            "C": {"dataType":"double"},
            "C1": {"dataType":"double"},
            "C2": {"dataType":"double"},
            "DirectSalesReferral": {"dataType":"string"},
            "EStatement": {"dataType":"string"},
            "ApBankAccountNumber": {"dataType":"string"},
            "DeferDay": {"dataType":"double"},
            "DiRate": {"dataType":"double"},
            "LoanExpiryDate": {"dataType":"string"},
            "PdStatus": {"dataType":"string"},
            "EarlySettleAmount": {"dataType":"double"},
            "InstallmentAmountMinPaid": {"dataType":"double"},
            "LastRepayMethod": {"dataType":"string"},
            "WaivedAdminCharge": {"dataType":"double"},
            "WaivedLateCharge": {"dataType":"double"},
            "Debtors": {"dataType":"array","array":{"dataType":"refObject","ref":"Debtor"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CallResultCode": {
        "dataType": "refObject",
        "properties": {
            "Id": {"dataType":"string","required":true},
            "Code": {"dataType":"string","required":true},
            "Description": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContactAmendmentHistory": {
        "dataType": "refObject",
        "properties": {
            "CustomerId": {"dataType":"string","required":true},
            "AccountNumber": {"dataType":"string","required":true},
            "LoanSequence": {"dataType":"string","required":true},
            "Role": {"dataType":"string","required":true},
            "PhoneType": {"dataType":"double","required":true},
            "PhoneNumber": {"dataType":"string","required":true},
            "PhoneExtension": {"dataType":"string","required":true},
            "PhoneInvalidReason": {"dataType":"string","required":true},
            "ActionDatetime": {"dataType":"string","required":true},
            "ActionType": {"dataType":"string","required":true},
            "AgentId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerPhone": {
        "dataType": "refObject",
        "properties": {
            "PhoneId": {"dataType":"string","required":true},
            "CustomerId": {"dataType":"string","required":true},
            "PhoneType": {"dataType":"double","required":true},
            "PhoneCountryCode": {"dataType":"string","required":true},
            "PhoneNumber": {"dataType":"string","required":true},
            "PhoneExtension": {"dataType":"string","required":true},
            "PhoneInvalidReason": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "AccountNumber": {"dataType":"string","required":true},
            "LoanSequence": {"dataType":"string","required":true},
            "Role": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FollowHistory": {
        "dataType": "refObject",
        "properties": {
            "Id": {"dataType":"string","required":true},
            "CustomerId": {"dataType":"string","required":true},
            "AccountNumber": {"dataType":"string","required":true},
            "LoanSequence": {"dataType":"string","required":true},
            "StartTime": {"dataType":"string","required":true},
            "ActionDateTime": {"dataType":"string","required":true},
            "CallResult": {"dataType":"string","required":true},
            "CallMemo": {"dataType":"string","required":true},
            "ConnId": {"dataType":"string","required":true},
            "AgentId": {"dataType":"string","required":true},
            "RecorderLink": {"dataType":"string","required":true},
            "IsAdhocSearch": {"dataType":"boolean"},
            "FollowStatus": {"dataType":"string"},
            "NextFollowDateTime": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FollowStatusCode": {
        "dataType": "refObject",
        "properties": {
            "Id": {"dataType":"string","required":true},
            "Code": {"dataType":"string","required":true},
            "Description": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MobilePhone": {
        "dataType": "refObject",
        "properties": {
            "mobile": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerDetailsResponse": {
        "dataType": "refObject",
        "properties": {
            "Customer": {"dataType":"nestedObjectLiteral","nestedProperties":{"CustomerResidentials":{"dataType":"array","array":{"dataType":"refObject","ref":"CustomerAddress"},"required":true},"CustomerBusinesses":{"dataType":"array","array":{"dataType":"refObject","ref":"CustomerAddress"},"required":true},"Loans":{"dataType":"array","array":{"dataType":"refObject","ref":"Loan"},"required":true},"PagerNumber":{"dataType":"string","required":true},"OtherPhoneNumber":{"dataType":"string","required":true},"MobilePhone2Number":{"dataType":"string","required":true},"MobilePhoneNumber":{"dataType":"string","required":true},"Email":{"dataType":"string","required":true},"DateOfBirth":{"dataType":"string","required":true},"Nickname":{"dataType":"string","required":true},"SurnameChinese":{"dataType":"string","required":true},"GivenNameChinese":{"dataType":"string","required":true},"Surname":{"dataType":"string","required":true},"GivenName":{"dataType":"string","required":true},"NationalIdType":{"dataType":"string","required":true},"NationalId":{"dataType":"string","required":true},"Id":{"dataType":"string","required":true}},"required":true},
            "CustomerBusinessesForEdit": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerAddress"},"required":true},
            "CustomerResidentialsForEdit": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerAddress"},"required":true},
            "ActionCodes": {"ref":"Record_string.any_","required":true},
            "BankAccountCodes": {"ref":"Record_string.any_","required":true},
            "BankInMethodCodes": {"ref":"Record_string.any_","required":true},
            "CallResultCodes": {"dataType":"array","array":{"dataType":"refObject","ref":"CallResultCode"},"required":true},
            "ContactAmendmentHistory": {"dataType":"array","array":{"dataType":"refObject","ref":"ContactAmendmentHistory"},"required":true},
            "CustomerPhone": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerPhone"},"required":true},
            "FollowHistory": {"dataType":"array","array":{"dataType":"refObject","ref":"FollowHistory"},"required":true},
            "FollowStatusCodes": {"dataType":"array","array":{"dataType":"refObject","ref":"FollowStatusCode"},"required":true},
            "Debtors": {"dataType":"array","array":{"dataType":"refObject","ref":"Debtor"},"required":true},
            "References": {"dataType":"array","array":{"dataType":"refObject","ref":"Reference"},"required":true},
            "mobile_phones": {"dataType":"array","array":{"dataType":"refObject","ref":"MobilePhone"},"required":true},
            "CustomerNickname": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerRequest": {
        "dataType": "refObject",
        "properties": {
            "Tenant": {"dataType":"string","required":true},
            "IdType": {"dataType":"string","required":true},
            "NationalId": {"dataType":"string","required":true},
            "ForceLatest": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WrapupResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "processedAt": {"dataType":"string","required":true},
            "accountsProcessed": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WrapupRequest": {
        "dataType": "refObject",
        "properties": {
            "TenantName": {"dataType":"string","required":true},
            "IsAdhocSearch": {"dataType":"boolean","required":true},
            "CallInfo": {"dataType":"nestedObjectLiteral","nestedProperties":{"NextFollowDatetime":{"dataType":"string"},"CustomerId":{"dataType":"string"},"AgentId":{"dataType":"string"},"CallListName":{"dataType":"string"},"CallResultCodeId":{"dataType":"string","required":true},"ConnId":{"dataType":"string"},"CallUUID":{"dataType":"string"},"InteractionType":{"dataType":"string"},"InteractionId":{"dataType":"string"},"Accounts":{"dataType":"array","array":{"dataType":"any"},"required":true},"Duration":{"dataType":"double","required":true},"StartTime":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsMainController_getHealthEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/health',
            ...(fetchMiddlewares<RequestHandler>(MainController)),
            ...(fetchMiddlewares<RequestHandler>(MainController.prototype.getHealthEndpoint)),

            async function MainController_getHealthEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMainController_getHealthEndpoint, request, response });

                const controller = new MainController();

              await templateService.apiHandler({
                methodName: 'getHealthEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMainController_getMeEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MainController)),
            ...(fetchMiddlewares<RequestHandler>(MainController.prototype.getMeEndpoint)),

            async function MainController_getMeEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMainController_getMeEndpoint, request, response });

                const controller = new MainController();

              await templateService.apiHandler({
                methodName: 'getMeEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDataController_executeStoredProcedureEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"StoredProcedureRequest"},
        };
        app.post('/api/data',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DataController)),
            ...(fetchMiddlewares<RequestHandler>(DataController.prototype.executeStoredProcedureEndpoint)),

            async function DataController_executeStoredProcedureEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDataController_executeStoredProcedureEndpoint, request, response });

                const controller = new DataController();

              await templateService.apiHandler({
                methodName: 'executeStoredProcedureEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCrmController_getDebtorInfoEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"DebtorRequest"},
        };
        app.post('/api/crm/debtor',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CrmController)),
            ...(fetchMiddlewares<RequestHandler>(CrmController.prototype.getDebtorInfoEndpoint)),

            async function CrmController_getDebtorInfoEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCrmController_getDebtorInfoEndpoint, request, response });

                const controller = new CrmController();

              await templateService.apiHandler({
                methodName: 'getDebtorInfoEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCrmController_searchCustomersEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"SearchRequest"},
        };
        app.post('/api/crm/search',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CrmController)),
            ...(fetchMiddlewares<RequestHandler>(CrmController.prototype.searchCustomersEndpoint)),

            async function CrmController_searchCustomersEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCrmController_searchCustomersEndpoint, request, response });

                const controller = new CrmController();

              await templateService.apiHandler({
                methodName: 'searchCustomersEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCrmController_getCustomerDetailsEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"CustomerRequest"},
        };
        app.post('/api/crm/customer',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CrmController)),
            ...(fetchMiddlewares<RequestHandler>(CrmController.prototype.getCustomerDetailsEndpoint)),

            async function CrmController_getCustomerDetailsEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCrmController_getCustomerDetailsEndpoint, request, response });

                const controller = new CrmController();

              await templateService.apiHandler({
                methodName: 'getCustomerDetailsEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCrmController_submitWrapupEndpoint: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"WrapupRequest"},
        };
        app.post('/api/crm/wrapup',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CrmController)),
            ...(fetchMiddlewares<RequestHandler>(CrmController.prototype.submitWrapupEndpoint)),

            async function CrmController_submitWrapupEndpoint(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCrmController_submitWrapupEndpoint, request, response });

                const controller = new CrmController();

              await templateService.apiHandler({
                methodName: 'submitWrapupEndpoint',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
