/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export interface UserResponse {
  userId: string;
  name: string;
}

/** Shared types for TSOA controllers */
export interface ErrorResponse {
  error: string;
  message?: string;
}

export interface StoredProcedureResponse {
  Result?: {
    Column1?: string;
    Table1?: any[];
    Table?: any[];
  };
  Parameters?: any[];
  error?: string;
}

export interface StoredProcedureRequest {
  Provider: string;
  Command: {
    Parameters: any[];
    Type: string;
    Text: string;
  };
}

export interface CustomerAddress {
  CustomerId: string;
  AddressType: string;
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
  AddressLine4: string;
  PhoneNumber: string;
  PhoneCountryCode?: string;
  PhoneExtension?: string;
  Country: string;
  PostalCode: string;
  Address?: string;
}

export interface CustomerInfo {
  CustomerBusinesses: CustomerAddress[];
  CustomerResidentials: CustomerAddress[];
  SpouseBusinessPhoneCountryCode: string;
  SpouseBusinessPhoneNumber: string;
  SpouseCompanyAddress: string;
  SpouseAge: string;
  SpouseCompanyName: string;
  SpouseComplain: string | null;
  SpouseMobilePhoneCountryCode: string;
  SpouseMobilePhoneNumber: string;
  SpouseName: string;
  SpouseNameChinese: string;
  SpouseNickname: string;
  SpousePosition: string;
  OverseasWorkerLoanAddress: string;
  OverseasWorkerLoanDependantName: string;
  OverseasWorkerLoanEmployerName: string;
  OverseasWorkerLoanEmployerPhone: string;
  OverseasWorkerLoanPhoneNumber: string;
  OverseasWorkerLoanRelationship: string;
  GivenName: string;
  Surname: string;
  GivenNameChinese: string;
  SurnameChinese: string;
  Id: string;
  NationalIdType: string;
  DateOfMatch: string;
  PartialIdMatched: boolean;
  Nationality: string;
  MaritalStatus: string;
  DateOfBirth: string;
  Email: string;
}

export interface DebtorRequest {
  Tenant?: string;
  IdType: string;
  NationalId: string;
}

export interface CustomerSearchResponse {
  Customer: {
    GivenName: string;
    Surname: string;
    Nickname: string;
    NationalId: string;
    NationalIdType: string;
  }[];
}

export interface SearchRequest {
  Tenant: string;
  AccountNumber?: string | null;
  LoanSequence?: string | null;
  NationalIdType?: string | null;
  NationalId?: string | null;
  Surname?: string | null;
  GivenName?: string | null;
  ReferenceName?: string | null;
  CompanyName?: string | null;
  PhoneNumber?: string | null;
  ReferencePhoneNumber?: string | null;
  CustomerId?: string | null;
  AgentId?: string | null;
}

export interface Reference {
  Role: string;
  GivenName: string;
  Surname: string;
  GivenNameChinese?: string;
  SurnameChinese?: string;
  /** @format double */
  Age?: number;
  RelationshipCode?: string;
  MobilePhoneNumber: string;
  MobilePhoneCountryCode?: string;
  ResidentialPhoneNumber: string;
  ResidentialPhoneCountryCode?: string;
  BusinessPhoneNumber: string;
  BusinessPhoneCountryCode?: string;
  OtherPhoneNumber: string;
  OtherPhoneCountryCode?: string;
  Company?: string;
  Position?: string;
  HasActiveLoans?: boolean;
  CustomerId?: string;
}

export interface Debtor {
  CustomerId?: string;
  AccountNumber: string;
  LoanSequence: string;
  Role: string;
  NationalId: string;
  NationalIdType: string;
  GivenName: string;
  Surname: string;
  MobilePhoneNumber: string;
  ResidentialPhoneNumber: string;
  BusinessPhoneNumber: string;
  OtherPhoneNumber: string;
  References: Reference[];
  CustomerInfo?: CustomerInfo;
}

export interface Loan {
  AccountNumber: string;
  LoanSequence: string;
  LoanStatus: string;
  /** @format double */
  LoanBalance: number;
  /** @format double */
  OverdueDay: number;
  /** @format double */
  NetOverdueAmount: number;
  /** @format double */
  LateCharge: number;
  /** @format double */
  AdminCharge: number;
  /** @format double */
  AnnualCharge: number;
  NextDueDate: string;
  SpecialRemarks: string | null;
  CenterRemarks: string | null;
  /** @format double */
  TotalNumberOfInstallment?: number;
  /** @format double */
  TotalNumberOfPaidInstallment?: number;
  /** @format double */
  InstallmentAmount?: number;
  RepayMethod?: string;
  RejectReason?: string;
  LoanType?: string;
  Group?: string;
  Role?: string;
  CampaignType?: string;
  /** @format double */
  LoanAmount?: number;
  /** @format double */
  IfAmount?: number;
  LoanDate?: string;
  ExpiryDate?: string;
  CutOffDate?: string;
  LastPayDate?: string;
  /** @format double */
  LastPayAmount?: number;
  /** @format double */
  Score?: number;
  FollowStatus?: string;
  /** @format double */
  TotalDeferDay?: number;
  /** @format double */
  C?: number;
  /** @format double */
  C1?: number;
  /** @format double */
  C2?: number;
  DirectSalesReferral?: string;
  EStatement?: string;
  ApBankAccountNumber?: string;
  /** @format double */
  DeferDay?: number;
  /** @format double */
  DiRate?: number;
  LoanExpiryDate?: string;
  PdStatus?: string;
  /** @format double */
  EarlySettleAmount?: number;
  /** @format double */
  InstallmentAmountMinPaid?: number;
  LastRepayMethod?: string;
  /** @format double */
  WaivedAdminCharge?: number;
  /** @format double */
  WaivedLateCharge?: number;
  Debtors: Debtor[];
}

/** Construct a type with a set of properties K of type T */
export type RecordStringAny = Record<string, any>;

export interface CallResultCode {
  Id: string;
  Code: string;
  Description: string;
}

export interface ContactAmendmentHistory {
  CustomerId: string;
  AccountNumber: string;
  LoanSequence: string;
  Role: string;
  /** @format double */
  PhoneType: number;
  PhoneNumber: string;
  PhoneExtension: string;
  PhoneInvalidReason: string;
  ActionDatetime: string;
  ActionType: string;
  AgentId: string;
}

export interface CustomerPhone {
  PhoneId: string;
  CustomerId: string;
  /** @format double */
  PhoneType: number;
  PhoneCountryCode: string;
  PhoneNumber: string;
  PhoneExtension: string;
  PhoneInvalidReason: string | null;
  AccountNumber: string;
  LoanSequence: string;
  Role: string;
}

export interface FollowHistory {
  Id: string;
  CustomerId: string;
  AccountNumber: string;
  LoanSequence: string;
  StartTime: string;
  ActionDateTime: string;
  CallResult: string;
  CallMemo: string;
  ConnId: string;
  AgentId: string;
  RecorderLink: string;
  IsAdhocSearch?: boolean;
  FollowStatus?: string;
  NextFollowDateTime?: string;
}

export interface FollowStatusCode {
  Id: string;
  Code: string;
  Description: string;
}

export interface MobilePhone {
  mobile: string;
}

export interface CustomerDetailsResponse {
  Customer: {
    CustomerResidentials: CustomerAddress[];
    CustomerBusinesses: CustomerAddress[];
    Loans: Loan[];
    PagerNumber: string;
    OtherPhoneNumber: string;
    MobilePhone2Number: string;
    MobilePhoneNumber: string;
    Email: string;
    DateOfBirth: string;
    Nickname: string;
    SurnameChinese: string;
    GivenNameChinese: string;
    Surname: string;
    GivenName: string;
    NationalIdType: string;
    NationalId: string;
    Id: string;
  };
  CustomerBusinessesForEdit: CustomerAddress[];
  CustomerResidentialsForEdit: CustomerAddress[];
  /** Construct a type with a set of properties K of type T */
  ActionCodes: RecordStringAny;
  /** Construct a type with a set of properties K of type T */
  BankAccountCodes: RecordStringAny;
  /** Construct a type with a set of properties K of type T */
  BankInMethodCodes: RecordStringAny;
  CallResultCodes: CallResultCode[];
  ContactAmendmentHistory: ContactAmendmentHistory[];
  CustomerPhone: CustomerPhone[];
  FollowHistory: FollowHistory[];
  FollowStatusCodes: FollowStatusCode[];
  Debtors: Debtor[];
  References: Reference[];
  mobile_phones: MobilePhone[];
  CustomerNickname: string;
}

export interface CustomerRequest {
  Tenant: string;
  IdType: string;
  NationalId: string;
  ForceLatest?: boolean;
}

export interface WrapupResponse {
  success: boolean;
  message: string;
  processedAt: string;
  /** @format double */
  accountsProcessed: number;
}

export interface WrapupRequest {
  TenantName: string;
  IsAdhocSearch: boolean;
  CallInfo: {
    NextFollowDatetime?: string;
    CustomerId?: string;
    AgentId?: string;
    CallListName?: string;
    CallResultCodeId: string;
    ConnId?: string;
    CallUUID?: string;
    InteractionType?: string;
    InteractionId?: string;
    Accounts: any[];
    /** @format double */
    Duration: number;
    StartTime: string;
  };
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title @openauth/tsoa
 * @version 0.0.0
 * @baseUrl /api
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  health = {
    /**
     * @description Health check endpoint
     *
     * @tags System
     * @name GetHealthEndpoint
     * @request GET:/health
     */
    getHealthEndpoint: (params: RequestParams = {}) =>
      this.request<HealthResponse, any>({
        path: `/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  me = {
    /**
     * @description Get current user information Authentication is handled by API Gateway's JWT authorizer
     *
     * @tags System
     * @name GetMeEndpoint
     * @request GET:/me
     * @secure
     */
    getMeEndpoint: (params: RequestParams = {}) =>
      this.request<UserResponse, ErrorResponse>({
        path: `/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  data = {
    /**
     * @description Execute a stored procedure
     *
     * @tags Data
     * @name ExecuteStoredProcedureEndpoint
     * @request POST:/data
     * @secure
     */
    executeStoredProcedureEndpoint: (
      data: StoredProcedureRequest,
      params: RequestParams = {},
    ) =>
      this.request<StoredProcedureResponse, ErrorResponse>({
        path: `/data`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  crm = {
    /**
     * @description Get debtor information by national ID
     *
     * @tags CRM
     * @name GetDebtorInfoEndpoint
     * @request POST:/crm/debtor
     * @secure
     */
    getDebtorInfoEndpoint: (data: DebtorRequest, params: RequestParams = {}) =>
      this.request<CustomerInfo, ErrorResponse>({
        path: `/crm/debtor`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Search customers by various criteria
     *
     * @tags CRM
     * @name SearchCustomersEndpoint
     * @request POST:/crm/search
     * @secure
     */
    searchCustomersEndpoint: (
      data: SearchRequest,
      params: RequestParams = {},
    ) =>
      this.request<CustomerSearchResponse, ErrorResponse>({
        path: `/crm/search`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get full customer details by national ID
     *
     * @tags CRM
     * @name GetCustomerDetailsEndpoint
     * @request POST:/crm/customer
     * @secure
     */
    getCustomerDetailsEndpoint: (
      data: CustomerRequest,
      params: RequestParams = {},
    ) =>
      this.request<CustomerDetailsResponse, ErrorResponse>({
        path: `/crm/customer`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Submit wrapup data after a call
     *
     * @tags CRM
     * @name SubmitWrapupEndpoint
     * @request POST:/crm/wrapup
     * @secure
     */
    submitWrapupEndpoint: (data: WrapupRequest, params: RequestParams = {}) =>
      this.request<WrapupResponse, ErrorResponse>({
        path: `/crm/wrapup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
