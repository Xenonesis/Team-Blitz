// Allowed emails for hackathon page access
export const ALLOWED_EMAILS = [
  // Team Blitz Core Team
  'aayushtonk@02@gmail.com',
  'itisaddy7@gmail.com',
  'ashwinisj2005@gmail.com',
  'officialprachi1211@gmail.com',
  'alimuneerali245@gmail.com',
  'ashmes16@gmail.com',
  'jordan@team.com',
  'swati01mishra01@gmail.com',
  
  // Additional authorized emails
  'admin@teamblitz.com',
  
  // Add more emails here as needed
  // 'newuser@example.com',
];

// Function to check if email is allowed
export const isEmailAllowed = (email) => {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
};

// Function to add new allowed email (for admin use)
export const addAllowedEmail = (email) => {
  if (email && !ALLOWED_EMAILS.includes(email.toLowerCase())) {
    ALLOWED_EMAILS.push(email.toLowerCase());
    return true;
  }
  return false;
};