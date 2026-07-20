# Window Title Pro Topbar

A GNOME Shell top bar extension that displays the focused window's icon, app name, and title.

[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-45%20%7C%2046%20%7C%2047%20%7C%2048%20%7C%2049%20%7C%2050-brightgreen)](https://extensions.gnome.org/extension/10319/window-title-pro/)
[![Version](https://img.shields.io/badge/version-14-orange)](https://github.com/eprahemi/window-title-pro/releases)

> **EGO:** [Install from extensions.gnome.org](https://extensions.gnome.org/extension/10319/window-title-pro/)

## Features

- **Window title** — focused window icon + app name + title in the top bar
- **Panel position** — place it left, center, or right
- **Keyboard shortcut** — `Super+Y` to toggle visibility (configurable)
- **Right-click menu** — quick actions: always on top, fullscreen, minimize, maximize, close
- **Clean style** — monochrome desaturated icons by default, minimal look
- **Full control** — show/hide icon, app name, and window title independently
- **Per-app colors** — 379 apps with brand-accurate title colors
- **Workspace indicator** — shows current workspace number `[1]`, `[2]`, etc.
- **Window count badge** — shows `(3)` when multiple windows of same app are open
- **Font size control** — adjustable text size for panel text
- **Fade animation** — smooth fade in/out on window switch (0–1000ms)

## Install

### EGO (recommended)

Install from [extensions.gnome.org](https://extensions.gnome.org/extension/10319/window-title-pro/).

### Manual

```bash
[ -d window-title-pro ] && rm -rf window-title-pro
git clone https://github.com/eprahemi/window-title-pro.git
cd window-title-pro
mkdir -p ~/.local/share/gnome-shell/extensions/window-title-pro@eprahemi.github.io
cp extension.js metadata.json prefs.js ~/.local/share/gnome-shell/extensions/window-title-pro@eprahemi.github.io/
cp -r schemas ~/.local/share/gnome-shell/extensions/window-title-pro@eprahemi.github.io/
glib-compile-schemas ~/.local/share/gnome-shell/extensions/window-title-pro@eprahemi.github.io/schemas/
```

> If you already have a `window-title-pro` folder from a previous clone, the script removes it first and does a fresh clone.

> Works for fresh install and overwrite — `cp -r` replaces existing files silently.

Restart GNOME Shell, then enable:

```bash
gnome-extensions enable window-title-pro@eprahemi.github.io
```

## Settings

Open **GNOME Extensions** app → **Window Title Pro Topbar** → gear icon:

### Appearance

| Setting | Description |
|---|---|
| Colored icon | Full color vs monochrome (desaturated) |
| Per-app title color | Color app name by brand color (requires Colored icon ON) |
| Icon size | 12–26 px |
| Font size | Text size for panel (0 = default) |
| Separator | Text between app name and window title |

### Panel

| Setting | Description |
|---|---|
| Panel position | Left / Center / Right |
| Fixed width | Use fixed width instead of auto-sizing |
| Width | Percentage of panel (when fixed width is ON) |
| Fade time | Animation speed 0–1000 ms (0 = instant) |

### Extra

| Setting | Description |
|---|---|
| Workspace indicator | Show current workspace number |
| Window count | Show window count badge when > 1 |
| Toggle shortcut | Keyboard binding to show/hide (default: `Super+Y`) |
| Right-click menu | Enable/disable context menu |

## Supported GNOME Versions

GNOME 45, 46, 47, 48, 49, 50

## Eprahemi

- [GitHub](https://github.com/eprahemi)
- [EGO](https://extensions.gnome.org/extension/10319/window-title-pro/)
