export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  if (isNaN(date.getTime())) return 'N/A';
  const diffMs = Math.max(0, now - date);
  const diffH = diffMs / (1000 * 60 * 60);
  if (diffH < 1) return `${Math.floor(diffH * 60)}m ago`;
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
};
