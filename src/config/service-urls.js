"use strict";
/**
 * Internal configuration for service URLs
 * These URLs should not be exposed to end users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODAL_SERVICE_URLS = void 0;
exports.getServiceUrl = getServiceUrl;
/**
 * Production Modal service URLs
 * @internal
 */
exports.MODAL_SERVICE_URLS = {
    text: 'https://mikethebot44--tryscout-text-create-app.modal.run',
    embed: 'https://mikethebot44--tryscout-embed-create-app.modal.run',
    image: 'https://mikethebot44--tryscout-image-create-app.modal.run',
    audio: 'https://mikethebot44--tryscout-audio-create-app.modal.run',
    vision: 'https://mikethebot44--tryscout-vision-create-app.modal.run',
};
/**
 * Get the service URL for a specific operation type
 * @internal
 */
function getServiceUrl(service) {
    return exports.MODAL_SERVICE_URLS[service];
}
