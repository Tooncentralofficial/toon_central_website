Local Tailwind styling notes for creator dashboard

- Colors are applied via arbitrary values to match Figma without touching global tokens:
  - Backgrounds: #050b12, #0a121d, #0b101a, #0f1b28, #0f1622, #1a2434
  - Borders: #0f1b28, #122034
  - Text: #f5f7fb, #7f8ca0, #a7b4c7, #cdd6e2
  - Accents: #1ec069 (green), #f33a3a (badge red), #f5b74a (scheduled pill)
- Font sizing and radii use Tailwind utilities with custom pixel values where needed (rounded-[14px], text-[13px], etc.).
- Sidebar collapse uses state in `dashboardClient.tsx`; toggle button text is « / ».
- Quick actions reuse NavIcon; wallet icon stands in for “Manage Comics”.
