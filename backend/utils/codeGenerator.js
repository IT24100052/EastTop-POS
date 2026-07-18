const mongoose = require('mongoose');

/**
 * Generates the next sequential code for a Mongoose model.
 * Finds the highest code with the specified prefix, increments its numeric part, and formats it.
 * This is robust against document deletions and race conditions (when combined with MongoDB unique constraints).
 *
 * @param {string|mongoose.Model} model - The Mongoose model name or model instance.
 * @param {string} prefix - The code prefix (e.g., 'ITEM', '1001').
 * @param {number} padding - Number of digits padding (default 7).
 * @returns {Promise<string>} The generated code.
 */
async function generateNextCode(model, prefix, padding = 7) {
  const TargetModel = typeof model === 'string' ? mongoose.model(model) : model;
  
  // Find the latest document with a code starting with the given prefix
  const latest = await TargetModel.findOne({ code: new RegExp('^' + prefix) })
    .sort({ code: -1 })
    .exec();

  let nextNum = 1;
  if (latest && latest.code) {
    const numPart = latest.code.slice(prefix.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed)) {
      nextNum = parsed + 1;
    }
  }
  let candidateCode = prefix + String(nextNum).padStart(padding, '0');
  
  // Fallback: If string sorting failed due to mixed paddings in the past,
  // or if the code exists, loop until we find a free code.
  while (await TargetModel.exists({ code: candidateCode })) {
    nextNum++;
    candidateCode = prefix + String(nextNum).padStart(padding, '0');
  }

  return candidateCode;
}

module.exports = {
  generateNextCode
};
