// JWT Utility Service Simulates real-world JSON Web Token (JWT) creation, Base64URL decoding, and expiration validation on the client.

const base64UrlEncode = (input) => {
  const newStr = typeof input === "string" ? input : JSON.stringify(input);
  return btoa(unescape(encodeURIComponent(newStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const base64UrlDecode = (input) => {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const jsonStr = decodeURIComponent(escape(atob(base64)));
  return JSON.parse(jsonStr);
};

export const createMockJWT = (payload, expiresInSeconds = 900) => {
  const newExpirySecond = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const jwtPayload = {
    ...payload,
    iat: newExpirySecond,
    exp: newExpirySecond + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(jwtPayload);

  const jwtMockSignature = base64UrlEncode(
    `sig_${payload.id || "guest"}_${jwtPayload.exp}_${Math.random().toString(36).slice(2, 8)}`,
  );

  const jwtMockToken = `${encodedHeader}.${encodedPayload}.${jwtMockSignature}`;
  return jwtMockToken;
};

export const decodeMockJWT = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? nowInSeconds >= payload.exp : false;
    const remainingSeconds = payload.exp ? Math.max(0, payload.exp - nowInSeconds) : 0;

    return {
      header,
      payload,
      isExpired,
      remainingSeconds,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const isTokenValid = (token) => {
  const decoded = decodeMockJWT(token);
  return decoded !== null && !decoded.isExpired;
};
