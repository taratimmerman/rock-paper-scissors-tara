export const renderIcon = (
  icon: string,
  fallbackIcon: string = "⭐️",
): string => {
  // Checks for file extensions OR base64 data URLs OR absolute/relative paths
  const isImage =
    /\.(png|jpe?g|svg|gif|webp)(\?.*)?$/i.test(icon) ||
    icon.startsWith("data:image") ||
    icon.includes("/");

  if (isImage) {
    const fallbackMarkup = `<span class="icon-fallback" aria-hidden="true">${fallbackIcon}</span>`;
    const onerrorHandler = `this.onerror=null; this.style.display='none'; this.parentElement?.querySelector('.icon-fallback')?.remove(); this.insertAdjacentHTML('afterend', '${fallbackMarkup.replace(/'/g, "\\'")}');`;

    return `<img src="${icon}" alt="" class="icon-image" aria-hidden="true" onerror="${onerrorHandler}" />`;
  }

  return `<span class="icon-emoji" aria-hidden="true">${icon}</span>`;
};
