// Super Admin emails - only these can access admin panel
export const SUPER_ADMIN_EMAILS = [
  'itisaddy7@gmail.com',
  'aayushtonk@02@gmail.com'
];

// Allowed emails for hackathon page access
export const ALLOWED_EMAILS = [
  // Team Blitz Core Team
  'aayushtonk@02@gmail.com',
  'itisaddy7@gmail.com',
  'ashwinisj2005@gmail.com',
  'officialprachi1211@gmail.com',
  'alimuneerali245@gmail.com',
  'ashmes16@gmail.com',
  'swati01mishra01@gmail.com',
  
  // Additional authorized emails
  'admin@teamblitz.com',
  
  // Add more emails here as needed
  // 'newuser@example.com',
];

// Temporarily blocked emails
export const BLOCKED_EMAILS = [
  // Temporarily blocked users will be added here
  // 'blocked@example.com',
];

// Function to check if user is super admin
export const isSuperAdmin = (email) => {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
};

// Function to check if email is allowed and not blocked
export const isEmailAllowed = (email) => {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  
  // Check if blocked first
  if (BLOCKED_EMAILS.includes(normalizedEmail)) {
    return false;
  }
  
  return ALLOWED_EMAILS.includes(normalizedEmail);
};

// Function to add new allowed email (super admin only)
export const addAllowedEmail = (email) => {
  if (email && !ALLOWED_EMAILS.includes(email.toLowerCase())) {
    ALLOWED_EMAILS.push(email.toLowerCase());
    return true;
  }
  return false;
};

// Function to remove allowed email (super admin only)
export const removeAllowedEmail = (email) => {
  const normalizedEmail = email.toLowerCase();
  const index = ALLOWED_EMAILS.indexOf(normalizedEmail);
  if (index > -1) {
    ALLOWED_EMAILS.splice(index, 1);
    return true;
  }
  return false;
};

// Function to temporarily block an email (super admin only)
export const blockEmail = (email) => {
  const normalizedEmail = email.toLowerCase();
  if (!BLOCKED_EMAILS.includes(normalizedEmail)) {
    BLOCKED_EMAILS.push(normalizedEmail);
    return true;
  }
  return false;
};

// Function to unblock an email (super admin only)
export const unblockEmail = (email) => {
  const normalizedEmail = email.toLowerCase();
  const index = BLOCKED_EMAILS.indexOf(normalizedEmail);
  if (index > -1) {
    BLOCKED_EMAILS.splice(index, 1);
    return true;
  }
  return false;
};