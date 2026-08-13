# Delava / دلاوا — upload guide

Upload these files individually; all image files are PNG or WebP.

- `delava-logo-orange.png`: primary transparent logo for light mode. Color `#EE6D1B`.
- `delava-logo-white.png`: transparent logo for dark mode.
- `delava-logo-dark.png`: transparent dark logo, exact color `#0B0B0B`.
- `delava-icon-orange.png`: square icon containing the full `دلاوا` wordmark.
- `delava-icon-dark.png`: dark square icon containing the full `دلاوا` wordmark.
- `delava-icon-light.png`: light square icon containing the full `دلاوا` wordmark.
- `delava-social-dark.png` and `delava-social-light.png`: square social images.

Recommended website logic:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="delava-logo-white.png">
  <img src="delava-logo-orange.png" alt="دلاوا">
</picture>
```
