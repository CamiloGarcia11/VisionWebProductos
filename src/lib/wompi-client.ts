import crypto from "crypto";

export const WOMPI_ENV = process.env.WOMPI_ENV || "SANDBOX";

export const WOMPI_CONFIG = {
  env: WOMPI_ENV,
  baseUrl: WOMPI_ENV === "PRODUCTION"
    ? "https://production.wompi.co/v1/"
    : "https://sandbox.wompi.co/v1/",
  publicKey: WOMPI_ENV === "PRODUCTION"
    ? process.env.WOMPI_PROD_PUB_KEY || "pub_prod_Hp5PfIjR7WTmxv88xfRRTLkpZttd4QgC"
    : process.env.WOMPI_SANDBOX_PUB_KEY || "pub_test_Q5y15KS2WDVW0vTrgFNy2iktWU8yOSMu",
  privateKey: WOMPI_ENV === "PRODUCTION"
    ? process.env.VISIONWEB_WOMPI_PRV_KEY || "prv_prod_jzigwNB4VWBqqFSPhqI5bABLJ8uyyyu1"
    : process.env.WOMPI_SANDBOX_PRV_KEY || "prv_test_Q5y15KS2WDVW0vTrgFNy2iktWU8yOSMu",
  integritySecret: WOMPI_ENV === "PRODUCTION"
    ? process.env.VISIONWEB_WOMPI_INTEGRITY_SECRET || "prod_integrity_SmyxChthfkLmzeSNC1W5adsGlObRm4v/"
    : "test_integrity_Q5y15KS2WDVW0vTrgFNy2iktWU8yOSMu",
};

/**
 * Retorna la URL base oficial de Checkout de Wompi.
 * Wompi utiliza exclusivamente https://checkout.wompi.co/p/ tanto para llaves pub_test_ como pub_prod_.
 */
export function getWompiCheckoutHost(publicKey: string): string {
  return "https://checkout.wompi.co/p/";
}

/**
 * Cliente HTTP unificado para peticiones a la API de Wompi.
 */
export async function wompiFetch(endpoint: string, options: RequestInit = {}) {
  const cleanBaseUrl = WOMPI_CONFIG.baseUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${cleanBaseUrl}/${cleanEndpoint}`;

  const headers = {
    "Authorization": `Bearer ${WOMPI_CONFIG.privateKey}`,
    "Content-Type": "application/json",
    "User-Agent": "TiendaExpressApp/1.0",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Calcula la firma de integridad SHA-256 (referencia + montoEnCentavos + moneda + secreto)
 */
export function calculateWompiIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string = "COP",
  integritySecret: string = WOMPI_CONFIG.integritySecret
): string {
  const cadena = `${reference}${amountInCents}${currency}${integritySecret}`;
  return crypto.createHash("sha256").update(cadena).digest("hex");
}
