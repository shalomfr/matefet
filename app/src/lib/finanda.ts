// Finanda Smart Aggregation - Service Layer
// Open Banking API integration for Israeli banks (NextGenPSD2 XS2A)
// Docs: https://docs.finanda.com/

// ==================== TYPES ====================

export interface FinandaAccount {
  iban: string;
  currency: string;
  accountType: string;
  accountId: string;
  accountNumber: string;
  branchNumber: string;
  bankCode: number;
  bankName: string;
  accountName: string;
  creditLimit?: number;
  balances: FinandaBalance[];
}

export interface FinandaBalance {
  balanceAmount: { currency: string; amount: string };
  balanceType: "closingBooked" | "expected" | "openingBooked" | "interimAvailable" | "forwardAvailable" | "interimBooked";
  referenceDate: string;
  lastChangeDateTime?: string;
}

export interface FinandaTransaction {
  transactionId: string;
  accountId: string;
  amount: { currency: string; amount: string };
  direction: "CREDIT" | "DEBIT";
  description: string;
  counterpartyName?: string;
  reference?: string;
  category?: string;
  categoryGroup?: string;
  state: "booked" | "pending";
  valueDate: string;
  bookingDate: string;
  balance?: number;
}

export interface FinandaPaymentResponse {
  paymentId: string;
  transactionStatus: "RCVD" | "ACCP" | "ACSC" | "RJCT";
  message?: string;
}

export interface FinandaConsentResponse {
  consentId: string;
  redirectUrl: string;
  validUntil: string;
}

export interface FinandaJobStatus {
  status: "initiated" | "after-queue" | "download-completed" | "completed" | "failure";
  ilsAccounts?: number;
  ilsTransactions?: number;
  ccAccounts?: number;
  ccTransactions?: number;
}

// ==================== ISRAELI BANKS ====================

export interface IsraeliBank {
  bankCode: number;
  name: string;
  nameEn: string;
  icon: string;
  type: "bank" | "credit_card";
}

export const ISRAELI_BANKS: IsraeliBank[] = [
  { bankCode: 12, name: "בנק הפועלים", nameEn: "Bank Hapoalim", icon: "🏦", type: "bank" },
  { bankCode: 10, name: "בנק לאומי", nameEn: "Bank Leumi", icon: "🏦", type: "bank" },
  { bankCode: 20, name: "בנק מזרחי טפחות", nameEn: "Mizrahi Tefahot", icon: "🏦", type: "bank" },
  { bankCode: 11, name: "בנק דיסקונט", nameEn: "Discount Bank", icon: "🏦", type: "bank" },
  { bankCode: 31, name: "הבנק הבינלאומי הראשון", nameEn: "FIBI", icon: "🏦", type: "bank" },
  { bankCode: 14, name: "בנק אוצר החייל", nameEn: "Bank Otsar HaHayal", icon: "🏦", type: "bank" },
  { bankCode: 17, name: "בנק מרכנתיל דיסקונט", nameEn: "Mercantile Discount", icon: "🏦", type: "bank" },
  { bankCode: 18, name: "הבנק הדיגיטלי הראשון", nameEn: "ONE ZERO", icon: "🏦", type: "bank" },
  { bankCode: 4, name: "בנק יהב", nameEn: "Bank Yahav", icon: "🏦", type: "bank" },
  { bankCode: 26, name: "יובנק", nameEn: "U-Bank", icon: "🏦", type: "bank" },
  { bankCode: 54, name: "בנק ירושלים", nameEn: "Bank of Jerusalem", icon: "🏦", type: "bank" },
  { bankCode: 9, name: "דואר פיננסים", nameEn: "Israel Post Finance", icon: "🏦", type: "bank" },
  { bankCode: 10023, name: "כ.א.ל (CAL)", nameEn: "CAL", icon: "💳", type: "credit_card" },
  { bankCode: 10033, name: "מקס (Max)", nameEn: "Max", icon: "💳", type: "credit_card" },
  { bankCode: 12002, name: "ישראכרט", nameEn: "Isracard", icon: "💳", type: "credit_card" },
];

// ==================== ERROR ====================

export class FinandaNotConnectedError extends Error {
  constructor() {
    super("Finanda API is not configured. Set FINANDA_API_KEY, FINANDA_CUSTOMER_ID, and FINANDA_SECRET_KEY environment variables.");
    this.name = "FinandaNotConnectedError";
  }
}

// ==================== SERVICE ====================

export class FinandaService {
  private baseUrl: string;
  private customerId: string;
  private secretKey: string;
  private codeVerifier: string;

  constructor() {
    const isProduction = process.env.FINANDA_ENV === "production";
    this.baseUrl = isProduction
      ? "https://fsa.production.finanda.com"
      : "https://fsa.testing.finanda.com";
    this.customerId = process.env.FINANDA_CUSTOMER_ID ?? "";
    this.secretKey = process.env.FINANDA_SECRET_KEY ?? "";
    this.codeVerifier = process.env.FINANDA_CODE_VERIFIER ?? "";
  }

  get isConfigured(): boolean {
    return !!(process.env.FINANDA_API_KEY && this.customerId && this.secretKey);
  }

  private ensureConfigured(): void {
    if (!this.isConfigured) {
      throw new FinandaNotConnectedError();
    }
  }

  // Generate JWT token for Finanda API authentication
  private async generateToken(): Promise<string> {
    this.ensureConfigured();
    // In production, this would use jsonwebtoken with RS256:
    // const jwt = require('jsonwebtoken');
    // return jwt.sign({ codeVerifier: this.codeVerifier }, { key: this.secretKey, passphrase }, { algorithm: 'RS256', expiresIn: 60 });
    throw new FinandaNotConnectedError();
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await this.generateToken();
    return {
      "Content-Type": "application/json",
      "fsa-customer-id": this.customerId,
      "x-request-id": crypto.randomUUID(),
      "fsa-secret-token": token,
      "fsa-api-version": "v1",
    };
  }

  // ==================== BANKS ====================

  getSupportedBanks(): IsraeliBank[] {
    return ISRAELI_BANKS;
  }

  getBankByCode(bankCode: number): IsraeliBank | undefined {
    return ISRAELI_BANKS.find((b) => b.bankCode === bankCode);
  }

  // ==================== PROFILE ====================

  async createProfile(profileId: string): Promise<{ profileId: string }> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/createProfile`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId }),
    });
    return res.json();
  }

  // ==================== CONSENT ====================

  async getConsentUrl(profileId: string, bankCode: number, redirectUrl: string): Promise<FinandaConsentResponse> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/createSession`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId }),
    });
    const session = await res.json();

    const consentRes = await fetch(`${this.baseUrl}/createConsent`, {
      method: "POST",
      headers: { ...headers, "x-request-id": crypto.randomUUID() },
      body: JSON.stringify({
        profileId,
        sessionId: session.sessionId,
        aspsp_code: bankCode,
        redirectUrl,
      }),
    });
    return consentRes.json();
  }

  async handleConsentCallback(profileId: string, authCode: string): Promise<{ consentId: string }> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/exchangeAuthorizationToken`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId, authorizationCode: authCode }),
    });
    return res.json();
  }

  // ==================== ACCOUNTS (AIS) ====================

  async getAccounts(profileId: string): Promise<FinandaAccount[]> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/getAccountList`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId }),
    });
    const data = await res.json();
    return data.accounts ?? [];
  }

  async getTransactions(profileId: string, accountId: string, dateFrom?: string, dateTo?: string): Promise<FinandaTransaction[]> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/getTransactions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId, accountId, dateFrom, dateTo }),
    });
    const data = await res.json();
    return data.transactions ?? [];
  }

  // ==================== JOBS ====================

  async initiateJob(profileId: string, consentId: string): Promise<{ jobId: string }> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/initiateJobForConsent`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId, consentId }),
    });
    return res.json();
  }

  async getJobStatus(profileId: string, jobId: string): Promise<FinandaJobStatus> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/getJobStatus`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId, jobId }),
    });
    return res.json();
  }

  // ==================== PAYMENTS (PIS) ====================

  async initiatePayment(
    profileId: string,
    fromIban: string,
    toIban: string,
    amount: number,
    currency: string = "ILS",
    reference?: string
  ): Promise<FinandaPaymentResponse> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/initiatePayment`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        profileId,
        debtorAccount: { iban: fromIban },
        creditorAccount: { iban: toIban },
        instructedAmount: { currency, amount: amount.toString() },
        remittanceInformationUnstructured: reference,
      }),
    });
    return res.json();
  }

  async getPaymentStatus(profileId: string, paymentId: string): Promise<FinandaPaymentResponse> {
    this.ensureConfigured();
    const headers = await this.getHeaders();
    const res = await fetch(`${this.baseUrl}/getPaymentStatus`, {
      method: "POST",
      headers,
      body: JSON.stringify({ profileId, paymentId }),
    });
    return res.json();
  }
}

// ==================== SINGLETON ====================

let finandaInstance: FinandaService | null = null;

export function getFinandaService(): FinandaService {
  if (!finandaInstance) {
    finandaInstance = new FinandaService();
  }
  return finandaInstance;
}
