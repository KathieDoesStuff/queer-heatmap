import {
  inflate_1
} from "./chunk-TNZLQCKP.js";
import {
  BaseDecoder
} from "./chunk-7NDSTSZN.js";
import "./chunk-4EOJPDL2.js";

// node_modules/geotiff/dist-module/compression/deflate.js
var DeflateDecoder = class extends BaseDecoder {
  decodeBlock(buffer) {
    return inflate_1(new Uint8Array(buffer)).buffer;
  }
};
export {
  DeflateDecoder as default
};
//# sourceMappingURL=deflate-FIQ2FS4V.js.map
