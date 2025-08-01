/**
 * Represents a subject in an academic curriculum.
 */
class Subject {
	/**
	 * Creates a new Subject instance.
	 *
	 * @param {string} name - The name of the subject.
	 * @param {number} year - The academic year in which the subject is typically
	 * taken.
	 * @param {number} period - The academic period or semester (e.g., 1, 2).
	 * @param {number|string|null} note - The grade obtained in the subject, or null
	 * if not yet graded.
	 * @param {string|null} date - The date when the subject was passed or taken, or
	 * null if not applicable.
	 * @param {number} credits - The number of academic credits the subject is worth.
	 * @param {number} hours - The time allocation or duration of the subject
	 * (e.g., 2, 4, 8)
	 * @param {Array<string>} correlatives - An array of subject names that are
	 * prerequisites (correlatives).
	 */
	constructor(name, year, period, note, date, credits, hours, correlatives) {
		this.name = name;
		this.year = year;
		this.period = period;
		this.note = note;
		this.date = date;
		this.credits = credits;
		this.hours = hours;
		this.correlatives = correlatives;
	}

	/**
	 * Gets the name of the subject.
	 *
	 * @returns {string} The name of the subject.
	 */
	getName() {
		return this.name;
	}

	/**
	 * Gets the academic year of the subject.
	 *
	 * @returns {number} The year of the subject.
	 */
	getYear() {
		return this.year;
	}

	/**
	 * Gets the academic period (e.g., semester) of the subject.
	 *
	 * @returns {number} The period of the subject.
	 */
	getPeriod() {
		return this.period;
	}

	/**
	 * Gets the grade obtained in the subject.
	 *
	 * @returns {number|string|null} The grade or note.
	 */
	getNote() {
		return this.note;
	}

	/**
	 * Gets the date when the subject was taken or passed.
	 *
	 * @returns {string|null} The date, or null if not available.
	 */
	getDate() {
		return this.date;
	}

	/**
	 * Gets the number of credits the subject is worth.
	 *
	 * @returns {number} The credit value.
	 */
	getCredits() {
		return this.credits;
	}

	/**
	 * Gets the time allocation or duration of the subject.
	 *
	 * @returns {number} The time duration (e.g., 2, 4, 8).
	 */
	getHours() {
		return this.hours;
	}

	/**
	 * Gets the list of prerequisite subjects (correlatives).
	 *
	 * @returns {Array<string>} An array of correlatives.
	 */
	getCorrelatives() {
		return this.correlatives;
	}
}
