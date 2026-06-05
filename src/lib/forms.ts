// Form delivery service — Web3Forms.
//
// Get a key (free, unlimited) at https://web3forms.com. The key is public
// by design; it only routes submissions to the inbox associated with it,
// so there's no secret to leak.
//
// To switch services later (Formspree, Mailgun, Cloudflare Worker, etc.),
// only this file changes.

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// Web3Forms access key for the contact form. The same key is reused for
// the newsletter form unless you set NEWSLETTER_KEY below.
export const WEB3FORMS_KEY = 'e8c3845e-89f9-4de1-9e13-42a3fba70e36';

// Optional: set this if you want newsletter submissions to land in a
// different inbox / account from contact submissions. Leave as null to
// reuse WEB3FORMS_KEY for both.
export const WEB3FORMS_NEWSLETTER_KEY: string | null = null;

// -----------------------------------------------------------------------
// Feature flags — flip to true when ready to accept submissions.
// While false, the form is not rendered at all; the page shows a simple
// "email us directly" fallback (contact) or hides the section entirely
// (newsletter).
// -----------------------------------------------------------------------
export const CONTACT_FORM_ENABLED = false;
export const NEWSLETTER_FORM_ENABLED = false;
