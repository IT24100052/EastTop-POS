// ─────────────────────────────────────────────────────────
//  EastTop POS — Backend Validators
//  Used by Mongoose schemas for server-side validation.
// ─────────────────────────────────────────────────────────

/* Name — English letters, spaces, apostrophes, hyphens. 3–100 chars. */
const nameValidator = {
  validator: function (v) {
    if (!v) return true; // let `required` handle blank
    const t = v.trim();
    return t.length >= 3 && t.length <= 100 && /^[A-Za-z][A-Za-z '\-]{1,99}$/.test(t);
  },
  message: props =>
    `"${props.value}" is not a valid name. Use English letters, spaces, apostrophes or hyphens (3–100 characters).`
};

/* Mobile — exactly 10 digits, must start with 07 (Sri Lanka). */
const phoneValidator = {
  validator: function (v) {
    if (!v) return true;
    const normalized = v.replace(/[\s\-\(\)]/g, '');
    return /^07\d{8}$/.test(normalized);
  },
  message: props =>
    `"${props.value}" is not a valid Sri Lankan mobile number. It must be exactly 10 digits starting with 07 (e.g. 0771234567).`
};

/* NIC — old format: 9 digits + V/v/X/x; new format: 12 digits. */
const nicValidator = {
  validator: function (v) {
    if (!v) return true;
    const trimmed = v.trim();
    return /^(\d{9}[vVxX]|\d{12})$/.test(trimmed);
  },
  message: props =>
    `"${props.value}" is not a valid Sri Lankan NIC. Use 9 digits + V/X (old) or 12 digits (new).`
};

/* Email — RFC-like, no spaces, max 254 chars. */
const emailValidator = {
  validator: function (v) {
    if (!v) return true;
    if (v.length > 254 || /\s/.test(v)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  },
  message: props =>
    `"${props.value}" is not a valid email address.`
};

/* Price / Amount — positive number, max 2 decimal places. */
const priceValidator = {
  validator: function (v) {
    if (v === undefined || v === null) return true;
    const n = parseFloat(v);
    if (isNaN(n) || n < 0) return false;
    return /^\d+(\.\d{1,2})?$/.test(String(v));
  },
  message: props =>
    `"${props.value}" is not a valid price. Use a positive number with up to 2 decimal places.`
};

/* Product Name — max 150 chars, no HTML/JS. */
const productNameValidator = {
  validator: function (v) {
    if (!v) return true;
    if (v.length > 150) return false;
    return !/<[^>]+>/.test(v) && !/script/i.test(v);
  },
  message: props =>
    `"${props.value}" is not a valid product name. Max 150 characters, no HTML or script content.`
};

/* Description — max 1000 chars, no script injection. */
const descriptionValidator = {
  validator: function (v) {
    if (!v) return true;
    if (v.length > 1000) return false;
    return !/<script/i.test(v) && !/javascript:/i.test(v);
  },
  message: props =>
    `Description exceeds 1000 characters or contains disallowed content.`
};

// ── Reusable Mongoose schema type objects ─────────────────

const nameSchemaType = {
  type: String,
  trim: true,
  maxlength: 100,
  validate: nameValidator
};

const nicSchemaType = {
  type: String,
  trim: true,
  uppercase: true,
  validate: nicValidator
};

const phoneSchemaType = {
  type: String,
  set: v => v ? v.replace(/[\s\-\(\)]/g, '') : v,
  validate: phoneValidator
};

const emailSchemaType = {
  type: String,
  trim: true,
  lowercase: true,
  maxlength: 254,
  validate: emailValidator
};

module.exports = {
  // validators (plain objects — usable standalone)
  nameValidator,
  phoneValidator,
  nicValidator,
  emailValidator,
  priceValidator,
  productNameValidator,
  descriptionValidator,
  // schema types (spread into mongoose schema field defs)
  nameSchemaType,
  nicSchemaType,
  phoneSchemaType,
  emailSchemaType
};
