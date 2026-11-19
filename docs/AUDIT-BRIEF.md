# Visual audit brief (audit only — do NOT edit any code)

Site: http://localhost:3100 (Next.js dev server on the user's PC, open in the user's real Chrome).
First load of each page can take 5–15 s while it compiles — wait, then reload once if it is blank.

## Tools and rules
- Use only the Claude in Chrome tools (load with ToolSearch:
  "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__browser_batch").
- Create ONE new tab for yourself (tabs_create_mcp) and work only in it. Never close any tab. Never resize the window
  (other auditors share it). Never type into forms except to test validation; never submit real data anywhere else.
- Judge like a senior designer and a picky customer, at full size: take screenshots at scale 0.6–1 and use the
  `zoom` action on every section to inspect details.

## For every page in your list
Scroll from top to bottom in steps (one viewport at a time), and at each step check:
1. Alignment: do blocks share the same left/right edges (page container), do headings line up with the content
   under them, are card grids even, are icons vertically centred with their text, are buttons aligned?
2. Typography: are equal-level headings the same size/weight across the page and compared with other pages?
   Body text size and colour consistent? Any odd line-heights, cramped or orphaned lines, Tamil text clipped?
3. Spacing: consistent gaps between sections; anything cramped or with too much empty space?
4. Colour/background: do the pastel blocks feel premium or busy? Is anything low-contrast? Would a plain white or
   a soft off-white page background be better in that place? (Give a clear opinion per page.)
5. Images: cropping, blurry, distorted, repeated next to each other, wrong product, Gemini watermark visible.
6. Motion & interaction: hover a few cards/buttons/links (computer `hover`), open dropdowns/accordions/tabs/drawers,
   try the slider arrows. Does motion feel smooth and premium, too much, or missing? Anything stuck invisible after
   scrolling? Jump to the bottom with the End key and check the footer shows fully.
7. Copy: typos, inconsistent capitalisation, the words "organic"/"fresh" (not allowed), dead or placeholder text.
8. Broken things: console errors (javascript_tool: check for visible error overlays), dead links you notice.

## Report (your final message, max 500 words)
A prioritised list. Each item: **page › section › element — problem — exact suggested fix** (sizes, colours,
spacing values where you can). Mark each P1 (looks broken/unprofessional), P2 (inconsistent), P3 (polish).
End with: 3–5 concrete ideas to make the pages in your list feel more premium (motion included), and your
recommendation on white vs tinted backgrounds for these pages.
