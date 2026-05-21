export const safeReturnUrl = (url?: string | null): string | undefined =>
  url && url.startsWith('/') && !url.startsWith('//') ? url : undefined
