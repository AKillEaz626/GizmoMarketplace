---
name: gizmo-site-guidance
description: "Project guidance for GizmoStorePrintShop website. Use when: planning site structure, organizing components, building features, or asking questions about the project architecture."
applyTo: "**"
---

# GizmoStorePrintShop Development Guide

## Project Overview

- **Tech Stack**: Vite + TypeScript + HTML/CSS/JS
- **Location**: `c:\Users\ameye\Desktop\Business\GizmoStorePrintShop`
- **Launch Command**: `npm run dev` (runs local dev server on ~localhost:5173)
- **Build Command**: `npm run build` (produces optimized build)

## Project Structure

```
src/
  main.js          - Application entry point
  main.ts          - TypeScript source
  style.css        - Global styles
public/           - Static assets (if needed)
index.html        - HTML template
package.json      - Dependencies & scripts
tsconfig.json     - TypeScript configuration
```

## Before Starting Work

1. **Start the dev server**: Run `npm run dev` in terminal to launch local development environment
2. **Files you're editing**: Main code goes in `src/` folder
3. **Styles**: Modify or extend `src/style.css`
4. **HTML structure**: Edit `index.html` for layout changes

## Planning & Organizing

When planning features or the site structure:

- Break down work into **small, focused tasks**
- Organize by **pages/features** (homepage, product listing, shopping cart, etc.)
- Keep related code (components, styles, logic) together in the `src/` folder
- Use meaningful file names and comments for maintainability

## Building Features

When building:

1. **Start with structure**: Plan components and file organization first
2. **Add styling**: Use `src/style.css` or create component-specific CSS
3. **Add interactivity**: Write TypeScript/JavaScript in `src/` files
4. **Test locally**: Check changes in browser at `http://localhost:5173`
5. **Iterate**: Make changes, save, refresh browser (Vite auto-reloads)

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Create production build in `dist/` folder
- `npm run preview` - Preview production build locally

## How I Can Help

- **Planning**: Organize features, suggest file structure, break down tasks
- **Building**: Write components, help with logic, fix bugs, refactor code
- **Debugging**: Troubleshoot errors and improve code
- **Questions**: Ask me about TypeScript, CSS, Vite, or project architecture anytime

Start with "Let's plan..." or "I want to build..." and let me know what you'd like to focus on!
