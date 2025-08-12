import React, { useEffect, useState } from 'react';

type Settings = {
    enableSounds: boolean;
    showCursor: boolean;
    lengthPreference: 'short' | 'medium' | 'long';
};

const defaultSettings: Settings = {
    enableSounds: false,
    showCursor: true,
    lengthPreference: 'medium'
};

export function SettingsPanel(): JSX.Element {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        const raw = localStorage.getItem('narratype:settings');
        if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    }, []);

    function save() {
        localStorage.setItem('narratype:settings', JSON.stringify(settings));
        setStatus('Saved');
        setTimeout(() => setStatus(''), 1500);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <input id="enableSounds" type="checkbox" checked={settings.enableSounds} onChange={(e) => setSettings((s) => ({ ...s, enableSounds: e.target.checked }))} />
                <label htmlFor="enableSounds">Key sounds</label>
            </div>
            <div className="flex items-center gap-2">
                <input id="showCursor" type="checkbox" checked={settings.showCursor} onChange={(e) => setSettings((s) => ({ ...s, showCursor: e.target.checked }))} />
                <label htmlFor="showCursor">Show cursor</label>
            </div>
            <div className="flex items-center gap-2">
                <label className="w-32">Exercise length</label>
                <select className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1" value={settings.lengthPreference} onChange={(e) => setSettings((s) => ({ ...s, lengthPreference: e.target.value as Settings['lengthPreference'] }))}>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                </select>
            </div>
            <button className="btn-primary" onClick={save}>Save</button>
            {status && <div className="text-sm text-neutral-300">{status}</div>}
        </div>
    );
}


