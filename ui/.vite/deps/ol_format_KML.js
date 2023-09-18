import {
  LineString_default,
  interpolatePoint,
  lineStringsCoordinateAtM
} from "./chunk-W2KFISFX.js";
import "./chunk-3TH2XOAI.js";
import {
  Feature_default
} from "./chunk-YN4UMUHW.js";
import {
  Geometry_default,
  Point_default,
  Polygon_default,
  SimpleGeometry_default,
  arrayMaxSquaredDelta,
  assignClosestArrayPoint,
  assignClosestMultiArrayPoint,
  deflateCoordinates,
  deflateCoordinatesArray,
  deflateMultiCoordinatesArray,
  douglasPeuckerArray,
  getInteriorPointsOfMultiArray,
  inflateCoordinates,
  inflateCoordinatesArray,
  inflateMultiCoordinatesArray,
  intersectsLineStringArray,
  intersectsLinearRingMultiArray,
  linearRingss,
  linearRingssAreOriented,
  linearRingssContainsXY,
  multiArrayMaxSquaredDelta,
  orientLinearRingsArray,
  quantizeMultiArray
} from "./chunk-KFWWOLVS.js";
import {
  closestSquaredDistanceXY,
  containsXY,
  createEmpty,
  createOrUpdateEmpty,
  createOrUpdateFromFlatCoordinates,
  equivalent,
  extend as extend2,
  get,
  getCenter
} from "./chunk-Z65V5NHV.js";
import {
  Fill_default,
  Icon_default,
  Stroke_default,
  Style_default,
  Text_default
} from "./chunk-VD2B4VQ4.js";
import "./chunk-43UBQKTQ.js";
import "./chunk-7WAVCBXX.js";
import "./chunk-XLOLXDZY.js";
import "./chunk-TV4UVIJR.js";
import "./chunk-CAYFFAYC.js";
import {
  ImageState_default
} from "./chunk-J5H2GECR.js";
import {
  asArray
} from "./chunk-NHXTUU2X.js";
import "./chunk-PA55PNQX.js";
import {
  EventType_default,
  abstract,
  extend,
  listen,
  squaredDistance,
  toRadians,
  unlistenByKey
} from "./chunk-JLG4I4EQ.js";
import "./chunk-4EOJPDL2.js";

// node_modules/ol/geom/GeometryCollection.js
var GeometryCollection = class extends Geometry_default {
  /**
   * @param {Array<Geometry>} [geometries] Geometries.
   */
  constructor(geometries) {
    super();
    this.geometries_ = geometries ? geometries : null;
    this.changeEventsKeys_ = [];
    this.listenGeometriesChange_();
  }
  /**
   * @private
   */
  unlistenGeometriesChange_() {
    this.changeEventsKeys_.forEach(unlistenByKey);
    this.changeEventsKeys_.length = 0;
  }
  /**
   * @private
   */
  listenGeometriesChange_() {
    if (!this.geometries_) {
      return;
    }
    for (let i = 0, ii = this.geometries_.length; i < ii; ++i) {
      this.changeEventsKeys_.push(
        listen(this.geometries_[i], EventType_default.CHANGE, this.changed, this)
      );
    }
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!GeometryCollection} Clone.
   * @api
   */
  clone() {
    const geometryCollection = new GeometryCollection(null);
    geometryCollection.setGeometries(this.geometries_);
    geometryCollection.applyProperties(this);
    return geometryCollection;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      minSquaredDistance = geometries[i].closestPointXY(
        x,
        y,
        closestPoint,
        minSquaredDistance
      );
    }
    return minSquaredDistance;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(x, y) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].containsXY(x, y)) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(extent) {
    createOrUpdateEmpty(extent);
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      extend2(extent, geometries[i].getExtent());
    }
    return extent;
  }
  /**
   * Return the geometries that make up this geometry collection.
   * @return {Array<Geometry>} Geometries.
   * @api
   */
  getGeometries() {
    return cloneGeometries(this.geometries_);
  }
  /**
   * @return {Array<Geometry>} Geometries.
   */
  getGeometriesArray() {
    return this.geometries_;
  }
  /**
   * @return {Array<Geometry>} Geometries.
   */
  getGeometriesArrayRecursive() {
    let geometriesArray = [];
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].getType() === this.getType()) {
        geometriesArray = geometriesArray.concat(
          /** @type {GeometryCollection} */
          geometries[i].getGeometriesArrayRecursive()
        );
      } else {
        geometriesArray.push(geometries[i]);
      }
    }
    return geometriesArray;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {GeometryCollection} Simplified GeometryCollection.
   */
  getSimplifiedGeometry(squaredTolerance) {
    if (this.simplifiedGeometryRevision !== this.getRevision()) {
      this.simplifiedGeometryMaxMinSquaredTolerance = 0;
      this.simplifiedGeometryRevision = this.getRevision();
    }
    if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) {
      return this;
    }
    const simplifiedGeometries = [];
    const geometries = this.geometries_;
    let simplified = false;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      const geometry = geometries[i];
      const simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
      simplifiedGeometries.push(simplifiedGeometry);
      if (simplifiedGeometry !== geometry) {
        simplified = true;
      }
    }
    if (simplified) {
      const simplifiedGeometryCollection = new GeometryCollection(null);
      simplifiedGeometryCollection.setGeometriesArray(simplifiedGeometries);
      return simplifiedGeometryCollection;
    }
    this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
    return this;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "GeometryCollection";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(extent) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].intersectsExtent(extent)) {
        return true;
      }
    }
    return false;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.geometries_.length === 0;
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(angle, anchor) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].rotate(angle, anchor);
    }
    this.changed();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(sx, sy, anchor) {
    if (!anchor) {
      anchor = getCenter(this.getExtent());
    }
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].scale(sx, sy, anchor);
    }
    this.changed();
  }
  /**
   * Set the geometries that make up this geometry collection.
   * @param {Array<Geometry>} geometries Geometries.
   * @api
   */
  setGeometries(geometries) {
    this.setGeometriesArray(cloneGeometries(geometries));
  }
  /**
   * @param {Array<Geometry>} geometries Geometries.
   */
  setGeometriesArray(geometries) {
    this.unlistenGeometriesChange_();
    this.geometries_ = geometries;
    this.listenGeometriesChange_();
    this.changed();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   */
  applyTransform(transformFn) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].applyTransform(transformFn);
    }
    this.changed();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(deltaX, deltaY) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].translate(deltaX, deltaY);
    }
    this.changed();
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    this.unlistenGeometriesChange_();
    super.disposeInternal();
  }
};
function cloneGeometries(geometries) {
  const clonedGeometries = [];
  for (let i = 0, ii = geometries.length; i < ii; ++i) {
    clonedGeometries.push(geometries[i].clone());
  }
  return clonedGeometries;
}
var GeometryCollection_default = GeometryCollection;

// node_modules/ol/geom/MultiLineString.js
var MultiLineString = class extends SimpleGeometry_default {
  /**
   * @param {Array<Array<import("../coordinate.js").Coordinate>|LineString>|Array<number>} coordinates
   *     Coordinates or LineString geometries. (For internal use, flat coordinates in
   *     combination with `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Flat coordinate ends for internal use.
   */
  constructor(coordinates, layout, ends) {
    super();
    this.ends_ = [];
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    if (Array.isArray(coordinates[0])) {
      this.setCoordinates(
        /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
        coordinates,
        layout
      );
    } else if (layout !== void 0 && ends) {
      this.setFlatCoordinates(
        layout,
        /** @type {Array<number>} */
        coordinates
      );
      this.ends_ = ends;
    } else {
      let layout2 = this.getLayout();
      const lineStrings = (
        /** @type {Array<LineString>} */
        coordinates
      );
      const flatCoordinates = [];
      const ends2 = [];
      for (let i = 0, ii = lineStrings.length; i < ii; ++i) {
        const lineString = lineStrings[i];
        if (i === 0) {
          layout2 = lineString.getLayout();
        }
        extend(flatCoordinates, lineString.getFlatCoordinates());
        ends2.push(flatCoordinates.length);
      }
      this.setFlatCoordinates(layout2, flatCoordinates);
      this.ends_ = ends2;
    }
  }
  /**
   * Append the passed linestring to the multilinestring.
   * @param {LineString} lineString LineString.
   * @api
   */
  appendLineString(lineString) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = lineString.getFlatCoordinates().slice();
    } else {
      extend(this.flatCoordinates, lineString.getFlatCoordinates().slice());
    }
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiLineString} Clone.
   * @api
   */
  clone() {
    const multiLineString = new MultiLineString(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    multiLineString.applyProperties(this);
    return multiLineString;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        arrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.ends_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestArrayPoint(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      false,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * `interpolate` controls interpolation between consecutive LineStrings
   * within the MultiLineString. If `interpolate` is `true` the coordinates
   * will be linearly interpolated between the last coordinate of one LineString
   * and the first coordinate of the next LineString.  If `interpolate` is
   * `false` then the function will return `null` for Ms falling between
   * LineStrings.
   *
   * @param {number} m M.
   * @param {boolean} [extrapolate] Extrapolate. Default is `false`.
   * @param {boolean} [interpolate] Interpolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate|null} Coordinate.
   * @api
   */
  getCoordinateAtM(m, extrapolate, interpolate) {
    if (this.layout != "XYM" && this.layout != "XYZM" || this.flatCoordinates.length === 0) {
      return null;
    }
    extrapolate = extrapolate !== void 0 ? extrapolate : false;
    interpolate = interpolate !== void 0 ? interpolate : false;
    return lineStringsCoordinateAtM(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      m,
      extrapolate,
      interpolate
    );
  }
  /**
   * Return the coordinates of the multilinestring.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   */
  getCoordinates() {
    return inflateCoordinatesArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * Return the linestring at the specified index.
   * @param {number} index Index.
   * @return {LineString} LineString.
   * @api
   */
  getLineString(index) {
    if (index < 0 || this.ends_.length <= index) {
      return null;
    }
    return new LineString_default(
      this.flatCoordinates.slice(
        index === 0 ? 0 : this.ends_[index - 1],
        this.ends_[index]
      ),
      this.layout
    );
  }
  /**
   * Return the linestrings of this multilinestring.
   * @return {Array<LineString>} LineStrings.
   * @api
   */
  getLineStrings() {
    const flatCoordinates = this.flatCoordinates;
    const ends = this.ends_;
    const layout = this.layout;
    const lineStrings = [];
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const lineString = new LineString_default(
        flatCoordinates.slice(offset, end),
        layout
      );
      lineStrings.push(lineString);
      offset = end;
    }
    return lineStrings;
  }
  /**
   * @return {Array<number>} Flat midpoints.
   */
  getFlatMidpoints() {
    const midpoints = [];
    const flatCoordinates = this.flatCoordinates;
    let offset = 0;
    const ends = this.ends_;
    const stride = this.stride;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const midpoint = interpolatePoint(
        flatCoordinates,
        offset,
        end,
        stride,
        0.5
      );
      extend(midpoints, midpoint);
      offset = end;
    }
    return midpoints;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {MultiLineString} Simplified MultiLineString.
   * @protected
   */
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEnds = [];
    simplifiedFlatCoordinates.length = douglasPeuckerArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      squaredTolerance,
      simplifiedFlatCoordinates,
      0,
      simplifiedEnds
    );
    return new MultiLineString(simplifiedFlatCoordinates, "XY", simplifiedEnds);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "MultiLineString";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(extent) {
    return intersectsLineStringArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      extent
    );
  }
  /**
   * Set the coordinates of the multilinestring.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCoordinates(coordinates, layout) {
    this.setLayout(layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const ends = deflateCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
};
var MultiLineString_default = MultiLineString;

// node_modules/ol/geom/MultiPoint.js
var MultiPoint = class extends SimpleGeometry_default {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(coordinates, layout) {
    super();
    if (layout && !Array.isArray(coordinates[0])) {
      this.setFlatCoordinates(
        layout,
        /** @type {Array<number>} */
        coordinates
      );
    } else {
      this.setCoordinates(
        /** @type {Array<import("../coordinate.js").Coordinate>} */
        coordinates,
        layout
      );
    }
  }
  /**
   * Append the passed point to this multipoint.
   * @param {Point} point Point.
   * @api
   */
  appendPoint(point) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = point.getFlatCoordinates().slice();
    } else {
      extend(this.flatCoordinates, point.getFlatCoordinates());
    }
    this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPoint} Clone.
   * @api
   */
  clone() {
    const multiPoint = new MultiPoint(
      this.flatCoordinates.slice(),
      this.layout
    );
    multiPoint.applyProperties(this);
    return multiPoint;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    const flatCoordinates = this.flatCoordinates;
    const stride = this.stride;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const squaredDistance2 = squaredDistance(
        x,
        y,
        flatCoordinates[i],
        flatCoordinates[i + 1]
      );
      if (squaredDistance2 < minSquaredDistance) {
        minSquaredDistance = squaredDistance2;
        for (let j = 0; j < stride; ++j) {
          closestPoint[j] = flatCoordinates[i + j];
        }
        closestPoint.length = stride;
      }
    }
    return minSquaredDistance;
  }
  /**
   * Return the coordinates of the multipoint.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   */
  getCoordinates() {
    return inflateCoordinates(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the point at the specified index.
   * @param {number} index Index.
   * @return {Point} Point.
   * @api
   */
  getPoint(index) {
    const n = !this.flatCoordinates ? 0 : this.flatCoordinates.length / this.stride;
    if (index < 0 || n <= index) {
      return null;
    }
    return new Point_default(
      this.flatCoordinates.slice(
        index * this.stride,
        (index + 1) * this.stride
      ),
      this.layout
    );
  }
  /**
   * Return the points of this multipoint.
   * @return {Array<Point>} Points.
   * @api
   */
  getPoints() {
    const flatCoordinates = this.flatCoordinates;
    const layout = this.layout;
    const stride = this.stride;
    const points = [];
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const point = new Point_default(flatCoordinates.slice(i, i + stride), layout);
      points.push(point);
    }
    return points;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "MultiPoint";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(extent) {
    const flatCoordinates = this.flatCoordinates;
    const stride = this.stride;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const x = flatCoordinates[i];
      const y = flatCoordinates[i + 1];
      if (containsXY(extent, x, y)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Set the coordinates of the multipoint.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCoordinates(coordinates, layout) {
    this.setLayout(layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinates(
      this.flatCoordinates,
      0,
      coordinates,
      this.stride
    );
    this.changed();
  }
};
var MultiPoint_default = MultiPoint;

// node_modules/ol/geom/flat/center.js
function linearRingss2(flatCoordinates, offset, endss, stride) {
  const flatCenters = [];
  let extent = createEmpty();
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    extent = createOrUpdateFromFlatCoordinates(
      flatCoordinates,
      offset,
      ends[0],
      stride
    );
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
    offset = ends[ends.length - 1];
  }
  return flatCenters;
}

// node_modules/ol/geom/MultiPolygon.js
var MultiPolygon = class extends SimpleGeometry_default {
  /**
   * @param {Array<Array<Array<import("../coordinate.js").Coordinate>>|Polygon>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` and `endss` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<Array<number>>} [endss] Array of ends for internal use with flat coordinates.
   */
  constructor(coordinates, layout, endss) {
    super();
    this.endss_ = [];
    this.flatInteriorPointsRevision_ = -1;
    this.flatInteriorPoints_ = null;
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    this.orientedRevision_ = -1;
    this.orientedFlatCoordinates_ = null;
    if (!endss && !Array.isArray(coordinates[0])) {
      let thisLayout = this.getLayout();
      const polygons = (
        /** @type {Array<Polygon>} */
        coordinates
      );
      const flatCoordinates = [];
      const thisEndss = [];
      for (let i = 0, ii = polygons.length; i < ii; ++i) {
        const polygon = polygons[i];
        if (i === 0) {
          thisLayout = polygon.getLayout();
        }
        const offset = flatCoordinates.length;
        const ends = polygon.getEnds();
        for (let j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] += offset;
        }
        extend(flatCoordinates, polygon.getFlatCoordinates());
        thisEndss.push(ends);
      }
      layout = thisLayout;
      coordinates = flatCoordinates;
      endss = thisEndss;
    }
    if (layout !== void 0 && endss) {
      this.setFlatCoordinates(
        layout,
        /** @type {Array<number>} */
        coordinates
      );
      this.endss_ = endss;
    } else {
      this.setCoordinates(
        /** @type {Array<Array<Array<import("../coordinate.js").Coordinate>>>} */
        coordinates,
        layout
      );
    }
  }
  /**
   * Append the passed polygon to this multipolygon.
   * @param {Polygon} polygon Polygon.
   * @api
   */
  appendPolygon(polygon) {
    let ends;
    if (!this.flatCoordinates) {
      this.flatCoordinates = polygon.getFlatCoordinates().slice();
      ends = polygon.getEnds().slice();
      this.endss_.push();
    } else {
      const offset = this.flatCoordinates.length;
      extend(this.flatCoordinates, polygon.getFlatCoordinates());
      ends = polygon.getEnds().slice();
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] += offset;
      }
    }
    this.endss_.push(ends);
    this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPolygon} Clone.
   * @api
   */
  clone() {
    const len = this.endss_.length;
    const newEndss = new Array(len);
    for (let i = 0; i < len; ++i) {
      newEndss[i] = this.endss_[i].slice();
    }
    const multiPolygon = new MultiPolygon(
      this.flatCoordinates.slice(),
      this.layout,
      newEndss
    );
    multiPolygon.applyProperties(this);
    return multiPolygon;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        multiArrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.endss_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestMultiArrayPoint(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      this.maxDelta_,
      true,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(x, y) {
    return linearRingssContainsXY(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      x,
      y
    );
  }
  /**
   * Return the area of the multipolygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return linearRingss(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for multi-polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<Array<import("../coordinate.js").Coordinate>>>} Coordinates.
   * @api
   */
  getCoordinates(right) {
    let flatCoordinates;
    if (right !== void 0) {
      flatCoordinates = this.getOrientedFlatCoordinates().slice();
      orientLinearRingsArray(
        flatCoordinates,
        0,
        this.endss_,
        this.stride,
        right
      );
    } else {
      flatCoordinates = this.flatCoordinates;
    }
    return inflateMultiCoordinatesArray(
      flatCoordinates,
      0,
      this.endss_,
      this.stride
    );
  }
  /**
   * @return {Array<Array<number>>} Endss.
   */
  getEndss() {
    return this.endss_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoints() {
    if (this.flatInteriorPointsRevision_ != this.getRevision()) {
      const flatCenters = linearRingss2(
        this.flatCoordinates,
        0,
        this.endss_,
        this.stride
      );
      this.flatInteriorPoints_ = getInteriorPointsOfMultiArray(
        this.getOrientedFlatCoordinates(),
        0,
        this.endss_,
        this.stride,
        flatCenters
      );
      this.flatInteriorPointsRevision_ = this.getRevision();
    }
    return this.flatInteriorPoints_;
  }
  /**
   * Return the interior points as {@link module:ol/geom/MultiPoint~MultiPoint multipoint}.
   * @return {MultiPoint} Interior points as XYM coordinates, where M is
   * the length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoints() {
    return new MultiPoint_default(this.getFlatInteriorPoints().slice(), "XYM");
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const flatCoordinates = this.flatCoordinates;
      if (linearRingssAreOriented(flatCoordinates, 0, this.endss_, this.stride)) {
        this.orientedFlatCoordinates_ = flatCoordinates;
      } else {
        this.orientedFlatCoordinates_ = flatCoordinates.slice();
        this.orientedFlatCoordinates_.length = orientLinearRingsArray(
          this.orientedFlatCoordinates_,
          0,
          this.endss_,
          this.stride
        );
      }
      this.orientedRevision_ = this.getRevision();
    }
    return this.orientedFlatCoordinates_;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {MultiPolygon} Simplified MultiPolygon.
   * @protected
   */
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEndss = [];
    simplifiedFlatCoordinates.length = quantizeMultiArray(
      this.flatCoordinates,
      0,
      this.endss_,
      this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates,
      0,
      simplifiedEndss
    );
    return new MultiPolygon(simplifiedFlatCoordinates, "XY", simplifiedEndss);
  }
  /**
   * Return the polygon at the specified index.
   * @param {number} index Index.
   * @return {Polygon} Polygon.
   * @api
   */
  getPolygon(index) {
    if (index < 0 || this.endss_.length <= index) {
      return null;
    }
    let offset;
    if (index === 0) {
      offset = 0;
    } else {
      const prevEnds = this.endss_[index - 1];
      offset = prevEnds[prevEnds.length - 1];
    }
    const ends = this.endss_[index].slice();
    const end = ends[ends.length - 1];
    if (offset !== 0) {
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] -= offset;
      }
    }
    return new Polygon_default(
      this.flatCoordinates.slice(offset, end),
      this.layout,
      ends
    );
  }
  /**
   * Return the polygons of this multipolygon.
   * @return {Array<Polygon>} Polygons.
   * @api
   */
  getPolygons() {
    const layout = this.layout;
    const flatCoordinates = this.flatCoordinates;
    const endss = this.endss_;
    const polygons = [];
    let offset = 0;
    for (let i = 0, ii = endss.length; i < ii; ++i) {
      const ends = endss[i].slice();
      const end = ends[ends.length - 1];
      if (offset !== 0) {
        for (let j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] -= offset;
        }
      }
      const polygon = new Polygon_default(
        flatCoordinates.slice(offset, end),
        layout,
        ends
      );
      polygons.push(polygon);
      offset = end;
    }
    return polygons;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "MultiPolygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(extent) {
    return intersectsLinearRingMultiArray(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      extent
    );
  }
  /**
   * Set the coordinates of the multipolygon.
   * @param {!Array<Array<Array<import("../coordinate.js").Coordinate>>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCoordinates(coordinates, layout) {
    this.setLayout(layout, coordinates, 3);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const endss = deflateMultiCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates,
      this.stride,
      this.endss_
    );
    if (endss.length === 0) {
      this.flatCoordinates.length = 0;
    } else {
      const lastEnds = endss[endss.length - 1];
      this.flatCoordinates.length = lastEnds.length === 0 ? 0 : lastEnds[lastEnds.length - 1];
    }
    this.changed();
  }
};
var MultiPolygon_default = MultiPolygon;

// node_modules/ol/format/Feature.js
var FeatureFormat = class {
  constructor() {
    this.dataProjection = void 0;
    this.defaultFeatureProjection = void 0;
    this.supportedMediaTypes = null;
  }
  /**
   * Adds the data projection to the read options.
   * @param {Document|Element|Object|string} source Source.
   * @param {ReadOptions} [options] Options.
   * @return {ReadOptions|undefined} Options.
   * @protected
   */
  getReadOptions(source, options) {
    if (options) {
      let dataProjection = options.dataProjection ? get(options.dataProjection) : this.readProjection(source);
      if (options.extent && dataProjection && dataProjection.getUnits() === "tile-pixels") {
        dataProjection = get(dataProjection);
        dataProjection.setWorldExtent(options.extent);
      }
      options = {
        dataProjection,
        featureProjection: options.featureProjection
      };
    }
    return this.adaptOptions(options);
  }
  /**
   * Sets the `dataProjection` on the options, if no `dataProjection`
   * is set.
   * @param {WriteOptions|ReadOptions|undefined} options
   *     Options.
   * @protected
   * @return {WriteOptions|ReadOptions|undefined}
   *     Updated options.
   */
  adaptOptions(options) {
    return Object.assign(
      {
        dataProjection: this.dataProjection,
        featureProjection: this.defaultFeatureProjection
      },
      options
    );
  }
  /**
   * @abstract
   * @return {Type} The format type.
   */
  getType() {
    return abstract();
  }
  /**
   * Read a single feature from a source.
   *
   * @abstract
   * @param {Document|Element|Object|string} source Source.
   * @param {ReadOptions} [options] Read options.
   * @return {import("../Feature.js").FeatureLike} Feature.
   */
  readFeature(source, options) {
    return abstract();
  }
  /**
   * Read all features from a source.
   *
   * @abstract
   * @param {Document|Element|ArrayBuffer|Object|string} source Source.
   * @param {ReadOptions} [options] Read options.
   * @return {Array<import("../Feature.js").FeatureLike>} Features.
   */
  readFeatures(source, options) {
    return abstract();
  }
  /**
   * Read a single geometry from a source.
   *
   * @abstract
   * @param {Document|Element|Object|string} source Source.
   * @param {ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometry(source, options) {
    return abstract();
  }
  /**
   * Read the projection from a source.
   *
   * @abstract
   * @param {Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default|undefined} Projection.
   */
  readProjection(source) {
    return abstract();
  }
  /**
   * Encode a feature in this format.
   *
   * @abstract
   * @param {import("../Feature.js").default} feature Feature.
   * @param {WriteOptions} [options] Write options.
   * @return {string|ArrayBuffer} Result.
   */
  writeFeature(feature, options) {
    return abstract();
  }
  /**
   * Encode an array of features in this format.
   *
   * @abstract
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {WriteOptions} [options] Write options.
   * @return {string|ArrayBuffer} Result.
   */
  writeFeatures(features, options) {
    return abstract();
  }
  /**
   * Write a single geometry in this format.
   *
   * @abstract
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {WriteOptions} [options] Write options.
   * @return {string|ArrayBuffer} Result.
   */
  writeGeometry(geometry, options) {
    return abstract();
  }
};
var Feature_default2 = FeatureFormat;
function transformGeometryWithOptions(geometry, write, options) {
  const featureProjection = options ? get(options.featureProjection) : null;
  const dataProjection = options ? get(options.dataProjection) : null;
  let transformed;
  if (featureProjection && dataProjection && !equivalent(featureProjection, dataProjection)) {
    transformed = (write ? geometry.clone() : geometry).transform(
      write ? featureProjection : dataProjection,
      write ? dataProjection : featureProjection
    );
  } else {
    transformed = geometry;
  }
  if (write && options && /** @type {WriteOptions} */
  options.decimals !== void 0) {
    const power = Math.pow(
      10,
      /** @type {WriteOptions} */
      options.decimals
    );
    const transform = function(coordinates) {
      for (let i = 0, ii = coordinates.length; i < ii; ++i) {
        coordinates[i] = Math.round(coordinates[i] * power) / power;
      }
      return coordinates;
    };
    if (transformed === geometry) {
      transformed = geometry.clone();
    }
    transformed.applyTransform(transform);
  }
  return transformed;
}

// node_modules/ol/xml.js
var XML_SCHEMA_INSTANCE_URI = "http://www.w3.org/2001/XMLSchema-instance";
function createElementNS(namespaceURI, qualifiedName) {
  return getDocument().createElementNS(namespaceURI, qualifiedName);
}
function getAllTextContent(node, normalizeWhitespace) {
  return getAllTextContent_(node, normalizeWhitespace, []).join("");
}
function getAllTextContent_(node, normalizeWhitespace, accumulator) {
  if (node.nodeType == Node.CDATA_SECTION_NODE || node.nodeType == Node.TEXT_NODE) {
    if (normalizeWhitespace) {
      accumulator.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""));
    } else {
      accumulator.push(node.nodeValue);
    }
  } else {
    let n;
    for (n = node.firstChild; n; n = n.nextSibling) {
      getAllTextContent_(n, normalizeWhitespace, accumulator);
    }
  }
  return accumulator;
}
function isDocument(object) {
  return "documentElement" in object;
}
function parse(xml) {
  return new DOMParser().parseFromString(xml, "application/xml");
}
function makeArrayExtender(valueReader, thisArg) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      const value = valueReader.call(
        thisArg !== void 0 ? thisArg : this,
        node,
        objectStack
      );
      if (value !== void 0) {
        const array = (
          /** @type {Array<*>} */
          objectStack[objectStack.length - 1]
        );
        extend(array, value);
      }
    }
  );
}
function makeArrayPusher(valueReader, thisArg) {
  return (
    /**
     * @param {Element} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      const value = valueReader.call(
        thisArg !== void 0 ? thisArg : this,
        node,
        objectStack
      );
      if (value !== void 0) {
        const array = (
          /** @type {Array<*>} */
          objectStack[objectStack.length - 1]
        );
        array.push(value);
      }
    }
  );
}
function makeReplacer(valueReader, thisArg) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      const value = valueReader.call(
        thisArg !== void 0 ? thisArg : this,
        node,
        objectStack
      );
      if (value !== void 0) {
        objectStack[objectStack.length - 1] = value;
      }
    }
  );
}
function makeObjectPropertySetter(valueReader, property, thisArg) {
  return (
    /**
     * @param {Element} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function(node, objectStack) {
      const value = valueReader.call(
        thisArg !== void 0 ? thisArg : this,
        node,
        objectStack
      );
      if (value !== void 0) {
        const object = (
          /** @type {!Object} */
          objectStack[objectStack.length - 1]
        );
        const name = property !== void 0 ? property : node.localName;
        object[name] = value;
      }
    }
  );
}
function makeChildAppender(nodeWriter, thisArg) {
  return function(node, value, objectStack) {
    nodeWriter.call(
      thisArg !== void 0 ? thisArg : this,
      node,
      value,
      objectStack
    );
    const parent = (
      /** @type {NodeStackItem} */
      objectStack[objectStack.length - 1]
    );
    const parentNode = parent.node;
    parentNode.appendChild(node);
  };
}
function makeSimpleNodeFactory(fixedNodeName, fixedNamespaceURI) {
  return (
    /**
     * @param {*} value Value.
     * @param {Array<*>} objectStack Object stack.
     * @param {string} [newNodeName] Node name.
     * @return {Node} Node.
     */
    function(value, objectStack, newNodeName) {
      const context = (
        /** @type {NodeStackItem} */
        objectStack[objectStack.length - 1]
      );
      const node = context.node;
      let nodeName = fixedNodeName;
      if (nodeName === void 0) {
        nodeName = newNodeName;
      }
      const namespaceURI = fixedNamespaceURI !== void 0 ? fixedNamespaceURI : node.namespaceURI;
      return createElementNS(
        namespaceURI,
        /** @type {string} */
        nodeName
      );
    }
  );
}
var OBJECT_PROPERTY_NODE_FACTORY = makeSimpleNodeFactory();
function makeSequence(object, orderedKeys) {
  const length = orderedKeys.length;
  const sequence = new Array(length);
  for (let i = 0; i < length; ++i) {
    sequence[i] = object[orderedKeys[i]];
  }
  return sequence;
}
function makeStructureNS(namespaceURIs, structure, structureNS) {
  structureNS = structureNS !== void 0 ? structureNS : {};
  let i, ii;
  for (i = 0, ii = namespaceURIs.length; i < ii; ++i) {
    structureNS[namespaceURIs[i]] = structure;
  }
  return structureNS;
}
function parseNode(parsersNS, node, objectStack, thisArg) {
  let n;
  for (n = node.firstElementChild; n; n = n.nextElementSibling) {
    const parsers = parsersNS[n.namespaceURI];
    if (parsers !== void 0) {
      const parser = parsers[n.localName];
      if (parser !== void 0) {
        parser.call(thisArg, n, objectStack);
      }
    }
  }
}
function pushParseAndPop(object, parsersNS, node, objectStack, thisArg) {
  objectStack.push(object);
  parseNode(parsersNS, node, objectStack, thisArg);
  return (
    /** @type {T} */
    objectStack.pop()
  );
}
function serialize(serializersNS, nodeFactory, values, objectStack, keys, thisArg) {
  const length = (keys !== void 0 ? keys : values).length;
  let value, node;
  for (let i = 0; i < length; ++i) {
    value = values[i];
    if (value !== void 0) {
      node = nodeFactory.call(
        thisArg !== void 0 ? thisArg : this,
        value,
        objectStack,
        keys !== void 0 ? keys[i] : void 0
      );
      if (node !== void 0) {
        serializersNS[node.namespaceURI][node.localName].call(
          thisArg,
          node,
          value,
          objectStack
        );
      }
    }
  }
}
function pushSerializeAndPop(object, serializersNS, nodeFactory, values, objectStack, keys, thisArg) {
  objectStack.push(object);
  serialize(serializersNS, nodeFactory, values, objectStack, keys, thisArg);
  return (
    /** @type {O|undefined} */
    objectStack.pop()
  );
}
var xmlSerializer_ = void 0;
function getXMLSerializer() {
  if (xmlSerializer_ === void 0 && typeof XMLSerializer !== "undefined") {
    xmlSerializer_ = new XMLSerializer();
  }
  return xmlSerializer_;
}
var document_ = void 0;
function getDocument() {
  if (document_ === void 0 && typeof document !== "undefined") {
    document_ = document.implementation.createDocument("", "", null);
  }
  return document_;
}

// node_modules/ol/format/XMLFeature.js
var XMLFeature = class extends Feature_default2 {
  constructor() {
    super();
    this.xmlSerializer_ = getXMLSerializer();
  }
  /**
   * @return {import("./Feature.js").Type} Format.
   */
  getType() {
    return "xml";
  }
  /**
   * Read a single feature.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../Feature.js").default} Feature.
   * @api
   */
  readFeature(source, options) {
    if (!source) {
      return null;
    }
    if (typeof source === "string") {
      const doc = parse(source);
      return this.readFeatureFromDocument(doc, options);
    }
    if (isDocument(source)) {
      return this.readFeatureFromDocument(
        /** @type {Document} */
        source,
        options
      );
    }
    return this.readFeatureFromNode(
      /** @type {Element} */
      source,
      options
    );
  }
  /**
   * @param {Document} doc Document.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromDocument(doc, options) {
    const features = this.readFeaturesFromDocument(doc, options);
    if (features.length > 0) {
      return features[0];
    }
    return null;
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromNode(node, options) {
    return null;
  }
  /**
   * Read all features from a feature collection.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @api
   */
  readFeatures(source, options) {
    if (!source) {
      return [];
    }
    if (typeof source === "string") {
      const doc = parse(source);
      return this.readFeaturesFromDocument(doc, options);
    }
    if (isDocument(source)) {
      return this.readFeaturesFromDocument(
        /** @type {Document} */
        source,
        options
      );
    }
    return this.readFeaturesFromNode(
      /** @type {Element} */
      source,
      options
    );
  }
  /**
   * @param {Document} doc Document.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromDocument(doc, options) {
    const features = [];
    for (let n = doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        extend(
          features,
          this.readFeaturesFromNode(
            /** @type {Element} */
            n,
            options
          )
        );
      }
    }
    return features;
  }
  /**
   * @abstract
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromNode(node, options) {
    return abstract();
  }
  /**
   * Read a single geometry from a source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometry(source, options) {
    if (!source) {
      return null;
    }
    if (typeof source === "string") {
      const doc = parse(source);
      return this.readGeometryFromDocument(doc, options);
    }
    if (isDocument(source)) {
      return this.readGeometryFromDocument(
        /** @type {Document} */
        source,
        options
      );
    }
    return this.readGeometryFromNode(
      /** @type {Element} */
      source,
      options
    );
  }
  /**
   * @param {Document} doc Document.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromDocument(doc, options) {
    return null;
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromNode(node, options) {
    return null;
  }
  /**
   * Read the projection from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default} Projection.
   * @api
   */
  readProjection(source) {
    if (!source) {
      return null;
    }
    if (typeof source === "string") {
      const doc = parse(source);
      return this.readProjectionFromDocument(doc);
    }
    if (isDocument(source)) {
      return this.readProjectionFromDocument(
        /** @type {Document} */
        source
      );
    }
    return this.readProjectionFromNode(
      /** @type {Element} */
      source
    );
  }
  /**
   * @param {Document} doc Document.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   */
  readProjectionFromDocument(doc) {
    return this.dataProjection;
  }
  /**
   * @param {Element} node Node.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   */
  readProjectionFromNode(node) {
    return this.dataProjection;
  }
  /**
   * Encode a feature as string.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded feature.
   */
  writeFeature(feature, options) {
    const node = this.writeFeatureNode(feature, options);
    return this.xmlSerializer_.serializeToString(node);
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @protected
   * @return {Node} Node.
   */
  writeFeatureNode(feature, options) {
    return null;
  }
  /**
   * Encode an array of features as string.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Result.
   * @api
   */
  writeFeatures(features, options) {
    const node = this.writeFeaturesNode(features, options);
    return this.xmlSerializer_.serializeToString(node);
  }
  /**
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Node} Node.
   */
  writeFeaturesNode(features, options) {
    return null;
  }
  /**
   * Encode a geometry as string.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded geometry.
   */
  writeGeometry(geometry, options) {
    const node = this.writeGeometryNode(geometry, options);
    return this.xmlSerializer_.serializeToString(node);
  }
  /**
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Node} Node.
   */
  writeGeometryNode(geometry, options) {
    return null;
  }
};
var XMLFeature_default = XMLFeature;

// node_modules/ol/format/xsd.js
function readBoolean(node) {
  const s = getAllTextContent(node, false);
  return readBooleanString(s);
}
function readBooleanString(string) {
  const m = /^\s*(true|1)|(false|0)\s*$/.exec(string);
  if (m) {
    return m[1] !== void 0 || false;
  }
  return void 0;
}
function readDecimal(node) {
  const s = getAllTextContent(node, false);
  return readDecimalString(s);
}
function readDecimalString(string) {
  const m = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(string);
  if (m) {
    return parseFloat(m[1]);
  }
  return void 0;
}
function readString(node) {
  return getAllTextContent(node, false).trim();
}
function writeBooleanTextNode(node, bool) {
  writeStringTextNode(node, bool ? "1" : "0");
}
function writeCDATASection(node, string) {
  node.appendChild(getDocument().createCDATASection(string));
}
function writeDecimalTextNode(node, decimal) {
  const string = decimal.toPrecision();
  node.appendChild(getDocument().createTextNode(string));
}
function writeStringTextNode(node, string) {
  node.appendChild(getDocument().createTextNode(string));
}

// node_modules/ol/format/KML.js
var GX_NAMESPACE_URIS = ["http://www.google.com/kml/ext/2.2"];
var NAMESPACE_URIS = [
  null,
  "http://earth.google.com/kml/2.0",
  "http://earth.google.com/kml/2.1",
  "http://earth.google.com/kml/2.2",
  "http://www.opengis.net/kml/2.2"
];
var SCHEMA_LOCATION = "http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd";
var ICON_ANCHOR_UNITS_MAP = {
  "fraction": "fraction",
  "pixels": "pixels",
  "insetPixels": "pixels"
};
var PLACEMARK_PARSERS = makeStructureNS(
  NAMESPACE_URIS,
  {
    "ExtendedData": extendedDataParser,
    "Region": regionParser,
    "MultiGeometry": makeObjectPropertySetter(readMultiGeometry, "geometry"),
    "LineString": makeObjectPropertySetter(readLineString, "geometry"),
    "LinearRing": makeObjectPropertySetter(readLinearRing, "geometry"),
    "Point": makeObjectPropertySetter(readPoint, "geometry"),
    "Polygon": makeObjectPropertySetter(readPolygon, "geometry"),
    "Style": makeObjectPropertySetter(readStyle),
    "StyleMap": placemarkStyleMapParser,
    "address": makeObjectPropertySetter(readString),
    "description": makeObjectPropertySetter(readString),
    "name": makeObjectPropertySetter(readString),
    "open": makeObjectPropertySetter(readBoolean),
    "phoneNumber": makeObjectPropertySetter(readString),
    "styleUrl": makeObjectPropertySetter(readStyleURL),
    "visibility": makeObjectPropertySetter(readBoolean)
  },
  makeStructureNS(GX_NAMESPACE_URIS, {
    "MultiTrack": makeObjectPropertySetter(readGxMultiTrack, "geometry"),
    "Track": makeObjectPropertySetter(readGxTrack, "geometry")
  })
);
var NETWORK_LINK_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "ExtendedData": extendedDataParser,
  "Region": regionParser,
  "Link": linkParser,
  "address": makeObjectPropertySetter(readString),
  "description": makeObjectPropertySetter(readString),
  "name": makeObjectPropertySetter(readString),
  "open": makeObjectPropertySetter(readBoolean),
  "phoneNumber": makeObjectPropertySetter(readString),
  "visibility": makeObjectPropertySetter(readBoolean)
});
var LINK_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "href": makeObjectPropertySetter(readURI)
});
var CAMERA_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  Altitude: makeObjectPropertySetter(readDecimal),
  Longitude: makeObjectPropertySetter(readDecimal),
  Latitude: makeObjectPropertySetter(readDecimal),
  Tilt: makeObjectPropertySetter(readDecimal),
  AltitudeMode: makeObjectPropertySetter(readString),
  Heading: makeObjectPropertySetter(readDecimal),
  Roll: makeObjectPropertySetter(readDecimal)
});
var REGION_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "LatLonAltBox": latLonAltBoxParser,
  "Lod": lodParser
});
var KML_SEQUENCE = makeStructureNS(NAMESPACE_URIS, ["Document", "Placemark"]);
var KML_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "Document": makeChildAppender(writeDocument),
  "Placemark": makeChildAppender(writePlacemark)
});
var DEFAULT_COLOR;
var DEFAULT_FILL_STYLE = null;
function getDefaultFillStyle() {
  return DEFAULT_FILL_STYLE;
}
var DEFAULT_IMAGE_STYLE_ANCHOR;
var DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS;
var DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS;
var DEFAULT_IMAGE_STYLE_SIZE;
var DEFAULT_IMAGE_STYLE_SRC;
var DEFAULT_IMAGE_STYLE = null;
function getDefaultImageStyle() {
  return DEFAULT_IMAGE_STYLE;
}
var DEFAULT_NO_IMAGE_STYLE;
var DEFAULT_STROKE_STYLE = null;
function getDefaultStrokeStyle() {
  return DEFAULT_STROKE_STYLE;
}
var DEFAULT_TEXT_STROKE_STYLE;
var DEFAULT_TEXT_STYLE = null;
function getDefaultTextStyle() {
  return DEFAULT_TEXT_STYLE;
}
var DEFAULT_STYLE = null;
function getDefaultStyle() {
  return DEFAULT_STYLE;
}
var DEFAULT_STYLE_ARRAY = null;
function getDefaultStyleArray() {
  return DEFAULT_STYLE_ARRAY;
}
function scaleForSize(size) {
  return 32 / Math.min(size[0], size[1]);
}
function createStyleDefaults() {
  DEFAULT_COLOR = [255, 255, 255, 1];
  DEFAULT_FILL_STYLE = new Fill_default({
    color: DEFAULT_COLOR
  });
  DEFAULT_IMAGE_STYLE_ANCHOR = [20, 2];
  DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS = "pixels";
  DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS = "pixels";
  DEFAULT_IMAGE_STYLE_SIZE = [64, 64];
  DEFAULT_IMAGE_STYLE_SRC = "https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png";
  DEFAULT_IMAGE_STYLE = new Icon_default({
    anchor: DEFAULT_IMAGE_STYLE_ANCHOR,
    anchorOrigin: "bottom-left",
    anchorXUnits: DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS,
    anchorYUnits: DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS,
    crossOrigin: "anonymous",
    rotation: 0,
    scale: scaleForSize(DEFAULT_IMAGE_STYLE_SIZE),
    size: DEFAULT_IMAGE_STYLE_SIZE,
    src: DEFAULT_IMAGE_STYLE_SRC
  });
  DEFAULT_NO_IMAGE_STYLE = "NO_IMAGE";
  DEFAULT_STROKE_STYLE = new Stroke_default({
    color: DEFAULT_COLOR,
    width: 1
  });
  DEFAULT_TEXT_STROKE_STYLE = new Stroke_default({
    color: [51, 51, 51, 1],
    width: 2
  });
  DEFAULT_TEXT_STYLE = new Text_default({
    font: "bold 16px Helvetica",
    fill: DEFAULT_FILL_STYLE,
    stroke: DEFAULT_TEXT_STROKE_STYLE,
    scale: 0.8
  });
  DEFAULT_STYLE = new Style_default({
    fill: DEFAULT_FILL_STYLE,
    image: DEFAULT_IMAGE_STYLE,
    text: DEFAULT_TEXT_STYLE,
    stroke: DEFAULT_STROKE_STYLE,
    zIndex: 0
  });
  DEFAULT_STYLE_ARRAY = [DEFAULT_STYLE];
}
var TEXTAREA;
function defaultIconUrlFunction(href) {
  return href;
}
var KML = class extends XMLFeature_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    super();
    options = options ? options : {};
    if (!DEFAULT_STYLE_ARRAY) {
      createStyleDefaults();
    }
    this.dataProjection = get("EPSG:4326");
    this.defaultStyle_ = options.defaultStyle ? options.defaultStyle : DEFAULT_STYLE_ARRAY;
    this.extractStyles_ = options.extractStyles !== void 0 ? options.extractStyles : true;
    this.writeStyles_ = options.writeStyles !== void 0 ? options.writeStyles : true;
    this.sharedStyles_ = {};
    this.showPointNames_ = options.showPointNames !== void 0 ? options.showPointNames : true;
    this.crossOrigin_ = options.crossOrigin !== void 0 ? options.crossOrigin : "anonymous";
    this.iconUrlFunction_ = options.iconUrlFunction ? options.iconUrlFunction : defaultIconUrlFunction;
    this.supportedMediaTypes = ["application/vnd.google-earth.kml+xml"];
  }
  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<Feature>|undefined} Features.
   */
  readDocumentOrFolder_(node, objectStack) {
    const parsersNS = makeStructureNS(NAMESPACE_URIS, {
      "Document": makeArrayExtender(this.readDocumentOrFolder_, this),
      "Folder": makeArrayExtender(this.readDocumentOrFolder_, this),
      "Placemark": makeArrayPusher(this.readPlacemark_, this),
      "Style": this.readSharedStyle_.bind(this),
      "StyleMap": this.readSharedStyleMap_.bind(this)
    });
    const features = pushParseAndPop([], parsersNS, node, objectStack, this);
    if (features) {
      return features;
    }
    return void 0;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Feature|undefined} Feature.
   */
  readPlacemark_(node, objectStack) {
    const object = pushParseAndPop(
      { "geometry": null },
      PLACEMARK_PARSERS,
      node,
      objectStack,
      this
    );
    if (!object) {
      return void 0;
    }
    const feature = new Feature_default();
    const id = node.getAttribute("id");
    if (id !== null) {
      feature.setId(id);
    }
    const options = (
      /** @type {import("./Feature.js").ReadOptions} */
      objectStack[0]
    );
    const geometry = object["geometry"];
    if (geometry) {
      transformGeometryWithOptions(geometry, false, options);
    }
    feature.setGeometry(geometry);
    delete object["geometry"];
    if (this.extractStyles_) {
      const style = object["Style"];
      const styleUrl = object["styleUrl"];
      const styleFunction = createFeatureStyleFunction(
        style,
        styleUrl,
        this.defaultStyle_,
        this.sharedStyles_,
        this.showPointNames_
      );
      feature.setStyle(styleFunction);
    }
    delete object["Style"];
    feature.setProperties(object, true);
    return feature;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  readSharedStyle_(node, objectStack) {
    const id = node.getAttribute("id");
    if (id !== null) {
      const style = readStyle.call(this, node, objectStack);
      if (style) {
        let styleUri;
        let baseURI = node.baseURI;
        if (!baseURI || baseURI == "about:blank") {
          baseURI = window.location.href;
        }
        if (baseURI) {
          const url = new URL("#" + id, baseURI);
          styleUri = url.href;
        } else {
          styleUri = "#" + id;
        }
        this.sharedStyles_[styleUri] = style;
      }
    }
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  readSharedStyleMap_(node, objectStack) {
    const id = node.getAttribute("id");
    if (id === null) {
      return;
    }
    const styleMapValue = readStyleMapValue.call(this, node, objectStack);
    if (!styleMapValue) {
      return;
    }
    let styleUri;
    let baseURI = node.baseURI;
    if (!baseURI || baseURI == "about:blank") {
      baseURI = window.location.href;
    }
    if (baseURI) {
      const url = new URL("#" + id, baseURI);
      styleUri = url.href;
    } else {
      styleUri = "#" + id;
    }
    this.sharedStyles_[styleUri] = styleMapValue;
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromNode(node, options) {
    if (!NAMESPACE_URIS.includes(node.namespaceURI)) {
      return null;
    }
    const feature = this.readPlacemark_(node, [
      this.getReadOptions(node, options)
    ]);
    if (feature) {
      return feature;
    }
    return null;
  }
  /**
   * @protected
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromNode(node, options) {
    if (!NAMESPACE_URIS.includes(node.namespaceURI)) {
      return [];
    }
    let features;
    const localName = node.localName;
    if (localName == "Document" || localName == "Folder") {
      features = this.readDocumentOrFolder_(node, [
        this.getReadOptions(node, options)
      ]);
      if (features) {
        return features;
      }
      return [];
    }
    if (localName == "Placemark") {
      const feature = this.readPlacemark_(node, [
        this.getReadOptions(node, options)
      ]);
      if (feature) {
        return [feature];
      }
      return [];
    }
    if (localName == "kml") {
      features = [];
      for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
        const fs = this.readFeaturesFromNode(n, options);
        if (fs) {
          extend(features, fs);
        }
      }
      return features;
    }
    return [];
  }
  /**
   * Read the name of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {string|undefined} Name.
   * @api
   */
  readName(source) {
    if (!source) {
      return void 0;
    }
    if (typeof source === "string") {
      const doc = parse(source);
      return this.readNameFromDocument(doc);
    }
    if (isDocument(source)) {
      return this.readNameFromDocument(
        /** @type {Document} */
        source
      );
    }
    return this.readNameFromNode(
      /** @type {Element} */
      source
    );
  }
  /**
   * @param {Document} doc Document.
   * @return {string|undefined} Name.
   */
  readNameFromDocument(doc) {
    for (let n = (
      /** @type {Node} */
      doc.firstChild
    ); n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        const name = this.readNameFromNode(
          /** @type {Element} */
          n
        );
        if (name) {
          return name;
        }
      }
    }
    return void 0;
  }
  /**
   * @param {Element} node Node.
   * @return {string|undefined} Name.
   */
  readNameFromNode(node) {
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      if (NAMESPACE_URIS.includes(n.namespaceURI) && n.localName == "name") {
        return readString(n);
      }
    }
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      const localName = n.localName;
      if (NAMESPACE_URIS.includes(n.namespaceURI) && (localName == "Document" || localName == "Folder" || localName == "Placemark" || localName == "kml")) {
        const name = this.readNameFromNode(n);
        if (name) {
          return name;
        }
      }
    }
    return void 0;
  }
  /**
   * Read the network links of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {Array<Object>} Network links.
   * @api
   */
  readNetworkLinks(source) {
    const networkLinks = [];
    if (typeof source === "string") {
      const doc = parse(source);
      extend(networkLinks, this.readNetworkLinksFromDocument(doc));
    } else if (isDocument(source)) {
      extend(
        networkLinks,
        this.readNetworkLinksFromDocument(
          /** @type {Document} */
          source
        )
      );
    } else {
      extend(
        networkLinks,
        this.readNetworkLinksFromNode(
          /** @type {Element} */
          source
        )
      );
    }
    return networkLinks;
  }
  /**
   * @param {Document} doc Document.
   * @return {Array<Object>} Network links.
   */
  readNetworkLinksFromDocument(doc) {
    const networkLinks = [];
    for (let n = (
      /** @type {Node} */
      doc.firstChild
    ); n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        extend(
          networkLinks,
          this.readNetworkLinksFromNode(
            /** @type {Element} */
            n
          )
        );
      }
    }
    return networkLinks;
  }
  /**
   * @param {Element} node Node.
   * @return {Array<Object>} Network links.
   */
  readNetworkLinksFromNode(node) {
    const networkLinks = [];
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      if (NAMESPACE_URIS.includes(n.namespaceURI) && n.localName == "NetworkLink") {
        const obj = pushParseAndPop({}, NETWORK_LINK_PARSERS, n, []);
        networkLinks.push(obj);
      }
    }
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      const localName = n.localName;
      if (NAMESPACE_URIS.includes(n.namespaceURI) && (localName == "Document" || localName == "Folder" || localName == "kml")) {
        extend(networkLinks, this.readNetworkLinksFromNode(n));
      }
    }
    return networkLinks;
  }
  /**
   * Read the regions of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {Array<Object>} Regions.
   * @api
   */
  readRegion(source) {
    const regions = [];
    if (typeof source === "string") {
      const doc = parse(source);
      extend(regions, this.readRegionFromDocument(doc));
    } else if (isDocument(source)) {
      extend(
        regions,
        this.readRegionFromDocument(
          /** @type {Document} */
          source
        )
      );
    } else {
      extend(regions, this.readRegionFromNode(
        /** @type {Element} */
        source
      ));
    }
    return regions;
  }
  /**
   * @param {Document} doc Document.
   * @return {Array<Object>} Region.
   */
  readRegionFromDocument(doc) {
    const regions = [];
    for (let n = (
      /** @type {Node} */
      doc.firstChild
    ); n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        extend(regions, this.readRegionFromNode(
          /** @type {Element} */
          n
        ));
      }
    }
    return regions;
  }
  /**
   * @param {Element} node Node.
   * @return {Array<Object>} Region.
   * @api
   */
  readRegionFromNode(node) {
    const regions = [];
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      if (NAMESPACE_URIS.includes(n.namespaceURI) && n.localName == "Region") {
        const obj = pushParseAndPop({}, REGION_PARSERS, n, []);
        regions.push(obj);
      }
    }
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      const localName = n.localName;
      if (NAMESPACE_URIS.includes(n.namespaceURI) && (localName == "Document" || localName == "Folder" || localName == "kml")) {
        extend(regions, this.readRegionFromNode(n));
      }
    }
    return regions;
  }
  /**
   * @typedef {Object} KMLCamera Specifies the observer's viewpoint and associated view parameters.
   * @property {number} [Latitude] Latitude of the camera.
   * @property {number} [Longitude] Longitude of the camera.
   * @property {number} [Altitude] Altitude of the camera.
   * @property {string} [AltitudeMode] Floor-related altitude mode.
   * @property {number} [Heading] Horizontal camera rotation.
   * @property {number} [Tilt] Lateral camera rotation.
   * @property {number} [Roll] Vertical camera rotation.
   */
  /**
   * Read the cameras of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {Array<KMLCamera>} Cameras.
   * @api
   */
  readCamera(source) {
    const cameras = [];
    if (typeof source === "string") {
      const doc = parse(source);
      extend(cameras, this.readCameraFromDocument(doc));
    } else if (isDocument(source)) {
      extend(
        cameras,
        this.readCameraFromDocument(
          /** @type {Document} */
          source
        )
      );
    } else {
      extend(cameras, this.readCameraFromNode(
        /** @type {Element} */
        source
      ));
    }
    return cameras;
  }
  /**
   * @param {Document} doc Document.
   * @return {Array<KMLCamera>} Cameras.
   */
  readCameraFromDocument(doc) {
    const cameras = [];
    for (let n = (
      /** @type {Node} */
      doc.firstChild
    ); n; n = n.nextSibling) {
      if (n.nodeType === Node.ELEMENT_NODE) {
        extend(cameras, this.readCameraFromNode(
          /** @type {Element} */
          n
        ));
      }
    }
    return cameras;
  }
  /**
   * @param {Element} node Node.
   * @return {Array<KMLCamera>} Cameras.
   * @api
   */
  readCameraFromNode(node) {
    const cameras = [];
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      if (NAMESPACE_URIS.includes(n.namespaceURI) && n.localName === "Camera") {
        const obj = pushParseAndPop({}, CAMERA_PARSERS, n, []);
        cameras.push(obj);
      }
    }
    for (let n = node.firstElementChild; n; n = n.nextElementSibling) {
      const localName = n.localName;
      if (NAMESPACE_URIS.includes(n.namespaceURI) && (localName === "Document" || localName === "Folder" || localName === "Placemark" || localName === "kml")) {
        extend(cameras, this.readCameraFromNode(n));
      }
    }
    return cameras;
  }
  /**
   * Encode an array of features in the KML format as an XML node. GeometryCollections,
   * MultiPoints, MultiLineStrings, and MultiPolygons are output as MultiGeometries.
   *
   * @param {Array<Feature>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Node} Node.
   * @api
   */
  writeFeaturesNode(features, options) {
    options = this.adaptOptions(options);
    const kml = createElementNS(NAMESPACE_URIS[4], "kml");
    const xmlnsUri = "http://www.w3.org/2000/xmlns/";
    kml.setAttributeNS(xmlnsUri, "xmlns:gx", GX_NAMESPACE_URIS[0]);
    kml.setAttributeNS(xmlnsUri, "xmlns:xsi", XML_SCHEMA_INSTANCE_URI);
    kml.setAttributeNS(
      XML_SCHEMA_INSTANCE_URI,
      "xsi:schemaLocation",
      SCHEMA_LOCATION
    );
    const context = {
      node: kml
    };
    const properties = {};
    if (features.length > 1) {
      properties["Document"] = features;
    } else if (features.length == 1) {
      properties["Placemark"] = features[0];
    }
    const orderedKeys = KML_SEQUENCE[kml.namespaceURI];
    const values = makeSequence(properties, orderedKeys);
    pushSerializeAndPop(
      context,
      KML_SERIALIZERS,
      OBJECT_PROPERTY_NODE_FACTORY,
      values,
      [options],
      orderedKeys,
      this
    );
    return kml;
  }
};
function createNameStyleFunction(foundStyle, name) {
  const textOffset = [0, 0];
  let textAlign = "start";
  const imageStyle = foundStyle.getImage();
  if (imageStyle) {
    const imageSize = imageStyle.getSize();
    if (imageSize && imageSize.length == 2) {
      const imageScale = imageStyle.getScaleArray();
      const anchor = imageStyle.getAnchor();
      textOffset[0] = imageScale[0] * (imageSize[0] - anchor[0]);
      textOffset[1] = imageScale[1] * (imageSize[1] / 2 - anchor[1]);
      textAlign = "left";
    }
  }
  let textStyle = foundStyle.getText();
  if (textStyle) {
    textStyle = textStyle.clone();
    textStyle.setFont(textStyle.getFont() || DEFAULT_TEXT_STYLE.getFont());
    textStyle.setScale(textStyle.getScale() || DEFAULT_TEXT_STYLE.getScale());
    textStyle.setFill(textStyle.getFill() || DEFAULT_TEXT_STYLE.getFill());
    textStyle.setStroke(textStyle.getStroke() || DEFAULT_TEXT_STROKE_STYLE);
  } else {
    textStyle = DEFAULT_TEXT_STYLE.clone();
  }
  textStyle.setText(name);
  textStyle.setOffsetX(textOffset[0]);
  textStyle.setOffsetY(textOffset[1]);
  textStyle.setTextAlign(textAlign);
  const nameStyle = new Style_default({
    image: imageStyle,
    text: textStyle
  });
  return nameStyle;
}
function createFeatureStyleFunction(style, styleUrl, defaultStyle, sharedStyles, showPointNames) {
  return (
    /**
     * @param {Feature} feature feature.
     * @param {number} resolution Resolution.
     * @return {Array<Style>|Style} Style.
     */
    function(feature, resolution) {
      let drawName = showPointNames;
      let name = "";
      let multiGeometryPoints = [];
      if (drawName) {
        const geometry = feature.getGeometry();
        if (geometry) {
          if (geometry instanceof GeometryCollection_default) {
            multiGeometryPoints = geometry.getGeometriesArrayRecursive().filter(function(geometry2) {
              const type = geometry2.getType();
              return type === "Point" || type === "MultiPoint";
            });
            drawName = multiGeometryPoints.length > 0;
          } else {
            const type = geometry.getType();
            drawName = type === "Point" || type === "MultiPoint";
          }
        }
      }
      if (drawName) {
        name = /** @type {string} */
        feature.get("name");
        drawName = drawName && !!name;
        if (drawName && /&[^&]+;/.test(name)) {
          if (!TEXTAREA) {
            TEXTAREA = document.createElement("textarea");
          }
          TEXTAREA.innerHTML = name;
          name = TEXTAREA.value;
        }
      }
      let featureStyle = defaultStyle;
      if (style) {
        featureStyle = style;
      } else if (styleUrl) {
        featureStyle = findStyle(styleUrl, defaultStyle, sharedStyles);
      }
      if (drawName) {
        const nameStyle = createNameStyleFunction(featureStyle[0], name);
        if (multiGeometryPoints.length > 0) {
          nameStyle.setGeometry(new GeometryCollection_default(multiGeometryPoints));
          const baseStyle = new Style_default({
            geometry: featureStyle[0].getGeometry(),
            image: null,
            fill: featureStyle[0].getFill(),
            stroke: featureStyle[0].getStroke(),
            text: null
          });
          return [nameStyle, baseStyle].concat(featureStyle.slice(1));
        }
        return nameStyle;
      }
      return featureStyle;
    }
  );
}
function findStyle(styleValue, defaultStyle, sharedStyles) {
  if (Array.isArray(styleValue)) {
    return styleValue;
  }
  if (typeof styleValue === "string") {
    return findStyle(sharedStyles[styleValue], defaultStyle, sharedStyles);
  }
  return defaultStyle;
}
function readColor(node) {
  const s = getAllTextContent(node, false);
  const m = /^\s*#?\s*([0-9A-Fa-f]{8})\s*$/.exec(s);
  if (m) {
    const hexColor = m[1];
    return [
      parseInt(hexColor.substr(6, 2), 16),
      parseInt(hexColor.substr(4, 2), 16),
      parseInt(hexColor.substr(2, 2), 16),
      parseInt(hexColor.substr(0, 2), 16) / 255
    ];
  }
  return void 0;
}
function readFlatCoordinates(node) {
  let s = getAllTextContent(node, false);
  const flatCoordinates = [];
  s = s.replace(/\s*,\s*/g, ",");
  const re = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?),([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)(?:\s+|,|$)(?:([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)(?:\s+|$))?\s*/i;
  let m;
  while (m = re.exec(s)) {
    const x = parseFloat(m[1]);
    const y = parseFloat(m[2]);
    const z = m[3] ? parseFloat(m[3]) : 0;
    flatCoordinates.push(x, y, z);
    s = s.substr(m[0].length);
  }
  if (s !== "") {
    return void 0;
  }
  return flatCoordinates;
}
function readURI(node) {
  const s = getAllTextContent(node, false).trim();
  let baseURI = node.baseURI;
  if (!baseURI || baseURI == "about:blank") {
    baseURI = window.location.href;
  }
  if (baseURI) {
    const url = new URL(s, baseURI);
    return url.href;
  }
  return s;
}
function readStyleURL(node) {
  const s = getAllTextContent(node, false).trim().replace(/^(?!.*#)/, "#");
  let baseURI = node.baseURI;
  if (!baseURI || baseURI == "about:blank") {
    baseURI = window.location.href;
  }
  if (baseURI) {
    const url = new URL(s, baseURI);
    return url.href;
  }
  return s;
}
function readVec2(node) {
  const xunits = node.getAttribute("xunits");
  const yunits = node.getAttribute("yunits");
  let origin;
  if (xunits !== "insetPixels") {
    if (yunits !== "insetPixels") {
      origin = "bottom-left";
    } else {
      origin = "top-left";
    }
  } else {
    if (yunits !== "insetPixels") {
      origin = "bottom-right";
    } else {
      origin = "top-right";
    }
  }
  return {
    x: parseFloat(node.getAttribute("x")),
    xunits: ICON_ANCHOR_UNITS_MAP[xunits],
    y: parseFloat(node.getAttribute("y")),
    yunits: ICON_ANCHOR_UNITS_MAP[yunits],
    origin
  };
}
function readScale(node) {
  return readDecimal(node);
}
var STYLE_MAP_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "Pair": pairDataParser
});
function readStyleMapValue(node, objectStack) {
  return pushParseAndPop(void 0, STYLE_MAP_PARSERS, node, objectStack, this);
}
var ICON_STYLE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "Icon": makeObjectPropertySetter(readIcon),
  "color": makeObjectPropertySetter(readColor),
  "heading": makeObjectPropertySetter(readDecimal),
  "hotSpot": makeObjectPropertySetter(readVec2),
  "scale": makeObjectPropertySetter(readScale)
});
function iconStyleParser(node, objectStack) {
  const object = pushParseAndPop({}, ICON_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  const styleObject = (
    /** @type {Object} */
    objectStack[objectStack.length - 1]
  );
  const IconObject = "Icon" in object ? object["Icon"] : {};
  const drawIcon = !("Icon" in object) || Object.keys(IconObject).length > 0;
  let src;
  const href = (
    /** @type {string|undefined} */
    IconObject["href"]
  );
  if (href) {
    src = href;
  } else if (drawIcon) {
    src = DEFAULT_IMAGE_STYLE_SRC;
  }
  let anchor, anchorXUnits, anchorYUnits;
  let anchorOrigin = "bottom-left";
  const hotSpot = (
    /** @type {Vec2|undefined} */
    object["hotSpot"]
  );
  if (hotSpot) {
    anchor = [hotSpot.x, hotSpot.y];
    anchorXUnits = hotSpot.xunits;
    anchorYUnits = hotSpot.yunits;
    anchorOrigin = hotSpot.origin;
  } else if (/^https?:\/\/maps\.(?:google|gstatic)\.com\//.test(src)) {
    if (src.includes("pushpin")) {
      anchor = DEFAULT_IMAGE_STYLE_ANCHOR;
      anchorXUnits = DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS;
      anchorYUnits = DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS;
    } else if (src.includes("arrow-reverse")) {
      anchor = [54, 42];
      anchorXUnits = DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS;
      anchorYUnits = DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS;
    } else if (src.includes("paddle")) {
      anchor = [32, 1];
      anchorXUnits = DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS;
      anchorYUnits = DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS;
    }
  }
  let offset;
  const x = (
    /** @type {number|undefined} */
    IconObject["x"]
  );
  const y = (
    /** @type {number|undefined} */
    IconObject["y"]
  );
  if (x !== void 0 && y !== void 0) {
    offset = [x, y];
  }
  let size;
  const w = (
    /** @type {number|undefined} */
    IconObject["w"]
  );
  const h = (
    /** @type {number|undefined} */
    IconObject["h"]
  );
  if (w !== void 0 && h !== void 0) {
    size = [w, h];
  }
  let rotation;
  const heading = (
    /** @type {number} */
    object["heading"]
  );
  if (heading !== void 0) {
    rotation = toRadians(heading);
  }
  const scale = (
    /** @type {number|undefined} */
    object["scale"]
  );
  const color = (
    /** @type {Array<number>|undefined} */
    object["color"]
  );
  if (drawIcon) {
    if (src == DEFAULT_IMAGE_STYLE_SRC) {
      size = DEFAULT_IMAGE_STYLE_SIZE;
    }
    const imageStyle = new Icon_default({
      anchor,
      anchorOrigin,
      anchorXUnits,
      anchorYUnits,
      crossOrigin: this.crossOrigin_,
      offset,
      offsetOrigin: "bottom-left",
      rotation,
      scale,
      size,
      src: this.iconUrlFunction_(src),
      color
    });
    const imageScale = imageStyle.getScaleArray()[0];
    const imageSize = imageStyle.getSize();
    if (imageSize === null) {
      const imageState = imageStyle.getImageState();
      if (imageState === ImageState_default.IDLE || imageState === ImageState_default.LOADING) {
        const listener = function() {
          const imageState2 = imageStyle.getImageState();
          if (!(imageState2 === ImageState_default.IDLE || imageState2 === ImageState_default.LOADING)) {
            const imageSize2 = imageStyle.getSize();
            if (imageSize2 && imageSize2.length == 2) {
              const resizeScale = scaleForSize(imageSize2);
              imageStyle.setScale(imageScale * resizeScale);
            }
            imageStyle.unlistenImageChange(listener);
          }
        };
        imageStyle.listenImageChange(listener);
        if (imageState === ImageState_default.IDLE) {
          imageStyle.load();
        }
      }
    } else if (imageSize.length == 2) {
      const resizeScale = scaleForSize(imageSize);
      imageStyle.setScale(imageScale * resizeScale);
    }
    styleObject["imageStyle"] = imageStyle;
  } else {
    styleObject["imageStyle"] = DEFAULT_NO_IMAGE_STYLE;
  }
}
var LABEL_STYLE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "color": makeObjectPropertySetter(readColor),
  "scale": makeObjectPropertySetter(readScale)
});
function labelStyleParser(node, objectStack) {
  const object = pushParseAndPop({}, LABEL_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  const styleObject = objectStack[objectStack.length - 1];
  const textStyle = new Text_default({
    fill: new Fill_default({
      color: (
        /** @type {import("../color.js").Color} */
        "color" in object ? object["color"] : DEFAULT_COLOR
      )
    }),
    scale: (
      /** @type {number|undefined} */
      object["scale"]
    )
  });
  styleObject["textStyle"] = textStyle;
}
var LINE_STYLE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "color": makeObjectPropertySetter(readColor),
  "width": makeObjectPropertySetter(readDecimal)
});
function lineStyleParser(node, objectStack) {
  const object = pushParseAndPop({}, LINE_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  const styleObject = objectStack[objectStack.length - 1];
  const strokeStyle = new Stroke_default({
    color: (
      /** @type {import("../color.js").Color} */
      "color" in object ? object["color"] : DEFAULT_COLOR
    ),
    width: (
      /** @type {number} */
      "width" in object ? object["width"] : 1
    )
  });
  styleObject["strokeStyle"] = strokeStyle;
}
var POLY_STYLE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "color": makeObjectPropertySetter(readColor),
  "fill": makeObjectPropertySetter(readBoolean),
  "outline": makeObjectPropertySetter(readBoolean)
});
function polyStyleParser(node, objectStack) {
  const object = pushParseAndPop({}, POLY_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  const styleObject = objectStack[objectStack.length - 1];
  const fillStyle = new Fill_default({
    color: (
      /** @type {import("../color.js").Color} */
      "color" in object ? object["color"] : DEFAULT_COLOR
    )
  });
  styleObject["fillStyle"] = fillStyle;
  const fill = (
    /** @type {boolean|undefined} */
    object["fill"]
  );
  if (fill !== void 0) {
    styleObject["fill"] = fill;
  }
  const outline = (
    /** @type {boolean|undefined} */
    object["outline"]
  );
  if (outline !== void 0) {
    styleObject["outline"] = outline;
  }
}
var FLAT_LINEAR_RING_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "coordinates": makeReplacer(readFlatCoordinates)
});
function readFlatLinearRing(node, objectStack) {
  return pushParseAndPop(null, FLAT_LINEAR_RING_PARSERS, node, objectStack);
}
function gxCoordParser(node, objectStack) {
  const gxTrackObject = (
    /** @type {GxTrackObject} */
    objectStack[objectStack.length - 1]
  );
  const coordinates = gxTrackObject.coordinates;
  const s = getAllTextContent(node, false);
  const re = /^\s*([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s+([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s+([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s*$/i;
  const m = re.exec(s);
  if (m) {
    const x = parseFloat(m[1]);
    const y = parseFloat(m[2]);
    const z = parseFloat(m[3]);
    coordinates.push([x, y, z]);
  } else {
    coordinates.push([]);
  }
}
var GX_MULTITRACK_GEOMETRY_PARSERS = makeStructureNS(GX_NAMESPACE_URIS, {
  "Track": makeArrayPusher(readGxTrack)
});
function readGxMultiTrack(node, objectStack) {
  const lineStrings = pushParseAndPop(
    [],
    GX_MULTITRACK_GEOMETRY_PARSERS,
    node,
    objectStack
  );
  if (!lineStrings) {
    return void 0;
  }
  return new MultiLineString_default(lineStrings);
}
var GX_TRACK_PARSERS = makeStructureNS(
  NAMESPACE_URIS,
  {
    "when": whenParser
  },
  makeStructureNS(GX_NAMESPACE_URIS, {
    "coord": gxCoordParser
  })
);
function readGxTrack(node, objectStack) {
  const gxTrackObject = pushParseAndPop(
    /** @type {GxTrackObject} */
    {
      coordinates: [],
      whens: []
    },
    GX_TRACK_PARSERS,
    node,
    objectStack
  );
  if (!gxTrackObject) {
    return void 0;
  }
  const flatCoordinates = [];
  const coordinates = gxTrackObject.coordinates;
  const whens = gxTrackObject.whens;
  for (let i = 0, ii = Math.min(coordinates.length, whens.length); i < ii; ++i) {
    if (coordinates[i].length == 3) {
      flatCoordinates.push(
        coordinates[i][0],
        coordinates[i][1],
        coordinates[i][2],
        whens[i]
      );
    }
  }
  return new LineString_default(flatCoordinates, "XYZM");
}
var ICON_PARSERS = makeStructureNS(
  NAMESPACE_URIS,
  {
    "href": makeObjectPropertySetter(readURI)
  },
  makeStructureNS(GX_NAMESPACE_URIS, {
    "x": makeObjectPropertySetter(readDecimal),
    "y": makeObjectPropertySetter(readDecimal),
    "w": makeObjectPropertySetter(readDecimal),
    "h": makeObjectPropertySetter(readDecimal)
  })
);
function readIcon(node, objectStack) {
  const iconObject = pushParseAndPop({}, ICON_PARSERS, node, objectStack);
  if (iconObject) {
    return iconObject;
  }
  return null;
}
var GEOMETRY_FLAT_COORDINATES_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "coordinates": makeReplacer(readFlatCoordinates)
});
function readFlatCoordinatesFromNode(node, objectStack) {
  return pushParseAndPop(
    null,
    GEOMETRY_FLAT_COORDINATES_PARSERS,
    node,
    objectStack
  );
}
var EXTRUDE_AND_ALTITUDE_MODE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "extrude": makeObjectPropertySetter(readBoolean),
  "tessellate": makeObjectPropertySetter(readBoolean),
  "altitudeMode": makeObjectPropertySetter(readString)
});
function readLineString(node, objectStack) {
  const properties = pushParseAndPop(
    {},
    EXTRUDE_AND_ALTITUDE_MODE_PARSERS,
    node,
    objectStack
  );
  const flatCoordinates = readFlatCoordinatesFromNode(node, objectStack);
  if (flatCoordinates) {
    const lineString = new LineString_default(flatCoordinates, "XYZ");
    lineString.setProperties(properties, true);
    return lineString;
  }
  return void 0;
}
function readLinearRing(node, objectStack) {
  const properties = pushParseAndPop(
    {},
    EXTRUDE_AND_ALTITUDE_MODE_PARSERS,
    node,
    objectStack
  );
  const flatCoordinates = readFlatCoordinatesFromNode(node, objectStack);
  if (flatCoordinates) {
    const polygon = new Polygon_default(flatCoordinates, "XYZ", [
      flatCoordinates.length
    ]);
    polygon.setProperties(properties, true);
    return polygon;
  }
  return void 0;
}
var MULTI_GEOMETRY_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "LineString": makeArrayPusher(readLineString),
  "LinearRing": makeArrayPusher(readLinearRing),
  "MultiGeometry": makeArrayPusher(readMultiGeometry),
  "Point": makeArrayPusher(readPoint),
  "Polygon": makeArrayPusher(readPolygon)
});
function readMultiGeometry(node, objectStack) {
  const geometries = pushParseAndPop(
    [],
    MULTI_GEOMETRY_PARSERS,
    node,
    objectStack
  );
  if (!geometries) {
    return null;
  }
  if (geometries.length === 0) {
    return new GeometryCollection_default(geometries);
  }
  let multiGeometry;
  let homogeneous = true;
  const type = geometries[0].getType();
  let geometry;
  for (let i = 1, ii = geometries.length; i < ii; ++i) {
    geometry = geometries[i];
    if (geometry.getType() != type) {
      homogeneous = false;
      break;
    }
  }
  if (homogeneous) {
    let layout;
    let flatCoordinates;
    if (type == "Point") {
      const point = geometries[0];
      layout = point.getLayout();
      flatCoordinates = point.getFlatCoordinates();
      for (let i = 1, ii = geometries.length; i < ii; ++i) {
        geometry = geometries[i];
        extend(flatCoordinates, geometry.getFlatCoordinates());
      }
      multiGeometry = new MultiPoint_default(flatCoordinates, layout);
      setCommonGeometryProperties(multiGeometry, geometries);
    } else if (type == "LineString") {
      multiGeometry = new MultiLineString_default(geometries);
      setCommonGeometryProperties(multiGeometry, geometries);
    } else if (type == "Polygon") {
      multiGeometry = new MultiPolygon_default(geometries);
      setCommonGeometryProperties(multiGeometry, geometries);
    } else if (type == "GeometryCollection") {
      multiGeometry = new GeometryCollection_default(geometries);
    } else {
      throw new Error("Unknown geometry type found");
    }
  } else {
    multiGeometry = new GeometryCollection_default(geometries);
  }
  return (
    /** @type {import("../geom/Geometry.js").default} */
    multiGeometry
  );
}
function readPoint(node, objectStack) {
  const properties = pushParseAndPop(
    {},
    EXTRUDE_AND_ALTITUDE_MODE_PARSERS,
    node,
    objectStack
  );
  const flatCoordinates = readFlatCoordinatesFromNode(node, objectStack);
  if (flatCoordinates) {
    const point = new Point_default(flatCoordinates, "XYZ");
    point.setProperties(properties, true);
    return point;
  }
  return void 0;
}
var FLAT_LINEAR_RINGS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "innerBoundaryIs": innerBoundaryIsParser,
  "outerBoundaryIs": outerBoundaryIsParser
});
function readPolygon(node, objectStack) {
  const properties = pushParseAndPop(
    /** @type {Object<string,*>} */
    {},
    EXTRUDE_AND_ALTITUDE_MODE_PARSERS,
    node,
    objectStack
  );
  const flatLinearRings = pushParseAndPop(
    [null],
    FLAT_LINEAR_RINGS_PARSERS,
    node,
    objectStack
  );
  if (flatLinearRings && flatLinearRings[0]) {
    const flatCoordinates = flatLinearRings[0];
    const ends = [flatCoordinates.length];
    for (let i = 1, ii = flatLinearRings.length; i < ii; ++i) {
      extend(flatCoordinates, flatLinearRings[i]);
      ends.push(flatCoordinates.length);
    }
    const polygon = new Polygon_default(flatCoordinates, "XYZ", ends);
    polygon.setProperties(properties, true);
    return polygon;
  }
  return void 0;
}
var STYLE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "IconStyle": iconStyleParser,
  "LabelStyle": labelStyleParser,
  "LineStyle": lineStyleParser,
  "PolyStyle": polyStyleParser
});
function readStyle(node, objectStack) {
  const styleObject = pushParseAndPop(
    {},
    STYLE_PARSERS,
    node,
    objectStack,
    this
  );
  if (!styleObject) {
    return null;
  }
  let fillStyle = (
    /** @type {Fill} */
    "fillStyle" in styleObject ? styleObject["fillStyle"] : DEFAULT_FILL_STYLE
  );
  const fill = (
    /** @type {boolean|undefined} */
    styleObject["fill"]
  );
  if (fill !== void 0 && !fill) {
    fillStyle = null;
  }
  let imageStyle;
  if ("imageStyle" in styleObject) {
    if (styleObject["imageStyle"] != DEFAULT_NO_IMAGE_STYLE) {
      imageStyle = /** @type {import("../style/Image.js").default} */
      styleObject["imageStyle"];
    }
  } else {
    imageStyle = DEFAULT_IMAGE_STYLE;
  }
  const textStyle = (
    /** @type {Text} */
    "textStyle" in styleObject ? styleObject["textStyle"] : DEFAULT_TEXT_STYLE
  );
  const strokeStyle = (
    /** @type {Stroke} */
    "strokeStyle" in styleObject ? styleObject["strokeStyle"] : DEFAULT_STROKE_STYLE
  );
  const outline = (
    /** @type {boolean|undefined} */
    styleObject["outline"]
  );
  if (outline !== void 0 && !outline) {
    return [
      new Style_default({
        geometry: function(feature) {
          const geometry = feature.getGeometry();
          const type = geometry.getType();
          if (type === "GeometryCollection") {
            const collection = (
              /** @type {import("../geom/GeometryCollection").default} */
              geometry
            );
            return new GeometryCollection_default(
              collection.getGeometriesArrayRecursive().filter(function(geometry2) {
                const type2 = geometry2.getType();
                return type2 !== "Polygon" && type2 !== "MultiPolygon";
              })
            );
          }
          if (type !== "Polygon" && type !== "MultiPolygon") {
            return geometry;
          }
        },
        fill: fillStyle,
        image: imageStyle,
        stroke: strokeStyle,
        text: textStyle,
        zIndex: void 0
        // FIXME
      }),
      new Style_default({
        geometry: function(feature) {
          const geometry = feature.getGeometry();
          const type = geometry.getType();
          if (type === "GeometryCollection") {
            const collection = (
              /** @type {import("../geom/GeometryCollection").default} */
              geometry
            );
            return new GeometryCollection_default(
              collection.getGeometriesArrayRecursive().filter(function(geometry2) {
                const type2 = geometry2.getType();
                return type2 === "Polygon" || type2 === "MultiPolygon";
              })
            );
          }
          if (type === "Polygon" || type === "MultiPolygon") {
            return geometry;
          }
        },
        fill: fillStyle,
        stroke: null,
        zIndex: void 0
        // FIXME
      })
    ];
  }
  return [
    new Style_default({
      fill: fillStyle,
      image: imageStyle,
      stroke: strokeStyle,
      text: textStyle,
      zIndex: void 0
      // FIXME
    })
  ];
}
function setCommonGeometryProperties(multiGeometry, geometries) {
  const ii = geometries.length;
  const extrudes = new Array(geometries.length);
  const tessellates = new Array(geometries.length);
  const altitudeModes = new Array(geometries.length);
  let hasExtrude, hasTessellate, hasAltitudeMode;
  hasExtrude = false;
  hasTessellate = false;
  hasAltitudeMode = false;
  for (let i = 0; i < ii; ++i) {
    const geometry = geometries[i];
    extrudes[i] = geometry.get("extrude");
    tessellates[i] = geometry.get("tessellate");
    altitudeModes[i] = geometry.get("altitudeMode");
    hasExtrude = hasExtrude || extrudes[i] !== void 0;
    hasTessellate = hasTessellate || tessellates[i] !== void 0;
    hasAltitudeMode = hasAltitudeMode || altitudeModes[i];
  }
  if (hasExtrude) {
    multiGeometry.set("extrude", extrudes);
  }
  if (hasTessellate) {
    multiGeometry.set("tessellate", tessellates);
  }
  if (hasAltitudeMode) {
    multiGeometry.set("altitudeMode", altitudeModes);
  }
}
var DATA_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "displayName": makeObjectPropertySetter(readString),
  "value": makeObjectPropertySetter(readString)
});
function dataParser(node, objectStack) {
  const name = node.getAttribute("name");
  parseNode(DATA_PARSERS, node, objectStack);
  const featureObject = (
    /** @type {Object} */
    objectStack[objectStack.length - 1]
  );
  if (name && featureObject.displayName) {
    featureObject[name] = {
      value: featureObject.value,
      displayName: featureObject.displayName,
      toString: function() {
        return featureObject.value;
      }
    };
  } else if (name !== null) {
    featureObject[name] = featureObject.value;
  } else if (featureObject.displayName !== null) {
    featureObject[featureObject.displayName] = featureObject.value;
  }
  delete featureObject["value"];
}
var EXTENDED_DATA_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "Data": dataParser,
  "SchemaData": schemaDataParser
});
function extendedDataParser(node, objectStack) {
  parseNode(EXTENDED_DATA_PARSERS, node, objectStack);
}
function regionParser(node, objectStack) {
  parseNode(REGION_PARSERS, node, objectStack);
}
var PAIR_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "Style": makeObjectPropertySetter(readStyle),
  "key": makeObjectPropertySetter(readString),
  "styleUrl": makeObjectPropertySetter(readStyleURL)
});
function pairDataParser(node, objectStack) {
  const pairObject = pushParseAndPop({}, PAIR_PARSERS, node, objectStack, this);
  if (!pairObject) {
    return;
  }
  const key = (
    /** @type {string|undefined} */
    pairObject["key"]
  );
  if (key && key == "normal") {
    const styleUrl = (
      /** @type {string|undefined} */
      pairObject["styleUrl"]
    );
    if (styleUrl) {
      objectStack[objectStack.length - 1] = styleUrl;
    }
    const style = (
      /** @type {Style} */
      pairObject["Style"]
    );
    if (style) {
      objectStack[objectStack.length - 1] = style;
    }
  }
}
function placemarkStyleMapParser(node, objectStack) {
  const styleMapValue = readStyleMapValue.call(this, node, objectStack);
  if (!styleMapValue) {
    return;
  }
  const placemarkObject = objectStack[objectStack.length - 1];
  if (Array.isArray(styleMapValue)) {
    placemarkObject["Style"] = styleMapValue;
  } else if (typeof styleMapValue === "string") {
    placemarkObject["styleUrl"] = styleMapValue;
  } else {
    throw new Error("`styleMapValue` has an unknown type");
  }
}
var SCHEMA_DATA_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "SimpleData": simpleDataParser
});
function schemaDataParser(node, objectStack) {
  parseNode(SCHEMA_DATA_PARSERS, node, objectStack);
}
function simpleDataParser(node, objectStack) {
  const name = node.getAttribute("name");
  if (name !== null) {
    const data = readString(node);
    const featureObject = (
      /** @type {Object} */
      objectStack[objectStack.length - 1]
    );
    featureObject[name] = data;
  }
}
var LAT_LON_ALT_BOX_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "altitudeMode": makeObjectPropertySetter(readString),
  "minAltitude": makeObjectPropertySetter(readDecimal),
  "maxAltitude": makeObjectPropertySetter(readDecimal),
  "north": makeObjectPropertySetter(readDecimal),
  "south": makeObjectPropertySetter(readDecimal),
  "east": makeObjectPropertySetter(readDecimal),
  "west": makeObjectPropertySetter(readDecimal)
});
function latLonAltBoxParser(node, objectStack) {
  const object = pushParseAndPop(
    {},
    LAT_LON_ALT_BOX_PARSERS,
    node,
    objectStack
  );
  if (!object) {
    return;
  }
  const regionObject = (
    /** @type {Object} */
    objectStack[objectStack.length - 1]
  );
  const extent = [
    parseFloat(object["west"]),
    parseFloat(object["south"]),
    parseFloat(object["east"]),
    parseFloat(object["north"])
  ];
  regionObject["extent"] = extent;
  regionObject["altitudeMode"] = object["altitudeMode"];
  regionObject["minAltitude"] = parseFloat(object["minAltitude"]);
  regionObject["maxAltitude"] = parseFloat(object["maxAltitude"]);
}
var LOD_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "minLodPixels": makeObjectPropertySetter(readDecimal),
  "maxLodPixels": makeObjectPropertySetter(readDecimal),
  "minFadeExtent": makeObjectPropertySetter(readDecimal),
  "maxFadeExtent": makeObjectPropertySetter(readDecimal)
});
function lodParser(node, objectStack) {
  const object = pushParseAndPop({}, LOD_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  const lodObject = (
    /** @type {Object} */
    objectStack[objectStack.length - 1]
  );
  lodObject["minLodPixels"] = parseFloat(object["minLodPixels"]);
  lodObject["maxLodPixels"] = parseFloat(object["maxLodPixels"]);
  lodObject["minFadeExtent"] = parseFloat(object["minFadeExtent"]);
  lodObject["maxFadeExtent"] = parseFloat(object["maxFadeExtent"]);
}
var INNER_BOUNDARY_IS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  // KML spec only allows one LinearRing  per innerBoundaryIs, but Google Earth
  // allows multiple, so we parse multiple here too.
  "LinearRing": makeArrayPusher(readFlatLinearRing)
});
function innerBoundaryIsParser(node, objectStack) {
  const innerBoundaryFlatLinearRings = pushParseAndPop(
    /** @type {Array<Array<number>>} */
    [],
    INNER_BOUNDARY_IS_PARSERS,
    node,
    objectStack
  );
  if (innerBoundaryFlatLinearRings.length > 0) {
    const flatLinearRings = (
      /** @type {Array<Array<number>>} */
      objectStack[objectStack.length - 1]
    );
    flatLinearRings.push(...innerBoundaryFlatLinearRings);
  }
}
var OUTER_BOUNDARY_IS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  "LinearRing": makeReplacer(readFlatLinearRing)
});
function outerBoundaryIsParser(node, objectStack) {
  const flatLinearRing = pushParseAndPop(
    void 0,
    OUTER_BOUNDARY_IS_PARSERS,
    node,
    objectStack
  );
  if (flatLinearRing) {
    const flatLinearRings = (
      /** @type {Array<Array<number>>} */
      objectStack[objectStack.length - 1]
    );
    flatLinearRings[0] = flatLinearRing;
  }
}
function linkParser(node, objectStack) {
  parseNode(LINK_PARSERS, node, objectStack);
}
function whenParser(node, objectStack) {
  const gxTrackObject = (
    /** @type {GxTrackObject} */
    objectStack[objectStack.length - 1]
  );
  const whens = gxTrackObject.whens;
  const s = getAllTextContent(node, false);
  const when = Date.parse(s);
  whens.push(isNaN(when) ? 0 : when);
}
function writeColorTextNode(node, color) {
  const rgba = asArray(color);
  const opacity = rgba.length == 4 ? rgba[3] : 1;
  const abgr = [opacity * 255, rgba[2], rgba[1], rgba[0]];
  for (let i = 0; i < 4; ++i) {
    const hex = Math.floor(
      /** @type {number} */
      abgr[i]
    ).toString(16);
    abgr[i] = hex.length == 1 ? "0" + hex : hex;
  }
  writeStringTextNode(node, abgr.join(""));
}
function writeCoordinatesTextNode(node, coordinates, objectStack) {
  const context = objectStack[objectStack.length - 1];
  const layout = context["layout"];
  const stride = context["stride"];
  let dimension;
  if (layout == "XY" || layout == "XYM") {
    dimension = 2;
  } else if (layout == "XYZ" || layout == "XYZM") {
    dimension = 3;
  } else {
    throw new Error("Invalid geometry layout");
  }
  const ii = coordinates.length;
  let text = "";
  if (ii > 0) {
    text += coordinates[0];
    for (let d = 1; d < dimension; ++d) {
      text += "," + coordinates[d];
    }
    for (let i = stride; i < ii; i += stride) {
      text += " " + coordinates[i];
      for (let d = 1; d < dimension; ++d) {
        text += "," + coordinates[i + d];
      }
    }
  }
  writeStringTextNode(node, text);
}
var EXTENDEDDATA_NODE_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "Data": makeChildAppender(writeDataNode),
  "value": makeChildAppender(writeDataNodeValue),
  "displayName": makeChildAppender(writeDataNodeName)
});
function writeDataNode(node, pair, objectStack) {
  node.setAttribute("name", pair.name);
  const context = { node };
  const value = pair.value;
  if (typeof value == "object") {
    if (value !== null && value.displayName) {
      pushSerializeAndPop(
        context,
        EXTENDEDDATA_NODE_SERIALIZERS,
        OBJECT_PROPERTY_NODE_FACTORY,
        [value.displayName],
        objectStack,
        ["displayName"]
      );
    }
    if (value !== null && value.value) {
      pushSerializeAndPop(
        context,
        EXTENDEDDATA_NODE_SERIALIZERS,
        OBJECT_PROPERTY_NODE_FACTORY,
        [value.value],
        objectStack,
        ["value"]
      );
    }
  } else {
    pushSerializeAndPop(
      context,
      EXTENDEDDATA_NODE_SERIALIZERS,
      OBJECT_PROPERTY_NODE_FACTORY,
      [value],
      objectStack,
      ["value"]
    );
  }
}
function writeDataNodeName(node, name) {
  writeCDATASection(node, name);
}
function writeDataNodeValue(node, value) {
  writeStringTextNode(node, value);
}
var DOCUMENT_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "Placemark": makeChildAppender(writePlacemark)
});
var DOCUMENT_NODE_FACTORY = function(value, objectStack, nodeName) {
  const parentNode = objectStack[objectStack.length - 1].node;
  return createElementNS(parentNode.namespaceURI, "Placemark");
};
function writeDocument(node, features, objectStack) {
  const context = { node };
  pushSerializeAndPop(
    context,
    DOCUMENT_SERIALIZERS,
    DOCUMENT_NODE_FACTORY,
    features,
    objectStack,
    void 0,
    this
  );
}
var DATA_NODE_FACTORY = makeSimpleNodeFactory("Data");
function writeExtendedData(node, namesAndValues, objectStack) {
  const context = { node };
  const names = namesAndValues.names;
  const values = namesAndValues.values;
  const length = names.length;
  for (let i = 0; i < length; i++) {
    pushSerializeAndPop(
      context,
      EXTENDEDDATA_NODE_SERIALIZERS,
      DATA_NODE_FACTORY,
      [{ name: names[i], value: values[i] }],
      objectStack
    );
  }
}
var ICON_SEQUENCE = makeStructureNS(
  NAMESPACE_URIS,
  ["href"],
  makeStructureNS(GX_NAMESPACE_URIS, ["x", "y", "w", "h"])
);
var ICON_SERIALIZERS = makeStructureNS(
  NAMESPACE_URIS,
  {
    "href": makeChildAppender(writeStringTextNode)
  },
  makeStructureNS(GX_NAMESPACE_URIS, {
    "x": makeChildAppender(writeDecimalTextNode),
    "y": makeChildAppender(writeDecimalTextNode),
    "w": makeChildAppender(writeDecimalTextNode),
    "h": makeChildAppender(writeDecimalTextNode)
  })
);
var GX_NODE_FACTORY = function(value, objectStack, nodeName) {
  return createElementNS(GX_NAMESPACE_URIS[0], "gx:" + nodeName);
};
function writeIcon(node, icon, objectStack) {
  const context = { node };
  const parentNode = objectStack[objectStack.length - 1].node;
  let orderedKeys = ICON_SEQUENCE[parentNode.namespaceURI];
  let values = makeSequence(icon, orderedKeys);
  pushSerializeAndPop(
    context,
    ICON_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
  orderedKeys = ICON_SEQUENCE[GX_NAMESPACE_URIS[0]];
  values = makeSequence(icon, orderedKeys);
  pushSerializeAndPop(
    context,
    ICON_SERIALIZERS,
    GX_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
var ICON_STYLE_SEQUENCE = makeStructureNS(NAMESPACE_URIS, [
  "scale",
  "heading",
  "Icon",
  "color",
  "hotSpot"
]);
var ICON_STYLE_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "Icon": makeChildAppender(writeIcon),
  "color": makeChildAppender(writeColorTextNode),
  "heading": makeChildAppender(writeDecimalTextNode),
  "hotSpot": makeChildAppender(writeVec2),
  "scale": makeChildAppender(writeScaleTextNode)
});
function writeIconStyle(node, style, objectStack) {
  const context = { node };
  const properties = {};
  const src = style.getSrc();
  const size = style.getSize();
  const iconImageSize = style.getImageSize();
  const iconProperties = {
    "href": src
  };
  if (size) {
    iconProperties["w"] = size[0];
    iconProperties["h"] = size[1];
    const anchor = style.getAnchor();
    const origin = style.getOrigin();
    if (origin && iconImageSize && origin[0] !== 0 && origin[1] !== size[1]) {
      iconProperties["x"] = origin[0];
      iconProperties["y"] = iconImageSize[1] - (origin[1] + size[1]);
    }
    if (anchor && (anchor[0] !== size[0] / 2 || anchor[1] !== size[1] / 2)) {
      const hotSpot = {
        x: anchor[0],
        xunits: "pixels",
        y: size[1] - anchor[1],
        yunits: "pixels"
      };
      properties["hotSpot"] = hotSpot;
    }
  }
  properties["Icon"] = iconProperties;
  let scale = style.getScaleArray()[0];
  let imageSize = size;
  if (imageSize === null) {
    imageSize = DEFAULT_IMAGE_STYLE_SIZE;
  }
  if (imageSize.length == 2) {
    const resizeScale = scaleForSize(imageSize);
    scale = scale / resizeScale;
  }
  if (scale !== 1) {
    properties["scale"] = scale;
  }
  const rotation = style.getRotation();
  if (rotation !== 0) {
    properties["heading"] = rotation;
  }
  const color = style.getColor();
  if (color) {
    properties["color"] = color;
  }
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = ICON_STYLE_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    ICON_STYLE_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
var LABEL_STYLE_SEQUENCE = makeStructureNS(NAMESPACE_URIS, [
  "color",
  "scale"
]);
var LABEL_STYLE_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "color": makeChildAppender(writeColorTextNode),
  "scale": makeChildAppender(writeScaleTextNode)
});
function writeLabelStyle(node, style, objectStack) {
  const context = { node };
  const properties = {};
  const fill = style.getFill();
  if (fill) {
    properties["color"] = fill.getColor();
  }
  const scale = style.getScale();
  if (scale && scale !== 1) {
    properties["scale"] = scale;
  }
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = LABEL_STYLE_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    LABEL_STYLE_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
var LINE_STYLE_SEQUENCE = makeStructureNS(NAMESPACE_URIS, ["color", "width"]);
var LINE_STYLE_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "color": makeChildAppender(writeColorTextNode),
  "width": makeChildAppender(writeDecimalTextNode)
});
function writeLineStyle(node, style, objectStack) {
  const context = { node };
  const properties = {
    "color": style.getColor(),
    "width": Number(style.getWidth()) || 1
  };
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = LINE_STYLE_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    LINE_STYLE_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
var GEOMETRY_TYPE_TO_NODENAME = {
  "Point": "Point",
  "LineString": "LineString",
  "LinearRing": "LinearRing",
  "Polygon": "Polygon",
  "MultiPoint": "MultiGeometry",
  "MultiLineString": "MultiGeometry",
  "MultiPolygon": "MultiGeometry",
  "GeometryCollection": "MultiGeometry"
};
var GEOMETRY_NODE_FACTORY = function(value, objectStack, nodeName) {
  if (value) {
    const parentNode = objectStack[objectStack.length - 1].node;
    return createElementNS(
      parentNode.namespaceURI,
      GEOMETRY_TYPE_TO_NODENAME[
        /** @type {import("../geom/Geometry.js").default} */
        value.getType()
      ]
    );
  }
};
var POINT_NODE_FACTORY = makeSimpleNodeFactory("Point");
var LINE_STRING_NODE_FACTORY = makeSimpleNodeFactory("LineString");
var LINEAR_RING_NODE_FACTORY = makeSimpleNodeFactory("LinearRing");
var POLYGON_NODE_FACTORY = makeSimpleNodeFactory("Polygon");
var MULTI_GEOMETRY_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "LineString": makeChildAppender(writePrimitiveGeometry),
  "Point": makeChildAppender(writePrimitiveGeometry),
  "Polygon": makeChildAppender(writePolygon),
  "GeometryCollection": makeChildAppender(writeMultiGeometry)
});
function writeMultiGeometry(node, geometry, objectStack) {
  const context = { node };
  const type = geometry.getType();
  let geometries = [];
  let factory;
  if (type === "GeometryCollection") {
    geometry.getGeometriesArrayRecursive().forEach(function(geometry2) {
      const type2 = geometry2.getType();
      if (type2 === "MultiPoint") {
        geometries = geometries.concat(
          /** @type {MultiPoint} */
          geometry2.getPoints()
        );
      } else if (type2 === "MultiLineString") {
        geometries = geometries.concat(
          /** @type {MultiLineString} */
          geometry2.getLineStrings()
        );
      } else if (type2 === "MultiPolygon") {
        geometries = geometries.concat(
          /** @type {MultiPolygon} */
          geometry2.getPolygons()
        );
      } else if (type2 === "Point" || type2 === "LineString" || type2 === "Polygon") {
        geometries.push(geometry2);
      } else {
        throw new Error("Unknown geometry type");
      }
    });
    factory = GEOMETRY_NODE_FACTORY;
  } else if (type === "MultiPoint") {
    geometries = /** @type {MultiPoint} */
    geometry.getPoints();
    factory = POINT_NODE_FACTORY;
  } else if (type === "MultiLineString") {
    geometries = /** @type {MultiLineString} */
    geometry.getLineStrings();
    factory = LINE_STRING_NODE_FACTORY;
  } else if (type === "MultiPolygon") {
    geometries = /** @type {MultiPolygon} */
    geometry.getPolygons();
    factory = POLYGON_NODE_FACTORY;
  } else {
    throw new Error("Unknown geometry type");
  }
  pushSerializeAndPop(
    context,
    MULTI_GEOMETRY_SERIALIZERS,
    factory,
    geometries,
    objectStack
  );
}
var BOUNDARY_IS_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "LinearRing": makeChildAppender(writePrimitiveGeometry)
});
function writeBoundaryIs(node, linearRing, objectStack) {
  const context = { node };
  pushSerializeAndPop(
    context,
    BOUNDARY_IS_SERIALIZERS,
    LINEAR_RING_NODE_FACTORY,
    [linearRing],
    objectStack
  );
}
var PLACEMARK_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "ExtendedData": makeChildAppender(writeExtendedData),
  "MultiGeometry": makeChildAppender(writeMultiGeometry),
  "LineString": makeChildAppender(writePrimitiveGeometry),
  "LinearRing": makeChildAppender(writePrimitiveGeometry),
  "Point": makeChildAppender(writePrimitiveGeometry),
  "Polygon": makeChildAppender(writePolygon),
  "Style": makeChildAppender(writeStyle),
  "address": makeChildAppender(writeStringTextNode),
  "description": makeChildAppender(writeStringTextNode),
  "name": makeChildAppender(writeStringTextNode),
  "open": makeChildAppender(writeBooleanTextNode),
  "phoneNumber": makeChildAppender(writeStringTextNode),
  "styleUrl": makeChildAppender(writeStringTextNode),
  "visibility": makeChildAppender(writeBooleanTextNode)
});
var PLACEMARK_SEQUENCE = makeStructureNS(NAMESPACE_URIS, [
  "name",
  "open",
  "visibility",
  "address",
  "phoneNumber",
  "description",
  "styleUrl",
  "Style"
]);
var EXTENDEDDATA_NODE_FACTORY = makeSimpleNodeFactory("ExtendedData");
function writePlacemark(node, feature, objectStack) {
  const context = { node };
  if (feature.getId()) {
    node.setAttribute(
      "id",
      /** @type {string} */
      feature.getId()
    );
  }
  const properties = feature.getProperties();
  const filter = {
    "address": 1,
    "description": 1,
    "name": 1,
    "open": 1,
    "phoneNumber": 1,
    "styleUrl": 1,
    "visibility": 1
  };
  filter[feature.getGeometryName()] = 1;
  const keys = Object.keys(properties || {}).sort().filter(function(v) {
    return !filter[v];
  });
  const styleFunction = feature.getStyleFunction();
  if (styleFunction) {
    const styles = styleFunction(feature, 0);
    if (styles) {
      const styleArray = Array.isArray(styles) ? styles : [styles];
      let pointStyles = styleArray;
      if (feature.getGeometry()) {
        pointStyles = styleArray.filter(function(style) {
          const geometry2 = style.getGeometryFunction()(feature);
          if (geometry2) {
            const type = geometry2.getType();
            if (type === "GeometryCollection") {
              return (
                /** @type {GeometryCollection} */
                geometry2.getGeometriesArrayRecursive().filter(function(geometry3) {
                  const type2 = geometry3.getType();
                  return type2 === "Point" || type2 === "MultiPoint";
                }).length
              );
            }
            return type === "Point" || type === "MultiPoint";
          }
        });
        "Point";
      }
      if (this.writeStyles_) {
        let lineStyles = styleArray;
        let polyStyles = styleArray;
        if (feature.getGeometry()) {
          lineStyles = styleArray.filter(function(style) {
            const geometry2 = style.getGeometryFunction()(feature);
            if (geometry2) {
              const type = geometry2.getType();
              if (type === "GeometryCollection") {
                return (
                  /** @type {GeometryCollection} */
                  geometry2.getGeometriesArrayRecursive().filter(function(geometry3) {
                    const type2 = geometry3.getType();
                    return type2 === "LineString" || type2 === "MultiLineString";
                  }).length
                );
              }
              return type === "LineString" || type === "MultiLineString";
            }
          });
          polyStyles = styleArray.filter(function(style) {
            const geometry2 = style.getGeometryFunction()(feature);
            if (geometry2) {
              const type = geometry2.getType();
              if (type === "GeometryCollection") {
                return (
                  /** @type {GeometryCollection} */
                  geometry2.getGeometriesArrayRecursive().filter(function(geometry3) {
                    const type2 = geometry3.getType();
                    return type2 === "Polygon" || type2 === "MultiPolygon";
                  }).length
                );
              }
              return type === "Polygon" || type === "MultiPolygon";
            }
          });
        }
        properties["Style"] = {
          pointStyles,
          lineStyles,
          polyStyles
        };
      }
      if (pointStyles.length && properties["name"] === void 0) {
        const textStyle = pointStyles[0].getText();
        if (textStyle) {
          properties["name"] = textStyle.getText();
        }
      }
    }
  }
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = PLACEMARK_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    PLACEMARK_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
  if (keys.length > 0) {
    const sequence = makeSequence(properties, keys);
    const namesAndValues = { names: keys, values: sequence };
    pushSerializeAndPop(
      context,
      PLACEMARK_SERIALIZERS,
      EXTENDEDDATA_NODE_FACTORY,
      [namesAndValues],
      objectStack
    );
  }
  const options = (
    /** @type {import("./Feature.js").WriteOptions} */
    objectStack[0]
  );
  let geometry = feature.getGeometry();
  if (geometry) {
    geometry = transformGeometryWithOptions(geometry, true, options);
  }
  pushSerializeAndPop(
    context,
    PLACEMARK_SERIALIZERS,
    GEOMETRY_NODE_FACTORY,
    [geometry],
    objectStack
  );
}
var PRIMITIVE_GEOMETRY_SEQUENCE = makeStructureNS(NAMESPACE_URIS, [
  "extrude",
  "tessellate",
  "altitudeMode",
  "coordinates"
]);
var PRIMITIVE_GEOMETRY_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "extrude": makeChildAppender(writeBooleanTextNode),
  "tessellate": makeChildAppender(writeBooleanTextNode),
  "altitudeMode": makeChildAppender(writeStringTextNode),
  "coordinates": makeChildAppender(writeCoordinatesTextNode)
});
function writePrimitiveGeometry(node, geometry, objectStack) {
  const flatCoordinates = geometry.getFlatCoordinates();
  const context = { node };
  context["layout"] = geometry.getLayout();
  context["stride"] = geometry.getStride();
  const properties = geometry.getProperties();
  properties.coordinates = flatCoordinates;
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = PRIMITIVE_GEOMETRY_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    PRIMITIVE_GEOMETRY_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
var POLY_STYLE_SEQUENCE = makeStructureNS(NAMESPACE_URIS, [
  "color",
  "fill",
  "outline"
]);
var POLYGON_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "outerBoundaryIs": makeChildAppender(writeBoundaryIs),
  "innerBoundaryIs": makeChildAppender(writeBoundaryIs)
});
var INNER_BOUNDARY_NODE_FACTORY = makeSimpleNodeFactory("innerBoundaryIs");
var OUTER_BOUNDARY_NODE_FACTORY = makeSimpleNodeFactory("outerBoundaryIs");
function writePolygon(node, polygon, objectStack) {
  const linearRings = polygon.getLinearRings();
  const outerRing = linearRings.shift();
  const context = { node };
  pushSerializeAndPop(
    context,
    POLYGON_SERIALIZERS,
    INNER_BOUNDARY_NODE_FACTORY,
    linearRings,
    objectStack
  );
  pushSerializeAndPop(
    context,
    POLYGON_SERIALIZERS,
    OUTER_BOUNDARY_NODE_FACTORY,
    [outerRing],
    objectStack
  );
}
var POLY_STYLE_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "color": makeChildAppender(writeColorTextNode),
  "fill": makeChildAppender(writeBooleanTextNode),
  "outline": makeChildAppender(writeBooleanTextNode)
});
function writePolyStyle(node, style, objectStack) {
  const context = { node };
  const fill = style.getFill();
  const stroke = style.getStroke();
  const properties = {
    "color": fill ? fill.getColor() : void 0,
    "fill": fill ? void 0 : false,
    "outline": stroke ? void 0 : false
  };
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = POLY_STYLE_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    POLY_STYLE_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
function writeScaleTextNode(node, scale) {
  writeDecimalTextNode(node, Math.round(scale * 1e6) / 1e6);
}
var STYLE_SEQUENCE = makeStructureNS(NAMESPACE_URIS, [
  "IconStyle",
  "LabelStyle",
  "LineStyle",
  "PolyStyle"
]);
var STYLE_SERIALIZERS = makeStructureNS(NAMESPACE_URIS, {
  "IconStyle": makeChildAppender(writeIconStyle),
  "LabelStyle": makeChildAppender(writeLabelStyle),
  "LineStyle": makeChildAppender(writeLineStyle),
  "PolyStyle": makeChildAppender(writePolyStyle)
});
function writeStyle(node, styles, objectStack) {
  const context = { node };
  const properties = {};
  if (styles.pointStyles.length) {
    const textStyle = styles.pointStyles[0].getText();
    if (textStyle) {
      properties["LabelStyle"] = textStyle;
    }
    const imageStyle = styles.pointStyles[0].getImage();
    if (imageStyle && typeof /** @type {?} */
    imageStyle.getSrc === "function") {
      properties["IconStyle"] = imageStyle;
    }
  }
  if (styles.lineStyles.length) {
    const strokeStyle = styles.lineStyles[0].getStroke();
    if (strokeStyle) {
      properties["LineStyle"] = strokeStyle;
    }
  }
  if (styles.polyStyles.length) {
    const strokeStyle = styles.polyStyles[0].getStroke();
    if (strokeStyle && !properties["LineStyle"]) {
      properties["LineStyle"] = strokeStyle;
    }
    properties["PolyStyle"] = styles.polyStyles[0];
  }
  const parentNode = objectStack[objectStack.length - 1].node;
  const orderedKeys = STYLE_SEQUENCE[parentNode.namespaceURI];
  const values = makeSequence(properties, orderedKeys);
  pushSerializeAndPop(
    context,
    STYLE_SERIALIZERS,
    OBJECT_PROPERTY_NODE_FACTORY,
    values,
    objectStack,
    orderedKeys
  );
}
function writeVec2(node, vec2) {
  node.setAttribute("x", String(vec2.x));
  node.setAttribute("y", String(vec2.y));
  node.setAttribute("xunits", vec2.xunits);
  node.setAttribute("yunits", vec2.yunits);
}
var KML_default = KML;
export {
  KML_default as default,
  getDefaultFillStyle,
  getDefaultImageStyle,
  getDefaultStrokeStyle,
  getDefaultStyle,
  getDefaultStyleArray,
  getDefaultTextStyle,
  readFlatCoordinates
};
//# sourceMappingURL=ol_format_KML.js.map
