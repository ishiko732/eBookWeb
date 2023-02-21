export function openViewWindow(resouceId: string) {
  const win = window.open(`/views?resource=${resouceId}`, "_blank");
  win?.focus();
}
