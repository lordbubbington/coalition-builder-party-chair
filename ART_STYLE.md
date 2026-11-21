# Coalition Builder: Party Chair art and interface guide

This game follows the studio-wide art direction documented in the AI Games Studio art-rules project and its `ART_STYLE.md` reference. The shared guide calls for a hand-authored cartoon look with crisp pixel-art assets, clear silhouettes, compact palettes, and a consistent interface system.

## Interface

- Use deep navy `hsl(226 24% 7%)`, raised navy `hsl(226 21% 12%)`, warm ivory `hsl(42 25% 92%)`, muted copper `hsl(32 48% 48%)`, muted teal `hsl(174 36% 56%)`, coral `hsl(7 62% 59%)`, and slate borders `hsl(220 14% 26%)` as the shared palette.
- Use a serif face such as Iowan Old Style, Palatino, or Georgia for headings; Aptos or Segoe UI for body copy; condensed faces for labels; and monospace for numbers.
- Preserve keyboard focus visibility and use text labels and contrast alongside color.
- Version 0.2.1 tripled the existing CSS font sizes; version 0.2.2 reduces that scale by 20%. The interface fills the available window, flows vertically when needed, and adapts its grids at smaller widths.

## Pixel art and icons

- Keep pixel artwork crisp, with clear silhouettes, compact colors, and a dark outline. Avoid blur, photographic texture, and airbrushed softness.
- UI icon source art is designed on a 64×64 grid with transparent backgrounds when used as a standalone icon.
- The application icon is a 512×512 opaque square. It uses a simplified U.S. silhouette and a large checkmark on a deep-navy field, with teal, ivory, copper, and dark outlines. The U.S. silhouette is a visual mark, not an electoral map.

## Asset

- `assets/coalition-builder-icon.svg` is the app icon and browser favicon. Its 64×64 viewBox is rendered at the required 512×512 square size.
