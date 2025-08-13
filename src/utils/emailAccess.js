import AllowedEmail from '@/models/AllowedEmail';
import { isEmailAllowed as configIsEmailAllowed } from '@/config/allowedEmails';

// Check if email is allowed using database first, fallback to config
export async function isEmailAllowed(email) {
  if (!email) return false;
  
  try {
    // Try database first
    const isAllowed = await AllowedEmail.isEmailAllowed(email);
    return isAllowed;
  } catch (error) {
    console.warn('Database check failed, falling back to config:', error);
    // Fallback to config file
    return configIsEmailAllowed(email);
  }
}

// Get all allowed emails from database, fallback to config
export async function getAllowedEmails() {
  try {
    return await AllowedEmail.getAllowedEmails();
  } catch (error) {
    console.warn('Database fetch failed, falling back to config:', error);
    const { ALLOWED_EMAILS } = await import('@/config/allowedEmails');
    return ALLOWED_EMAILS;
  }
}

// Get all blocked emails from database
export async function getBlockedEmails() {
  try {
    return await AllowedEmail.getBlockedEmails();
  } catch (error) {
    console.warn('Database fetch failed:', error);
    return [];
  }
}