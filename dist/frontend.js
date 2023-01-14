jQuery(function ($) {
	/*!
	 * Pikaday
	 *
	 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/Pikaday/Pikaday
	 */

	(function (root, factory) {
		"use strict";

		var moment;
		if (typeof exports === "object") {
			// CommonJS module
			// Load moment.js as an optional dependency
			try {
				moment = require("moment");
			} catch (e) {}
			module.exports = factory(moment);
		} else if (typeof define === "function" && define.amd) {
			// AMD. Register as an anonymous module.
			define(function (req) {
				// Load moment.js as an optional dependency
				var id = "moment";
				try {
					moment = req(id);
				} catch (e) {}
				return factory(moment);
			});
		} else {
			root.Pikaday = factory(root.moment);
		}
	})(this, function (moment) {
		"use strict";

		/**
		 * feature detection and helper functions
		 */
		var hasMoment = typeof moment === "function",
			hasEventListeners = !!window.addEventListener,
			document = window.document,
			sto = window.setTimeout,
			addEvent = function (el, e, callback, capture) {
				if (hasEventListeners) {
					el.addEventListener(e, callback, !!capture);
				} else {
					el.attachEvent("on" + e, callback);
				}
			},
			removeEvent = function (el, e, callback, capture) {
				if (hasEventListeners) {
					el.removeEventListener(e, callback, !!capture);
				} else {
					el.detachEvent("on" + e, callback);
				}
			},
			trim = function (str) {
				return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
			},
			hasClass = function (el, cn) {
				return (" " + el.className + " ").indexOf(" " + cn + " ") !== -1;
			},
			addClass = function (el, cn) {
				if (!hasClass(el, cn)) {
					el.className = el.className === "" ? cn : el.className + " " + cn;
				}
			},
			removeClass = function (el, cn) {
				el.className = trim(
					(" " + el.className + " ").replace(" " + cn + " ", " ")
				);
			},
			isArray = function (obj) {
				return /Array/.test(Object.prototype.toString.call(obj));
			},
			isDate = function (obj) {
				return (
					/Date/.test(Object.prototype.toString.call(obj)) &&
					!isNaN(obj.getTime())
				);
			},
			isWeekend = function (date) {
				var day = date.getDay();
				return day === 0 || day === 6;
			},
			isLeapYear = function (year) {
				// solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
				return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
			},
			getDaysInMonth = function (year, month) {
				return [
					31,
					isLeapYear(year) ? 29 : 28,
					31,
					30,
					31,
					30,
					31,
					31,
					30,
					31,
					30,
					31,
				][month];
			},
			setToStartOfDay = function (date) {
				if (isDate(date)) date.setHours(0, 0, 0, 0);
			},
			compareDates = function (a, b) {
				// weak date comparison (use setToStartOfDay(date) to ensure correct result)
				return a.getTime() === b.getTime();
			},
			extend = function (to, from, overwrite) {
				var prop, hasProp;
				for (prop in from) {
					hasProp = to[prop] !== undefined;
					if (
						hasProp &&
						typeof from[prop] === "object" &&
						from[prop] !== null &&
						from[prop].nodeName === undefined
					) {
						if (isDate(from[prop])) {
							if (overwrite) {
								to[prop] = new Date(from[prop].getTime());
							}
						} else if (isArray(from[prop])) {
							if (overwrite) {
								to[prop] = from[prop].slice(0);
							}
						} else {
							to[prop] = extend({}, from[prop], overwrite);
						}
					} else if (overwrite || !hasProp) {
						to[prop] = from[prop];
					}
				}
				return to;
			},
			fireEvent = function (el, eventName, data) {
				var ev;

				if (document.createEvent) {
					ev = document.createEvent("HTMLEvents");
					ev.initEvent(eventName, true, false);
					ev = extend(ev, data);
					el.dispatchEvent(ev);
				} else if (document.createEventObject) {
					ev = document.createEventObject();
					ev = extend(ev, data);
					el.fireEvent("on" + eventName, ev);
				}
			},
			adjustCalendar = function (calendar) {
				if (calendar.month < 0) {
					calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
					calendar.month += 12;
				}
				if (calendar.month > 11) {
					calendar.year += Math.floor(Math.abs(calendar.month) / 12);
					calendar.month -= 12;
				}
				return calendar;
			},
			/**
			 * defaults and localisation
			 */
			defaults = {
				// bind the picker to a form field
				field: null,

				// automatically show/hide the picker on `field` focus (default `true` if `field` is set)
				bound: undefined,

				// data-attribute on the input field with an aria assistance tekst (only applied when `bound` is set)
				ariaLabel: "Use the arrow keys to pick a date",

				// position of the datepicker, relative to the field (default to bottom & left)
				// ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
				position: "bottom left",

				// automatically fit in the viewport even if it means repositioning from the position option
				reposition: true,

				// the default output format for `.toString()` and `field` value
				format: "YYYY-MM-DD",

				// the toString function which gets passed a current date object and format
				// and returns a string
				toString: null,

				// used to create date object from current input string
				parse: null,

				// the initial date to view when first opened
				defaultDate: null,

				// make the `defaultDate` the initial selected value
				setDefaultDate: false,

				// first day of week (0: Sunday, 1: Monday etc)
				firstDay: 0,

				// the default flag for moment's strict date parsing
				formatStrict: false,

				// the minimum/earliest date that can be selected
				minDate: null,
				// the maximum/latest date that can be selected
				maxDate: null,

				// number of years either side, or array of upper/lower range
				yearRange: 10,

				// show week numbers at head of row
				showWeekNumber: false,

				// Week picker mode
				pickWholeWeek: false,

				// used internally (don't config outside)
				minYear: 0,
				maxYear: 9999,
				minMonth: undefined,
				maxMonth: undefined,

				startRange: null,
				endRange: null,

				isRTL: false,

				// Additional text to append to the year in the calendar title
				yearSuffix: "",

				// Render the month after year in the calendar title
				showMonthAfterYear: false,

				// Render days of the calendar grid that fall in the next or previous month
				showDaysInNextAndPreviousMonths: false,

				// Allows user to select days that fall in the next or previous month
				enableSelectionDaysInNextAndPreviousMonths: false,

				// how many months are visible
				numberOfMonths: 1,

				// when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
				// only used for the first display or when a selected date is not visible
				mainCalendar: "left",

				// Specify a DOM element to render the calendar in
				container: undefined,

				// Blur field when date is selected
				blurFieldOnSelect: true,

				// internationalization
				i18n: {
					previousMonth: "Previous Month",
					nextMonth: "Next Month",
					months: [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					],
					weekdays: [
						"Sunday",
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday",
					],
					weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				},

				// Theme Classname
				theme: null,

				// events array
				events: [],

				// callback function
				onSelect: null,
				onOpen: null,
				onClose: null,
				onDraw: null,

				// Enable keyboard input
				keyboardInput: true,
			},
			/**
			 * templating functions to abstract HTML rendering
			 */
			renderDayName = function (opts, day, abbr) {
				day += opts.firstDay;
				while (day >= 7) {
					day -= 7;
				}
				return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
			},
			renderDay = function (opts) {
				var arr = [];
				var ariaSelected = "false";
				if (opts.isEmpty) {
					if (opts.showDaysInNextAndPreviousMonths) {
						arr.push("is-outside-current-month");

						if (!opts.enableSelectionDaysInNextAndPreviousMonths) {
							arr.push("is-selection-disabled");
						}
					} else {
						return '<td class="is-empty"></td>';
					}
				}
				if (opts.isDisabled) {
					arr.push("is-disabled");
				}
				if (opts.isToday) {
					arr.push("is-today");
				}
				if (opts.isSelected) {
					arr.push("is-selected");
					ariaSelected = "true";
				}
				if (opts.hasEvent) {
					arr.push("has-event");
				}
				if (opts.isInRange) {
					arr.push("is-inrange");
				}
				if (opts.isStartRange) {
					arr.push("is-startrange");
				}
				if (opts.isEndRange) {
					arr.push("is-endrange");
				}
				return (
					'<td data-day="' +
					opts.day +
					'" class="' +
					arr.join(" ") +
					'" aria-selected="' +
					ariaSelected +
					'">' +
					'<button class="pika-button pika-day" type="button" ' +
					'data-pika-year="' +
					opts.year +
					'" data-pika-month="' +
					opts.month +
					'" data-pika-day="' +
					opts.day +
					'">' +
					opts.day +
					"</button>" +
					"</td>"
				);
			},
			renderWeek = function (d, m, y) {
				// Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
				var onejan = new Date(y, 0, 1),
					weekNum = Math.ceil(
						((new Date(y, m, d) - onejan) / 86400000 + onejan.getDay() + 1) / 7
					);
				return '<td class="pika-week">' + weekNum + "</td>";
			},
			renderRow = function (days, isRTL, pickWholeWeek, isRowSelected) {
				return (
					'<tr class="pika-row' +
					(pickWholeWeek ? " pick-whole-week" : "") +
					(isRowSelected ? " is-selected" : "") +
					'">' +
					(isRTL ? days.reverse() : days).join("") +
					"</tr>"
				);
			},
			renderBody = function (rows) {
				return "<tbody>" + rows.join("") + "</tbody>";
			},
			renderHead = function (opts) {
				var i,
					arr = [];
				if (opts.showWeekNumber) {
					arr.push("<th></th>");
				}
				for (i = 0; i < 7; i++) {
					arr.push(
						'<th scope="col"><abbr title="' +
							renderDayName(opts, i) +
							'">' +
							renderDayName(opts, i, true) +
							"</abbr></th>"
					);
				}
				return (
					"<thead><tr>" +
					(opts.isRTL ? arr.reverse() : arr).join("") +
					"</tr></thead>"
				);
			},
			renderTitle = function (instance, c, year, month, refYear, randId) {
				var i,
					j,
					arr,
					opts = instance._o,
					isMinYear = year === opts.minYear,
					isMaxYear = year === opts.maxYear,
					html =
						'<div id="' +
						randId +
						'" class="pika-title" role="heading" aria-live="assertive">',
					monthHtml,
					yearHtml,
					prev = true,
					next = true;

				for (arr = [], i = 0; i < 12; i++) {
					arr.push(
						'<option value="' +
							(year === refYear ? i - c : 12 + i - c) +
							'"' +
							(i === month ? ' selected="selected"' : "") +
							((isMinYear && i < opts.minMonth) ||
							(isMaxYear && i > opts.maxMonth)
								? 'disabled="disabled"'
								: "") +
							">" +
							opts.i18n.months[i] +
							"</option>"
					);
				}

				monthHtml =
					'<div class="pika-label">' +
					opts.i18n.months[month] +
					'<select class="pika-select pika-select-month" tabindex="-1">' +
					arr.join("") +
					"</select></div>";

				if (isArray(opts.yearRange)) {
					i = opts.yearRange[0];
					j = opts.yearRange[1] + 1;
				} else {
					i = year - opts.yearRange;
					j = 1 + year + opts.yearRange;
				}

				for (arr = []; i < j && i <= opts.maxYear; i++) {
					if (i >= opts.minYear) {
						arr.push(
							'<option value="' +
								i +
								'"' +
								(i === year ? ' selected="selected"' : "") +
								">" +
								i +
								"</option>"
						);
					}
				}
				yearHtml =
					'<div class="pika-label">' +
					year +
					opts.yearSuffix +
					'<select class="pika-select pika-select-year" tabindex="-1">' +
					arr.join("") +
					"</select></div>";

				if (opts.showMonthAfterYear) {
					html += yearHtml + monthHtml;
				} else {
					html += monthHtml + yearHtml;
				}

				if (isMinYear && (month === 0 || opts.minMonth >= month)) {
					prev = false;
				}

				if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
					next = false;
				}

				if (c === 0) {
					html +=
						'<button class="pika-prev' +
						(prev ? "" : " is-disabled") +
						'" type="button">' +
						opts.i18n.previousMonth +
						"</button>";
				}
				if (c === instance._o.numberOfMonths - 1) {
					html +=
						'<button class="pika-next' +
						(next ? "" : " is-disabled") +
						'" type="button">' +
						opts.i18n.nextMonth +
						"</button>";
				}

				return (html += "</div>");
			},
			renderTable = function (opts, data, randId) {
				return (
					'<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' +
					randId +
					'">' +
					renderHead(opts) +
					renderBody(data) +
					"</table>"
				);
			},
			/**
			 * Pikaday constructor
			 */
			Pikaday = function (options) {
				var self = this,
					opts = self.config(options);

				self._onMouseDown = function (e) {
					if (!self._v) {
						return;
					}
					e = e || window.event;
					var target = e.target || e.srcElement;
					if (!target) {
						return;
					}

					if (!hasClass(target, "is-disabled")) {
						if (
							hasClass(target, "pika-button") &&
							!hasClass(target, "is-empty") &&
							!hasClass(target.parentNode, "is-disabled")
						) {
							self.setDate(
								new Date(
									target.getAttribute("data-pika-year"),
									target.getAttribute("data-pika-month"),
									target.getAttribute("data-pika-day")
								)
							);
							if (opts.bound) {
								sto(function () {
									self.hide();
									if (opts.blurFieldOnSelect && opts.field) {
										opts.field.blur();
									}
								}, 100);
							}
						} else if (hasClass(target, "pika-prev")) {
							self.prevMonth();
						} else if (hasClass(target, "pika-next")) {
							self.nextMonth();
						}
					}
					if (!hasClass(target, "pika-select")) {
						// if this is touch event prevent mouse events emulation
						if (e.preventDefault) {
							e.preventDefault();
						} else {
							e.returnValue = false;
							return false;
						}
					} else {
						self._c = true;
					}
				};

				self._onChange = function (e) {
					e = e || window.event;
					var target = e.target || e.srcElement;
					if (!target) {
						return;
					}
					if (hasClass(target, "pika-select-month")) {
						self.gotoMonth(target.value);
					} else if (hasClass(target, "pika-select-year")) {
						self.gotoYear(target.value);
					}
				};

				self._onKeyChange = function (e) {
					e = e || window.event;

					if (self.isVisible()) {
						switch (e.keyCode) {
							case 13:
							case 27:
								if (opts.field) {
									opts.field.blur();
								}
								break;
							case 37:
								e.preventDefault();
								self.adjustDate("subtract", 1);
								break;
							case 38:
								self.adjustDate("subtract", 7);
								break;
							case 39:
								self.adjustDate("add", 1);
								break;
							case 40:
								self.adjustDate("add", 7);
								break;
						}
					}
				};

				self._onInputChange = function (e) {
					var date;

					if (e.firedBy === self) {
						return;
					}
					if (opts.parse) {
						date = opts.parse(opts.field.value, opts.format);
					} else if (hasMoment) {
						date = moment(opts.field.value, opts.format, opts.formatStrict);
						date = date && date.isValid() ? date.toDate() : null;
					} else {
						date = new Date(Date.parse(opts.field.value));
					}
					if (isDate(date)) {
						self.setDate(date);
					}
					if (!self._v) {
						self.show();
					}
				};

				self._onInputFocus = function () {
					self.show();
				};

				self._onInputClick = function () {
					self.show();
				};

				self._onInputBlur = function () {
					// IE allows pika div to gain focus; catch blur the input field
					var pEl = document.activeElement;
					do {
						if (hasClass(pEl, "pika-single")) {
							return;
						}
					} while ((pEl = pEl.parentNode));

					if (!self._c) {
						self._b = sto(function () {
							self.hide();
						}, 50);
					}
					self._c = false;
				};

				self._onClick = function (e) {
					e = e || window.event;
					var target = e.target || e.srcElement,
						pEl = target;
					if (!target) {
						return;
					}
					if (!hasEventListeners && hasClass(target, "pika-select")) {
						if (!target.onchange) {
							target.setAttribute("onchange", "return;");
							addEvent(target, "change", self._onChange);
						}
					}
					do {
						if (hasClass(pEl, "pika-single") || pEl === opts.trigger) {
							return;
						}
					} while ((pEl = pEl.parentNode));
					if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
						self.hide();
					}
				};

				self.el = document.createElement("div");
				self.el.className =
					"pika-single" +
					(opts.isRTL ? " is-rtl" : "") +
					(opts.theme ? " " + opts.theme : "");

				addEvent(self.el, "mousedown", self._onMouseDown, true);
				addEvent(self.el, "touchend", self._onMouseDown, true);
				addEvent(self.el, "change", self._onChange);

				if (opts.keyboardInput) {
					addEvent(document, "keydown", self._onKeyChange);
				}

				if (opts.field) {
					if (opts.container) {
						opts.container.appendChild(self.el);
					} else if (opts.bound) {
						document.body.appendChild(self.el);
					} else {
						opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
					}
					addEvent(opts.field, "change", self._onInputChange);

					if (!opts.defaultDate) {
						if (hasMoment && opts.field.value) {
							opts.defaultDate = moment(opts.field.value, opts.format).toDate();
						} else {
							opts.defaultDate = new Date(Date.parse(opts.field.value));
						}
						opts.setDefaultDate = true;
					}
				}

				var defDate = opts.defaultDate;

				if (isDate(defDate)) {
					if (opts.setDefaultDate) {
						self.setDate(defDate, true);
					} else {
						self.gotoDate(defDate);
					}
				} else {
					self.gotoDate(new Date());
				}

				if (opts.bound) {
					this.hide();
					self.el.className += " is-bound";
					addEvent(opts.trigger, "click", self._onInputClick);
					addEvent(opts.trigger, "focus", self._onInputFocus);
					addEvent(opts.trigger, "blur", self._onInputBlur);
				} else {
					this.show();
				}
			};

		/**
		 * public Pikaday API
		 */
		Pikaday.prototype = {
			/**
			 * configure functionality
			 */
			config: function (options) {
				if (!this._o) {
					this._o = extend({}, defaults, true);
				}

				var opts = extend(this._o, options, true);

				opts.isRTL = !!opts.isRTL;

				opts.field = opts.field && opts.field.nodeName ? opts.field : null;

				opts.theme =
					typeof opts.theme === "string" && opts.theme ? opts.theme : null;

				opts.bound = !!(opts.bound !== undefined
					? opts.field && opts.bound
					: opts.field);

				opts.trigger =
					opts.trigger && opts.trigger.nodeName ? opts.trigger : opts.field;

				opts.disableWeekends = !!opts.disableWeekends;

				opts.disableDayFn =
					typeof opts.disableDayFn === "function" ? opts.disableDayFn : null;

				var nom = parseInt(opts.numberOfMonths, 10) || 1;
				opts.numberOfMonths = nom > 4 ? 4 : nom;

				if (!isDate(opts.minDate)) {
					opts.minDate = false;
				}
				if (!isDate(opts.maxDate)) {
					opts.maxDate = false;
				}
				if (opts.minDate && opts.maxDate && opts.maxDate < opts.minDate) {
					opts.maxDate = opts.minDate = false;
				}
				if (opts.minDate) {
					this.setMinDate(opts.minDate);
				}
				if (opts.maxDate) {
					this.setMaxDate(opts.maxDate);
				}

				if (isArray(opts.yearRange)) {
					var fallback = new Date().getFullYear() - 10;
					opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
					opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
				} else {
					opts.yearRange =
						Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
					if (opts.yearRange > 100) {
						opts.yearRange = 100;
					}
				}

				return opts;
			},

			/**
			 * return a formatted string of the current selection (using Moment.js if available)
			 */
			toString: function (format) {
				format = format || this._o.format;
				if (!isDate(this._d)) {
					return "";
				}
				if (this._o.toString) {
					return this._o.toString(this._d, format);
				}
				if (hasMoment) {
					return moment(this._d).format(format);
				}
				return this._d.toDateString();
			},

			/**
			 * return a Moment.js object of the current selection (if available)
			 */
			getMoment: function () {
				return hasMoment ? moment(this._d) : null;
			},

			/**
			 * set the current selection from a Moment.js object (if available)
			 */
			setMoment: function (date, preventOnSelect) {
				if (hasMoment && moment.isMoment(date)) {
					this.setDate(date.toDate(), preventOnSelect);
				}
			},

			/**
			 * return a Date object of the current selection
			 */
			getDate: function () {
				return isDate(this._d) ? new Date(this._d.getTime()) : null;
			},

			/**
			 * set the current selection
			 */
			setDate: function (date, preventOnSelect) {
				if (!date) {
					this._d = null;

					if (this._o.field) {
						this._o.field.value = "";
						fireEvent(this._o.field, "change", { firedBy: this });
					}

					return this.draw();
				}
				if (typeof date === "string") {
					date = new Date(Date.parse(date));
				}
				if (!isDate(date)) {
					return;
				}

				var min = this._o.minDate,
					max = this._o.maxDate;

				if (isDate(min) && date < min) {
					date = min;
				} else if (isDate(max) && date > max) {
					date = max;
				}

				this._d = new Date(date.getTime());
				setToStartOfDay(this._d);
				this.gotoDate(this._d);

				if (this._o.field) {
					this._o.field.value = this.toString();
					fireEvent(this._o.field, "change", { firedBy: this });
				}
				if (!preventOnSelect && typeof this._o.onSelect === "function") {
					this._o.onSelect.call(this, this.getDate());
				}
			},

			/**
			 * change view to a specific date
			 */
			gotoDate: function (date) {
				var newCalendar = true;

				if (!isDate(date)) {
					return;
				}

				if (this.calendars) {
					var firstVisibleDate = new Date(
							this.calendars[0].year,
							this.calendars[0].month,
							1
						),
						lastVisibleDate = new Date(
							this.calendars[this.calendars.length - 1].year,
							this.calendars[this.calendars.length - 1].month,
							1
						),
						visibleDate = date.getTime();
					// get the end of the month
					lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
					lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
					newCalendar =
						visibleDate < firstVisibleDate.getTime() ||
						lastVisibleDate.getTime() < visibleDate;
				}

				if (newCalendar) {
					this.calendars = [
						{
							month: date.getMonth(),
							year: date.getFullYear(),
						},
					];
					if (this._o.mainCalendar === "right") {
						this.calendars[0].month += 1 - this._o.numberOfMonths;
					}
				}

				this.adjustCalendars();
			},

			adjustDate: function (sign, days) {
				var day = this.getDate() || new Date();
				var difference = parseInt(days) * 24 * 60 * 60 * 1000;

				var newDay;

				if (sign === "add") {
					newDay = new Date(day.valueOf() + difference);
				} else if (sign === "subtract") {
					newDay = new Date(day.valueOf() - difference);
				}

				this.setDate(newDay);
			},

			adjustCalendars: function () {
				this.calendars[0] = adjustCalendar(this.calendars[0]);
				for (var c = 1; c < this._o.numberOfMonths; c++) {
					this.calendars[c] = adjustCalendar({
						month: this.calendars[0].month + c,
						year: this.calendars[0].year,
					});
				}
				this.draw();
			},

			gotoToday: function () {
				this.gotoDate(new Date());
			},

			/**
			 * change view to a specific month (zero-index, e.g. 0: January)
			 */
			gotoMonth: function (month) {
				if (!isNaN(month)) {
					this.calendars[0].month = parseInt(month, 10);
					this.adjustCalendars();
				}
			},

			nextMonth: function () {
				this.calendars[0].month++;
				this.adjustCalendars();
			},

			prevMonth: function () {
				this.calendars[0].month--;
				this.adjustCalendars();
			},

			/**
			 * change view to a specific full year (e.g. "2012")
			 */
			gotoYear: function (year) {
				if (!isNaN(year)) {
					this.calendars[0].year = parseInt(year, 10);
					this.adjustCalendars();
				}
			},

			/**
			 * change the minDate
			 */
			setMinDate: function (value) {
				if (value instanceof Date) {
					setToStartOfDay(value);
					this._o.minDate = value;
					this._o.minYear = value.getFullYear();
					this._o.minMonth = value.getMonth();
				} else {
					this._o.minDate = defaults.minDate;
					this._o.minYear = defaults.minYear;
					this._o.minMonth = defaults.minMonth;
					this._o.startRange = defaults.startRange;
				}

				this.draw();
			},

			/**
			 * change the maxDate
			 */
			setMaxDate: function (value) {
				if (value instanceof Date) {
					setToStartOfDay(value);
					this._o.maxDate = value;
					this._o.maxYear = value.getFullYear();
					this._o.maxMonth = value.getMonth();
				} else {
					this._o.maxDate = defaults.maxDate;
					this._o.maxYear = defaults.maxYear;
					this._o.maxMonth = defaults.maxMonth;
					this._o.endRange = defaults.endRange;
				}

				this.draw();
			},

			setStartRange: function (value) {
				this._o.startRange = value;
			},

			setEndRange: function (value) {
				this._o.endRange = value;
			},

			/**
			 * refresh the HTML
			 */
			draw: function (force) {
				if (!this._v && !force) {
					return;
				}
				var opts = this._o,
					minYear = opts.minYear,
					maxYear = opts.maxYear,
					minMonth = opts.minMonth,
					maxMonth = opts.maxMonth,
					html = "",
					randId;

				if (this._y <= minYear) {
					this._y = minYear;
					if (!isNaN(minMonth) && this._m < minMonth) {
						this._m = minMonth;
					}
				}
				if (this._y >= maxYear) {
					this._y = maxYear;
					if (!isNaN(maxMonth) && this._m > maxMonth) {
						this._m = maxMonth;
					}
				}

				randId =
					"pika-title-" +
					Math.random()
						.toString(36)
						.replace(/[^a-z]+/g, "")
						.substr(0, 2);

				for (var c = 0; c < opts.numberOfMonths; c++) {
					html +=
						'<div class="pika-lendar">' +
						renderTitle(
							this,
							c,
							this.calendars[c].year,
							this.calendars[c].month,
							this.calendars[0].year,
							randId
						) +
						this.render(
							this.calendars[c].year,
							this.calendars[c].month,
							randId
						) +
						"</div>";
				}

				this.el.innerHTML = html;

				if (opts.bound) {
					if (opts.field.type !== "hidden") {
						sto(function () {
							opts.trigger.focus();
						}, 1);
					}
				}

				if (typeof this._o.onDraw === "function") {
					this._o.onDraw(this);
				}

				if (opts.bound) {
					// let the screen reader user know to use arrow keys
					opts.field.setAttribute("aria-label", opts.ariaLabel);
				}
			},

			adjustPosition: function () {
				var field,
					pEl,
					width,
					height,
					viewportWidth,
					viewportHeight,
					scrollTop,
					left,
					top,
					clientRect,
					leftAligned,
					bottomAligned;

				if (this._o.container) return;

				this.el.style.position = "absolute";

				field = this._o.trigger;
				pEl = field;
				width = this.el.offsetWidth;
				height = this.el.offsetHeight;
				viewportWidth =
					window.innerWidth || document.documentElement.clientWidth;
				viewportHeight =
					window.innerHeight || document.documentElement.clientHeight;
				scrollTop =
					window.pageYOffset ||
					document.body.scrollTop ||
					document.documentElement.scrollTop;
				leftAligned = true;
				bottomAligned = true;

				if (typeof field.getBoundingClientRect === "function") {
					clientRect = field.getBoundingClientRect();
					left = clientRect.left + window.pageXOffset;
					top = clientRect.bottom + window.pageYOffset;
				} else {
					left = pEl.offsetLeft;
					top = pEl.offsetTop + pEl.offsetHeight;
					while ((pEl = pEl.offsetParent)) {
						left += pEl.offsetLeft;
						top += pEl.offsetTop;
					}
				}

				// default position is bottom & left
				if (
					(this._o.reposition && left + width > viewportWidth) ||
					(this._o.position.indexOf("right") > -1 &&
						left - width + field.offsetWidth > 0)
				) {
					left = left - width + field.offsetWidth;
					leftAligned = false;
				}
				if (
					(this._o.reposition && top + height > viewportHeight + scrollTop) ||
					(this._o.position.indexOf("top") > -1 &&
						top - height - field.offsetHeight > 0)
				) {
					top = top - height - field.offsetHeight;
					bottomAligned = false;
				}

				this.el.style.left = left + "px";
				this.el.style.top = top + "px";

				addClass(this.el, leftAligned ? "left-aligned" : "right-aligned");
				addClass(this.el, bottomAligned ? "bottom-aligned" : "top-aligned");
				removeClass(this.el, !leftAligned ? "left-aligned" : "right-aligned");
				removeClass(this.el, !bottomAligned ? "bottom-aligned" : "top-aligned");
			},

			/**
			 * render HTML for a particular month
			 */
			render: function (year, month, randId) {
				var opts = this._o,
					now = new Date(),
					days = getDaysInMonth(year, month),
					before = new Date(year, month, 1).getDay(),
					data = [],
					row = [];
				setToStartOfDay(now);
				if (opts.firstDay > 0) {
					before -= opts.firstDay;
					if (before < 0) {
						before += 7;
					}
				}
				var previousMonth = month === 0 ? 11 : month - 1,
					nextMonth = month === 11 ? 0 : month + 1,
					yearOfPreviousMonth = month === 0 ? year - 1 : year,
					yearOfNextMonth = month === 11 ? year + 1 : year,
					daysInPreviousMonth = getDaysInMonth(
						yearOfPreviousMonth,
						previousMonth
					);
				var cells = days + before,
					after = cells;
				while (after > 7) {
					after -= 7;
				}
				cells += 7 - after;
				var isWeekSelected = false;
				for (var i = 0, r = 0; i < cells; i++) {
					var day = new Date(year, month, 1 + (i - before)),
						isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
						isToday = compareDates(day, now),
						hasEvent =
							opts.events.indexOf(day.toDateString()) !== -1 ? true : false,
						isEmpty = i < before || i >= days + before,
						dayNumber = 1 + (i - before),
						monthNumber = month,
						yearNumber = year,
						isStartRange =
							opts.startRange && compareDates(opts.startRange, day),
						isEndRange = opts.endRange && compareDates(opts.endRange, day),
						isInRange =
							opts.startRange &&
							opts.endRange &&
							opts.startRange < day &&
							day < opts.endRange,
						isDisabled =
							(opts.minDate && day < opts.minDate) ||
							(opts.maxDate && day > opts.maxDate) ||
							(opts.disableWeekends && isWeekend(day)) ||
							(opts.disableDayFn && opts.disableDayFn(day));

					if (isEmpty) {
						if (i < before) {
							dayNumber = daysInPreviousMonth + dayNumber;
							monthNumber = previousMonth;
							yearNumber = yearOfPreviousMonth;
						} else {
							dayNumber = dayNumber - days;
							monthNumber = nextMonth;
							yearNumber = yearOfNextMonth;
						}
					}

					var dayConfig = {
						day: dayNumber,
						month: monthNumber,
						year: yearNumber,
						hasEvent: hasEvent,
						isSelected: isSelected,
						isToday: isToday,
						isDisabled: isDisabled,
						isEmpty: isEmpty,
						isStartRange: isStartRange,
						isEndRange: isEndRange,
						isInRange: isInRange,
						showDaysInNextAndPreviousMonths:
							opts.showDaysInNextAndPreviousMonths,
						enableSelectionDaysInNextAndPreviousMonths:
							opts.enableSelectionDaysInNextAndPreviousMonths,
					};

					if (opts.pickWholeWeek && isSelected) {
						isWeekSelected = true;
					}

					row.push(renderDay(dayConfig));

					if (++r === 7) {
						if (opts.showWeekNumber) {
							row.unshift(renderWeek(i - before, month, year));
						}
						data.push(
							renderRow(row, opts.isRTL, opts.pickWholeWeek, isWeekSelected)
						);
						row = [];
						r = 0;
						isWeekSelected = false;
					}
				}
				return renderTable(opts, data, randId);
			},

			isVisible: function () {
				return this._v;
			},

			show: function () {
				if (!this.isVisible()) {
					this._v = true;
					this.draw();
					removeClass(this.el, "is-hidden");
					if (this._o.bound) {
						addEvent(document, "click", this._onClick);
						this.adjustPosition();
					}
					if (typeof this._o.onOpen === "function") {
						this._o.onOpen.call(this);
					}
				}
			},

			hide: function () {
				var v = this._v;
				if (v !== false) {
					if (this._o.bound) {
						removeEvent(document, "click", this._onClick);
					}
					this.el.style.position = "static"; // reset
					this.el.style.left = "auto";
					this.el.style.top = "auto";
					addClass(this.el, "is-hidden");
					this._v = false;
					if (v !== undefined && typeof this._o.onClose === "function") {
						this._o.onClose.call(this);
					}
				}
			},

			/**
			 * GAME OVER
			 */
			destroy: function () {
				var opts = this._o;

				this.hide();
				removeEvent(this.el, "mousedown", this._onMouseDown, true);
				removeEvent(this.el, "touchend", this._onMouseDown, true);
				removeEvent(this.el, "change", this._onChange);
				if (opts.keyboardInput) {
					removeEvent(document, "keydown", this._onKeyChange);
				}
				if (opts.field) {
					removeEvent(opts.field, "change", this._onInputChange);
					if (opts.bound) {
						removeEvent(opts.trigger, "click", this._onInputClick);
						removeEvent(opts.trigger, "focus", this._onInputFocus);
						removeEvent(opts.trigger, "blur", this._onInputBlur);
					}
				}
				if (this.el.parentNode) {
					this.el.parentNode.removeChild(this.el);
				}
			},
		};

		$(".cwp-form form").each(function () {
			$(this)
				.find(".cwp-datepicker input")
				.each(function () {
					const format = $(this).data("format");

					const datePicker = new Pikaday({
						field: this,
						format,
						toString(date, format) {
							// you should do formatting based on the passed format,
							// but we will just return 'D/M/YYYY' for simplicity
							const day = date.getDate();
							const month = date.getMonth() + 1;
							const year = date.getFullYear();

							if (format === "DD/MM/YYYY") {
								return `${day}/${month}/${year}`;
							} else if (format === "MM/DD/YYYY") {
								return `${month}/${day}/${year}`;
							} else {
								return `${year}/${month}/${day}`;
							}
						},
					});
					datePicker.setMinDate(new Date("Thu Jan 1 1920"));
				});
		});

		return Pikaday;
	});

	class Conditional {
		constructor(form) {
			this.form = $(form);
			this.fields = this.form.find("[data-cwp-field]");
			this.conditionalFields = this.form.find("[data-condition]");

			if (this.conditionalFields.length) {
				this.init();
			}
		}

		parseCondition(cond) {
			const field_id = cond.field.split("-");

			return {
				fieldName: field_id[0],
				field: field_id[field_id.length - 1],
				operand: cond.condition,
				value: cond.value,
			};
		}

		buildCondition(value, operand, condValue) {
			if (value instanceof Array) {
				switch (operand) {
					case "===":
						return JSON.stringify(value) === JSON.stringify(condValue);
					case "!==":
						return JSON.stringify(value) !== JSON.stringify(condValue);
				}
			} else {
				switch (operand) {
					case "===":
						return value === condValue;
					case "!==":
						return value !== condValue;
				}
			}
		}

		init() {
			const { conditionalFields } = this, t = this;

			conditionalFields.each(function () {
				let condition = t.parseCondition($(this).data("condition"));

				condition["elem"] = $(this);

				t.fields.each(function () {
					let target = $(this).attr("id").startsWith( condition["field"] );

					if ( target ) {
						condition.elem.toggle(
							t.buildCondition( $(this).val(), condition["operand"], condition["value"] )
						);
					}

					$(this).on("input", function () {
						let target = $(this).attr("id").startsWith(condition["field"]);
						let fieldValue;

						if ($(this).attr("type") === "checkbox") {
							fieldValue = [];
							t.form
								.find(`input[name="${$(this).attr("name")}"]:checked`)
								.each(function () {
									fieldValue.push($(this).val());
								});
						} else if ($(this).attr("type") === "file") {
							fieldValue = $(this).val().replace(/C:\\fakepath\\/i, "");
						} else {
							fieldValue = $(this).val();
						}

						if ( target ) {
							condition.elem.toggle(
								t.buildCondition( fieldValue, condition["operand"], condition["value"] )
							);
						}
					});
				});
			});
		}
	}

	class ProgressBar {
		constructor(bars) {
			this.bars = bars;
		}

		set(perc, animate = false) {
			const percentage = String(perc).concat("%");

			const { bars } = this;

			bars.each(function () {
				const fill = $(this).find(".bar-fill");
				const percentageIndicator = fill.find(".percentage-indicator");

				if (animate) {
					fill.animate(
						{
							width: percentage,
						},
						{
							duration: 1000,
							step: function (now) {
								if (percentageIndicator.length) {
									percentageIndicator.html(Math.floor(now) + "%");
								}
							},
						}
					);
				} else {
					fill.stop(true, true); // for stopping the ongoing animation
					fill.css("width", percentage);

					if (percentageIndicator.length) {
						percentageIndicator.html(percentage);
					}
				}
			});
		}
	}

	class MultiStepForm {
		constructor(target) {
			this.target = $(target);
			this.steps = this.target.find(".cwp-form-step");
			this.bars = this.target.find(".cwp-gutenberg-form.cwp-progress-bar");
			this.progressBarHandler = new ProgressBar(this.bars);

			this.init();
		}

		init() {
			const { steps } = this;
			//initializing progress bars

			// displaying the first step by default;
			steps.eq(0).addClass("cwp-active-step");
			this.handleEvents();
			this.handleProgress();
			this.handleDisability(); // disabling triggers that are invalid
		}

		handleDisability() {
			const { target, steps } = this;

			const triggers = target.find(".multistep-trigger");

			triggers.each(function () {
				const rootStep = $(this).parents(".cwp-form-step");
				const currentStep = target.find(".cwp-active-step");
				const currentStepIndex = steps.index(currentStep) + 1;
				const totalSteps = steps.length;

				if (rootStep.length) {
					const hasNextStep = rootStep.next().hasClass("cwp-form-step");
					const hasPrevStep = rootStep.prev().hasClass("cwp-form-step");

					if (!hasNextStep) {
						rootStep.find('[data-trigger="next"]').css("opacity", ".5");
					} else {
						rootStep.find('[data-trigger="next"]').css("opacity", "1");
					}

					if (!hasPrevStep) {
						rootStep.find('[data-trigger="previous"]').css("opacity", ".5");
					} else {
						rootStep.find('[data-trigger="previous"]').css("opacity", "1");
					}
				} else {
					if (totalSteps === currentStepIndex) {
						target.find('[data-trigger="next"]').css("opacity", ".5");
					} else {
						target.find('[data-trigger="next"]').css("opacity", "1");
					}

					if (currentStepIndex === 1) {
						target.find('[data-trigger="previous"]').css("opacity", ".5");
					} else {
						target.find('[data-trigger="previous"]').css("opacity", "1");
					}
				}
			});
		}

		checkValidity(fields) {
			let validity = true;

			fields.each(function () {
				const __field = $(this).find("[data-cwp-field]");
				let __is_field_valid_ = false;

				if (!__field.length) {
					__is_field_valid_ = false;
				} else {
					__is_field_valid_ = __field[0].checkValidity();
				}

				if (!__is_field_valid_) {
					validity = false;
				}
			});

			return validity;
		}

		reportValidity(fields) {
			fields.each(function () {
				const field = $(this).find("[data-cwp-field]");

				if (field.length) {
					field[0].reportValidity();
				}
			});
		}

		handleProgress(animate = true) {
			const { target, steps } = this;
			const totalSteps = steps.length;
			const currentStep = target.find(".cwp-active-step");
			const currentStepIndex = steps.index(currentStep) + 1;

			const currentPercentage = Math.floor(
				(currentStepIndex / totalSteps) * 100
			);

			this.progressBarHandler.set(currentPercentage, animate);
		}

		next() {
			const { target, steps } = this;
			const currentActiveStep = target.find(".cwp-active-step");
			const currentFields = currentActiveStep.find(".cwp-field");
			const hasNextStep = currentActiveStep.next().hasClass("cwp-form-step");

			const hasSlideAnimation = target.hasClass("cwp-slide-step");

			if (!this.checkValidity(currentFields)) {
				this.reportValidity(currentFields);
				return;
			}

			if (!hasNextStep) {
				return;
			}

			steps.removeClass("cwp-active-step from-next");
			currentActiveStep.next().addClass("cwp-active-step from-next");

			this.handleProgress();
			this.handleDisability();
		}

		prev() {
			const { target, steps } = this;
			const currentActiveStep = target.find(".cwp-active-step");
			const currentFields = currentActiveStep.find(".cwp-field");
			const hasPrevStep = currentActiveStep.prev().hasClass("cwp-form-step");

			if (!this.checkValidity(currentFields)) {
				this.reportValidity(currentFields);
				return;
			}

			if (!hasPrevStep) {
				return;
			}

			steps.removeClass("cwp-active-step from-before");
			currentActiveStep.prev().addClass("cwp-active-step from-before");
			this.handleProgress(false);
			this.handleDisability();
		}

		handleEvents() {
			const { target } = this;
			const t = this;

			target.find(".multistep-trigger").each(function () {
				const trigger = $(this).data("trigger");

				$(this).click(function (e) {
					e.preventDefault();

					if (trigger === "next") {
						t.next();
					} else if (trigger === "previous") {
						t.prev();
					}
				});
			});
		}
	}

	class AutoPopulate {
		constructor(form) {
			this.form = form;
			this.populate();
		}

		getParameterByName(name) {
			let url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return "";
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		decodeCheckboxName(name) {
			let separated = name.split("__");
			let uriWithGroup = separated[1];
			const withoutGroup = uriWithGroup.split("[]")[0];

			return withoutGroup;
		}

		getDecodedFieldId(name, type, self) {
			let value;

			if (type === "range") {
				const parent = $(self)
					.parents(".cwp-range-set")
					.find("input[type='number']");
				name = parent.attr("name");
			}
			if (type === "checkbox") {
				value = this.decodeCheckboxName(name);
			} else {
				value = name.split("__")[1];
			}

			const decoded = window.atob(decodeURIComponent(value));
			const params = decoded.split("-");
			const field_id = params[params.length - 1];

			return field_id;
		}

		populate() {
			const fields = this.form.find("[data-cwp-field]");
			const t = this;
			fields.each(function () {
				const type = $(this).attr("type");

				const name = $(this).attr("name");
				const field_id = t.getDecodedFieldId(name, type, this);
				const queryValue = t.getParameterByName(field_id);

				if (type === "checkbox" && field_id !== null) {
					$(this)
						.parents(".cwp-checkbox")
						.find(`input[type="checkbox"]`)
						.each(() => {
							const value = $(this).val();
							const checkboxesValues =
								queryValue !== null ? queryValue.split(",") : "";

							if (checkboxesValues.includes(value)) {
								$(this).attr("checked", true);
							}
						});
				} else if (type === "radio" && field_id !== null) {
					$(this)
						.parents(".cwp-radio")
						.find(`input[type="radio"]`)
						.each(() => {
							const value = $(this).val();

							if (value === queryValue) {
								$(this).attr("checked", true);
							}
						});
				} else if (
					field_id !== null &&
					type !== "file" &&
					type !== "hidden" &&
					queryValue !== null
				) {
					$(this).val(queryValue);
				}
			});
		}
	}

	function getRegex(fields) {
		let res = [];

		fields.forEach((f, i) => {
			if (i !== fields.length - 1) {
				res += `{{${f}}}|`;
			} else if (i === fields.length - 1) {
				res += `{{${f}}}`;
			}
		});

		return new RegExp(res, "g");
	}

	function getMapObject(fields, data) {
		let res = {};

		fields.forEach((f) => {
			let breaked = f.split("-");

			let fieldName;

			let firstLetter = breaked[1].substring(0, 1).toUpperCase();

			if (isNaN(firstLetter)) {
				fieldName =
					"number" +
					breaked[1].substring(0, 1).toUpperCase() +
					breaked[1].substring(1, breaked[1].length);
			} else {
				fieldName = f;
			}

			res["{{" + f + "}}"] = data[fieldName];
		});
		return res;
	}

	function applyCalculation(form) {
		form.find(".cwp-field.cwp-calculation").each(function () {
			let formula = $(this).attr("data-cwp-calculation");

			if (!formula) {
				return;
			}

			// let fields = formula.match(/[(number)\-\d\w]+/g);
			const f = formula.match(/[{{]+[\/number\-\d\w]+[}}]+/g);
			const fields = f.map((v) => v.substring(2, v.length - 2));
			const deciPlaces = Number($(this).data("deci"));

			const self = $(this),
				t = this;

			form.find("[data-cwp-field]").each(function () {
				$(this).on("input", function () {
					const target = $(this).attr("id").substring(0, 6);
					var replace = `number-${target}`;

					if (fields.includes(replace)) {
						self.attr(`data-${replace}`, $(this).val());
					}

					fields.forEach((field) => {
						let expression = formula;
						let regExp = getRegex(fields);

						const mapObj = getMapObject(fields, t.dataset);

						expression = expression.replace(regExp, function (matched) {
							return mapObj[matched];
						});

						const result = eval(expression).toFixed(deciPlaces);

						self.find("input").val(result);
						self.find(".cwp-calc-result").html(result);
					});
				});
				fields.forEach((field) => {
					let expression = formula;
					let regExp = getRegex(fields);

					const mapObj = getMapObject(fields, t.dataset);

					expression = expression.replace(regExp, function (matched) {
						return mapObj[matched];
					});

					const result = eval(expression).toFixed(deciPlaces);

					self.find("input").val(result);
					self.find(".cwp-calc-result").html(result);
				});

				const target = $(this).attr("id").substring(0, 6);
				var replace = `number-${target}`;

				if (fields.includes(replace)) {
					self.attr(
						`data-${replace}`,
						$(this).val() === "" ? 0 : $(this).val()
					);
				}
			});
		});
	}

	$().ready(function () {
		$(".cwp-form").each(function () {
			const populator = new AutoPopulate($(this));
		});

		$(".cwp-form").each(function () {
			let formRoot = $(this).find("form");

			let resubmit_btn = $(this).find(".cwp-add_another_submission button");

			if (resubmit_btn.length) {
				resubmit_btn.click(function () {
					$(this).parent().parent().parent().css("display", "none");
					formRoot.css("display", "block");
				});
			}
		});

		$(".cwp-form form").each(function () {
			// for auto population

			$(this)
				.find(".cwp-yes-no input[type='checkbox']")
				.change(function () {
					if ($(this).prop("checked")) {
						$(this).val("yes");
						$(this).parent().find('input[type="hidden"]').val("yes");
					} else {
						$(this).parent().find('input[type="hidden"]').val("no");
						$(this).val("no");
					}
				});

			$(this).on("submit", function (e) {

				let required_checkboxes = $(this).find(
					".cwp-checkbox-set.required-checkbox"
				);

				required_checkboxes.each(function (index) {
					if ($(this).find("input:checkbox").filter(":checked").length < 1) {
						e.preventDefault();

						let errMessage = $(this).data("errors");

						if (!$(this).find(".cwp-warning").length) {
							$(this).append(`
                    <div class="cwp-warning">
                      <div>
                        <span class="dashicons dashicons-info"></span>
                      </div>
					  <div>
					  ${
							errMessage.empty.trim().length === 0
								? "Please select atleast one checkbox!"
								: errMessage.empty
						}

                      </div>
                    </div>
                  `);
						}
					} else if ($(this).find(".cwp-warning").length) {
						$(this).find(".cwp-warning").remove();
					}
				});

				let required_radios = $(this).find(".cwp-radio-set.required-radio");

				required_radios.each(function (index) {
					if ($(this).find("input:radio").filter(":checked").length < 1) {
						let errMessage = $(this).data("errors");

						e.preventDefault();

						if (!$(this).find(".cwp-warning").length) {
							$(this).append(`
                      <div class="cwp-warning">
                        <div>
                          <span class="dashicons dashicons-info"></span>
                        </div>
                        <div>
						${
							errMessage.empty.trim().length === 0
								? "Please select radio!"
								: errMessage.empty
						}
                        </div>
                      </div>
                    `);
						}
					} else if ($(this).find(".cwp-warning").length) {
						$(this).find(".cwp-warning").remove();
					}
				});
				// Get form id
				let form_id = $(this).attr("id");
				window.location.href = `#${form_id}`;
			});

		});

		$(".cwp-form form").each(function () {
			let condition = new Conditional(this);
			const self = this;

			this.querySelectorAll(".cwp-reset_btn").forEach((resetBtn) => {
				resetBtn.onclick = (e) => {
					e.preventDefault();

					self.querySelectorAll("[data-cwp-field]").forEach((v) => {
						v.value = "";
					});
				};
			});

			let rangeSliders = $(this).find(".cwp-range-set");

			if (rangeSliders.length) {
				rangeSliders.each(function () {
					let rangeInput = $(this).find('input[type="range"]');
					let numberInput = $(this).find('input[type="number"]');

					rangeInput.on("input", function () {
						numberInput.val($(this).val());
					});
					numberInput.on("input", function () {
						rangeInput.val($(this).val());
					});
				});
			}

			if ($(this).find(".cwp-field.cwp-calculation").length) {
				applyCalculation($(this));
			}
		});

		$(".cwp-form").each(function () {
			if ($(this).data("formtype") === "multiStep") {
				const multiStepForm = new MultiStepForm(this);
			}
		});
	});
});

document.addEventListener("DOMContentLoaded", function () {
	var elements = document.querySelectorAll(".cwp-form [data-cwp-field]");

	elements.forEach((elem) => {
		elem.oninvalid = function (e) {
			if (e.target.dataset.errors) {
				const validityText = JSON.parse(e.target.dataset.errors);

				if (validityText.mismatch) {
					let mismatchWithValue = validityText.mismatch.replace(
						/{{value}}/g,
						e.target.value
					);

					e.target.setCustomValidity("");
					if (!e.target.validity.valid) {
						e.target.value === ""
							? e.target.setCustomValidity(validityText.empty)
							: e.target.setCustomValidity(mismatchWithValue);
					}
				} else if (validityText.empty) {
					e.target.setCustomValidity("");
					if (!e.target.validity.valid) {
						e.target.value === ""
							? e.target.setCustomValidity(validityText.empty)
							: null;
					}
				}
			}
		};
		elem.onkeydown = function (e) {
			if (e.target.dataset.errors) {
				e.target.setCustomValidity("");

				const parseErrors = JSON.parse(e.target.dataset.errors);
				const typeMismatchMessage = parseErrors.mismatch;

				if (parseErrors.mismatch) {
					let mismatchWithValue = typeMismatchMessage.replace(
						/{{value}}/g,
						e.target.value
					);

					e.target.setAttribute("title", mismatchWithValue);
					if (e.target.validity.typeMismatch) {
						e.target.setCustomValidity(
							mismatchWithValue ? mismatchWithValue : ""
						);
					}
				}
			}
		};
	});
});
