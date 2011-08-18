/**
 * The Plot module provides 2D, plotter-style helper methods for canvas drawing.
 * Canvas seems to reference every action in relation to the context's x/y origin -- 
 * this can be tedious when attempting to draw polygons, so Plot allows actions to be
 * referenced from the last-drawed coordinates.  The idea is:  "move to point A, draw
 * a line to point B, draw an arc to point C, now draw a line to point D" and so on...
 *
 * @module plot
 *
 */

/**
 * Provides helper methods for Canvas elements.
 * @namespace TBD
 * @class Plot
 * @requires TBD
 */

var Plot = (function() {

	var aPlot = {
	    a: "b",
	    c: "d",
	    e: function() {
		alert(this);
	    }
	};

	return (aPlot);
}());


