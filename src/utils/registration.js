/**
 * ==============================================================================
 * UNIVERSITY IT CLUB — EVENT REGISTRATION HANDLER
 * ==============================================================================
 * 
 * FRONTEND-ONLY ARCHITECTURE NOTE:
 * This module isolates the event registration submission logic.
 * Currently, it simulates network transmission and generates a local
 * registration confirmation receipt without communicating with a live server.
 * 
 * HOW TO CONNECT TO A REAL BACKEND IN THE FUTURE:
 * 1. Replace the mock delay in `submitRegistration` with a real `fetch` or `axios` call.
 * 2. Example:
 *    const response = await fetch('https://api.youruniversity.edu/it-club/register', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify(formData)
 *    });
 *    return await response.json();
 * 
 * 3. You can also connect this to a Google Apps Script Webhook to write directly
 *    to a Google Sheet without building a full backend.
 */

// Placeholder for future backend endpoint URL
export const REGISTRATION_API_ENDPOINT = "https://api.youruniversity.edu/v1/it-club/events/register";

/**
 * Validates the registration form fields before submission.
 * @param {Object} formData 
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateRegistrationForm(formData) {
  const errors = {};

  if (!formData.eventId || !formData.eventId.trim()) {
    errors.eventId = "Please select an event to register for.";
  }

  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (minimum 2 characters).";
  }

  // Strict yet practical email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email.trim())) {
    errors.email = "Please enter a valid student or institutional email address.";
  }

  // Standard phone number validation (permits optional +, spaces, dashes, parentheses, 7-15 digits)
  const phoneDigits = (formData.phone || "").replace(/[^0-9]/g, "");
  if (!formData.phone || phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = "Please enter a valid phone number with area/country code (8-15 digits).";
  }

  if (!formData.university || formData.university.trim().length < 2) {
    errors.university = "Please enter your university or college name.";
  }

  if (!formData.department || formData.department.trim().length < 2) {
    errors.department = "Please specify your course, department, or faculty.";
  }

  if (!formData.yearOfStudy || !formData.yearOfStudy.trim()) {
    errors.yearOfStudy = "Please select your current year of study.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Submits the registration request.
 * Currently simulates network latency and returns a generated confirmation token.
 * 
 * @param {Object} registrationPayload
 * @returns {Promise<Object>}
 */
export async function submitRegistration(registrationPayload) {
  // Validate again defensively
  const validation = validateRegistrationForm(registrationPayload);
  if (!validation.isValid) {
    throw {
      name: "ValidationError",
      errors: validation.errors,
      message: "Form validation failed. Please check the highlighted fields."
    };
  }

  // Simulate network request latency (900ms)
  await new Promise(resolve => setTimeout(resolve, 900));

  // Generate a mock unique ticket/registration ID for demonstration
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const eventPrefix = (registrationPayload.eventId || "EVENT").substring(0, 3).toUpperCase();
  const registrationId = `ITCLUB-${eventPrefix}-${randomSuffix}`;
  const timestamp = new Date().toISOString();

  // Return formatted confirmation payload
  return {
    success: true,
    isLocalDemo: true,
    registrationId,
    timestamp,
    registeredEvent: {
      id: registrationPayload.eventId,
      title: registrationPayload.eventTitle,
      date: registrationPayload.eventDate,
      venue: registrationPayload.eventVenue
    },
    attendee: {
      fullName: registrationPayload.fullName.trim(),
      email: registrationPayload.email.trim().toLowerCase(),
      phone: registrationPayload.phone.trim(),
      university: registrationPayload.university.trim(),
      department: registrationPayload.department.trim(),
      yearOfStudy: registrationPayload.yearOfStudy
    },
    notice: "Frontend Demonstration: No external database is currently linked. In production, this data is routed to your university backend API or registration spreadsheet."
  };
}
