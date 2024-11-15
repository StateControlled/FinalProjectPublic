/**
 * @returns The number of days in the current month.
 */
const daysThisMonth = () => {
    var today = new Date();
    var month = today.getMonth();
    return daysInMonth(month + 1, today.getFullYear());
};

/**
 * Calculates the number of days in a given month for a given year.
 * @param {*} month the month for which to calcuate the number of days
 * @param {*} year the year that should be used for the calculation
 * @returns The number of days in the given month.
 */
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}