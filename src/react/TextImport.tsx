import React, { useRef, useState } from 'react';

export function TextImport(): JSX.Element {
    const [status, setStatus] = useState<string>('');
    const fileRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState<string>('');

    async function uploadFile(file: File) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/texts/import', { method: 'POST', body: form });
        const data = await res.json();
        setStatus(data.message || 'Imported');
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="mb-2 font-semibold">Upload .txt</h3>
                <input ref={fileRef} type="file" accept=".txt" onChange={(e) => e.target.files && uploadFile(e.target.files[0])} />
            </div>

            <div>
                <h3 className="mb-2 font-semibold">Paste text</h3>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-40 w-full rounded-md border border-neutral-800 bg-neutral-900 p-2" placeholder="# title: My Text\n# author: Me\n\nYour content..." />
                <button
                    className="btn-primary mt-2"
                    onClick={async () => {
                        const res = await fetch('/api/texts/import', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ content: text })
                        });
                        const data = await res.json();
                        setStatus(data.message || 'Saved');
                    }}
                >
                    Save
                </button>
            </div>

            {status && <div className="rounded bg-neutral-800 p-2 text-sm text-neutral-200">{status}</div>}
        </div>
    );
}


