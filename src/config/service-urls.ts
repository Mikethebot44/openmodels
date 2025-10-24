/**
 * Internal configuration for service URLs
 * These URLs should not be exposed to end users
 */

interface ServiceUrls {
  text: string;
  embed: string;
  image: string;
  audio: string;
  vision: string;
}

/**
 * Production Modal service URLs
 * @internal
 */
export const MODAL_SERVICE_URLS: ServiceUrls = {
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
export function getServiceUrl(service: keyof ServiceUrls): string {
  return MODAL_SERVICE_URLS[service];
}

