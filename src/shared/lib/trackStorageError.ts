export const trackStorageError = (action: string, error: unknown) => {
  const { gtag } = useGtag()

  console.warn(`[storage] localStorage ${action} failed:`, error)
  gtag('event', 'storage_error', {
    action,
    error_message: error instanceof Error ? error.message : String(error),
  })
}
