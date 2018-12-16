"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var URL = window.URL || window.webkitURL;
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

/**
 * Creates a WebWorker using the given url.
 *
 * @param {string} url The url of the worker.
 *
 * @returns {Worker} The worker.
 */
function createWorker(url) {
	var worker = null;
	try {
		worker = new Worker(url);
	} catch (e) {
		try {
			var blob = void 0;
			try {
				blob = new Blob(["importScripts('" + url + "');"], { type: "application/javascript" });
			} catch (e1) {
				var blobBuilder = new BlobBuilder();
				blobBuilder.append("importScripts('" + url + "');");
				blob = blobBuilder.getBlob("application/javascript");
			}
			var blobUrl = URL.createObjectURL(blob);
			worker = new Worker(blobUrl);
		} catch (e2) {
			throw e2;
		}
	}
	return worker;
}

exports.default = createWorker;
//# sourceMappingURL=createWorker.js.map
