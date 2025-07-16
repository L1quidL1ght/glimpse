// Input validation and sanitization utilities

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove any potentially dangerous characters and trim whitespace
  return input
    .replace(/[<>"'&]/g, '') // Remove basic XSS characters
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim()
    .substring(0, 1000); // Limit length to prevent DoS
};

export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }
  
  return email
    .toLowerCase()
    .trim()
    .substring(0, 320); // RFC 5321 email length limit
};

export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    return '';
  }
  
  // Keep only digits, spaces, dashes, parentheses, and plus sign
  return phone
    .replace(/[^0-9\s\-\(\)\+]/g, '')
    .trim()
    .substring(0, 20);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 320;
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[+]?[1-9][\d\s\-\(\)]{7,18}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateMemberId = (memberId: string): boolean => {
  if (!memberId) return true; // Member ID is optional
  return /^[A-Za-z0-9\-_]{3,20}$/.test(memberId);
};

export const validatePreference = (preference: string): boolean => {
  return preference.trim().length >= 1 && preference.trim().length <= 200;
};

export const validateNote = (note: string): boolean => {
  return note.length <= 2000;
};

export const validateTag = (tag: string): boolean => {
  return /^[A-Za-z0-9\s\-_]{1,50}$/.test(tag);
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitMap.get(key);
  
  if (!current || (now - current.lastReset) > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

// Sanitize and validate form data
export interface SanitizedGuestData {
  name: string;
  email: string;
  phone: string;
  memberId: string;
}

export const sanitizeGuestData = (data: any): SanitizedGuestData => {
  return {
    name: sanitizeInput(data.name || ''),
    email: sanitizeEmail(data.email || ''),
    phone: sanitizePhone(data.phone || ''),
    memberId: sanitizeInput(data.memberId || '')
  };
};

export const validateGuestData = (data: SanitizedGuestData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validateName(data.name)) {
    errors.push('Name must be between 2 and 100 characters');
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (data.memberId && !validateMemberId(data.memberId)) {
    errors.push('Member ID must be 3-20 characters (letters, numbers, hyphens, underscores only)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
