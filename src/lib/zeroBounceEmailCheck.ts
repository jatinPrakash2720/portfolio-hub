import "server-only"

// This is the shape of the response we expect from the ZeroBounce API
interface ZeroBounceResponse {
  address: string
  status:
    | "valid"
    | "invalid"
    | "catch-all"
    | "unknown"
    | "spamtrap"
    | "abuse"
    | "do_not_mail"
  // ... many other fields
}

/**
 * Verifies if an email address is valid and deliverable using the ZeroBounce API.
 * @param email The email address to validate.
 * @returns A boolean indicating if the email is considered valid.
 */
export async function verifyEmailDeliverability(
  email: string
): Promise<boolean> {
  const apiKey = process.env.ZEROBOUNCE_API_KEY
  if (!apiKey) {
    console.error("ZeroBounce API key is not configured.")
    // In production, we might want to fail open (return true) if the service is misconfigured.
    return true
  }

  try {
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(
        email
      )}`
    )

    if (!response.ok) {
      throw new Error("ZeroBounce API request failed.")
    }

    const data: ZeroBounceResponse = await response.json()

    // We consider 'valid' and 'catch-all' as deliverable.
    // 'catch-all' domains accept all emails, so we can't be 100% sure, but it's likely valid.
    return data.status === "valid" || data.status === "catch-all"
  } catch (error) {
    console.error("Error during email verification:", error)
    // If the verification service fails, we "fail open" to not block legitimate users.
    return true
  }
}
