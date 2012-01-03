/**
 * The Plot module provides 2D, plotter-style helper methods for canvas drawing.
 * Canvas seems to reference every action in relation to the context's x/y origin -- 
 * this can be tedious when attempting to draw polygons, so Plot allows actions to be
 * sequentially referenced from the last-drawn coordinates.  The idea is:  "Move to Point A, draw
 * a line to Point B, draw an arc to Point C, now draw a line to Point D" and so on...
 *
 * @module plot
 *
 */

/**
 * Provides helper methods for Canvas elements.
 * @namespace TBD
 * @class Plot
 * @requires TBD
 * @param {String} id The id of the canvas element.
 * @param {String} lineColor The desired color for drawing lines (defaults to black).
 * @param {Number} lineWidth The desired width for drawing lines (defaults to 1).
 */
function Plot(id, lineColor, lineWidth) {
  this.lastPoint = this.origin = {
    x: 0, 
    y: 0
  };

  this.id = id;   
  this.isDrawing = false; 
  this.canvas = document.getElementById(id);

  if (this.canvas && this.canvas.getContext) {
    this.context = this.canvas.getContext("2d");
    if (this.context) {
      this.context.strokeStyle = lineColor || "#000";
      this.context.lineWidth = lineWidth || 1;
    }
  }

}

Plot.convert = Math.PI/180;

Plot.prototype = {

  /** 
   * Updates the last pen location
   * @method updateLastPoint
   * @param {Number} x The x coordinate
   * @param {Number} y The y coordinate
   * @param {Boolean} absolute Forces an override of the last point, used for setting an absolute position 
   * @return {Object} Returns the Plot instance for chaining.
   */
  updateLastPoint: function (x, y, absolute) {
    this.lastPoint = (absolute) ? {
      x: x,
      y: y
    } : {
      x: x + this.lastPoint.x,
      y: y + this.lastPoint.y
    };

    return this;
  },

  /** 
   * Relocates pen to the given coordinates.
   * @method move
   * @param {Number} x The desired X coordinate, relative to the last point.
   * @param {Number} y The desired Y coordinate, relative to the last point.
   * @param {Boolean} absolute Forces absolute positioning.
   * @return {Object} Returns the Plot instance for chaining.
   */
  move: function (x, y, absolute) {
    this.updateLastPoint(x, y, absolute);
    this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
    return this;
  },

  /** 
   * Relocates pen horizontally.
   * @method hmove
   * @param {Number} x The desired X coordinate, relative to the last point.
   * @return {Object} Returns the Plot instance for chaining.
   */
  hmove: function (x) {
    return this.move(x,0);
  },

 
  /** 
   * Relocates pen vertically.
   * @method vmove
   * @param {Number} y The desired Y coordinate, relative to the last point.
   * @return {Object} Returns the Plot instance for chaining.
   */
  vmove: function (y) {
    return this.move(0,y);
  },

  /** 
   * Relocates pen back to the origin.
   * @method home
   * @return {Object} Returns the Plot instance for chaining.
   */
  home: function () {
    this.updateLastPoint(this.origin.x, this.origin.y, true);
    this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
    return this;
  },

  /** 
   * Draws a line to the given coordinates.
   * @method line
   * @param {Number} x The desired X coordinate, relative to the last point.
   * @param {Number} y The desired Y coordinate, relative to the last point.
   * @return {Object} Returns the Plot instance for chaining.
   */
  line: function (x, y) {   
    this.updateLastPoint(x, y);
    this.context.lineTo(this.lastPoint.x, this.lastPoint.y);   
    return this;
  },

  /**
   * Pass through to context.stroke()
   * @method stroke
   * @return {Object} Returns the Plot instance for chaining.
   */
  stroke: function() {
    this.context.stroke();
    return this;
  },

  /**
   * Pass through to context.fill()
   * @method fill
   * @return {Object} Returns the Plot instance for chaining.
   */
  fill: function() {
    this.context.fill();
    return this;
  },

  /** 
   * Draws a horizontal line to the given x-coordinate.
   * @method hline
   * @param {Number} x The desired X coordinate, relative to the last point.
   * @return {Object} Returns the Plot instance for chaining.
   */
  hline: function (x) {
    return this.line(x,0);
  },

  /** 
   * Draws a vertical line to the given y-coordinate.
   * @method vline
   * @param {Number} y The desired X coordinate, relative to the last point.
   * @return {Object} Returns the Plot instance for chaining.
   */
  vline: function (y) {
    return this.line(0,y);
  },
    
  /** 
   * Draws an arc around a given center point.
   * @method arc
   * @param {Number} x The X coordinate of the center point.
   * @param {Number} y The Y coordinate of the center point.
   * @param {Number} r The desired radius.
   * @param {Number} startAngle The desired angle start, in degrees
   * @param {Number} endAngle The desired angle end, in degrees
   * @return {Object} Returns the Plot instance for chaining.
   */
  arc: function (x, y, r, startAngle, endAngle) {
    this.context.arc(x, y, r, startAngle * c, endAngle * c, false);
    return this;
  },

    /** 
     * Draws an arcTo from the last point to a new end point.
     * @method arcTo
     * @param {Number} ax The X coordinate of the end point.
     * @param {Number} ay The Y coordinate of the end point.
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    arcTo: function (ax, ay, r) {
      var lp = this.lastPoint;
      
      //this.begin();
      this.context.arcTo(lp.x, lp.y, lp.x + ax, lp.y + ay, r);
      this.updateLastPoint(ax, ay);
      //this.end();
      return this;
    },
    
    /** 
     * Draws a radiused corner pointing to the north-then-east.
     * @method ne
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    ne: function (r) {

      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      //this.arc(this.lastPoint.x, this.lastPoint.y-r, r, 0, 90);
      this.context.quadraticCurveTo(x, y-r, x+r, y-r);
      this.move(r, -r);
      return this;
    },

    /** 
     * Draws a radiused corner pointing to the south-then-east.
     * @method se
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    se: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

       //this.arc(this.lastPoint.x, this.lastPoint.y+r, r, 0, 270);
       this.context.quadraticCurveTo(x, y+r, x+r, y+r);
       this.move(r, r);
       return this;
    },

    /** 
     * Draws a radiused corner pointing to the north-then-west.
     * @method nw
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    nw: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      //this.arc(this.lastPoint.x-r, this.lastPoint.y, r, 180, 90);
      this.context.quadraticCurveTo(x, y-r, x-r, y-r);
      this.move(-r, -r);
      return this;
    },

    /** 
     * Draws a radiused corner pointing to the south-then-west.
     * @method sw
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    sw: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      //this.arc(this.lastPoint.x, this.lastPoint.y+r, r, 270, 180);
      this.context.quadraticCurveTo(x, y+r, x-r, y+r);
      this.move(-r, r);
      return this;
    },

    /** 
     * Draws a radiused corner pointing to the west-then-north.
     * @method wn
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    wn: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      this.context.quadraticCurveTo(x-r, y, x-r, y-r);
      this.move(-r, -r);
      return this;
    },

    /** 
     * Draws a radiused corner pointing to the west-then-south.
     * @method ws
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    ws: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      this.context.quadraticCurveTo(x-r, y, x-r, y+r);
      this.move(-r, r);
      return this;
    },

    /** 
     * Draws a radiused corner pointing to the east-then-north.
     * @method en
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    en: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      this.context.quadraticCurveTo(x+r, y, x+r, y-r);
      this.move(r, -r);
      return this;
    },

    /** 
     * Draws a radiused corner pointing to the east-then-south.
     * @method es
     * @param {Number} r The desired radius.
     * @return {Object} Returns the Plot instance for chaining.
     */
    es: function (r) {
      var x = this.lastPoint.x,
        y = this.lastPoint.y;

      this.context.quadraticCurveTo(x+r, y, x+r, y+r);
      this.move(r, r);
      return this;
    },

    /** 
     * Draws a rectangle centered on the canvas with the provided dimensions.
     * @method centerRect
     * @param {Number} w The desired width of the rectangle.
     * @param {Number} h The desired height of the rectangle.
     * @return {Object} Returns the Plot instance for chaining.
     */
    centerRect: function (w, h) {
      var center = this.getCenter();

      h = h || w;
      
      this.context.strokeRect(center.x-w/2, center.y-h/2, w, h);
      return this;
    },
	
    /** 
     * Sets the line color.
     * @method setLineColor
     * @param {String} color 
     * @return {Object} Returns the Plot instance for chaining.
     */
    setLineColor: function (color) {
      this.context.strokeStyle = color;
      return this;
    },
    
    /** 
     * Sets the line width.
     * @method setLineWidth
     * @param {Number} width 
     * @return {Object} Returns the Plot instance for chaining.
     */
    setLineWidth: function (width) {
      this.context.lineWidth = width;
      return this;
    },
    
    /** 
     * Finds the center coordinates of the canvas.
     * @method getCenter
     * @return {Object} Returns the coordinates of the center point.
     */
    getCenter: function () {
      var canvas = this.canvas;

      return ({
        x: canvas.width/2,
        y: canvas.height/2
      });
    },

    /** 
     * Centers the pen on the canvas.
     * @method center
     * @return {Object} Returns the Plot instance for chaining.
     */
    center: function () {
      var center = this.getCenter();

      this.move(center.x, center.y, true);
      return this;
    },

    /**
     * Starts the drawing path.
     * @method begin
     * @return {Object} Returns the Plot instance for chaining.
     */
    begin: function () {
      this.context.beginPath();
      return this;
    },
    
    /**
     * Alias for begin method
     * @method start
     * @return {Object} Returns the Plot instance for chaining.     
     */
    start: function () {
        this.move(0,0);
        return this.begin();
    },
    
    /**
     * Closes the canvas drawing path.
     * @method end
     * @param {Boolean} closePath Causes the end point to be connected to the starting point [optional].
     * @return {Object} Returns the Plot instance for chaining.
     */
    end: function (closePath) {
      this.context.stroke();

      if (closePath) {
        this.context.closePath();
      }
      
      if (this.isDrawing) {
        this.isDrawing = false;
      }
      
      return this;
    },
    
    /**
     * Resets the canvas.
     * @method reset
     * @return {Object} Returns the Plot instance for chaining.
     */
    reset: function () {
      //this.end();
      
      //this.context.clearRect(this.origin.x, this.origin.y, this.canvas.width, this.canvas.height);
      //this.home();
      
      //hack to wipe canvas
      this.canvas.width = this.canvas.width;
      
      return this;
    },
    
    /**
     * Draws a point at the current location.
     * @method point
     * @return {Object} Returns the Plot instance for chaining.
     */
    point: function() {
      this.begin();
      this.context.strokeText(".", this.lastPoint.x, this.lastPoint.y);
      this.end();
      return this;
    },
    
   /**
     * Returns the coordinates of the last point location as a string.
     * @method loc
     * @return {String} A string denoting the last coordinates.
     */
    loc: function() {
      return this.lastPoint.x + ", " + this.lastPoint.y;
    },
    
    /**
     * Draws a rectangle with rounded corners.
     * @method roundRect
     * @param {Number} width The desired width of the rectangle.
     * @param {Number} height The desired height of the rectangle.
     * @param {Number} radius The radius for the rounded corners.
     * @param {Number} x The x coordinate of the center point.
     * @param {Number} y The y coordinate of the center point.
     * @param {String} id The id of the rectangle.
     * @return {Object} Returns the Plot instance for chaining.
     */
    roundRect: function(width, height, radius, x, y, id) {
      var center = this.getCenter();
      
      x = x || center.x - (width/2) + radius;
      y = y || center.y - (height/2);
      
      this.rects = this.rects || {};
      this.rects[id] = {
        width: width,
        height: height,
        radius: radius,
        x: x,
        y: y
      };
      
      return this.start().move(x, y, true).hline(width-radius-radius).es(radius).vline(height-radius-radius).sw(radius).hline(-width+radius+radius).wn(radius).vline(-height+radius+radius).ne(radius).end();
      
     }
};    



