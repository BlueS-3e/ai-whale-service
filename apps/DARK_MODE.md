# Dark Mode Implementation

Both frontend dashboards now support dark/light mode with automatic system preference detection.

## Features

- 🌙 **Dark Mode** - Beautiful dark theme optimized for low-light environments
- ☀️ **Light Mode** - Clean light theme for daytime use
- 🔄 **System Preference** - Automatically detects and follows your system theme
- 💾 **Persistent** - Your theme preference is saved in localStorage
- ⚡ **No Flash** - Prevents white flash on page load in dark mode

## How It Works

### For Users

1. **Theme Toggle Button**: Look for the sun/moon icon in the top right header
2. **Click to Switch**: Toggle between dark and light modes
3. **Automatic Detection**: On first visit, the theme matches your system preference
4. **Persistent**: Your choice is remembered for future visits

### For Developers

The implementation uses `next-themes` which provides:

- **ThemeProvider**: Wraps the app and manages theme state
- **useTheme Hook**: Access and control theme from any component
- **Tailwind Integration**: Uses Tailwind's `dark:` prefix for styling

## File Structure

```
components/
├── theme-provider.tsx    # Theme context provider
└── theme-toggle.tsx      # Theme toggle button component

app/
└── layout.tsx           # Root layout with ThemeProvider configured
```

## Adding Theme Support to New Pages

### 1. Add Dark Mode Styles

Use Tailwind's `dark:` prefix to style elements for dark mode:

\`\`\`tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  <h1 className="text-blue-600 dark:text-blue-400">Hello World</h1>
</div>
\`\`\`

### 2. Use the Theme Toggle

Import and add the toggle to your page:

\`\`\`tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function MyPage() {
  return (
    <header>
      <nav>
        {/* ... other nav items ... */}
        <ThemeToggle />
      </nav>
    </header>
  );
}
\`\`\`

### 3. Access Theme Programmatically

Use the `useTheme` hook in client components:

\`\`\`tsx
"use client";

import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current theme: {theme}
    </button>
  );
}
\`\`\`

## Theme Configuration

The ThemeProvider is configured in `app/layout.tsx`:

\`\`\`tsx
<ThemeProvider
  attribute="class"          // Uses class-based dark mode
  defaultTheme="system"      // Defaults to system preference
  enableSystem               // Enables system detection
  disableTransitionOnChange  // Prevents transition flicker
>
  {children}
</ThemeProvider>
\`\`\`

## CSS Variables

Dark mode colors are defined in `app/globals.css`:

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... light mode colors ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode colors ... */
}
\`\`\`

## Theme Options

Available theme values:
- `"light"` - Force light mode
- `"dark"` - Force dark mode
- `"system"` - Follow system preference

## Customization

### Change Default Theme

Edit the `defaultTheme` prop in `app/layout.tsx`:

\`\`\`tsx
<ThemeProvider defaultTheme="dark" ... >
\`\`\`

### Add Custom Colors

1. Define CSS variables in `globals.css`
2. Reference them in Tailwind config
3. Use with `dark:` prefix in components

### Theme Transitions

Enable smooth transitions by removing `disableTransitionOnChange`:

\`\`\`tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
\`\`\`

## Browser Support

Works in all modern browsers:
- Chrome/Edge 76+
- Firefox 67+
- Safari 12.1+

## Accessibility

- ✅ Keyboard accessible (Tab + Enter/Space)
- ✅ Screen reader friendly (aria-labels)
- ✅ Respects prefers-color-scheme
- ✅ No motion for users with reduced motion preference

## Troubleshooting

### Theme Not Persisting

- Check browser localStorage is enabled
- Clear site data and try again

### White Flash on Load

- Ensure `suppressHydrationWarning` is on `<html>` tag
- Check `disableTransitionOnChange` is set

### Icons Not Showing

- Verify `lucide-react` is installed: `npm install lucide-react`
- Check icon imports in `theme-toggle.tsx`

## Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind Dark Mode Guide](https://tailwindcss.com/docs/dark-mode)
- [Web.dev: prefers-color-scheme](https://web.dev/prefers-color-scheme/)
