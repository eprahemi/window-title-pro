# Window Title Pro Topbar Enhanced

**Focused window icon + app name + title + right-click menu in the top bar.**

A MacTahoe-styled GNOME top bar extension with extra features:

- **Panel position** — place it left, center, or right
- **Keyboard shortcut** — `Super+Y` to toggle visibility (configurable)
- **Right-click menu** — quick actions: always on top, fullscreen, minimize, maximize, close
- **MacTahoe style** — monochrome desaturated icons by default, clean SF Pro-compatible look
- **Full control** — show/hide icon, app name, and window title independently
- **Per-app colors** — 379 apps with brand-accurate title colors
- **Workspace indicator** — shows current workspace number
- **Window count badge** — shows count when multiple windows of same app are open

## Install

```bash
git clone https://github.com/eprahemi/window-title-pro.git
cd window-title-pro
cp -r window-title-pro@eprahemi.github.io ~/.local/share/gnome-shell/extensions/
glib-compile-schemas ~/.local/share/gnome-shell/extensions/window-title-pro@eprahemi.github.io/schemas/
```

Restart GNOME Shell (`Alt+F2`, `r`, Enter), then:

```bash
gnome-extensions enable window-title-pro@eprahemi.github.io
```

## Settings

Open **GNOME Extensions** → **Window Title Pro Topbar Enhanced** to configure:

| Setting | Description |
|---|---|
| Show icon | Toggle app icon |
| Show app name | Toggle application name |
| Show window title | Toggle window title |
| Colored icon | Full color vs MacTahoe monochrome |
| Per-app title color | Color app name by brand (requires Colored icon) |
| Workspace indicator | Show current workspace number |
| Window count | Show window count badge |
| Panel position | Left / Center / Right |
| Icon size | 12–26 px |
| Fixed width | Percentage of panel width |
| Fade time | Animation speed (0 = instant) |
| Toggle shortcut | Keyboard binding |
| Right-click menu | Enable/disable context menu |

## Enhanced by Eprahemi

- [GitHub](https://github.com/eprahemi)
- [EGO](https://extensions.gnome.org/extension/10319/window-title-pro/)
- Part of the [Fedora MacTahoe](https://github.com/eprahemi/Fedora-MacTahoe-Eprahemi) project
