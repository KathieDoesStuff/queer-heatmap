import {
  Layer_default2
} from "./chunk-FEUY5YTX.js";
import {
  TileState_default
} from "./chunk-VLTZGDTC.js";
import {
  Layer_default
} from "./chunk-HTRXVZ7Z.js";
import {
  ViewHint_default,
  easeIn
} from "./chunk-MBX64NFB.js";
import {
  apply,
  compose,
  makeInverse,
  toString
} from "./chunk-KFWWOLVS.js";
import {
  boundingExtent,
  containsCoordinate,
  containsExtent,
  createEmpty,
  equals,
  extend,
  extendCoordinate,
  forEachCorner,
  fromUserExtent,
  getArea,
  getBottomLeft,
  getBottomRight,
  getCenter,
  getHeight,
  getIntersection,
  getPointResolution,
  getRotatedViewport,
  getTopLeft,
  getTopRight,
  getTransform,
  getWidth,
  intersects,
  isEmpty,
  transform
} from "./chunk-Z65V5NHV.js";
import {
  Image_default,
  listenImage
} from "./chunk-7WAVCBXX.js";
import {
  assert
} from "./chunk-XLOLXDZY.js";
import {
  ImageState_default
} from "./chunk-J5H2GECR.js";
import {
  createCanvasContext2D,
  releaseCanvas,
  toSize
} from "./chunk-NHXTUU2X.js";
import {
  EventType_default,
  Target_default,
  abstract,
  ascending,
  clamp,
  getUid,
  listen,
  modulo,
  solveLinearSystem,
  unlistenByKey
} from "./chunk-JLG4I4EQ.js";

// node_modules/ol/structs/LRUCache.js
var LRUCache = class {
  /**
   * @param {number} [highWaterMark] High water mark.
   */
  constructor(highWaterMark) {
    this.highWaterMark = highWaterMark !== void 0 ? highWaterMark : 2048;
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  /**
   * Expire the cache.
   * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
   */
  expireCache(keep) {
    while (this.canExpireCache()) {
      this.pop();
    }
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Contains key.
   */
  containsKey(key) {
    return this.entries_.hasOwnProperty(key);
  }
  /**
   * @param {function(T, string, LRUCache<T>): ?} f The function
   *     to call for every entry from the oldest to the newer. This function takes
   *     3 arguments (the entry value, the entry key and the LRUCache object).
   *     The return value is ignored.
   */
  forEach(f) {
    let entry = this.oldest_;
    while (entry) {
      f(entry.value_, entry.key_, this);
      entry = entry.newer;
    }
  }
  /**
   * @param {string} key Key.
   * @param {*} [options] Options (reserved for subclasses).
   * @return {T} Value.
   */
  get(key, options) {
    const entry = this.entries_[key];
    assert(
      entry !== void 0,
      "Tried to get a value for a key that does not exist in the cache"
    );
    if (entry === this.newest_) {
      return entry.value_;
    }
    if (entry === this.oldest_) {
      this.oldest_ = /** @type {Entry} */
      this.oldest_.newer;
      this.oldest_.older = null;
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    entry.newer = null;
    entry.older = this.newest_;
    this.newest_.newer = entry;
    this.newest_ = entry;
    return entry.value_;
  }
  /**
   * Remove an entry from the cache.
   * @param {string} key The entry key.
   * @return {T} The removed entry.
   */
  remove(key) {
    const entry = this.entries_[key];
    assert(
      entry !== void 0,
      "Tried to get a value for a key that does not exist in the cache"
    );
    if (entry === this.newest_) {
      this.newest_ = /** @type {Entry} */
      entry.older;
      if (this.newest_) {
        this.newest_.newer = null;
      }
    } else if (entry === this.oldest_) {
      this.oldest_ = /** @type {Entry} */
      entry.newer;
      if (this.oldest_) {
        this.oldest_.older = null;
      }
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    delete this.entries_[key];
    --this.count_;
    return entry.value_;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.count_;
  }
  /**
   * @return {Array<string>} Keys.
   */
  getKeys() {
    const keys = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      keys[i++] = entry.key_;
    }
    return keys;
  }
  /**
   * @return {Array<T>} Values.
   */
  getValues() {
    const values = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      values[i++] = entry.value_;
    }
    return values;
  }
  /**
   * @return {T} Last value.
   */
  peekLast() {
    return this.oldest_.value_;
  }
  /**
   * @return {string} Last key.
   */
  peekLastKey() {
    return this.oldest_.key_;
  }
  /**
   * Get the key of the newest item in the cache.  Throws if the cache is empty.
   * @return {string} The newest key.
   */
  peekFirstKey() {
    return this.newest_.key_;
  }
  /**
   * Return an entry without updating least recently used time.
   * @param {string} key Key.
   * @return {T} Value.
   */
  peek(key) {
    if (!this.containsKey(key)) {
      return void 0;
    }
    return this.entries_[key].value_;
  }
  /**
   * @return {T} value Value.
   */
  pop() {
    const entry = this.oldest_;
    delete this.entries_[entry.key_];
    if (entry.newer) {
      entry.newer.older = null;
    }
    this.oldest_ = /** @type {Entry} */
    entry.newer;
    if (!this.oldest_) {
      this.newest_ = null;
    }
    --this.count_;
    return entry.value_;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  replace(key, value) {
    this.get(key);
    this.entries_[key].value_ = value;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  set(key, value) {
    assert(
      !(key in this.entries_),
      "Tried to set a value for a key that is used already"
    );
    const entry = {
      key_: key,
      newer: null,
      older: this.newest_,
      value_: value
    };
    if (!this.newest_) {
      this.oldest_ = entry;
    } else {
      this.newest_.newer = entry;
    }
    this.newest_ = entry;
    this.entries_[key] = entry;
    ++this.count_;
  }
  /**
   * Set a maximum number of entries for the cache.
   * @param {number} size Cache size.
   * @api
   */
  setSize(size) {
    this.highWaterMark = size;
  }
};
var LRUCache_default = LRUCache;

// node_modules/ol/layer/BaseImage.js
var BaseImageLayer = class extends Layer_default {
  /**
   * @param {Options<ImageSourceType>} [options] Layer options.
   */
  constructor(options) {
    options = options ? options : {};
    super(options);
  }
};
var BaseImage_default = BaseImageLayer;

// node_modules/ol/renderer/canvas/ImageLayer.js
var CanvasImageLayerRenderer = class extends Layer_default2 {
  /**
   * @param {import("../../layer/Image.js").default} imageLayer Image layer.
   */
  constructor(imageLayer) {
    super(imageLayer);
    this.image_ = null;
  }
  /**
   * @return {import('../../DataTile.js').ImageLike} Image.
   */
  getImage() {
    return !this.image_ ? null : this.image_.getImage();
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(frameState) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const viewResolution = viewState.resolution;
    const imageSource = this.getLayer().getSource();
    const hints = frameState.viewHints;
    let renderedExtent = frameState.extent;
    if (layerState.extent !== void 0) {
      renderedExtent = getIntersection(
        renderedExtent,
        fromUserExtent(layerState.extent, viewState.projection)
      );
    }
    if (!hints[ViewHint_default.ANIMATING] && !hints[ViewHint_default.INTERACTING] && !isEmpty(renderedExtent)) {
      if (imageSource) {
        const projection = viewState.projection;
        const image = imageSource.getImage(
          renderedExtent,
          viewResolution,
          pixelRatio,
          projection
        );
        if (image) {
          if (this.loadImage(image)) {
            this.image_ = image;
          } else if (image.getState() === ImageState_default.EMPTY) {
            this.image_ = null;
          }
        }
      } else {
        this.image_ = null;
      }
    }
    return !!this.image_;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   */
  getData(pixel) {
    const frameState = this.frameState;
    if (!frameState) {
      return null;
    }
    const layer = this.getLayer();
    const coordinate = apply(
      frameState.pixelToCoordinateTransform,
      pixel.slice()
    );
    const layerExtent = layer.getExtent();
    if (layerExtent) {
      if (!containsCoordinate(layerExtent, coordinate)) {
        return null;
      }
    }
    const imageExtent = this.image_.getExtent();
    const img = this.image_.getImage();
    const imageMapWidth = getWidth(imageExtent);
    const col = Math.floor(
      img.width * ((coordinate[0] - imageExtent[0]) / imageMapWidth)
    );
    if (col < 0 || col >= img.width) {
      return null;
    }
    const imageMapHeight = getHeight(imageExtent);
    const row = Math.floor(
      img.height * ((imageExtent[3] - coordinate[1]) / imageMapHeight)
    );
    if (row < 0 || row >= img.height) {
      return null;
    }
    return this.getImageData(img, col, row);
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(frameState, target) {
    const image = this.image_;
    const imageExtent = image.getExtent();
    const imageResolution = image.getResolution();
    const [imageResolutionX, imageResolutionY] = Array.isArray(imageResolution) ? imageResolution : [imageResolution, imageResolution];
    const imagePixelRatio = image.getPixelRatio();
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const viewCenter = viewState.center;
    const viewResolution = viewState.resolution;
    const scaleX = pixelRatio * imageResolutionX / (viewResolution * imagePixelRatio);
    const scaleY = pixelRatio * imageResolutionY / (viewResolution * imagePixelRatio);
    const extent = frameState.extent;
    const resolution = viewState.resolution;
    const rotation = viewState.rotation;
    const width = Math.round(getWidth(extent) / resolution * pixelRatio);
    const height = Math.round(getHeight(extent) / resolution * pixelRatio);
    compose(
      this.pixelTransform,
      frameState.size[0] / 2,
      frameState.size[1] / 2,
      1 / pixelRatio,
      1 / pixelRatio,
      rotation,
      -width / 2,
      -height / 2
    );
    makeInverse(this.inversePixelTransform, this.pixelTransform);
    const canvasTransform = toString(this.pixelTransform);
    this.useContainer(target, canvasTransform, this.getBackground(frameState));
    const context = this.context;
    const canvas = context.canvas;
    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }
    let clipped = false;
    let render2 = true;
    if (layerState.extent) {
      const layerExtent = fromUserExtent(
        layerState.extent,
        viewState.projection
      );
      render2 = intersects(layerExtent, frameState.extent);
      clipped = render2 && !containsExtent(layerExtent, frameState.extent);
      if (clipped) {
        this.clipUnrotated(context, frameState, layerExtent);
      }
    }
    const img = image.getImage();
    const transform2 = compose(
      this.tempTransform,
      width / 2,
      height / 2,
      scaleX,
      scaleY,
      0,
      imagePixelRatio * (imageExtent[0] - viewCenter[0]) / imageResolutionX,
      imagePixelRatio * (viewCenter[1] - imageExtent[3]) / imageResolutionY
    );
    this.renderedResolution = imageResolutionY * pixelRatio / imagePixelRatio;
    const dw = img.width * transform2[0];
    const dh = img.height * transform2[3];
    if (!this.getLayer().getSource().getInterpolate()) {
      context.imageSmoothingEnabled = false;
    }
    this.preRender(context, frameState);
    if (render2 && dw >= 0.5 && dh >= 0.5) {
      const dx = transform2[4];
      const dy = transform2[5];
      const opacity = layerState.opacity;
      let previousAlpha;
      if (opacity !== 1) {
        previousAlpha = context.globalAlpha;
        context.globalAlpha = opacity;
      }
      context.drawImage(img, 0, 0, +img.width, +img.height, dx, dy, dw, dh);
      if (opacity !== 1) {
        context.globalAlpha = previousAlpha;
      }
    }
    this.postRender(context, frameState);
    if (clipped) {
      context.restore();
    }
    context.imageSmoothingEnabled = true;
    if (canvasTransform !== canvas.style.transform) {
      canvas.style.transform = canvasTransform;
    }
    return this.container;
  }
};
var ImageLayer_default = CanvasImageLayerRenderer;

// node_modules/ol/layer/Image.js
var ImageLayer = class extends BaseImage_default {
  /**
   * @param {import("./BaseImage.js").Options<ImageSourceType>} [options] Layer options.
   */
  constructor(options) {
    super(options);
  }
  createRenderer() {
    return new ImageLayer_default(this);
  }
  /**
   * Get data for a pixel location.  A four element RGBA array will be returned.  For requests outside the
   * layer extent, `null` will be returned.  Data for an image can only be retrieved if the
   * source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   */
  getData(pixel) {
    return super.getData(pixel);
  }
};
var Image_default2 = ImageLayer;

// node_modules/ol/layer/TileProperty.js
var TileProperty_default = {
  PRELOAD: "preload",
  USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};

// node_modules/ol/layer/BaseTile.js
var BaseTileLayer = class extends Layer_default {
  /**
   * @param {Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(options) {
    options = options ? options : {};
    const baseOptions = Object.assign({}, options);
    delete baseOptions.preload;
    delete baseOptions.useInterimTilesOnError;
    super(baseOptions);
    this.on;
    this.once;
    this.un;
    this.setPreload(options.preload !== void 0 ? options.preload : 0);
    this.setUseInterimTilesOnError(
      options.useInterimTilesOnError !== void 0 ? options.useInterimTilesOnError : true
    );
  }
  /**
   * Return the level as number to which we will preload tiles up to.
   * @return {number} The level to preload tiles up to.
   * @observable
   * @api
   */
  getPreload() {
    return (
      /** @type {number} */
      this.get(TileProperty_default.PRELOAD)
    );
  }
  /**
   * Set the level as number to which we will preload tiles up to.
   * @param {number} preload The level to preload tiles up to.
   * @observable
   * @api
   */
  setPreload(preload) {
    this.set(TileProperty_default.PRELOAD, preload);
  }
  /**
   * Whether we use interim tiles on error.
   * @return {boolean} Use interim tiles on error.
   * @observable
   * @api
   */
  getUseInterimTilesOnError() {
    return (
      /** @type {boolean} */
      this.get(TileProperty_default.USE_INTERIM_TILES_ON_ERROR)
    );
  }
  /**
   * Set whether we use interim tiles on error.
   * @param {boolean} useInterimTilesOnError Use interim tiles on error.
   * @observable
   * @api
   */
  setUseInterimTilesOnError(useInterimTilesOnError) {
    this.set(TileProperty_default.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
  }
  /**
   * Get data for a pixel location.  The return type depends on the source data.  For image tiles,
   * a four element RGBA array will be returned.  For data tiles, the array length will match the
   * number of bands in the dataset.  For requests outside the layer extent, `null` will be returned.
   * Data for a image tiles can only be retrieved if the source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   */
  getData(pixel) {
    return super.getData(pixel);
  }
};
var BaseTile_default = BaseTileLayer;

// node_modules/ol/Tile.js
var Tile = class extends Target_default {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {Options} [options] Tile options.
   */
  constructor(tileCoord, state, options) {
    super();
    options = options ? options : {};
    this.tileCoord = tileCoord;
    this.state = state;
    this.interimTile = null;
    this.key = "";
    this.transition_ = options.transition === void 0 ? 250 : options.transition;
    this.transitionStarts_ = {};
    this.interpolate = !!options.interpolate;
  }
  /**
   * @protected
   */
  changed() {
    this.dispatchEvent(EventType_default.CHANGE);
  }
  /**
   * Called by the tile cache when the tile is removed from the cache due to expiry
   */
  release() {
    if (this.state === TileState_default.ERROR) {
      this.setState(TileState_default.EMPTY);
    }
  }
  /**
   * @return {string} Key.
   */
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  /**
   * Get the interim tile most suitable for rendering using the chain of interim
   * tiles. This corresponds to the  most recent tile that has been loaded, if no
   * such tile exists, the original tile is returned.
   * @return {!Tile} Best tile for rendering.
   */
  getInterimTile() {
    if (!this.interimTile) {
      return this;
    }
    let tile = this.interimTile;
    do {
      if (tile.getState() == TileState_default.LOADED) {
        this.transition_ = 0;
        return tile;
      }
      tile = tile.interimTile;
    } while (tile);
    return this;
  }
  /**
   * Goes through the chain of interim tiles and discards sections of the chain
   * that are no longer relevant.
   */
  refreshInterimChain() {
    if (!this.interimTile) {
      return;
    }
    let tile = this.interimTile;
    let prev = this;
    do {
      if (tile.getState() == TileState_default.LOADED) {
        tile.interimTile = null;
        break;
      } else if (tile.getState() == TileState_default.LOADING) {
        prev = tile;
      } else if (tile.getState() == TileState_default.IDLE) {
        prev.interimTile = tile.interimTile;
      } else {
        prev = tile;
      }
      tile = prev.interimTile;
    } while (tile);
  }
  /**
   * Get the tile coordinate for this tile.
   * @return {import("./tilecoord.js").TileCoord} The tile coordinate.
   * @api
   */
  getTileCoord() {
    return this.tileCoord;
  }
  /**
   * @return {import("./TileState.js").default} State.
   */
  getState() {
    return this.state;
  }
  /**
   * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
   * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
   * when the tile cannot be loaded. Otherwise the tile cannot be removed from
   * the tile queue and will block other requests.
   * @param {import("./TileState.js").default} state State.
   * @api
   */
  setState(state) {
    if (this.state !== TileState_default.ERROR && this.state > state) {
      throw new Error("Tile load sequence violation");
    }
    this.state = state;
    this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @abstract
   * @api
   */
  load() {
    abstract();
  }
  /**
   * Get the alpha value for rendering.
   * @param {string} id An id for the renderer.
   * @param {number} time The render frame time.
   * @return {number} A number between 0 and 1.
   */
  getAlpha(id, time) {
    if (!this.transition_) {
      return 1;
    }
    let start = this.transitionStarts_[id];
    if (!start) {
      start = time;
      this.transitionStarts_[id] = start;
    } else if (start === -1) {
      return 1;
    }
    const delta = time - start + 1e3 / 60;
    if (delta >= this.transition_) {
      return 1;
    }
    return easeIn(delta / this.transition_);
  }
  /**
   * Determine if a tile is in an alpha transition.  A tile is considered in
   * transition if tile.getAlpha() has not yet been called or has been called
   * and returned 1.
   * @param {string} id An id for the renderer.
   * @return {boolean} The tile is in transition.
   */
  inTransition(id) {
    if (!this.transition_) {
      return false;
    }
    return this.transitionStarts_[id] !== -1;
  }
  /**
   * Mark a transition as complete.
   * @param {string} id An id for the renderer.
   */
  endTransition(id) {
    if (this.transition_) {
      this.transitionStarts_[id] = -1;
    }
  }
};
var Tile_default = Tile;

// node_modules/ol/ImageTile.js
var ImageTile = class extends Tile_default {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @param {import("./Tile.js").Options} [options] Tile options.
   */
  constructor(tileCoord, state, src, crossOrigin, tileLoadFunction, options) {
    super(tileCoord, state, options);
    this.crossOrigin_ = crossOrigin;
    this.src_ = src;
    this.key = src;
    this.image_ = new Image();
    if (crossOrigin !== null) {
      this.image_.crossOrigin = crossOrigin;
    }
    this.unlisten_ = null;
    this.tileLoadFunction_ = tileLoadFunction;
  }
  /**
   * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
   * @param {HTMLCanvasElement|HTMLImageElement} element Element.
   */
  setImage(element) {
    this.image_ = element;
    this.state = TileState_default.LOADED;
    this.unlistenImage_();
    this.changed();
  }
  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  handleImageError_() {
    this.state = TileState_default.ERROR;
    this.unlistenImage_();
    this.image_ = getBlankImage();
    this.changed();
  }
  /**
   * Tracks successful image load.
   *
   * @private
   */
  handleImageLoad_() {
    const image = (
      /** @type {HTMLImageElement} */
      this.image_
    );
    if (image.naturalWidth && image.naturalHeight) {
      this.state = TileState_default.LOADED;
    } else {
      this.state = TileState_default.EMPTY;
    }
    this.unlistenImage_();
    this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   *
   * To retry loading tiles on failed requests, use a custom `tileLoadFunction`
   * that checks for error status codes and reloads only when the status code is
   * 408, 429, 500, 502, 503 and 504, and only when not too many retries have been
   * made already:
   *
   * ```js
   * const retryCodes = [408, 429, 500, 502, 503, 504];
   * const retries = {};
   * source.setTileLoadFunction((tile, src) => {
   *   const image = tile.getImage();
   *   fetch(src)
   *     .then((response) => {
   *       if (retryCodes.includes(response.status)) {
   *         retries[src] = (retries[src] || 0) + 1;
   *         if (retries[src] <= 3) {
   *           setTimeout(() => tile.load(), retries[src] * 1000);
   *         }
   *         return Promise.reject();
   *       }
   *       return response.blob();
   *     })
   *     .then((blob) => {
   *       const imageUrl = URL.createObjectURL(blob);
   *       image.src = imageUrl;
   *       setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
   *     })
   *     .catch(() => tile.setState(3)); // error
   * });
   * ```
   *
   * @api
   */
  load() {
    if (this.state == TileState_default.ERROR) {
      this.state = TileState_default.IDLE;
      this.image_ = new Image();
      if (this.crossOrigin_ !== null) {
        this.image_.crossOrigin = this.crossOrigin_;
      }
    }
    if (this.state == TileState_default.IDLE) {
      this.state = TileState_default.LOADING;
      this.changed();
      this.tileLoadFunction_(this, this.src_);
      this.unlisten_ = listenImage(
        this.image_,
        this.handleImageLoad_.bind(this),
        this.handleImageError_.bind(this)
      );
    }
  }
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  unlistenImage_() {
    if (this.unlisten_) {
      this.unlisten_();
      this.unlisten_ = null;
    }
  }
};
function getBlankImage() {
  const ctx = createCanvasContext2D(1, 1);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 1, 1);
  return ctx.canvas;
}
var ImageTile_default = ImageTile;

// node_modules/ol/reproj/common.js
var ERROR_THRESHOLD = 0.5;

// node_modules/ol/reproj/Triangulation.js
var MAX_SUBDIVISION = 10;
var MAX_TRIANGLE_WIDTH = 0.25;
var Triangulation = class {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../extent.js").Extent} targetExtent Target extent to triangulate.
   * @param {import("../extent.js").Extent} maxSourceExtent Maximal source extent that can be used.
   * @param {number} errorThreshold Acceptable error (in source units).
   * @param {?number} destinationResolution The (optional) resolution of the destination.
   */
  constructor(sourceProj, targetProj, targetExtent, maxSourceExtent, errorThreshold, destinationResolution) {
    this.sourceProj_ = sourceProj;
    this.targetProj_ = targetProj;
    let transformInvCache = {};
    const transformInv = getTransform(this.targetProj_, this.sourceProj_);
    this.transformInv_ = function(c) {
      const key = c[0] + "/" + c[1];
      if (!transformInvCache[key]) {
        transformInvCache[key] = transformInv(c);
      }
      return transformInvCache[key];
    };
    this.maxSourceExtent_ = maxSourceExtent;
    this.errorThresholdSquared_ = errorThreshold * errorThreshold;
    this.triangles_ = [];
    this.wrapsXInSource_ = false;
    this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!maxSourceExtent && !!this.sourceProj_.getExtent() && getWidth(maxSourceExtent) >= getWidth(this.sourceProj_.getExtent());
    this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? getWidth(this.sourceProj_.getExtent()) : null;
    this.targetWorldWidth_ = this.targetProj_.getExtent() ? getWidth(this.targetProj_.getExtent()) : null;
    const destinationTopLeft = getTopLeft(targetExtent);
    const destinationTopRight = getTopRight(targetExtent);
    const destinationBottomRight = getBottomRight(targetExtent);
    const destinationBottomLeft = getBottomLeft(targetExtent);
    const sourceTopLeft = this.transformInv_(destinationTopLeft);
    const sourceTopRight = this.transformInv_(destinationTopRight);
    const sourceBottomRight = this.transformInv_(destinationBottomRight);
    const sourceBottomLeft = this.transformInv_(destinationBottomLeft);
    const maxSubdivision = MAX_SUBDIVISION + (destinationResolution ? Math.max(
      0,
      Math.ceil(
        Math.log2(
          getArea(targetExtent) / (destinationResolution * destinationResolution * 256 * 256)
        )
      )
    ) : 0);
    this.addQuad_(
      destinationTopLeft,
      destinationTopRight,
      destinationBottomRight,
      destinationBottomLeft,
      sourceTopLeft,
      sourceTopRight,
      sourceBottomRight,
      sourceBottomLeft,
      maxSubdivision
    );
    if (this.wrapsXInSource_) {
      let leftBound = Infinity;
      this.triangles_.forEach(function(triangle, i, arr) {
        leftBound = Math.min(
          leftBound,
          triangle.source[0][0],
          triangle.source[1][0],
          triangle.source[2][0]
        );
      });
      this.triangles_.forEach((triangle) => {
        if (Math.max(
          triangle.source[0][0],
          triangle.source[1][0],
          triangle.source[2][0]
        ) - leftBound > this.sourceWorldWidth_ / 2) {
          const newTriangle = [
            [triangle.source[0][0], triangle.source[0][1]],
            [triangle.source[1][0], triangle.source[1][1]],
            [triangle.source[2][0], triangle.source[2][1]]
          ];
          if (newTriangle[0][0] - leftBound > this.sourceWorldWidth_ / 2) {
            newTriangle[0][0] -= this.sourceWorldWidth_;
          }
          if (newTriangle[1][0] - leftBound > this.sourceWorldWidth_ / 2) {
            newTriangle[1][0] -= this.sourceWorldWidth_;
          }
          if (newTriangle[2][0] - leftBound > this.sourceWorldWidth_ / 2) {
            newTriangle[2][0] -= this.sourceWorldWidth_;
          }
          const minX = Math.min(
            newTriangle[0][0],
            newTriangle[1][0],
            newTriangle[2][0]
          );
          const maxX = Math.max(
            newTriangle[0][0],
            newTriangle[1][0],
            newTriangle[2][0]
          );
          if (maxX - minX < this.sourceWorldWidth_ / 2) {
            triangle.source = newTriangle;
          }
        }
      });
    }
    transformInvCache = {};
  }
  /**
   * Adds triangle to the triangulation.
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @private
   */
  addTriangle_(a, b, c, aSrc, bSrc, cSrc) {
    this.triangles_.push({
      source: [aSrc, bSrc, cSrc],
      target: [a, b, c]
    });
  }
  /**
   * Adds quad (points in clock-wise order) to the triangulation
   * (and reprojects the vertices) if valid.
   * Performs quad subdivision if needed to increase precision.
   *
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} d The target d coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @param {import("../coordinate.js").Coordinate} dSrc The source d coordinate.
   * @param {number} maxSubdivision Maximal allowed subdivision of the quad.
   * @private
   */
  addQuad_(a, b, c, d, aSrc, bSrc, cSrc, dSrc, maxSubdivision) {
    const sourceQuadExtent = boundingExtent([aSrc, bSrc, cSrc, dSrc]);
    const sourceCoverageX = this.sourceWorldWidth_ ? getWidth(sourceQuadExtent) / this.sourceWorldWidth_ : null;
    const sourceWorldWidth = (
      /** @type {number} */
      this.sourceWorldWidth_
    );
    const wrapsX = this.sourceProj_.canWrapX() && sourceCoverageX > 0.5 && sourceCoverageX < 1;
    let needsSubdivision = false;
    if (maxSubdivision > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const targetQuadExtent = boundingExtent([a, b, c, d]);
        const targetCoverageX = getWidth(targetQuadExtent) / this.targetWorldWidth_;
        needsSubdivision = targetCoverageX > MAX_TRIANGLE_WIDTH || needsSubdivision;
      }
      if (!wrapsX && this.sourceProj_.isGlobal() && sourceCoverageX) {
        needsSubdivision = sourceCoverageX > MAX_TRIANGLE_WIDTH || needsSubdivision;
      }
    }
    if (!needsSubdivision && this.maxSourceExtent_) {
      if (isFinite(sourceQuadExtent[0]) && isFinite(sourceQuadExtent[1]) && isFinite(sourceQuadExtent[2]) && isFinite(sourceQuadExtent[3])) {
        if (!intersects(sourceQuadExtent, this.maxSourceExtent_)) {
          return;
        }
      }
    }
    let isNotFinite = 0;
    if (!needsSubdivision) {
      if (!isFinite(aSrc[0]) || !isFinite(aSrc[1]) || !isFinite(bSrc[0]) || !isFinite(bSrc[1]) || !isFinite(cSrc[0]) || !isFinite(cSrc[1]) || !isFinite(dSrc[0]) || !isFinite(dSrc[1])) {
        if (maxSubdivision > 0) {
          needsSubdivision = true;
        } else {
          isNotFinite = (!isFinite(aSrc[0]) || !isFinite(aSrc[1]) ? 8 : 0) + (!isFinite(bSrc[0]) || !isFinite(bSrc[1]) ? 4 : 0) + (!isFinite(cSrc[0]) || !isFinite(cSrc[1]) ? 2 : 0) + (!isFinite(dSrc[0]) || !isFinite(dSrc[1]) ? 1 : 0);
          if (isNotFinite != 1 && isNotFinite != 2 && isNotFinite != 4 && isNotFinite != 8) {
            return;
          }
        }
      }
    }
    if (maxSubdivision > 0) {
      if (!needsSubdivision) {
        const center = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
        const centerSrc = this.transformInv_(center);
        let dx;
        if (wrapsX) {
          const centerSrcEstimX = (modulo(aSrc[0], sourceWorldWidth) + modulo(cSrc[0], sourceWorldWidth)) / 2;
          dx = centerSrcEstimX - modulo(centerSrc[0], sourceWorldWidth);
        } else {
          dx = (aSrc[0] + cSrc[0]) / 2 - centerSrc[0];
        }
        const dy = (aSrc[1] + cSrc[1]) / 2 - centerSrc[1];
        const centerSrcErrorSquared = dx * dx + dy * dy;
        needsSubdivision = centerSrcErrorSquared > this.errorThresholdSquared_;
      }
      if (needsSubdivision) {
        if (Math.abs(a[0] - c[0]) <= Math.abs(a[1] - c[1])) {
          const bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
          const bcSrc = this.transformInv_(bc);
          const da = [(d[0] + a[0]) / 2, (d[1] + a[1]) / 2];
          const daSrc = this.transformInv_(da);
          this.addQuad_(
            a,
            b,
            bc,
            da,
            aSrc,
            bSrc,
            bcSrc,
            daSrc,
            maxSubdivision - 1
          );
          this.addQuad_(
            da,
            bc,
            c,
            d,
            daSrc,
            bcSrc,
            cSrc,
            dSrc,
            maxSubdivision - 1
          );
        } else {
          const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const abSrc = this.transformInv_(ab);
          const cd = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2];
          const cdSrc = this.transformInv_(cd);
          this.addQuad_(
            a,
            ab,
            cd,
            d,
            aSrc,
            abSrc,
            cdSrc,
            dSrc,
            maxSubdivision - 1
          );
          this.addQuad_(
            ab,
            b,
            c,
            cd,
            abSrc,
            bSrc,
            cSrc,
            cdSrc,
            maxSubdivision - 1
          );
        }
        return;
      }
    }
    if (wrapsX) {
      if (!this.canWrapXInSource_) {
        return;
      }
      this.wrapsXInSource_ = true;
    }
    if ((isNotFinite & 11) == 0) {
      this.addTriangle_(a, c, d, aSrc, cSrc, dSrc);
    }
    if ((isNotFinite & 14) == 0) {
      this.addTriangle_(a, c, b, aSrc, cSrc, bSrc);
    }
    if (isNotFinite) {
      if ((isNotFinite & 13) == 0) {
        this.addTriangle_(b, d, a, bSrc, dSrc, aSrc);
      }
      if ((isNotFinite & 7) == 0) {
        this.addTriangle_(b, d, c, bSrc, dSrc, cSrc);
      }
    }
  }
  /**
   * Calculates extent of the `source` coordinates from all the triangles.
   *
   * @return {import("../extent.js").Extent} Calculated extent.
   */
  calculateSourceExtent() {
    const extent = createEmpty();
    this.triangles_.forEach(function(triangle, i, arr) {
      const src = triangle.source;
      extendCoordinate(extent, src[0]);
      extendCoordinate(extent, src[1]);
      extendCoordinate(extent, src[2]);
    });
    return extent;
  }
  /**
   * @return {Array<Triangle>} Array of the calculated triangles.
   */
  getTriangles() {
    return this.triangles_;
  }
};
var Triangulation_default = Triangulation;

// node_modules/ol/reproj.js
var brokenDiagonalRendering_;
var canvasPool = [];
function drawTestTriangle(ctx, u1, v1, u2, v2) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(u1, v1);
  ctx.lineTo(u2, v2);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.fillRect(0, 0, Math.max(u1, u2) + 1, Math.max(v1, v2));
  ctx.restore();
}
function verifyBrokenDiagonalRendering(data, offset) {
  return Math.abs(data[offset * 4] - 210) > 2 || Math.abs(data[offset * 4 + 3] - 0.75 * 255) > 2;
}
function isBrokenDiagonalRendering() {
  if (brokenDiagonalRendering_ === void 0) {
    const ctx = createCanvasContext2D(6, 6, canvasPool);
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(210, 0, 0, 0.75)";
    drawTestTriangle(ctx, 4, 5, 4, 0);
    drawTestTriangle(ctx, 4, 5, 0, 5);
    const data = ctx.getImageData(0, 0, 3, 3).data;
    brokenDiagonalRendering_ = verifyBrokenDiagonalRendering(data, 0) || verifyBrokenDiagonalRendering(data, 4) || verifyBrokenDiagonalRendering(data, 8);
    releaseCanvas(ctx);
    canvasPool.push(ctx.canvas);
  }
  return brokenDiagonalRendering_;
}
function calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution) {
  const sourceCenter = transform(targetCenter, targetProj, sourceProj);
  let sourceResolution = getPointResolution(
    targetProj,
    targetResolution,
    targetCenter
  );
  const targetMetersPerUnit = targetProj.getMetersPerUnit();
  if (targetMetersPerUnit !== void 0) {
    sourceResolution *= targetMetersPerUnit;
  }
  const sourceMetersPerUnit = sourceProj.getMetersPerUnit();
  if (sourceMetersPerUnit !== void 0) {
    sourceResolution /= sourceMetersPerUnit;
  }
  const sourceExtent = sourceProj.getExtent();
  if (!sourceExtent || containsCoordinate(sourceExtent, sourceCenter)) {
    const compensationFactor = getPointResolution(sourceProj, sourceResolution, sourceCenter) / sourceResolution;
    if (isFinite(compensationFactor) && compensationFactor > 0) {
      sourceResolution /= compensationFactor;
    }
  }
  return sourceResolution;
}
function calculateSourceExtentResolution(sourceProj, targetProj, targetExtent, targetResolution) {
  const targetCenter = getCenter(targetExtent);
  let sourceResolution = calculateSourceResolution(
    sourceProj,
    targetProj,
    targetCenter,
    targetResolution
  );
  if (!isFinite(sourceResolution) || sourceResolution <= 0) {
    forEachCorner(targetExtent, function(corner) {
      sourceResolution = calculateSourceResolution(
        sourceProj,
        targetProj,
        corner,
        targetResolution
      );
      return isFinite(sourceResolution) && sourceResolution > 0;
    });
  }
  return sourceResolution;
}
function render(width, height, pixelRatio, sourceResolution, sourceExtent, targetResolution, targetExtent, triangulation, sources, gutter, renderEdges, interpolate) {
  const context = createCanvasContext2D(
    Math.round(pixelRatio * width),
    Math.round(pixelRatio * height),
    canvasPool
  );
  if (!interpolate) {
    context.imageSmoothingEnabled = false;
  }
  if (sources.length === 0) {
    return context.canvas;
  }
  context.scale(pixelRatio, pixelRatio);
  function pixelRound(value) {
    return Math.round(value * pixelRatio) / pixelRatio;
  }
  context.globalCompositeOperation = "lighter";
  const sourceDataExtent = createEmpty();
  sources.forEach(function(src, i, arr) {
    extend(sourceDataExtent, src.extent);
  });
  const canvasWidthInUnits = getWidth(sourceDataExtent);
  const canvasHeightInUnits = getHeight(sourceDataExtent);
  const stitchContext = createCanvasContext2D(
    Math.round(pixelRatio * canvasWidthInUnits / sourceResolution),
    Math.round(pixelRatio * canvasHeightInUnits / sourceResolution),
    canvasPool
  );
  if (!interpolate) {
    stitchContext.imageSmoothingEnabled = false;
  }
  const stitchScale = pixelRatio / sourceResolution;
  sources.forEach(function(src, i, arr) {
    const xPos = src.extent[0] - sourceDataExtent[0];
    const yPos = -(src.extent[3] - sourceDataExtent[3]);
    const srcWidth = getWidth(src.extent);
    const srcHeight = getHeight(src.extent);
    if (src.image.width > 0 && src.image.height > 0) {
      stitchContext.drawImage(
        src.image,
        gutter,
        gutter,
        src.image.width - 2 * gutter,
        src.image.height - 2 * gutter,
        xPos * stitchScale,
        yPos * stitchScale,
        srcWidth * stitchScale,
        srcHeight * stitchScale
      );
    }
  });
  const targetTopLeft = getTopLeft(targetExtent);
  triangulation.getTriangles().forEach(function(triangle, i, arr) {
    const source = triangle.source;
    const target = triangle.target;
    let x0 = source[0][0], y0 = source[0][1];
    let x1 = source[1][0], y1 = source[1][1];
    let x2 = source[2][0], y2 = source[2][1];
    const u0 = pixelRound((target[0][0] - targetTopLeft[0]) / targetResolution);
    const v0 = pixelRound(
      -(target[0][1] - targetTopLeft[1]) / targetResolution
    );
    const u1 = pixelRound((target[1][0] - targetTopLeft[0]) / targetResolution);
    const v1 = pixelRound(
      -(target[1][1] - targetTopLeft[1]) / targetResolution
    );
    const u2 = pixelRound((target[2][0] - targetTopLeft[0]) / targetResolution);
    const v2 = pixelRound(
      -(target[2][1] - targetTopLeft[1]) / targetResolution
    );
    const sourceNumericalShiftX = x0;
    const sourceNumericalShiftY = y0;
    x0 = 0;
    y0 = 0;
    x1 -= sourceNumericalShiftX;
    y1 -= sourceNumericalShiftY;
    x2 -= sourceNumericalShiftX;
    y2 -= sourceNumericalShiftY;
    const augmentedMatrix = [
      [x1, y1, 0, 0, u1 - u0],
      [x2, y2, 0, 0, u2 - u0],
      [0, 0, x1, y1, v1 - v0],
      [0, 0, x2, y2, v2 - v0]
    ];
    const affineCoefs = solveLinearSystem(augmentedMatrix);
    if (!affineCoefs) {
      return;
    }
    context.save();
    context.beginPath();
    if (isBrokenDiagonalRendering() || !interpolate) {
      context.moveTo(u1, v1);
      const steps = 4;
      const ud = u0 - u1;
      const vd = v0 - v1;
      for (let step = 0; step < steps; step++) {
        context.lineTo(
          u1 + pixelRound((step + 1) * ud / steps),
          v1 + pixelRound(step * vd / (steps - 1))
        );
        if (step != steps - 1) {
          context.lineTo(
            u1 + pixelRound((step + 1) * ud / steps),
            v1 + pixelRound((step + 1) * vd / (steps - 1))
          );
        }
      }
      context.lineTo(u2, v2);
    } else {
      context.moveTo(u1, v1);
      context.lineTo(u0, v0);
      context.lineTo(u2, v2);
    }
    context.clip();
    context.transform(
      affineCoefs[0],
      affineCoefs[2],
      affineCoefs[1],
      affineCoefs[3],
      u0,
      v0
    );
    context.translate(
      sourceDataExtent[0] - sourceNumericalShiftX,
      sourceDataExtent[3] - sourceNumericalShiftY
    );
    context.scale(
      sourceResolution / pixelRatio,
      -sourceResolution / pixelRatio
    );
    context.drawImage(stitchContext.canvas, 0, 0);
    context.restore();
  });
  releaseCanvas(stitchContext);
  canvasPool.push(stitchContext.canvas);
  if (renderEdges) {
    context.save();
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    triangulation.getTriangles().forEach(function(triangle, i, arr) {
      const target = triangle.target;
      const u0 = (target[0][0] - targetTopLeft[0]) / targetResolution;
      const v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution;
      const u1 = (target[1][0] - targetTopLeft[0]) / targetResolution;
      const v1 = -(target[1][1] - targetTopLeft[1]) / targetResolution;
      const u2 = (target[2][0] - targetTopLeft[0]) / targetResolution;
      const v2 = -(target[2][1] - targetTopLeft[1]) / targetResolution;
      context.beginPath();
      context.moveTo(u1, v1);
      context.lineTo(u0, v0);
      context.lineTo(u2, v2);
      context.closePath();
      context.stroke();
    });
    context.restore();
  }
  return context.canvas;
}

// node_modules/ol/reproj/Tile.js
var ReprojTile = class extends Tile_default {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
   * @param {import("../tilecoord.js").TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} gutter Gutter of the source tiles.
   * @param {FunctionType} getTileFunction
   *     Function returning source tiles (z, x, y, pixelRatio).
   * @param {number} [errorThreshold] Acceptable reprojection error (in px).
   * @param {boolean} [renderEdges] Render reprojection edges.
   * @param {boolean} [interpolate] Use linear interpolation when resampling.
   */
  constructor(sourceProj, sourceTileGrid, targetProj, targetTileGrid, tileCoord, wrappedTileCoord, pixelRatio, gutter, getTileFunction, errorThreshold, renderEdges, interpolate) {
    super(tileCoord, TileState_default.IDLE, { interpolate: !!interpolate });
    this.renderEdges_ = renderEdges !== void 0 ? renderEdges : false;
    this.pixelRatio_ = pixelRatio;
    this.gutter_ = gutter;
    this.canvas_ = null;
    this.sourceTileGrid_ = sourceTileGrid;
    this.targetTileGrid_ = targetTileGrid;
    this.wrappedTileCoord_ = wrappedTileCoord ? wrappedTileCoord : tileCoord;
    this.sourceTiles_ = [];
    this.sourcesListenerKeys_ = null;
    this.sourceZ_ = 0;
    const targetExtent = targetTileGrid.getTileCoordExtent(
      this.wrappedTileCoord_
    );
    const maxTargetExtent = this.targetTileGrid_.getExtent();
    let maxSourceExtent = this.sourceTileGrid_.getExtent();
    const limitedTargetExtent = maxTargetExtent ? getIntersection(targetExtent, maxTargetExtent) : targetExtent;
    if (getArea(limitedTargetExtent) === 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    const sourceProjExtent = sourceProj.getExtent();
    if (sourceProjExtent) {
      if (!maxSourceExtent) {
        maxSourceExtent = sourceProjExtent;
      } else {
        maxSourceExtent = getIntersection(maxSourceExtent, sourceProjExtent);
      }
    }
    const targetResolution = targetTileGrid.getResolution(
      this.wrappedTileCoord_[0]
    );
    const sourceResolution = calculateSourceExtentResolution(
      sourceProj,
      targetProj,
      limitedTargetExtent,
      targetResolution
    );
    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    const errorThresholdInPixels = errorThreshold !== void 0 ? errorThreshold : ERROR_THRESHOLD;
    this.triangulation_ = new Triangulation_default(
      sourceProj,
      targetProj,
      limitedTargetExtent,
      maxSourceExtent,
      sourceResolution * errorThresholdInPixels,
      targetResolution
    );
    if (this.triangulation_.getTriangles().length === 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    this.sourceZ_ = sourceTileGrid.getZForResolution(sourceResolution);
    let sourceExtent = this.triangulation_.calculateSourceExtent();
    if (maxSourceExtent) {
      if (sourceProj.canWrapX()) {
        sourceExtent[1] = clamp(
          sourceExtent[1],
          maxSourceExtent[1],
          maxSourceExtent[3]
        );
        sourceExtent[3] = clamp(
          sourceExtent[3],
          maxSourceExtent[1],
          maxSourceExtent[3]
        );
      } else {
        sourceExtent = getIntersection(sourceExtent, maxSourceExtent);
      }
    }
    if (!getArea(sourceExtent)) {
      this.state = TileState_default.EMPTY;
    } else {
      const sourceRange = sourceTileGrid.getTileRangeForExtentAndZ(
        sourceExtent,
        this.sourceZ_
      );
      for (let srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
        for (let srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
          const tile = getTileFunction(this.sourceZ_, srcX, srcY, pixelRatio);
          if (tile) {
            this.sourceTiles_.push(tile);
          }
        }
      }
      if (this.sourceTiles_.length === 0) {
        this.state = TileState_default.EMPTY;
      }
    }
  }
  /**
   * Get the HTML Canvas element for this tile.
   * @return {HTMLCanvasElement} Canvas.
   */
  getImage() {
    return this.canvas_;
  }
  /**
   * @private
   */
  reproject_() {
    const sources = [];
    this.sourceTiles_.forEach((tile) => {
      if (tile && tile.getState() == TileState_default.LOADED) {
        sources.push({
          extent: this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord),
          image: tile.getImage()
        });
      }
    });
    this.sourceTiles_.length = 0;
    if (sources.length === 0) {
      this.state = TileState_default.ERROR;
    } else {
      const z = this.wrappedTileCoord_[0];
      const size = this.targetTileGrid_.getTileSize(z);
      const width = typeof size === "number" ? size : size[0];
      const height = typeof size === "number" ? size : size[1];
      const targetResolution = this.targetTileGrid_.getResolution(z);
      const sourceResolution = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      );
      const targetExtent = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      this.canvas_ = render(
        width,
        height,
        this.pixelRatio_,
        sourceResolution,
        this.sourceTileGrid_.getExtent(),
        targetResolution,
        targetExtent,
        this.triangulation_,
        sources,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      );
      this.state = TileState_default.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.state == TileState_default.IDLE) {
      this.state = TileState_default.LOADING;
      this.changed();
      let leftToLoad = 0;
      this.sourcesListenerKeys_ = [];
      this.sourceTiles_.forEach((tile) => {
        const state = tile.getState();
        if (state == TileState_default.IDLE || state == TileState_default.LOADING) {
          leftToLoad++;
          const sourceListenKey = listen(
            tile,
            EventType_default.CHANGE,
            function(e) {
              const state2 = tile.getState();
              if (state2 == TileState_default.LOADED || state2 == TileState_default.ERROR || state2 == TileState_default.EMPTY) {
                unlistenByKey(sourceListenKey);
                leftToLoad--;
                if (leftToLoad === 0) {
                  this.unlistenSources_();
                  this.reproject_();
                }
              }
            },
            this
          );
          this.sourcesListenerKeys_.push(sourceListenKey);
        }
      });
      if (leftToLoad === 0) {
        setTimeout(this.reproject_.bind(this), 0);
      } else {
        this.sourceTiles_.forEach(function(tile, i, arr) {
          const state = tile.getState();
          if (state == TileState_default.IDLE) {
            tile.load();
          }
        });
      }
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(unlistenByKey);
    this.sourcesListenerKeys_ = null;
  }
  /**
   * Remove from the cache due to expiry
   */
  release() {
    if (this.canvas_) {
      releaseCanvas(this.canvas_.getContext("2d"));
      canvasPool.push(this.canvas_);
      this.canvas_ = null;
    }
    super.release();
  }
};
var Tile_default2 = ReprojTile;

// node_modules/ol/TileRange.js
var TileRange = class {
  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  constructor(minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */
  contains(tileCoord) {
    return this.containsXY(tileCoord[1], tileCoord[2]);
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Contains.
   */
  containsTileRange(tileRange) {
    return this.minX <= tileRange.minX && tileRange.maxX <= this.maxX && this.minY <= tileRange.minY && tileRange.maxY <= this.maxY;
  }
  /**
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @return {boolean} Contains coordinate.
   */
  containsXY(x, y) {
    return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Equals.
   */
  equals(tileRange) {
    return this.minX == tileRange.minX && this.minY == tileRange.minY && this.maxX == tileRange.maxX && this.maxY == tileRange.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   */
  extend(tileRange) {
    if (tileRange.minX < this.minX) {
      this.minX = tileRange.minX;
    }
    if (tileRange.maxX > this.maxX) {
      this.maxX = tileRange.maxX;
    }
    if (tileRange.minY < this.minY) {
      this.minY = tileRange.minY;
    }
    if (tileRange.maxY > this.maxY) {
      this.maxY = tileRange.maxY;
    }
  }
  /**
   * @return {number} Height.
   */
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  /**
   * @return {import("./size.js").Size} Size.
   */
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  /**
   * @return {number} Width.
   */
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Intersects.
   */
  intersects(tileRange) {
    return this.minX <= tileRange.maxX && this.maxX >= tileRange.minX && this.minY <= tileRange.maxY && this.maxY >= tileRange.minY;
  }
};
function createOrUpdate(minX, maxX, minY, maxY, tileRange) {
  if (tileRange !== void 0) {
    tileRange.minX = minX;
    tileRange.maxX = maxX;
    tileRange.minY = minY;
    tileRange.maxY = maxY;
    return tileRange;
  }
  return new TileRange(minX, maxX, minY, maxY);
}
var TileRange_default = TileRange;

// node_modules/ol/renderer/canvas/TileLayer.js
var CanvasTileLayerRenderer = class extends Layer_default2 {
  /**
   * @param {LayerType} tileLayer Tile layer.
   */
  constructor(tileLayer) {
    super(tileLayer);
    this.extentChanged = true;
    this.renderedExtent_ = null;
    this.renderedPixelRatio;
    this.renderedProjection = null;
    this.renderedRevision;
    this.renderedTiles = [];
    this.newTiles_ = false;
    this.tmpExtent = createEmpty();
    this.tmpTileRange_ = new TileRange_default(0, 0, 0, 0);
  }
  /**
   * @protected
   * @param {import("../../Tile.js").default} tile Tile.
   * @return {boolean} Tile is drawable.
   */
  isDrawableTile(tile) {
    const tileLayer = this.getLayer();
    const tileState = tile.getState();
    const useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();
    return tileState == TileState_default.LOADED || tileState == TileState_default.EMPTY || tileState == TileState_default.ERROR && !useInterimTilesOnError;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {!import("../../Tile.js").default} Tile.
   */
  getTile(z, x, y, frameState) {
    const pixelRatio = frameState.pixelRatio;
    const projection = frameState.viewState.projection;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getSource();
    let tile = tileSource.getTile(z, x, y, pixelRatio, projection);
    if (tile.getState() == TileState_default.ERROR) {
      if (tileLayer.getUseInterimTilesOnError() && tileLayer.getPreload() > 0) {
        this.newTiles_ = true;
      }
    }
    if (!this.isDrawableTile(tile)) {
      tile = tile.getInterimTile();
    }
    return tile;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   */
  getData(pixel) {
    const frameState = this.frameState;
    if (!frameState) {
      return null;
    }
    const layer = this.getLayer();
    const coordinate = apply(
      frameState.pixelToCoordinateTransform,
      pixel.slice()
    );
    const layerExtent = layer.getExtent();
    if (layerExtent) {
      if (!containsCoordinate(layerExtent, coordinate)) {
        return null;
      }
    }
    const pixelRatio = frameState.pixelRatio;
    const projection = frameState.viewState.projection;
    const viewState = frameState.viewState;
    const source = layer.getRenderSource();
    const tileGrid = source.getTileGridForProjection(viewState.projection);
    const tilePixelRatio = source.getTilePixelRatio(frameState.pixelRatio);
    for (let z = tileGrid.getZForResolution(viewState.resolution); z >= tileGrid.getMinZoom(); --z) {
      const tileCoord = tileGrid.getTileCoordForCoordAndZ(coordinate, z);
      const tile = source.getTile(
        z,
        tileCoord[1],
        tileCoord[2],
        pixelRatio,
        projection
      );
      if (!(tile instanceof ImageTile_default || tile instanceof Tile_default2) || tile instanceof Tile_default2 && tile.getState() === TileState_default.EMPTY) {
        return null;
      }
      if (tile.getState() !== TileState_default.LOADED) {
        continue;
      }
      const tileOrigin = tileGrid.getOrigin(z);
      const tileSize = toSize(tileGrid.getTileSize(z));
      const tileResolution = tileGrid.getResolution(z);
      const col = Math.floor(
        tilePixelRatio * ((coordinate[0] - tileOrigin[0]) / tileResolution - tileCoord[1] * tileSize[0])
      );
      const row = Math.floor(
        tilePixelRatio * ((tileOrigin[1] - coordinate[1]) / tileResolution - tileCoord[2] * tileSize[1])
      );
      const gutter = Math.round(
        tilePixelRatio * source.getGutterForProjection(viewState.projection)
      );
      return this.getImageData(tile.getImage(), col + gutter, row + gutter);
    }
    return null;
  }
  /**
   * @param {Object<number, Object<string, import("../../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
   * @param {number} zoom Zoom level.
   * @param {import("../../Tile.js").default} tile Tile.
   * @return {boolean|void} If `false`, the tile will not be considered loaded.
   */
  loadedTileCallback(tiles, zoom, tile) {
    if (this.isDrawableTile(tile)) {
      return super.loadedTileCallback(tiles, zoom, tile);
    }
    return false;
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(frameState) {
    return !!this.getLayer().getSource();
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(frameState, target) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;
    const projection = viewState.projection;
    const viewResolution = viewState.resolution;
    const viewCenter = viewState.center;
    const rotation = viewState.rotation;
    const pixelRatio = frameState.pixelRatio;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getSource();
    const sourceRevision = tileSource.getRevision();
    const tileGrid = tileSource.getTileGridForProjection(projection);
    const z = tileGrid.getZForResolution(viewResolution, tileSource.zDirection);
    const tileResolution = tileGrid.getResolution(z);
    let extent = frameState.extent;
    const resolution = frameState.viewState.resolution;
    const tilePixelRatio = tileSource.getTilePixelRatio(pixelRatio);
    const width = Math.round(getWidth(extent) / resolution * pixelRatio);
    const height = Math.round(getHeight(extent) / resolution * pixelRatio);
    const layerExtent = layerState.extent && fromUserExtent(layerState.extent, projection);
    if (layerExtent) {
      extent = getIntersection(
        extent,
        fromUserExtent(layerState.extent, projection)
      );
    }
    const dx = tileResolution * width / 2 / tilePixelRatio;
    const dy = tileResolution * height / 2 / tilePixelRatio;
    const canvasExtent = [
      viewCenter[0] - dx,
      viewCenter[1] - dy,
      viewCenter[0] + dx,
      viewCenter[1] + dy
    ];
    const tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
    const tilesToDrawByZ = {};
    tilesToDrawByZ[z] = {};
    const findLoadedTiles = this.createLoadedTileFinder(
      tileSource,
      projection,
      tilesToDrawByZ
    );
    const tmpExtent = this.tmpExtent;
    const tmpTileRange = this.tmpTileRange_;
    this.newTiles_ = false;
    const viewport = rotation ? getRotatedViewport(
      viewState.center,
      resolution,
      rotation,
      frameState.size
    ) : void 0;
    for (let x = tileRange.minX; x <= tileRange.maxX; ++x) {
      for (let y = tileRange.minY; y <= tileRange.maxY; ++y) {
        if (rotation && !tileGrid.tileCoordIntersectsViewport([z, x, y], viewport)) {
          continue;
        }
        const tile = this.getTile(z, x, y, frameState);
        if (this.isDrawableTile(tile)) {
          const uid = getUid(this);
          if (tile.getState() == TileState_default.LOADED) {
            tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
            let inTransition = tile.inTransition(uid);
            if (inTransition && layerState.opacity !== 1) {
              tile.endTransition(uid);
              inTransition = false;
            }
            if (!this.newTiles_ && (inTransition || !this.renderedTiles.includes(tile))) {
              this.newTiles_ = true;
            }
          }
          if (tile.getAlpha(uid, frameState.time) === 1) {
            continue;
          }
        }
        const childTileRange = tileGrid.getTileCoordChildTileRange(
          tile.tileCoord,
          tmpTileRange,
          tmpExtent
        );
        let covered = false;
        if (childTileRange) {
          covered = findLoadedTiles(z + 1, childTileRange);
        }
        if (!covered) {
          tileGrid.forEachTileCoordParentTileRange(
            tile.tileCoord,
            findLoadedTiles,
            tmpTileRange,
            tmpExtent
          );
        }
      }
    }
    const canvasScale = tileResolution / viewResolution * pixelRatio / tilePixelRatio;
    compose(
      this.pixelTransform,
      frameState.size[0] / 2,
      frameState.size[1] / 2,
      1 / pixelRatio,
      1 / pixelRatio,
      rotation,
      -width / 2,
      -height / 2
    );
    const canvasTransform = toString(this.pixelTransform);
    this.useContainer(target, canvasTransform, this.getBackground(frameState));
    const context = this.context;
    const canvas = context.canvas;
    makeInverse(this.inversePixelTransform, this.pixelTransform);
    compose(
      this.tempTransform,
      width / 2,
      height / 2,
      canvasScale,
      canvasScale,
      0,
      -width / 2,
      -height / 2
    );
    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }
    if (layerExtent) {
      this.clipUnrotated(context, frameState, layerExtent);
    }
    if (!tileSource.getInterpolate()) {
      context.imageSmoothingEnabled = false;
    }
    this.preRender(context, frameState);
    this.renderedTiles.length = 0;
    let zs = Object.keys(tilesToDrawByZ).map(Number);
    zs.sort(ascending);
    let clips, clipZs, currentClip;
    if (layerState.opacity === 1 && (!this.containerReused || tileSource.getOpaque(frameState.viewState.projection))) {
      zs = zs.reverse();
    } else {
      clips = [];
      clipZs = [];
    }
    for (let i = zs.length - 1; i >= 0; --i) {
      const currentZ = zs[i];
      const currentTilePixelSize = tileSource.getTilePixelSize(
        currentZ,
        pixelRatio,
        projection
      );
      const currentResolution = tileGrid.getResolution(currentZ);
      const currentScale = currentResolution / tileResolution;
      const dx2 = currentTilePixelSize[0] * currentScale * canvasScale;
      const dy2 = currentTilePixelSize[1] * currentScale * canvasScale;
      const originTileCoord = tileGrid.getTileCoordForCoordAndZ(
        getTopLeft(canvasExtent),
        currentZ
      );
      const originTileExtent = tileGrid.getTileCoordExtent(originTileCoord);
      const origin = apply(this.tempTransform, [
        tilePixelRatio * (originTileExtent[0] - canvasExtent[0]) / tileResolution,
        tilePixelRatio * (canvasExtent[3] - originTileExtent[3]) / tileResolution
      ]);
      const tileGutter = tilePixelRatio * tileSource.getGutterForProjection(projection);
      const tilesToDraw = tilesToDrawByZ[currentZ];
      for (const tileCoordKey in tilesToDraw) {
        const tile = (
          /** @type {import("../../ImageTile.js").default} */
          tilesToDraw[tileCoordKey]
        );
        const tileCoord = tile.tileCoord;
        const xIndex = originTileCoord[1] - tileCoord[1];
        const nextX = Math.round(origin[0] - (xIndex - 1) * dx2);
        const yIndex = originTileCoord[2] - tileCoord[2];
        const nextY = Math.round(origin[1] - (yIndex - 1) * dy2);
        const x = Math.round(origin[0] - xIndex * dx2);
        const y = Math.round(origin[1] - yIndex * dy2);
        const w = nextX - x;
        const h = nextY - y;
        const transition = z === currentZ;
        const inTransition = transition && tile.getAlpha(getUid(this), frameState.time) !== 1;
        let contextSaved = false;
        if (!inTransition) {
          if (clips) {
            currentClip = [x, y, x + w, y, x + w, y + h, x, y + h];
            for (let i2 = 0, ii = clips.length; i2 < ii; ++i2) {
              if (z !== currentZ && currentZ < clipZs[i2]) {
                const clip = clips[i2];
                if (intersects(
                  [x, y, x + w, y + h],
                  [clip[0], clip[3], clip[4], clip[7]]
                )) {
                  if (!contextSaved) {
                    context.save();
                    contextSaved = true;
                  }
                  context.beginPath();
                  context.moveTo(currentClip[0], currentClip[1]);
                  context.lineTo(currentClip[2], currentClip[3]);
                  context.lineTo(currentClip[4], currentClip[5]);
                  context.lineTo(currentClip[6], currentClip[7]);
                  context.moveTo(clip[6], clip[7]);
                  context.lineTo(clip[4], clip[5]);
                  context.lineTo(clip[2], clip[3]);
                  context.lineTo(clip[0], clip[1]);
                  context.clip();
                }
              }
            }
            clips.push(currentClip);
            clipZs.push(currentZ);
          } else {
            context.clearRect(x, y, w, h);
          }
        }
        this.drawTileImage(
          tile,
          frameState,
          x,
          y,
          w,
          h,
          tileGutter,
          transition
        );
        if (clips && !inTransition) {
          if (contextSaved) {
            context.restore();
          }
          this.renderedTiles.unshift(tile);
        } else {
          this.renderedTiles.push(tile);
        }
        this.updateUsedTiles(frameState.usedTiles, tileSource, tile);
      }
    }
    this.renderedRevision = sourceRevision;
    this.renderedResolution = tileResolution;
    this.extentChanged = !this.renderedExtent_ || !equals(this.renderedExtent_, canvasExtent);
    this.renderedExtent_ = canvasExtent;
    this.renderedPixelRatio = pixelRatio;
    this.renderedProjection = projection;
    this.manageTilePyramid(
      frameState,
      tileSource,
      tileGrid,
      pixelRatio,
      projection,
      extent,
      z,
      tileLayer.getPreload()
    );
    this.scheduleExpireCache(frameState, tileSource);
    this.postRender(context, frameState);
    if (layerState.extent) {
      context.restore();
    }
    context.imageSmoothingEnabled = true;
    if (canvasTransform !== canvas.style.transform) {
      canvas.style.transform = canvasTransform;
    }
    return this.container;
  }
  /**
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} x Left of the tile.
   * @param {number} y Top of the tile.
   * @param {number} w Width of the tile.
   * @param {number} h Height of the tile.
   * @param {number} gutter Tile gutter.
   * @param {boolean} transition Apply an alpha transition.
   */
  drawTileImage(tile, frameState, x, y, w, h, gutter, transition) {
    const image = this.getTileImage(tile);
    if (!image) {
      return;
    }
    const uid = getUid(this);
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const alpha = layerState.opacity * (transition ? tile.getAlpha(uid, frameState.time) : 1);
    const alphaChanged = alpha !== this.context.globalAlpha;
    if (alphaChanged) {
      this.context.save();
      this.context.globalAlpha = alpha;
    }
    this.context.drawImage(
      image,
      gutter,
      gutter,
      image.width - 2 * gutter,
      image.height - 2 * gutter,
      x,
      y,
      w,
      h
    );
    if (alphaChanged) {
      this.context.restore();
    }
    if (alpha !== layerState.opacity) {
      frameState.animate = true;
    } else if (transition) {
      tile.endTransition(uid);
    }
  }
  /**
   * @return {HTMLCanvasElement} Image
   */
  getImage() {
    const context = this.context;
    return context ? context.canvas : null;
  }
  /**
   * Get the image from a tile.
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @protected
   */
  getTileImage(tile) {
    return tile.getImage();
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @protected
   */
  scheduleExpireCache(frameState, tileSource) {
    if (tileSource.canExpireCache()) {
      const postRenderFunction = function(tileSource2, map, frameState2) {
        const tileSourceKey = getUid(tileSource2);
        if (tileSourceKey in frameState2.usedTiles) {
          tileSource2.expireCache(
            frameState2.viewState.projection,
            frameState2.usedTiles[tileSourceKey]
          );
        }
      }.bind(null, tileSource);
      frameState.postRenderFunctions.push(
        /** @type {import("../../Map.js").PostRenderFunction} */
        postRenderFunction
      );
    }
  }
  /**
   * @param {!Object<string, !Object<string, boolean>>} usedTiles Used tiles.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import('../../Tile.js').default} tile Tile.
   * @protected
   */
  updateUsedTiles(usedTiles, tileSource, tile) {
    const tileSourceKey = getUid(tileSource);
    if (!(tileSourceKey in usedTiles)) {
      usedTiles[tileSourceKey] = {};
    }
    usedTiles[tileSourceKey][tile.getKey()] = true;
  }
  /**
   * Manage tile pyramid.
   * This function performs a number of functions related to the tiles at the
   * current zoom and lower zoom levels:
   * - registers idle tiles in frameState.wantedTiles so that they are not
   *   discarded by the tile queue
   * - enqueues missing tiles
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import("../../tilegrid/TileGrid.js").default} tileGrid Tile grid.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../proj/Projection.js").default} projection Projection.
   * @param {import("../../extent.js").Extent} extent Extent.
   * @param {number} currentZ Current Z.
   * @param {number} preload Load low resolution tiles up to `preload` levels.
   * @param {function(import("../../Tile.js").default):void} [tileCallback] Tile callback.
   * @protected
   */
  manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, currentZ, preload, tileCallback) {
    const tileSourceKey = getUid(tileSource);
    if (!(tileSourceKey in frameState.wantedTiles)) {
      frameState.wantedTiles[tileSourceKey] = {};
    }
    const wantedTiles = frameState.wantedTiles[tileSourceKey];
    const tileQueue = frameState.tileQueue;
    const minZoom = tileGrid.getMinZoom();
    const rotation = frameState.viewState.rotation;
    const viewport = rotation ? getRotatedViewport(
      frameState.viewState.center,
      frameState.viewState.resolution,
      rotation,
      frameState.size
    ) : void 0;
    let tileCount = 0;
    let tile, tileRange, tileResolution, x, y, z;
    for (z = minZoom; z <= currentZ; ++z) {
      tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, tileRange);
      tileResolution = tileGrid.getResolution(z);
      for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
        for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
          if (rotation && !tileGrid.tileCoordIntersectsViewport([z, x, y], viewport)) {
            continue;
          }
          if (currentZ - z <= preload) {
            ++tileCount;
            tile = tileSource.getTile(z, x, y, pixelRatio, projection);
            if (tile.getState() == TileState_default.IDLE) {
              wantedTiles[tile.getKey()] = true;
              if (!tileQueue.isKeyQueued(tile.getKey())) {
                tileQueue.enqueue([
                  tile,
                  tileSourceKey,
                  tileGrid.getTileCoordCenter(tile.tileCoord),
                  tileResolution
                ]);
              }
            }
            if (tileCallback !== void 0) {
              tileCallback(tile);
            }
          } else {
            tileSource.useTile(z, x, y, projection);
          }
        }
      }
    }
    tileSource.updateCacheSize(tileCount, projection);
  }
};
var TileLayer_default = CanvasTileLayerRenderer;

// node_modules/ol/layer/Tile.js
var TileLayer = class extends BaseTile_default {
  /**
   * @param {import("./BaseTile.js").Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(options) {
    super(options);
  }
  createRenderer() {
    return new TileLayer_default(this);
  }
};
var Tile_default3 = TileLayer;

// node_modules/ol/DataTile.js
function asImageLike(data) {
  return data instanceof Image || data instanceof HTMLCanvasElement || data instanceof HTMLVideoElement || data instanceof ImageBitmap ? data : null;
}
function asArrayLike(data) {
  return data instanceof Uint8Array || data instanceof Uint8ClampedArray || data instanceof Float32Array || data instanceof DataView ? data : null;
}
var sharedContext = null;
function toArray(image) {
  if (!sharedContext) {
    sharedContext = createCanvasContext2D(
      image.width,
      image.height,
      void 0,
      { willReadFrequently: true }
    );
  }
  const canvas = sharedContext.canvas;
  const width = image.width;
  if (canvas.width !== width) {
    canvas.width = width;
  }
  const height = image.height;
  if (canvas.height !== height) {
    canvas.height = height;
  }
  sharedContext.clearRect(0, 0, width, height);
  sharedContext.drawImage(image, 0, 0);
  return sharedContext.getImageData(0, 0, width, height).data;
}
var defaultSize = [256, 256];
var DataTile = class extends Tile_default {
  /**
   * @param {Options} options Tile options.
   */
  constructor(options) {
    const state = TileState_default.IDLE;
    super(options.tileCoord, state, {
      transition: options.transition,
      interpolate: options.interpolate
    });
    this.loader_ = options.loader;
    this.data_ = null;
    this.error_ = null;
    this.size_ = options.size || null;
  }
  /**
   * Get the tile size.
   * @return {import('./size.js').Size} Tile size.
   */
  getSize() {
    if (this.size_) {
      return this.size_;
    }
    const imageData = asImageLike(this.data_);
    if (imageData) {
      return [imageData.width, imageData.height];
    }
    return defaultSize;
  }
  /**
   * Get the data for the tile.
   * @return {Data} Tile data.
   * @api
   */
  getData() {
    return this.data_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   * @api
   */
  getError() {
    return this.error_;
  }
  /**
   * Load not yet loaded URI.
   * @api
   */
  load() {
    if (this.state !== TileState_default.IDLE && this.state !== TileState_default.ERROR) {
      return;
    }
    this.state = TileState_default.LOADING;
    this.changed();
    const self = this;
    this.loader_().then(function(data) {
      self.data_ = data;
      self.state = TileState_default.LOADED;
      self.changed();
    }).catch(function(error) {
      self.error_ = error;
      self.state = TileState_default.ERROR;
      self.changed();
    });
  }
};
var DataTile_default = DataTile;

// node_modules/ol/reproj/DataTile.js
var ReprojDataTile = class extends DataTile_default {
  /**
   * @param {Options} options Tile options.
   */
  constructor(options) {
    super({
      tileCoord: options.tileCoord,
      loader: () => Promise.resolve(new Uint8Array(4)),
      interpolate: options.interpolate,
      transition: options.transition
    });
    this.pixelRatio_ = options.pixelRatio;
    this.gutter_ = options.gutter;
    this.reprojData_ = null;
    this.reprojError_ = null;
    this.reprojSize_ = void 0;
    this.sourceTileGrid_ = options.sourceTileGrid;
    this.targetTileGrid_ = options.targetTileGrid;
    this.wrappedTileCoord_ = options.wrappedTileCoord || options.tileCoord;
    this.sourceTiles_ = [];
    this.sourcesListenerKeys_ = null;
    this.sourceZ_ = 0;
    const targetExtent = this.targetTileGrid_.getTileCoordExtent(
      this.wrappedTileCoord_
    );
    const maxTargetExtent = this.targetTileGrid_.getExtent();
    let maxSourceExtent = this.sourceTileGrid_.getExtent();
    const limitedTargetExtent = maxTargetExtent ? getIntersection(targetExtent, maxTargetExtent) : targetExtent;
    if (getArea(limitedTargetExtent) === 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    const sourceProj = options.sourceProj;
    const sourceProjExtent = sourceProj.getExtent();
    if (sourceProjExtent) {
      if (!maxSourceExtent) {
        maxSourceExtent = sourceProjExtent;
      } else {
        maxSourceExtent = getIntersection(maxSourceExtent, sourceProjExtent);
      }
    }
    const targetResolution = this.targetTileGrid_.getResolution(
      this.wrappedTileCoord_[0]
    );
    const targetProj = options.targetProj;
    const sourceResolution = calculateSourceExtentResolution(
      sourceProj,
      targetProj,
      limitedTargetExtent,
      targetResolution
    );
    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    const errorThresholdInPixels = options.errorThreshold !== void 0 ? options.errorThreshold : ERROR_THRESHOLD;
    this.triangulation_ = new Triangulation_default(
      sourceProj,
      targetProj,
      limitedTargetExtent,
      maxSourceExtent,
      sourceResolution * errorThresholdInPixels,
      targetResolution
    );
    if (this.triangulation_.getTriangles().length === 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    this.sourceZ_ = this.sourceTileGrid_.getZForResolution(sourceResolution);
    let sourceExtent = this.triangulation_.calculateSourceExtent();
    if (maxSourceExtent) {
      if (sourceProj.canWrapX()) {
        sourceExtent[1] = clamp(
          sourceExtent[1],
          maxSourceExtent[1],
          maxSourceExtent[3]
        );
        sourceExtent[3] = clamp(
          sourceExtent[3],
          maxSourceExtent[1],
          maxSourceExtent[3]
        );
      } else {
        sourceExtent = getIntersection(sourceExtent, maxSourceExtent);
      }
    }
    if (!getArea(sourceExtent)) {
      this.state = TileState_default.EMPTY;
    } else {
      const sourceRange = this.sourceTileGrid_.getTileRangeForExtentAndZ(
        sourceExtent,
        this.sourceZ_
      );
      const getTile = options.getTileFunction;
      for (let srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
        for (let srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
          const tile = getTile(this.sourceZ_, srcX, srcY, this.pixelRatio_);
          if (tile) {
            this.sourceTiles_.push(tile);
          }
        }
      }
      if (this.sourceTiles_.length === 0) {
        this.state = TileState_default.EMPTY;
      }
    }
  }
  /**
   * Get the tile size.
   * @return {import('../size.js').Size} Tile size.
   */
  getSize() {
    return this.reprojSize_;
  }
  /**
   * Get the data for the tile.
   * @return {import("../DataTile.js").Data} Tile data.
   */
  getData() {
    return this.reprojData_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   */
  getError() {
    return this.reprojError_;
  }
  /**
   * @private
   */
  reproject_() {
    const dataSources = [];
    this.sourceTiles_.forEach((tile) => {
      if (!tile || tile.getState() !== TileState_default.LOADED) {
        return;
      }
      const size = tile.getSize();
      const gutter = this.gutter_;
      let tileData;
      const arrayData = asArrayLike(tile.getData());
      if (arrayData) {
        tileData = arrayData;
      } else {
        tileData = toArray(asImageLike(tile.getData()));
      }
      const pixelSize = [size[0] + 2 * gutter, size[1] + 2 * gutter];
      const isFloat = tileData instanceof Float32Array;
      const pixelCount = pixelSize[0] * pixelSize[1];
      const DataType = isFloat ? Float32Array : Uint8Array;
      const tileDataR = new DataType(tileData.buffer);
      const bytesPerElement = DataType.BYTES_PER_ELEMENT;
      const bytesPerPixel = bytesPerElement * tileDataR.length / pixelCount;
      const bytesPerRow = tileDataR.byteLength / pixelSize[1];
      const bandCount = Math.floor(
        bytesPerRow / bytesPerElement / pixelSize[0]
      );
      const packedLength = pixelCount * bandCount;
      let packedData = tileDataR;
      if (tileDataR.length !== packedLength) {
        packedData = new DataType(packedLength);
        let dataIndex = 0;
        let rowOffset = 0;
        const colCount = pixelSize[0] * bandCount;
        for (let rowIndex = 0; rowIndex < pixelSize[1]; ++rowIndex) {
          for (let colIndex = 0; colIndex < colCount; ++colIndex) {
            packedData[dataIndex++] = tileDataR[rowOffset + colIndex];
          }
          rowOffset += bytesPerRow / bytesPerElement;
        }
      }
      dataSources.push({
        extent: this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord),
        data: new Uint8Array(packedData.buffer),
        dataType: DataType,
        bytesPerPixel,
        pixelSize
      });
    });
    this.sourceTiles_.length = 0;
    if (dataSources.length === 0) {
      this.state = TileState_default.ERROR;
    } else {
      const z = this.wrappedTileCoord_[0];
      const size = this.targetTileGrid_.getTileSize(z);
      const targetWidth = typeof size === "number" ? size : size[0];
      const targetHeight = typeof size === "number" ? size : size[1];
      const targetResolution = this.targetTileGrid_.getResolution(z);
      const sourceResolution = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      );
      const targetExtent = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      let dataR, dataU;
      const bytesPerPixel = dataSources[0].bytesPerPixel;
      const reprojs = Math.ceil(bytesPerPixel / 3);
      for (let reproj = reprojs - 1; reproj >= 0; --reproj) {
        const sources = [];
        for (let i = 0, len = dataSources.length; i < len; ++i) {
          const dataSource = dataSources[i];
          const buffer = dataSource.data;
          const pixelSize = dataSource.pixelSize;
          const width = pixelSize[0];
          const height = pixelSize[1];
          const context2 = createCanvasContext2D(width, height, canvasPool);
          const imageData2 = context2.createImageData(width, height);
          const data2 = imageData2.data;
          let offset2 = reproj * 3;
          for (let j = 0, len2 = data2.length; j < len2; j += 4) {
            data2[j] = buffer[offset2];
            data2[j + 1] = buffer[offset2 + 1];
            data2[j + 2] = buffer[offset2 + 2];
            data2[j + 3] = 255;
            offset2 += bytesPerPixel;
          }
          context2.putImageData(imageData2, 0, 0);
          sources.push({
            extent: dataSource.extent,
            image: context2.canvas
          });
        }
        const canvas = render(
          targetWidth,
          targetHeight,
          this.pixelRatio_,
          sourceResolution,
          this.sourceTileGrid_.getExtent(),
          targetResolution,
          targetExtent,
          this.triangulation_,
          sources,
          this.gutter_,
          false,
          false
        );
        for (let i = 0, len = sources.length; i < len; ++i) {
          const canvas2 = sources[i].image;
          const context2 = canvas2.getContext("2d");
          releaseCanvas(context2);
          canvasPool.push(context2.canvas);
        }
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        releaseCanvas(context);
        canvasPool.push(canvas);
        if (!dataR) {
          dataU = new Uint8Array(
            bytesPerPixel * imageData.width * imageData.height
          );
          dataR = new dataSources[0].dataType(dataU.buffer);
        }
        const data = imageData.data;
        let offset = reproj * 3;
        for (let i = 0, len = data.length; i < len; i += 4) {
          if (data[i + 3] === 255) {
            dataU[offset] = data[i];
            dataU[offset + 1] = data[i + 1];
            dataU[offset + 2] = data[i + 2];
          } else {
            dataU[offset] = 0;
            dataU[offset + 1] = 0;
            dataU[offset + 2] = 0;
          }
          offset += bytesPerPixel;
        }
      }
      this.reprojData_ = dataR;
      this.reprojSize_ = [
        Math.round(targetWidth * this.pixelRatio_),
        Math.round(targetHeight * this.pixelRatio_)
      ];
      this.state = TileState_default.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.state !== TileState_default.IDLE && this.state !== TileState_default.ERROR) {
      return;
    }
    this.state = TileState_default.LOADING;
    this.changed();
    let leftToLoad = 0;
    this.sourcesListenerKeys_ = [];
    this.sourceTiles_.forEach((tile) => {
      const state = tile.getState();
      if (state !== TileState_default.IDLE && state !== TileState_default.LOADING) {
        return;
      }
      leftToLoad++;
      const sourceListenKey = listen(
        tile,
        EventType_default.CHANGE,
        function() {
          const state2 = tile.getState();
          if (state2 == TileState_default.LOADED || state2 == TileState_default.ERROR || state2 == TileState_default.EMPTY) {
            unlistenByKey(sourceListenKey);
            leftToLoad--;
            if (leftToLoad === 0) {
              this.unlistenSources_();
              this.reproject_();
            }
          }
        },
        this
      );
      this.sourcesListenerKeys_.push(sourceListenKey);
    });
    if (leftToLoad === 0) {
      setTimeout(this.reproject_.bind(this), 0);
    } else {
      this.sourceTiles_.forEach(function(tile) {
        const state = tile.getState();
        if (state == TileState_default.IDLE) {
          tile.load();
        }
      });
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(unlistenByKey);
    this.sourcesListenerKeys_ = null;
  }
};
var DataTile_default2 = ReprojDataTile;

// node_modules/ol/tilecoord.js
function createOrUpdate2(z, x, y, tileCoord) {
  if (tileCoord !== void 0) {
    tileCoord[0] = z;
    tileCoord[1] = x;
    tileCoord[2] = y;
    return tileCoord;
  }
  return [z, x, y];
}
function getKeyZXY(z, x, y) {
  return z + "/" + x + "/" + y;
}
function getKey(tileCoord) {
  return getKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]);
}
function getCacheKeyForTileKey(tileKey) {
  const [z, x, y] = tileKey.substring(tileKey.lastIndexOf("/") + 1, tileKey.length).split(",").map(Number);
  return getKeyZXY(z, x, y);
}
function fromKey(key) {
  return key.split("/").map(Number);
}
function hash(tileCoord) {
  return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
}
function withinExtentAndZ(tileCoord, tileGrid) {
  const z = tileCoord[0];
  const x = tileCoord[1];
  const y = tileCoord[2];
  if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
    return false;
  }
  const tileRange = tileGrid.getFullTileRange(z);
  if (!tileRange) {
    return true;
  }
  return tileRange.containsXY(x, y);
}

// node_modules/ol/ImageCanvas.js
var ImageCanvas = class extends Image_default {
  /**
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {HTMLCanvasElement} canvas Canvas.
   * @param {Loader} [loader] Optional loader function to
   *     support asynchronous canvas drawing.
   */
  constructor(extent, resolution, pixelRatio, canvas, loader) {
    const state = loader !== void 0 ? ImageState_default.IDLE : ImageState_default.LOADED;
    super(extent, resolution, pixelRatio, state);
    this.loader_ = loader !== void 0 ? loader : null;
    this.canvas_ = canvas;
    this.error_ = null;
  }
  /**
   * Get any error associated with asynchronous rendering.
   * @return {?Error} Any error that occurred during rendering.
   */
  getError() {
    return this.error_;
  }
  /**
   * Handle async drawing complete.
   * @param {Error} [err] Any error during drawing.
   * @private
   */
  handleLoad_(err) {
    if (err) {
      this.error_ = err;
      this.state = ImageState_default.ERROR;
    } else {
      this.state = ImageState_default.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.state == ImageState_default.IDLE) {
      this.state = ImageState_default.LOADING;
      this.changed();
      this.loader_(this.handleLoad_.bind(this));
    }
  }
  /**
   * @return {HTMLCanvasElement} Canvas element.
   */
  getImage() {
    return this.canvas_;
  }
};
var ImageCanvas_default = ImageCanvas;

// node_modules/ol/resolution.js
function fromResolutionLike(resolution) {
  if (Array.isArray(resolution)) {
    return Math.min(...resolution);
  }
  return resolution;
}

export {
  ERROR_THRESHOLD,
  Tile_default,
  asImageLike,
  asArrayLike,
  DataTile_default,
  Triangulation_default,
  calculateSourceResolution,
  render,
  DataTile_default2,
  Tile_default2,
  ImageTile_default,
  LRUCache_default,
  createOrUpdate,
  TileRange_default,
  createOrUpdate2,
  getKeyZXY,
  getKey,
  getCacheKeyForTileKey,
  fromKey,
  hash,
  withinExtentAndZ,
  ImageLayer_default,
  Image_default2 as Image_default,
  TileProperty_default,
  BaseTile_default,
  TileLayer_default,
  Tile_default3,
  ImageCanvas_default,
  fromResolutionLike
};
//# sourceMappingURL=chunk-JFGOZHTB.js.map
