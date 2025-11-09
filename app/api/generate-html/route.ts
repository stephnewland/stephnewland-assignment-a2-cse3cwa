import { NextRequest, NextResponse } from "next/server";

// Type for a single tab
interface Tab {
  id: number;
  header: string;
  content: string;
}

// Helper: generates the HTML from tabs
const generateHTML = (tabs: Tab[]) => {
  const headContent = `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Tabs Example</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .tab-button.active { background-color: #3b82f6; color: white; }
  </style>
</head>`;

  const buttons = tabs
    .map(
      (t, index) =>
        `<button class="tab-button ${
          index === 0 ? "active" : ""
        }" onclick="openTab(this, 'tab-${t.id}')">${t.header}</button>`
    )
    .join("\n");

  const contents = tabs
    .map(
      (t, index) =>
        `<div id="tab-${t.id}" class="tab-content ${
          index === 0 ? "active" : ""
        }"><h3>${t.header}</h3><p>${t.content}</p></div>`
    )
    .join("\n");

  const script = `
<script>
function openTab(evt, tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  evt.classList.add('active');
}
document.addEventListener('DOMContentLoaded', () => {
  const firstButton = document.querySelector('.tab-button');
  if (firstButton) openTab(firstButton, firstButton.getAttribute('data-tab-id'));
});
</script>`;

  return `<!DOCTYPE html>
<html lang="en">
${headContent}
<body>
  <div>${buttons}</div>
  <div>${contents}</div>
  ${script}
</body>
</html>`;
};

// The POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tabs: Tab[] = body.tabs;

    if (!tabs || !Array.isArray(tabs)) {
      return NextResponse.json({ error: "Invalid tabs data" }, { status: 400 });
    }

    const html = generateHTML(tabs);
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate HTML" },
      { status: 500 }
    );
  }
}
