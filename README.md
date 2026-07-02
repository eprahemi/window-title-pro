# Window Title Pro

**Focused window icon + app name + title + right-click menu in the top bar.**

A MacTahoe-styled fork of [Window Title Is Back](https://github.com/fthx/window-title-is-back) by fthx, with extra features:

- **Panel position** — place it left, center, or right
- **Keyboard shortcut** — `Super+Y` to toggle visibility (configurable)
- **Right-click menu** — quick actions: always on top, fullscreen, minimize, maximize, close
- **MacTahoe style** — monochrome desaturated icons by default, clean SF Pro-compatible look
- **Full control** — show/hide icon, app name, and window title independently

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

Open **GNOME Extensions** → **Window Title Pro** to configure:

| Setting | Description |
|---|---|
| Show icon | Toggle app icon |
| Show app name | Toggle application name |
| Show window title | Toggle window title |
| Colored icon | Full color vs MacTahoe monochrome |
| Panel position | Left / Center / Right |
| Icon size | 12–26 px |
| Fixed width | Percentage of panel width |
| Fade time | Animation speed (0 = instant) |
| Toggle shortcut | Keyboard binding |
| Right-click menu | Enable/disable context menu |

## Credits

- Original extension: [Window Title Is Back](https://github.com/fthx/window-title-is-back) by fthx
- Fork maintained by [eprahemi](https://github.com/eprahemi) for the Fedora MacTahoe project
