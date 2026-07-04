export const renderIcon = (icon: string): string => {
  // Checks for file extensions OR base64 data URLs OR absolute/relative paths
  const isImage =
    /\.(png|jpe?g|svg|gif|webp)(\?.*)?$/i.test(icon) ||
    icon.startsWith("data:image") ||
    icon.includes("/");

  if (isImage) {
    return `<img src="${icon}" alt="" class="icon-image" aria-hidden="true" />`;
  }

  return `<span class="icon-emoji" aria-hidden="true">${icon}</span>`;
};
