import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


// ── Shortcut recorder row ──
function _modifier_name(state, mask, name) {
    return (state & mask) ? `<${name}>` : '';
}

function _shortcut_to_text(shortcut) {
    if (!shortcut || shortcut === 'None')
        return 'None';
    return shortcut
        .replace(/<Super>/g, 'Super + ')
        .replace(/<Ctrl>/g, 'Ctrl + ')
        .replace(/<Alt>/g, 'Alt + ')
        .replace(/<Shift>/g, 'Shift + ')
        .replace(/\+ $/, '')
        .replace(/([a-zA-Z])$/, (m) => m.toUpperCase());
}

function create_shortcut_row(title, subtitle, settings, key) {
    const current = settings.get_strv(key);
    const current_text = current.length > 0 ? current[0] : 'None';

    const row = new Adw.ActionRow({
        title,
        subtitle,
    });

    const label = new Gtk.Label({
        label: _shortcut_to_text(current_text),
        css_classes: ['accent'],
    });
    row.add_suffix(label);

    const edit_btn = new Gtk.Button({
        icon_name: 'document-edit-symbolic',
        css_classes: ['flat'],
        valign: Gtk.Align.CENTER,
    });
    row.add_suffix(edit_btn);

    let recording = false;
    let controller = null;

    function _start_recording() {
        recording = true;
        label.set_label('… press keys …');
        label.set_css_classes(['warning']);
        edit_btn.set_sensitive(false);

        controller = new Gtk.EventControllerKey();
        const window = row.get_root();
        if (window)
            window.add_controller(controller);

        controller.connect('key-pressed', (_ctrl, keyval, _keycode, state) => {
            const required_mods = Gdk.ModifierType.CONTROL_MASK
                                | Gdk.ModifierType.ALT_MASK
                                | Gdk.ModifierType.SUPER_MASK
                                | Gdk.ModifierType.SHIFT_MASK;
            const mods_only = required_mods | Gdk.ModifierType.LOCK_MASK;

            if ((state & mods_only) === 0 && keyval > 0)
                return Gdk.EVENT_PROPAGATE;

            if ((state & required_mods) === 0) {
                label.set_label('need a modifier (Ctrl, Alt, Super…)');
                return Gdk.EVENT_STOP;
            }

            const mods = [
                _modifier_name(state, Gdk.ModifierType.CONTROL_MASK, 'Ctrl'),
                _modifier_name(state, Gdk.ModifierType.ALT_MASK, 'Alt'),
                _modifier_name(state, Gdk.ModifierType.SUPER_MASK, 'Super'),
                _modifier_name(state, Gdk.ModifierType.SHIFT_MASK, 'Shift'),
            ].filter(m => m).join('');

            const key_name = Gdk.keyval_name(keyval);
            if (!key_name || key_name === '')
                return Gdk.EVENT_PROPAGATE;

            const accelerator = mods + key_name;
            settings.set_strv(key, [accelerator]);

            label.set_label(_shortcut_to_text(accelerator));
            label.set_css_classes(['accent']);
            edit_btn.set_sensitive(true);

            if (controller) {
                const root = row.get_root();
                if (root)
                    root.remove_controller(controller);
                controller = null;
            }
            recording = false;

            return Gdk.EVENT_STOP;
        });
    }

    function _cancel_recording() {
        if (!recording)
            return;
        recording = false;
        const current2 = settings.get_strv(key);
        const text2 = current2.length > 0 ? current2[0] : 'None';
        label.set_label(_shortcut_to_text(text2));
        label.set_css_classes(['accent']);
        edit_btn.set_sensitive(true);
        if (controller) {
            const root = row.get_root();
            if (root)
                root.remove_controller(controller);
            controller = null;
        }
    }

    edit_btn.connect('clicked', () => {
        if (recording) {
            _cancel_recording();
        } else {
            _start_recording();
        }
    });

    settings.connect('changed::' + key, () => {
        const updated = settings.get_strv(key);
        const updated_text = updated.length > 0 ? updated[0] : 'None';
        if (!recording) {
            label.set_label(_shortcut_to_text(updated_text));
        }
    });

    return row;
}


export default class WindowTitleProExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Window Title Pro Enhanced',
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        // ── Items group ──
        const group_items = new Adw.PreferencesGroup({
            title: 'Items',
        });
        page.add(group_items);

        const row_icon = new Adw.SwitchRow({
            title: 'Show icon',
            subtitle: 'Display the app icon in the panel',
        });
        group_items.add(row_icon);
        window._settings.bind(
            'show-icon', row_icon, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const row_app = new Adw.SwitchRow({
            title: 'Show app name',
            subtitle: 'Display the application name',
        });
        group_items.add(row_app);
        window._settings.bind(
            'show-app', row_app, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const row_title = new Adw.SwitchRow({
            title: 'Show window title',
            subtitle: 'Display the focused window title',
        });
        group_items.add(row_title);
        window._settings.bind(
            'show-title', row_title, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // ── Appearance group ──
        const group_appearance = new Adw.PreferencesGroup({
            title: 'Appearance',
        });
        page.add(group_appearance);

        const row_color = new Adw.SwitchRow({
            title: 'Colored icon',
            subtitle: 'Show app icon in full color (disable for MacTahoe monochrome style)',
        });
        group_appearance.add(row_color);
        window._settings.bind(
            'colored-icon', row_color, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const row_per_app_color = new Adw.SwitchRow({
            title: 'Per-app title color',
            subtitle: 'Color the app name based on the application (requires "Colored icon" above)',
        });
        group_appearance.add(row_per_app_color);

        // ── Per-app color depends on colored-icon ──
        const _syncPerAppColor = () => {
            const colorOn = window._settings.get_boolean('colored-icon');
            row_per_app_color.set_sensitive(colorOn);
            if (!colorOn && window._settings.get_boolean('per-app-color')) {
                window._settings.set_boolean('per-app-color', false);
            }
            row_per_app_color.set_active(window._settings.get_boolean('per-app-color'));
        };
        window._settings.connect('changed::colored-icon', _syncPerAppColor);
        _syncPerAppColor();

        window._settings.bind(
            'per-app-color', row_per_app_color, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // ── Panel group ──
        const group_panel = new Adw.PreferencesGroup({
            title: 'Panel',
        });
        page.add(group_panel);

        const pos_list = new Gtk.StringList();
        pos_list.append('Left');
        pos_list.append('Center');
        pos_list.append('Right');
        const row_position = new Adw.ComboRow();
        row_position.set_title('Panel position');
        row_position.set_subtitle('Which side of the top panel to place the indicator');
        row_position.set_model(pos_list);
        group_panel.add(row_position);

        const pos_map = ['left', 'center', 'right'];
        const pos_current = pos_map.indexOf(
            window._settings.get_string('panel-position')
        );
        row_position.set_selected(pos_current >= 0 ? pos_current : 0);

        row_position.connect('notify::selected', () => {
            window._settings.set_string(
                'panel-position',
                pos_map[row_position.get_selected()]
            );
        });

        // ── Size group ──
        const group_size = new Adw.PreferencesGroup({
            title: 'Size & Width',
        });
        page.add(group_size);

        const adjustment_size = new Gtk.Adjustment({
            lower: 12,
            upper: 26,
            step_increment: 1,
        });

        const row_size = new Adw.SpinRow({
            title: 'Icon size (px)',
            adjustment: adjustment_size,
        });
        group_size.add(row_size);
        window._settings.bind(
            'icon-size', row_size, 'value',
            Gio.SettingsBindFlags.DEFAULT
        );

        const row_fixed = new Adw.SwitchRow({
            title: 'Fixed width',
            subtitle: 'Use a fixed width instead of auto-sizing',
        });
        group_size.add(row_fixed);
        window._settings.bind(
            'fixed-width', row_fixed, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const adjustment_width = new Gtk.Adjustment({
            lower: 5,
            upper: 50,
            step_increment: 5,
        });

        const row_width = new Adw.SpinRow({
            title: 'Indicator width (% of panel)',
            subtitle: 'Enable "Fixed width" above to use',
            adjustment: adjustment_width,
        });
        group_size.add(row_width);
        window._settings.bind(
            'width', row_width, 'value',
            Gio.SettingsBindFlags.DEFAULT
        );

        const _sync_width = () => {
            const on = window._settings.get_boolean('fixed-width');
            row_width.set_sensitive(on);
            row_width.set_subtitle(on
                ? 'Percentage of panel width'
                : 'Enable "Fixed width" above to use');
        };
        _sync_width();
        window._settings.connect('changed::fixed-width', _sync_width);

        // ── Animation group ──
        const group_anim = new Adw.PreferencesGroup({
            title: 'Animation',
        });
        page.add(group_anim);

        const adjustment_time = new Gtk.Adjustment({
            lower: 0,
            upper: 1000,
            step_increment: 10,
        });

        const row_time = new Adw.SpinRow({
            title: 'Fade in/out time (ms)',
            subtitle: 'Set to 0 for instant switching',
            adjustment: adjustment_time,
        });
        group_anim.add(row_time);
        window._settings.bind(
            'ease-time', row_time, 'value',
            Gio.SettingsBindFlags.DEFAULT
        );

        // ── Text group ──
        const group_text = new Adw.PreferencesGroup({
            title: 'Text',
        });
        page.add(group_text);

        const row_separator = new Adw.ComboRow({
            title: 'Separator',
            subtitle: 'Enable "Show window title" above to use',
        });
        const sep_list = new Gtk.StringList();
        const sep_options = [' — ', ' | ', ' - ', ' ~ ', ' · ', ' » ', ' « ', ' • ', ' → ', ' / ', ' : ', ' •• '];
        const sep_labels = ['—  (em dash)', '|  (pipe)', '-  (hyphen)', '~  (tilde)', '·  (middle dot)', '»  (right guillemet)', '«  (left guillemet)', '•  (bullet)', '→  (arrow)', '/  (slash)', ':  (colon)', '••  (double bullet)'];
        for (const label of sep_labels)
            sep_list.append(label);
        row_separator.set_model(sep_list);
        const current_sep = window._settings.get_string('separator');
        const sep_idx = sep_options.indexOf(current_sep);
        row_separator.set_selected(sep_idx >= 0 ? sep_idx : 0);
        row_separator.connect('notify::selected', () => {
            window._settings.set_string('separator', sep_options[row_separator.get_selected()]);
        });
        group_text.add(row_separator);

        const _sync_separator = () => {
            const on = window._settings.get_boolean('show-title');
            row_separator.set_sensitive(on);
            row_separator.set_subtitle(on
                ? 'Text shown between app name and window title'
                : 'Enable "Show window title" above to use');
        };
        _sync_separator();
        window._settings.connect('changed::show-title', _sync_separator);

        const adjustment_font = new Gtk.Adjustment({
            lower: 0,
            upper: 24,
            step_increment: 1,
        });

        const row_font = new Adw.SpinRow({
            title: 'Font size (px)',
            subtitle: 'Set to 0 for default panel size',
            adjustment: adjustment_font,
        });
        group_text.add(row_font);
        window._settings.bind(
            'font-size', row_font, 'value',
            Gio.SettingsBindFlags.DEFAULT
        );

        // ── Enhanced group ──
        const group_enhanced = new Adw.PreferencesGroup({
            title: 'Enhanced',
            description: 'Extra features — all off by default',
        });
        page.add(group_enhanced);

        const row_workspace = new Adw.SwitchRow({
            title: 'Workspace indicator',
            subtitle: 'Show current workspace number next to the app name',
        });
        group_enhanced.add(row_workspace);
        window._settings.bind(
            'show-workspace', row_workspace, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const row_window_count = new Adw.SwitchRow({
            title: 'Window count badge',
            subtitle: 'Show how many windows the focused app has open',
        });
        group_enhanced.add(row_window_count);
        window._settings.bind(
            'show-window-count', row_window_count, 'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // ── Shortcuts group ──
        const group_shortcuts = new Adw.PreferencesGroup({
            title: 'Shortcuts',
        });
        page.add(group_shortcuts);

        const row_shortcut = create_shortcut_row(
            'Toggle visibility',
            'Click the edit pen, then press your key combo',
            window._settings,
            'toggle-shortcut'
        );
        group_shortcuts.add(row_shortcut);

        // ── Header on the page ──
        const group_info = new Adw.PreferencesGroup({
            title: 'Window Title Pro Topbar Enhanced',
            description: 'Focused window icon + app name + title in the top bar. '
                + 'MacTahoe-styled with per-app colors (379 apps), workspace indicator, '
                + 'keyboard shortcuts, and window count.\nEnhanced by Eprahemi.',
        });
        page.add(group_info);

        // ── Reset to defaults ──
        const reset_group = new Adw.PreferencesGroup();
        page.add(reset_group);

        const reset_btn = new Gtk.Button({
            label: 'Reset All Settings to Defaults',
            css_classes: ['destructive-action'],
            halign: Gtk.Align.CENTER,
            margin_top: 12,
            margin_bottom: 12,
        });
        reset_group.add(reset_btn);

        reset_btn.connect('clicked', () => {
            const dialog = new Adw.AlertDialog({
                heading: 'Reset all settings?',
                body: 'This will restore every setting to its default value. This cannot be undone.',
            });
            dialog.add_response('cancel', 'Cancel');
            dialog.add_response('reset', 'Reset');
            dialog.set_default_response('cancel');
            dialog.set_close_response('cancel');
            dialog.set_response_appearance('reset', Adw.ResponseAppearance.DESTRUCTIVE);
            dialog.present(reset_btn);

            dialog.connect('response', (dlg, response) => {
                if (response === 'reset') {
                    const keys = window._settings.list_keys();
                    for (const k of keys)
                        window._settings.reset(k);
                }
            });
        });
    }
}
