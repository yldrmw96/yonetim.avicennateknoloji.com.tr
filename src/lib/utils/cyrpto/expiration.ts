import { JWTPayload, decodeJwt } from 'jose';

/**
 * JWT Token'ın süresinin dolup dolmadığını ve kalan süreyi verir.
 * 
 * @param token JWT string
 * @returns 
 *  - isExpired: Token süresi dolmuş mu?
 *  - timeLeft: Token'ın süresi dolmasına (veya dolduysa üzerinden geçen süre) - milisaniye cinsinden
 *  - readable: İnsan okunabilir formatta süre bilgisi (örn: "3 saat 5 dakika kaldı")
 */
export function getTokenExpirationStatus(token: string): {
  isExpired: boolean;
  timeLeft: number;
  readable: string;
} {
  try {
    const payload: JWTPayload = decodeJwt(token);

    if (!payload.exp) {
      throw new Error("Token'da 'exp' alanı yok.");
    }

    const now = Date.now();
    const expiresAt = payload.exp * 1000;
    const timeLeft = expiresAt - now;
    const isExpired = timeLeft <= 0;

    return {
      isExpired,
      timeLeft,
      readable: formatDuration(Math.abs(timeLeft)),
    };
  } catch (err) {
    console.error("Token çözümleme hatası:", err);
    return {
      isExpired: true,
      timeLeft: 0,
      readable: "Geçersiz token",
    };
  }
}

/**
 * Milisaniye cinsinden verilen süreyi okunabilir hale getirir.
 * 
 * @param ms Milisaniye
 * @returns Örn: "5 saat 12 dakika 3 saniye"
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const parts = [];
  if (hours > 0) parts.push(`${hours} saat`);
  if (minutes > 0) parts.push(`${minutes} dakika`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} saniye`);

  return parts.join(' ');
}
