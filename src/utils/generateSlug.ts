export const generateSlug = (title: string): string => {
  if (!title || typeof title !== "string") return "";

  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z\d\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
