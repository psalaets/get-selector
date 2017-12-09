'use strict';

var isEl = require('is-el');

/**
 * @module getSelector
 * @description Generates a unique CSS selector that will match only the passed element.
 *
 * @param {element} element - target element
 * @return {(string|boolean)} CSS selector that will return only the passed element, false if element is not valid
 */
module.exports = function (el) {
	// Query parts collection
	var s = [];

	// Not a valid DOM element
	if (!isEl(el)) {
		return false;
	}

	// Iterate through the element's ancestors
	while (el.parentNode) {
		// If element has ID, we're done -
		// build selector from all previous parts
		if (el.id) {
			s.unshift('#' + el.id);
			break;
		} else {
			// Reached the body or html tag -
			// add the tag to the parts collection
			if (el === el.ownerDocument.documentElement ||
				el === el.ownerDocument.body) {
				s.unshift(el.tagName.toLowerCase());
			// Get the element's position amongst its
			// siblings to build an "nth-child" selector
			} else {
				var position = countPreviousSiblings(el) + 1;
				s.unshift(el.tagName.toLowerCase() + ':nth-child(' + position + ')');
			}
			// Repeat for parent
			el = el.parentNode;
		}
	}

	// Return all parts, joined
	return s.join(' > ');
};

function countPreviousSiblings(el) {
	var count = 0;
	while (el.previousElementSibling) {
		el = el.previousElementSibling;
		count += 1;
	}
	return count;
}