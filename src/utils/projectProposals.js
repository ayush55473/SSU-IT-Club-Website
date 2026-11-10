import { submitProjectProposal } from '../services/contentService';

export function validateProposalForm(formData) {
  const errors = {};

  if (!formData.role || !['student', 'faculty'].includes(formData.role)) {
    errors.role = "Please select whether you are submitting as a Student or Faculty member.";
  }

  if (!formData.proposerName || formData.proposerName.trim().length < 2) {
    errors.proposerName = "Please enter your full name (minimum 2 characters).";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email.trim())) {
    errors.email = "Please provide a valid institutional or personal email address.";
  }

  const phoneDigits = (formData.phone || "").replace(/[^0-9]/g, "");
  if (!formData.phone || phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = "Please enter a valid phone or WhatsApp number (8–15 digits).";
  }

  if (!formData.branch || !formData.branch.trim()) {
    errors.branch = "Please select your branch or department.";
  }

  if (!formData.program || !formData.program.trim()) {
    errors.program = "Please select your academic program or academic designation.";
  }

  if (!formData.domain || !formData.domain.trim()) {
    errors.domain = "Please select a primary technological domain for this project.";
  }

  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = "Please provide a descriptive project title (minimum 5 characters).";
  }

  if (!formData.problemStatement || formData.problemStatement.trim().length < 15) {
    errors.problemStatement = "Please summarize the core problem statement (minimum 15 characters).";
  }

  if (!formData.explanation || formData.explanation.trim().length < 25) {
    errors.explanation = "Please provide an in-depth explanation of the background & current challenges (minimum 25 characters).";
  }

  if (!formData.objectives || !Array.isArray(formData.objectives) || formData.objectives.length === 0) {
    errors.objectives = "Please add at least one specific key objective / problem point this project will solve.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Submits the project proposal directly to the database.
 */
export async function submitProposal(proposalPayload) {
  const validation = validateProposalForm(proposalPayload);
  if (!validation.isValid) {
    throw {
      name: "ValidationError",
      errors: validation.errors,
      message: "Please fill in all required fields accurately."
    };
  }

  // Save to private database via contentService
  const res = await submitProjectProposal(proposalPayload);
  const ticketCode = res.ticketCode || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;

  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return {
    success: true,
    proposalId: ticketCode,
    timestamp,
    proposer: {
      role: proposalPayload.role,
      name: proposalPayload.proposerName.trim(),
      email: proposalPayload.email.trim().toLowerCase(),
      phone: proposalPayload.phone.trim(),
      branch: proposalPayload.branch.trim(),
      program: proposalPayload.program.trim(),
      academicId: proposalPayload.academicId ? proposalPayload.academicId.trim() : null
    },
    project: {
      title: proposalPayload.title.trim(),
      domain: proposalPayload.domain.trim(),
      timeline: proposalPayload.timeline || "Current Academic Year",
      problemStatement: proposalPayload.problemStatement.trim(),
      explanation: proposalPayload.explanation.trim(),
      objectives: [...proposalPayload.objectives],
      additionalNotes: proposalPayload.additionalNotes ? proposalPayload.additionalNotes.trim() : ""
    },
    status: "Under Technical Review by IT Cell",
    reviewSLA: "Within 48–72 hours"
  };
}
