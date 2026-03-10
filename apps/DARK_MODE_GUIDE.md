# Adding Dark Mode to Additional Pages

This guide shows how to add dark mode support to sub-pages and components in the dashboards.

## Quick Reference

### Basic Pattern
```tsx
// Light mode | Dark mode
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-white"
className="border-gray-200 dark:border-gray-700"
```

## Common Patterns

### 1. Backgrounds

```tsx
// Page background
<div className="bg-white dark:bg-gray-900">

// Card background  
<div className="bg-gray-50 dark:bg-gray-800">

// Alternate/Subtle background
<div className="bg-gray-100 dark:bg-gray-700">
```

### 2. Text Colors

```tsx
// Primary text
<h1 className="text-gray-900 dark:text-white">

// Secondary text
<p className="text-gray-600 dark:text-gray-300">

// Muted text
<span className="text-gray-500 dark:text-gray-400">
```

### 3. Borders

```tsx
// Standard border
<div className="border border-gray-200 dark:border-gray-700">

// Divider
<hr className="border-gray-300 dark:border-gray-600" />
```

### 4. Buttons

```tsx
// Primary button (already themed via CSS variables)
<Button>Click me</Button>

// Custom button
<button className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
  Custom Button
</button>
```

### 5. Forms

```tsx
<input 
  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
  type="text"
/>

<select className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <option>Option 1</option>
</select>
```

### 6. Cards

```tsx
<Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
  <CardHeader>
    <CardTitle className="text-gray-900 dark:text-white">Title</CardTitle>
    <CardDescription className="text-gray-600 dark:text-gray-400">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="text-gray-700 dark:text-gray-300">
    Content
  </CardContent>
</Card>
```

### 7. Navigation

```tsx
<nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  <a 
    href="#" 
    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
  >
    Link
  </a>
</nav>
```

### 8. Tables

```tsx
<table className="bg-white dark:bg-gray-800">
  <thead className="bg-gray-50 dark:bg-gray-700">
    <tr>
      <th className="text-gray-900 dark:text-white">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="text-gray-700 dark:text-gray-300">Data</td>
    </tr>
  </tbody>
</table>
```

### 9. Icons

```tsx
import { TrendingUp } from "lucide-react";

// Icon with theme-aware color
<TrendingUp className="text-blue-600 dark:text-blue-400" />

// Icon with auto color (inherits from CSS variables)
<TrendingUp className="text-primary" />
```

### 10. Gradients

```tsx
// Background gradient
<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

// Text gradient
<h1 className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

## Complete Page Example

```tsx
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My App
          </h1>
          <nav className="flex gap-4 items-center">
            <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This page supports dark mode!
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          © 2026 My App
        </div>
      </footer>
    </div>
  );
}
```

## Using CSS Variables (Recommended)

Instead of hardcoding colors, use CSS variables for better maintainability:

```tsx
// These automatically work in dark mode via globals.css
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <Button className="bg-primary text-primary-foreground">
      Click me
    </Button>
  </Card>
</div>
```

Available CSS variable classes:
- `bg-background` / `text-foreground`
- `bg-card` / `text-card-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-muted` / `text-muted-foreground`
- `bg-accent` / `text-accent-foreground`
- `border-border`
- `ring-ring`

## Pro Tips

1. **Use semantic color names**: Prefer `bg-background` over `bg-white dark:bg-gray-900`
2. **Test in both modes**: Always check your UI in both light and dark themes
3. **Consider contrast**: Ensure text is readable in both modes (WCAG AA compliance)
4. **Don't forget hover states**: Add dark mode variants for `:hover`, `:focus`, etc.
5. **Images**: Use `mix-blend-mode` or provide separate images for dark mode
6. **Charts**: Update chart colors for dark mode (recharts supports theming)

## Conditional Logic Based on Theme

For client components that need to know the current theme:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeAwareComponent() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div>
      {isDark ? (
        <img src="/logo-dark.png" alt="Logo" />
      ) : (
        <img src="/logo-light.png" alt="Logo" />
      )}
    </div>
  );
}
```

## Debugging Dark Mode

If dark mode isn't working:

1. **Check HTML class**: Inspect `<html>` tag - should have `class="dark"` in dark mode
2. **Check Tailwind config**: Verify `darkMode: ["class"]` in `tailwind.config.ts`
3. **Check ThemeProvider**: Ensure it wraps your app in `layout.tsx`
4. **Clear localStorage**: `localStorage.clear()` in browser console
5. **Check suppression**: `<html suppressHydrationWarning>` should be set
6. **Rebuild**: Run `npm run dev` to restart the dev server

## Resources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
