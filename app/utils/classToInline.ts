// app/utils/classToInline.ts
// Mapping of Tailwind utility classes → inline CSS
const classMap: Record<string, string> = {
  // Padding
  "p-1": "padding:0.25rem;",
  "p-2": "padding:0.5rem;",
  "p-4": "padding:1rem;",
  "px-2": "padding-left:0.5rem; padding-right:0.5rem;",
  "py-2": "padding-top:0.5rem; padding-bottom:0.5rem;",

  // Margin
  "m-1": "margin:0.25rem;",
  "m-2": "margin:0.5rem;",
  "m-4": "margin:1rem;",
  "mt-2": "margin-top:0.5rem;",
  "mb-2": "margin-bottom:0.5rem;",
  "ml-2": "margin-left:0.5rem;",
  "mr-2": "margin-right:0.5rem;",

  // Background colors
  "bg-white": "background-color:#ffffff;",
  "bg-gray-100": "background-color:#f3f4f6;",
  "bg-gray-200": "background-color:#e5e7eb;",
  "bg-gray-300": "background-color:#d1d5db;",
  "bg-blue-500": "background-color:#3b82f6;",
  "bg-red-500": "background-color:#ef4444;",

  // Text colors
  "text-black": "color:#000000;",
  "text-white": "color:#ffffff;",
  "text-gray-700": "color:#374151;",
  "text-blue-500": "color:#3b82f6;",
  "text-red-500": "color:#ef4444;",

  // Font weight
  "font-bold": "font-weight:bold;",
  "font-semibold": "font-weight:600;",
  "font-light": "font-weight:300;",

  // Text alignment
  "text-left": "text-align:left;",
  "text-center": "text-align:center;",
  "text-right": "text-align:right;",

  // Rounded corners
  rounded: "border-radius:0.25rem;",
  "rounded-md": "border-radius:0.375rem;",
  "rounded-lg": "border-radius:0.5rem;",

  // Border
  border: "border-width:1px; border-style:solid; border-color:#e5e7eb;",
  "border-2": "border-width:2px; border-style:solid; border-color:#e5e7eb;",
  "border-gray-300": "border-color:#d1d5db;",

  // Flex utilities
  flex: "display:flex;",
  "flex-col": "flex-direction:column;",
  "flex-row": "flex-direction:row;",
  "items-center": "align-items:center;",
  "justify-center": "justify-content:center;",
  "justify-between": "justify-content:space-between;",
};

// Function to replace Tailwind classes with inline styles
export function convertClassesToInline(html: string): string {
  return html.replace(/class="([^"]+)"/g, (_, classes) => {
    const styles = classes
      .split(/\s+/)
      .map((c: string) => classMap[c] || "")
      .join(" ");
    return `style="${styles.trim()}"`;
  });
}
