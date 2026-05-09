export const formatDateTime = (value) => {
  if (!value) return "To be announced";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

export const formatDateRange = (start, end) => {
  if (!start) return "Date coming soon";
  const startLabel = formatDateTime(start);
  if (!end) return startLabel;
  const endTime = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(end));
  return `${startLabel} - ${endTime}`;
};

export const getApiMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;
