// Resolve the legacy bundled URL without changing saved project documents.
export function workshopAssetUrl(url: string): string {
  return url === "/sample-object.svg"
    ? `${import.meta.env.BASE_URL}sample-object.svg`
    : url;
}
