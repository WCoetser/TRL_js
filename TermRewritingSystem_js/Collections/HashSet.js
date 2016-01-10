/*
This program is an implementation of the Term Rewriting Language, or TRL. 
In that sense it is also a specification for TRL by giving a reference
implementation. It contains a parser and interpreter.

Copyright (C) 2012 Wikus Coetser, 
Contact information on my blog: http://coffeesmudge.blogspot.com/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if (typeof (Collections) == "undefined") Collections = {};
if (typeof (Collections.HashSet) == "undefined") {

  // NB: 
  // ---
  // * Hash set elements MUST override toString for predictable 
  //   hashing and equality.
  // * Filters out functions on input collections
  ///////////////////////////////////////////////////////////////

  Collections.HashSet = function (initialElements) {
    this.AddElements(initialElements);
  }

  Collections.HashSet.prototype.AddElements = function (otherSet) {
    if (!otherSet) return;
    if (Array.isArray(otherSet)) {
      for (var key in otherSet) {
        // Implicit call to toString()
        if (!(otherSet[key] instanceof Function)) {
          this[otherSet[key]] = otherSet[key];
        }
      }
    }
    else {
      for (var key in otherSet) {
        if (!(otherSet[key] instanceof Function)) {
          this[key] = otherSet[key];
        }
      }
    }
  }

  Collections.HashSet.prototype.Clear = function () {
    for (var key in this) {
      if (this.hasOwnProperty(key)) {
        delete this[key];
      }
    }
  }

  Collections.HashSet.prototype.Intersect = function (intersectWithSet) {
    var retSet = new Collections.HashSet();
    for (var key in this) {
      if (this.hasOwnProperty(key)
        && intersectWithSet[key]
        && this[key]
        && intersectWithSet[key].toString() == this[key].toString()) {
        retSet.AddElements([intersectWithSet[key]]);
      }
    }
    return retSet;
  }

  Collections.HashSet.prototype.GetElementCount = function () {
    var count = 0;
    for (var key in this) {
      if (this.hasOwnProperty(key)) count++;
    }
    return count;
  }

  Collections.HashSet.prototype.ToArray = function () {
    var retArr = new Array();
    for (var key in this) {
      if (this.hasOwnProperty(key)) {
        retArr.push(this[key]);
      }
    }
    return retArr;
  }
}
