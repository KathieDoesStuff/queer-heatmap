import {
  RBush
} from "./chunk-HKKYR7SI.js";
import {
  CollectionEventType_default,
  Collection_default
} from "./chunk-L54ACQND.js";
import {
  containsExtent,
  createOrUpdate,
  equals,
  get,
  wrapAndSliceX
} from "./chunk-Z65V5NHV.js";
import {
  assert
} from "./chunk-XLOLXDZY.js";
import {
  EventType_default,
  Event_default,
  ObjectEventType_default,
  Object_default,
  TRUE,
  VOID,
  extend,
  getUid,
  isEmpty,
  listen,
  unlistenByKey
} from "./chunk-JLG4I4EQ.js";

// node_modules/ol/structs/RBush.js
var RBush2 = class {
  /**
   * @param {number} [maxEntries] Max entries.
   */
  constructor(maxEntries) {
    this.rbush_ = new RBush(maxEntries);
    this.items_ = {};
  }
  /**
   * Insert a value into the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  insert(extent, value) {
    const item = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      value
    };
    this.rbush_.insert(item);
    this.items_[getUid(value)] = item;
  }
  /**
   * Bulk-insert values into the RBush.
   * @param {Array<import("../extent.js").Extent>} extents Extents.
   * @param {Array<T>} values Values.
   */
  load(extents, values) {
    const items = new Array(values.length);
    for (let i = 0, l = values.length; i < l; i++) {
      const extent = extents[i];
      const value = values[i];
      const item = {
        minX: extent[0],
        minY: extent[1],
        maxX: extent[2],
        maxY: extent[3],
        value
      };
      items[i] = item;
      this.items_[getUid(value)] = item;
    }
    this.rbush_.load(items);
  }
  /**
   * Remove a value from the RBush.
   * @param {T} value Value.
   * @return {boolean} Removed.
   */
  remove(value) {
    const uid = getUid(value);
    const item = this.items_[uid];
    delete this.items_[uid];
    return this.rbush_.remove(item) !== null;
  }
  /**
   * Update the extent of a value in the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  update(extent, value) {
    const item = this.items_[getUid(value)];
    const bbox = [item.minX, item.minY, item.maxX, item.maxY];
    if (!equals(bbox, extent)) {
      this.remove(value);
      this.insert(extent, value);
    }
  }
  /**
   * Return all values in the RBush.
   * @return {Array<T>} All.
   */
  getAll() {
    const items = this.rbush_.all();
    return items.map(function(item) {
      return item.value;
    });
  }
  /**
   * Return all values in the given extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {Array<T>} All in extent.
   */
  getInExtent(extent) {
    const bbox = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3]
    };
    const items = this.rbush_.search(bbox);
    return items.map(function(item) {
      return item.value;
    });
  }
  /**
   * Calls a callback function with each value in the tree.
   * If the callback returns a truthy value, this value is returned without
   * checking the rest of the tree.
   * @param {function(T): *} callback Callback.
   * @return {*} Callback return value.
   */
  forEach(callback) {
    return this.forEach_(this.getAll(), callback);
  }
  /**
   * Calls a callback function with each value in the provided extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(T): *} callback Callback.
   * @return {*} Callback return value.
   */
  forEachInExtent(extent, callback) {
    return this.forEach_(this.getInExtent(extent), callback);
  }
  /**
   * @param {Array<T>} values Values.
   * @param {function(T): *} callback Callback.
   * @private
   * @return {*} Callback return value.
   */
  forEach_(values, callback) {
    let result;
    for (let i = 0, l = values.length; i < l; i++) {
      result = callback(values[i]);
      if (result) {
        return result;
      }
    }
    return result;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return isEmpty(this.items_);
  }
  /**
   * Remove all values from the RBush.
   */
  clear() {
    this.rbush_.clear();
    this.items_ = {};
  }
  /**
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} Extent.
   */
  getExtent(extent) {
    const data = this.rbush_.toJSON();
    return createOrUpdate(data.minX, data.minY, data.maxX, data.maxY, extent);
  }
  /**
   * @param {RBush} rbush R-Tree.
   */
  concat(rbush) {
    this.rbush_.load(rbush.rbush_.all());
    for (const i in rbush.items_) {
      this.items_[i] = rbush.items_[i];
    }
  }
};
var RBush_default = RBush2;

// node_modules/ol/source/Source.js
var Source = class extends Object_default {
  /**
   * @param {Options} options Source options.
   */
  constructor(options) {
    super();
    this.projection = get(options.projection);
    this.attributions_ = adaptAttributions(options.attributions);
    this.attributionsCollapsible_ = options.attributionsCollapsible !== void 0 ? options.attributionsCollapsible : true;
    this.loading = false;
    this.state_ = options.state !== void 0 ? options.state : "ready";
    this.wrapX_ = options.wrapX !== void 0 ? options.wrapX : false;
    this.interpolate_ = !!options.interpolate;
    this.viewResolver = null;
    this.viewRejector = null;
    const self = this;
    this.viewPromise_ = new Promise(function(resolve, reject) {
      self.viewResolver = resolve;
      self.viewRejector = reject;
    });
  }
  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   * @api
   */
  getAttributions() {
    return this.attributions_;
  }
  /**
   * @return {boolean} Attributions are collapsible.
   * @api
   */
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default|null} Projection.
   * @api
   */
  getProjection() {
    return this.projection;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(projection) {
    return null;
  }
  /**
   * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
   */
  getView() {
    return this.viewPromise_;
  }
  /**
   * Get the state of the source, see {@link import("./Source.js").State} for possible states.
   * @return {import("./Source.js").State} State.
   * @api
   */
  getState() {
    return this.state_;
  }
  /**
   * @return {boolean|undefined} Wrap X.
   */
  getWrapX() {
    return this.wrapX_;
  }
  /**
   * @return {boolean} Use linear interpolation when resampling.
   */
  getInterpolate() {
    return this.interpolate_;
  }
  /**
   * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
   * @api
   */
  refresh() {
    this.changed();
  }
  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
   *     or `undefined`.
   * @api
   */
  setAttributions(attributions) {
    this.attributions_ = adaptAttributions(attributions);
    this.changed();
  }
  /**
   * Set the state of the source.
   * @param {import("./Source.js").State} state State.
   */
  setState(state) {
    this.state_ = state;
    this.changed();
  }
};
function adaptAttributions(attributionLike) {
  if (!attributionLike) {
    return null;
  }
  if (Array.isArray(attributionLike)) {
    return function(frameState) {
      return attributionLike;
    };
  }
  if (typeof attributionLike === "function") {
    return attributionLike;
  }
  return function(frameState) {
    return [attributionLike];
  };
}
var Source_default = Source;

// node_modules/ol/source/VectorEventType.js
var VectorEventType_default = {
  /**
   * Triggered when a feature is added to the source.
   * @event module:ol/source/Vector.VectorSourceEvent#addfeature
   * @api
   */
  ADDFEATURE: "addfeature",
  /**
   * Triggered when a feature is updated.
   * @event module:ol/source/Vector.VectorSourceEvent#changefeature
   * @api
   */
  CHANGEFEATURE: "changefeature",
  /**
   * Triggered when the clear method is called on the source.
   * @event module:ol/source/Vector.VectorSourceEvent#clear
   * @api
   */
  CLEAR: "clear",
  /**
   * Triggered when a feature is removed from the source.
   * See {@link module:ol/source/Vector~VectorSource#clear source.clear()} for exceptions.
   * @event module:ol/source/Vector.VectorSourceEvent#removefeature
   * @api
   */
  REMOVEFEATURE: "removefeature",
  /**
   * Triggered when features starts loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadstart
   * @api
   */
  FEATURESLOADSTART: "featuresloadstart",
  /**
   * Triggered when features finishes loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadend
   * @api
   */
  FEATURESLOADEND: "featuresloadend",
  /**
   * Triggered if feature loading results in an error.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloaderror
   * @api
   */
  FEATURESLOADERROR: "featuresloaderror"
};

// node_modules/ol/loadingstrategy.js
function all(extent, resolution) {
  return [[-Infinity, -Infinity, Infinity, Infinity]];
}

// node_modules/ol/featureloader.js
var withCredentials = false;
function loadFeaturesXhr(url, format, extent, resolution, projection, success, failure) {
  const xhr2 = new XMLHttpRequest();
  xhr2.open(
    "GET",
    typeof url === "function" ? url(extent, resolution, projection) : url,
    true
  );
  if (format.getType() == "arraybuffer") {
    xhr2.responseType = "arraybuffer";
  }
  xhr2.withCredentials = withCredentials;
  xhr2.onload = function(event) {
    if (!xhr2.status || xhr2.status >= 200 && xhr2.status < 300) {
      const type = format.getType();
      let source;
      if (type == "json" || type == "text") {
        source = xhr2.responseText;
      } else if (type == "xml") {
        source = xhr2.responseXML;
        if (!source) {
          source = new DOMParser().parseFromString(
            xhr2.responseText,
            "application/xml"
          );
        }
      } else if (type == "arraybuffer") {
        source = /** @type {ArrayBuffer} */
        xhr2.response;
      }
      if (source) {
        success(
          /** @type {Array<import("./Feature.js").default>} */
          format.readFeatures(source, {
            extent,
            featureProjection: projection
          }),
          format.readProjection(source)
        );
      } else {
        failure();
      }
    } else {
      failure();
    }
  };
  xhr2.onerror = failure;
  xhr2.send();
}
function xhr(url, format) {
  return function(extent, resolution, projection, success, failure) {
    const source = (
      /** @type {import("./source/Vector").default} */
      this
    );
    loadFeaturesXhr(
      url,
      format,
      extent,
      resolution,
      projection,
      /**
       * @param {Array<import("./Feature.js").default>} features The loaded features.
       * @param {import("./proj/Projection.js").default} dataProjection Data
       * projection.
       */
      function(features, dataProjection) {
        source.addFeatures(features);
        if (success !== void 0) {
          success(features);
        }
      },
      /* FIXME handle error */
      failure ? failure : VOID
    );
  };
}

// node_modules/ol/source/Vector.js
var VectorSourceEvent = class extends Event_default {
  /**
   * @param {string} type Type.
   * @param {import("../Feature.js").default<Geometry>} [feature] Feature.
   * @param {Array<import("../Feature.js").default<Geometry>>} [features] Features.
   */
  constructor(type, feature, features) {
    super(type);
    this.feature = feature;
    this.features = features;
  }
};
var VectorSource = class extends Source_default {
  /**
   * @param {Options<Geometry>} [options] Vector source options.
   */
  constructor(options) {
    options = options || {};
    super({
      attributions: options.attributions,
      interpolate: true,
      projection: void 0,
      state: "ready",
      wrapX: options.wrapX !== void 0 ? options.wrapX : true
    });
    this.on;
    this.once;
    this.un;
    this.loader_ = VOID;
    this.format_ = options.format;
    this.overlaps_ = options.overlaps === void 0 ? true : options.overlaps;
    this.url_ = options.url;
    if (options.loader !== void 0) {
      this.loader_ = options.loader;
    } else if (this.url_ !== void 0) {
      assert(this.format_, "`format` must be set when `url` is set");
      this.loader_ = xhr(
        this.url_,
        /** @type {import("../format/Feature.js").default} */
        this.format_
      );
    }
    this.strategy_ = options.strategy !== void 0 ? options.strategy : all;
    const useSpatialIndex = options.useSpatialIndex !== void 0 ? options.useSpatialIndex : true;
    this.featuresRtree_ = useSpatialIndex ? new RBush_default() : null;
    this.loadedExtentsRtree_ = new RBush_default();
    this.loadingExtentsCount_ = 0;
    this.nullGeometryFeatures_ = {};
    this.idIndex_ = {};
    this.uidIndex_ = {};
    this.featureChangeKeys_ = {};
    this.featuresCollection_ = null;
    let collection;
    let features;
    if (Array.isArray(options.features)) {
      features = options.features;
    } else if (options.features) {
      collection = options.features;
      features = collection.getArray();
    }
    if (!useSpatialIndex && collection === void 0) {
      collection = new Collection_default(features);
    }
    if (features !== void 0) {
      this.addFeaturesInternal(features);
    }
    if (collection !== void 0) {
      this.bindFeaturesCollection_(collection);
    }
  }
  /**
   * Add a single feature to the source.  If you want to add a batch of features
   * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
   * instead. A feature will not be added to the source if feature with
   * the same id is already there. The reason for this behavior is to avoid
   * feature duplication when using bbox or tile loading strategies.
   * Note: this also applies if an {@link module:ol/Collection~Collection} is used for features,
   * meaning that if a feature with a duplicate id is added in the collection, it will
   * be removed from it right away.
   * @param {import("../Feature.js").default<Geometry>} feature Feature to add.
   * @api
   */
  addFeature(feature) {
    this.addFeatureInternal(feature);
    this.changed();
  }
  /**
   * Add a feature without firing a `change` event.
   * @param {import("../Feature.js").default<Geometry>} feature Feature.
   * @protected
   */
  addFeatureInternal(feature) {
    const featureKey = getUid(feature);
    if (!this.addToIndex_(featureKey, feature)) {
      if (this.featuresCollection_) {
        this.featuresCollection_.remove(feature);
      }
      return;
    }
    this.setupChangeEvents_(featureKey, feature);
    const geometry = feature.getGeometry();
    if (geometry) {
      const extent = geometry.getExtent();
      if (this.featuresRtree_) {
        this.featuresRtree_.insert(extent, feature);
      }
    } else {
      this.nullGeometryFeatures_[featureKey] = feature;
    }
    this.dispatchEvent(
      new VectorSourceEvent(VectorEventType_default.ADDFEATURE, feature)
    );
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {import("../Feature.js").default<Geometry>} feature The feature.
   * @private
   */
  setupChangeEvents_(featureKey, feature) {
    this.featureChangeKeys_[featureKey] = [
      listen(feature, EventType_default.CHANGE, this.handleFeatureChange_, this),
      listen(
        feature,
        ObjectEventType_default.PROPERTYCHANGE,
        this.handleFeatureChange_,
        this
      )
    ];
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {import("../Feature.js").default<Geometry>} feature The feature.
   * @return {boolean} The feature is "valid", in the sense that it is also a
   *     candidate for insertion into the Rtree.
   * @private
   */
  addToIndex_(featureKey, feature) {
    let valid = true;
    const id = feature.getId();
    if (id !== void 0) {
      if (!(id.toString() in this.idIndex_)) {
        this.idIndex_[id.toString()] = feature;
      } else {
        valid = false;
      }
    }
    if (valid) {
      assert(
        !(featureKey in this.uidIndex_),
        "The passed `feature` was already added to the source"
      );
      this.uidIndex_[featureKey] = feature;
    }
    return valid;
  }
  /**
   * Add a batch of features to the source.
   * @param {Array<import("../Feature.js").default<Geometry>>} features Features to add.
   * @api
   */
  addFeatures(features) {
    this.addFeaturesInternal(features);
    this.changed();
  }
  /**
   * Add features without firing a `change` event.
   * @param {Array<import("../Feature.js").default<Geometry>>} features Features.
   * @protected
   */
  addFeaturesInternal(features) {
    const extents = [];
    const newFeatures = [];
    const geometryFeatures = [];
    for (let i = 0, length = features.length; i < length; i++) {
      const feature = features[i];
      const featureKey = getUid(feature);
      if (this.addToIndex_(featureKey, feature)) {
        newFeatures.push(feature);
      }
    }
    for (let i = 0, length = newFeatures.length; i < length; i++) {
      const feature = newFeatures[i];
      const featureKey = getUid(feature);
      this.setupChangeEvents_(featureKey, feature);
      const geometry = feature.getGeometry();
      if (geometry) {
        const extent = geometry.getExtent();
        extents.push(extent);
        geometryFeatures.push(feature);
      } else {
        this.nullGeometryFeatures_[featureKey] = feature;
      }
    }
    if (this.featuresRtree_) {
      this.featuresRtree_.load(extents, geometryFeatures);
    }
    if (this.hasListener(VectorEventType_default.ADDFEATURE)) {
      for (let i = 0, length = newFeatures.length; i < length; i++) {
        this.dispatchEvent(
          new VectorSourceEvent(VectorEventType_default.ADDFEATURE, newFeatures[i])
        );
      }
    }
  }
  /**
   * @param {!Collection<import("../Feature.js").default<Geometry>>} collection Collection.
   * @private
   */
  bindFeaturesCollection_(collection) {
    let modifyingCollection = false;
    this.addEventListener(
      VectorEventType_default.ADDFEATURE,
      /**
       * @param {VectorSourceEvent<Geometry>} evt The vector source event
       */
      function(evt) {
        if (!modifyingCollection) {
          modifyingCollection = true;
          collection.push(evt.feature);
          modifyingCollection = false;
        }
      }
    );
    this.addEventListener(
      VectorEventType_default.REMOVEFEATURE,
      /**
       * @param {VectorSourceEvent<Geometry>} evt The vector source event
       */
      function(evt) {
        if (!modifyingCollection) {
          modifyingCollection = true;
          collection.remove(evt.feature);
          modifyingCollection = false;
        }
      }
    );
    collection.addEventListener(
      CollectionEventType_default.ADD,
      /**
       * @param {import("../Collection.js").CollectionEvent<import("../Feature.js").default<Geometry>>} evt The collection event
       */
      (evt) => {
        if (!modifyingCollection) {
          modifyingCollection = true;
          this.addFeature(evt.element);
          modifyingCollection = false;
        }
      }
    );
    collection.addEventListener(
      CollectionEventType_default.REMOVE,
      /**
       * @param {import("../Collection.js").CollectionEvent<import("../Feature.js").default<Geometry>>} evt The collection event
       */
      (evt) => {
        if (!modifyingCollection) {
          modifyingCollection = true;
          this.removeFeature(evt.element);
          modifyingCollection = false;
        }
      }
    );
    this.featuresCollection_ = collection;
  }
  /**
   * Remove all features from the source.
   * @param {boolean} [fast] Skip dispatching of {@link module:ol/source/Vector.VectorSourceEvent#event:removefeature} events.
   * @api
   */
  clear(fast) {
    if (fast) {
      for (const featureId in this.featureChangeKeys_) {
        const keys = this.featureChangeKeys_[featureId];
        keys.forEach(unlistenByKey);
      }
      if (!this.featuresCollection_) {
        this.featureChangeKeys_ = {};
        this.idIndex_ = {};
        this.uidIndex_ = {};
      }
    } else {
      if (this.featuresRtree_) {
        const removeAndIgnoreReturn = (feature) => {
          this.removeFeatureInternal(feature);
        };
        this.featuresRtree_.forEach(removeAndIgnoreReturn);
        for (const id in this.nullGeometryFeatures_) {
          this.removeFeatureInternal(this.nullGeometryFeatures_[id]);
        }
      }
    }
    if (this.featuresCollection_) {
      this.featuresCollection_.clear();
    }
    if (this.featuresRtree_) {
      this.featuresRtree_.clear();
    }
    this.nullGeometryFeatures_ = {};
    const clearEvent = new VectorSourceEvent(VectorEventType_default.CLEAR);
    this.dispatchEvent(clearEvent);
    this.changed();
  }
  /**
   * Iterate through all features on the source, calling the provided callback
   * with each one.  If the callback returns any "truthy" value, iteration will
   * stop and the function will return the same value.
   * Note: this function only iterate through the feature that have a defined geometry.
   *
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     on the source.  Return a truthy value to stop iteration.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeature(callback) {
    if (this.featuresRtree_) {
      return this.featuresRtree_.forEach(callback);
    }
    if (this.featuresCollection_) {
      this.featuresCollection_.forEach(callback);
    }
  }
  /**
   * Iterate through all features whose geometries contain the provided
   * coordinate, calling the callback with each feature.  If the callback returns
   * a "truthy" value, iteration will stop and the function will return the same
   * value.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     whose goemetry contains the provided coordinate.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   */
  forEachFeatureAtCoordinateDirect(coordinate, callback) {
    const extent = [coordinate[0], coordinate[1], coordinate[0], coordinate[1]];
    return this.forEachFeatureInExtent(extent, function(feature) {
      const geometry = feature.getGeometry();
      if (geometry.intersectsCoordinate(coordinate)) {
        return callback(feature);
      }
      return void 0;
    });
  }
  /**
   * Iterate through all features whose bounding box intersects the provided
   * extent (note that the feature's geometry may not intersect the extent),
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you are interested in features whose geometry intersects an extent, call
   * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
   *
   * When `useSpatialIndex` is set to false, this method will loop through all
   * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     whose bounding box intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureInExtent(extent, callback) {
    if (this.featuresRtree_) {
      return this.featuresRtree_.forEachInExtent(extent, callback);
    }
    if (this.featuresCollection_) {
      this.featuresCollection_.forEach(callback);
    }
  }
  /**
   * Iterate through all features whose geometry intersects the provided extent,
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you only want to test for bounding box intersection, call the
   * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     whose geometry intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureIntersectingExtent(extent, callback) {
    return this.forEachFeatureInExtent(
      extent,
      /**
       * @param {import("../Feature.js").default<Geometry>} feature Feature.
       * @return {T|undefined} The return value from the last call to the callback.
       */
      function(feature) {
        const geometry = feature.getGeometry();
        if (geometry.intersectsExtent(extent)) {
          const result = callback(feature);
          if (result) {
            return result;
          }
        }
      }
    );
  }
  /**
   * Get the features collection associated with this source. Will be `null`
   * unless the source was configured with `useSpatialIndex` set to `false`, or
   * with an {@link module:ol/Collection~Collection} as `features`.
   * @return {Collection<import("../Feature.js").default<Geometry>>|null} The collection of features.
   * @api
   */
  getFeaturesCollection() {
    return this.featuresCollection_;
  }
  /**
   * Get a snapshot of the features currently on the source in random order. The returned array
   * is a copy, the features are references to the features in the source.
   * @return {Array<import("../Feature.js").default<Geometry>>} Features.
   * @api
   */
  getFeatures() {
    let features;
    if (this.featuresCollection_) {
      features = this.featuresCollection_.getArray().slice(0);
    } else if (this.featuresRtree_) {
      features = this.featuresRtree_.getAll();
      if (!isEmpty(this.nullGeometryFeatures_)) {
        extend(features, Object.values(this.nullGeometryFeatures_));
      }
    }
    return (
      /** @type {Array<import("../Feature.js").default<Geometry>>} */
      features
    );
  }
  /**
   * Get all features whose geometry intersects the provided coordinate.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {Array<import("../Feature.js").default<Geometry>>} Features.
   * @api
   */
  getFeaturesAtCoordinate(coordinate) {
    const features = [];
    this.forEachFeatureAtCoordinateDirect(coordinate, function(feature) {
      features.push(feature);
    });
    return features;
  }
  /**
   * Get all features whose bounding box intersects the provided extent.  Note that this returns an array of
   * all features intersecting the given extent in random order (so it may include
   * features whose geometries do not intersect the extent).
   *
   * When `useSpatialIndex` is set to false, this method will return all
   * features.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {import("../proj/Projection.js").default} [projection] Include features
   * where `extent` exceeds the x-axis bounds of `projection` and wraps around the world.
   * @return {Array<import("../Feature.js").default<Geometry>>} Features.
   * @api
   */
  getFeaturesInExtent(extent, projection) {
    if (this.featuresRtree_) {
      const multiWorld = projection && projection.canWrapX() && this.getWrapX();
      if (!multiWorld) {
        return this.featuresRtree_.getInExtent(extent);
      }
      const extents = wrapAndSliceX(extent, projection);
      return [].concat(
        ...extents.map((anExtent) => this.featuresRtree_.getInExtent(anExtent))
      );
    }
    if (this.featuresCollection_) {
      return this.featuresCollection_.getArray().slice(0);
    }
    return [];
  }
  /**
   * Get the closest feature to the provided coordinate.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false`.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(import("../Feature.js").default<Geometry>):boolean} [filter] Feature filter function.
   *     The filter function will receive one argument, the {@link module:ol/Feature~Feature feature}
   *     and it should return a boolean value. By default, no filtering is made.
   * @return {import("../Feature.js").default<Geometry>} Closest feature.
   * @api
   */
  getClosestFeatureToCoordinate(coordinate, filter) {
    const x = coordinate[0];
    const y = coordinate[1];
    let closestFeature = null;
    const closestPoint = [NaN, NaN];
    let minSquaredDistance = Infinity;
    const extent = [-Infinity, -Infinity, Infinity, Infinity];
    filter = filter ? filter : TRUE;
    this.featuresRtree_.forEachInExtent(
      extent,
      /**
       * @param {import("../Feature.js").default<Geometry>} feature Feature.
       */
      function(feature) {
        if (filter(feature)) {
          const geometry = feature.getGeometry();
          const previousMinSquaredDistance = minSquaredDistance;
          minSquaredDistance = geometry.closestPointXY(
            x,
            y,
            closestPoint,
            minSquaredDistance
          );
          if (minSquaredDistance < previousMinSquaredDistance) {
            closestFeature = feature;
            const minDistance = Math.sqrt(minSquaredDistance);
            extent[0] = x - minDistance;
            extent[1] = y - minDistance;
            extent[2] = x + minDistance;
            extent[3] = y + minDistance;
          }
        }
      }
    );
    return closestFeature;
  }
  /**
   * Get the extent of the features currently in the source.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false`.
   * @param {import("../extent.js").Extent} [extent] Destination extent. If provided, no new extent
   *     will be created. Instead, that extent's coordinates will be overwritten.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent(extent) {
    return this.featuresRtree_.getExtent(extent);
  }
  /**
   * Get a feature by its identifier (the value returned by feature.getId()).
   * Note that the index treats string and numeric identifiers as the same.  So
   * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
   *
   * @param {string|number} id Feature identifier.
   * @return {import("../Feature.js").default<Geometry>|null} The feature (or `null` if not found).
   * @api
   */
  getFeatureById(id) {
    const feature = this.idIndex_[id.toString()];
    return feature !== void 0 ? feature : null;
  }
  /**
   * Get a feature by its internal unique identifier (using `getUid`).
   *
   * @param {string} uid Feature identifier.
   * @return {import("../Feature.js").default<Geometry>|null} The feature (or `null` if not found).
   */
  getFeatureByUid(uid) {
    const feature = this.uidIndex_[uid];
    return feature !== void 0 ? feature : null;
  }
  /**
   * Get the format associated with this source.
   *
   * @return {import("../format/Feature.js").default|undefined} The feature format.
   * @api
   */
  getFormat() {
    return this.format_;
  }
  /**
   * @return {boolean} The source can have overlapping geometries.
   */
  getOverlaps() {
    return this.overlaps_;
  }
  /**
   * Get the url associated with this source.
   *
   * @return {string|import("../featureloader.js").FeatureUrlFunction|undefined} The url.
   * @api
   */
  getUrl() {
    return this.url_;
  }
  /**
   * @param {Event} event Event.
   * @private
   */
  handleFeatureChange_(event) {
    const feature = (
      /** @type {import("../Feature.js").default<Geometry>} */
      event.target
    );
    const featureKey = getUid(feature);
    const geometry = feature.getGeometry();
    if (!geometry) {
      if (!(featureKey in this.nullGeometryFeatures_)) {
        if (this.featuresRtree_) {
          this.featuresRtree_.remove(feature);
        }
        this.nullGeometryFeatures_[featureKey] = feature;
      }
    } else {
      const extent = geometry.getExtent();
      if (featureKey in this.nullGeometryFeatures_) {
        delete this.nullGeometryFeatures_[featureKey];
        if (this.featuresRtree_) {
          this.featuresRtree_.insert(extent, feature);
        }
      } else {
        if (this.featuresRtree_) {
          this.featuresRtree_.update(extent, feature);
        }
      }
    }
    const id = feature.getId();
    if (id !== void 0) {
      const sid = id.toString();
      if (this.idIndex_[sid] !== feature) {
        this.removeFromIdIndex_(feature);
        this.idIndex_[sid] = feature;
      }
    } else {
      this.removeFromIdIndex_(feature);
      this.uidIndex_[featureKey] = feature;
    }
    this.changed();
    this.dispatchEvent(
      new VectorSourceEvent(VectorEventType_default.CHANGEFEATURE, feature)
    );
  }
  /**
   * Returns true if the feature is contained within the source.
   * @param {import("../Feature.js").default<Geometry>} feature Feature.
   * @return {boolean} Has feature.
   * @api
   */
  hasFeature(feature) {
    const id = feature.getId();
    if (id !== void 0) {
      return id in this.idIndex_;
    }
    return getUid(feature) in this.uidIndex_;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    if (this.featuresRtree_) {
      return this.featuresRtree_.isEmpty() && isEmpty(this.nullGeometryFeatures_);
    }
    if (this.featuresCollection_) {
      return this.featuresCollection_.getLength() === 0;
    }
    return true;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  loadFeatures(extent, resolution, projection) {
    const loadedExtentsRtree = this.loadedExtentsRtree_;
    const extentsToLoad = this.strategy_(extent, resolution, projection);
    for (let i = 0, ii = extentsToLoad.length; i < ii; ++i) {
      const extentToLoad = extentsToLoad[i];
      const alreadyLoaded = loadedExtentsRtree.forEachInExtent(
        extentToLoad,
        /**
         * @param {{extent: import("../extent.js").Extent}} object Object.
         * @return {boolean} Contains.
         */
        function(object) {
          return containsExtent(object.extent, extentToLoad);
        }
      );
      if (!alreadyLoaded) {
        ++this.loadingExtentsCount_;
        this.dispatchEvent(
          new VectorSourceEvent(VectorEventType_default.FEATURESLOADSTART)
        );
        this.loader_.call(
          this,
          extentToLoad,
          resolution,
          projection,
          (features) => {
            --this.loadingExtentsCount_;
            this.dispatchEvent(
              new VectorSourceEvent(
                VectorEventType_default.FEATURESLOADEND,
                void 0,
                features
              )
            );
          },
          () => {
            --this.loadingExtentsCount_;
            this.dispatchEvent(
              new VectorSourceEvent(VectorEventType_default.FEATURESLOADERROR)
            );
          }
        );
        loadedExtentsRtree.insert(extentToLoad, { extent: extentToLoad.slice() });
      }
    }
    this.loading = this.loader_.length < 4 ? false : this.loadingExtentsCount_ > 0;
  }
  refresh() {
    this.clear(true);
    this.loadedExtentsRtree_.clear();
    super.refresh();
  }
  /**
   * Remove an extent from the list of loaded extents.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  removeLoadedExtent(extent) {
    const loadedExtentsRtree = this.loadedExtentsRtree_;
    let obj;
    loadedExtentsRtree.forEachInExtent(extent, function(object) {
      if (equals(object.extent, extent)) {
        obj = object;
        return true;
      }
    });
    if (obj) {
      loadedExtentsRtree.remove(obj);
    }
  }
  /**
   * Remove a single feature from the source.  If you want to remove all features
   * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
   * instead.
   * @param {import("../Feature.js").default<Geometry>} feature Feature to remove.
   * @api
   */
  removeFeature(feature) {
    if (!feature) {
      return;
    }
    const featureKey = getUid(feature);
    if (featureKey in this.nullGeometryFeatures_) {
      delete this.nullGeometryFeatures_[featureKey];
    } else {
      if (this.featuresRtree_) {
        this.featuresRtree_.remove(feature);
      }
    }
    const result = this.removeFeatureInternal(feature);
    if (result) {
      this.changed();
    }
  }
  /**
   * Remove feature without firing a `change` event.
   * @param {import("../Feature.js").default<Geometry>} feature Feature.
   * @return {import("../Feature.js").default<Geometry>|undefined} The removed feature
   *     (or undefined if the feature was not found).
   * @protected
   */
  removeFeatureInternal(feature) {
    const featureKey = getUid(feature);
    const featureChangeKeys = this.featureChangeKeys_[featureKey];
    if (!featureChangeKeys) {
      return;
    }
    featureChangeKeys.forEach(unlistenByKey);
    delete this.featureChangeKeys_[featureKey];
    const id = feature.getId();
    if (id !== void 0) {
      delete this.idIndex_[id.toString()];
    }
    delete this.uidIndex_[featureKey];
    this.dispatchEvent(
      new VectorSourceEvent(VectorEventType_default.REMOVEFEATURE, feature)
    );
    return feature;
  }
  /**
   * Remove a feature from the id index.  Called internally when the feature id
   * may have changed.
   * @param {import("../Feature.js").default<Geometry>} feature The feature.
   * @return {boolean} Removed the feature from the index.
   * @private
   */
  removeFromIdIndex_(feature) {
    let removed = false;
    for (const id in this.idIndex_) {
      if (this.idIndex_[id] === feature) {
        delete this.idIndex_[id];
        removed = true;
        break;
      }
    }
    return removed;
  }
  /**
   * Set the new loader of the source. The next render cycle will use the
   * new loader.
   * @param {import("../featureloader.js").FeatureLoader} loader The loader to set.
   * @api
   */
  setLoader(loader) {
    this.loader_ = loader;
  }
  /**
   * Points the source to a new url. The next render cycle will use the new url.
   * @param {string|import("../featureloader.js").FeatureUrlFunction} url Url.
   * @api
   */
  setUrl(url) {
    assert(this.format_, "`format` must be set when `url` is set");
    this.url_ = url;
    this.setLoader(xhr(url, this.format_));
  }
};
var Vector_default = VectorSource;

export {
  Source_default,
  VectorEventType_default,
  loadFeaturesXhr,
  VectorSourceEvent,
  Vector_default
};
//# sourceMappingURL=chunk-C35G5BI7.js.map
