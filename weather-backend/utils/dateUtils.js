// utils/dateUtils.js

/**
 * Build ISO time string from date and hour
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} hour - 
 * @returns {string} 
 */
function buildISOTime(date, hour) {
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day, hour));
  return dateObj.toISOString();
}

/**
 * Validate date format YYYY-MM-DD
 * @param {string} dateStr
 * @returns {boolean}
 */
function isValidDate(dateStr) {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

module.exports = {
  buildISOTime,
  isValidDate
};
