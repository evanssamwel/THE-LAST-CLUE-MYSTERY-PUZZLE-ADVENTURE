/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Edit3, Check, Trash2, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface InvestigationNotesProps {
  notes: string;
  onChangeNotes: (newNotes: string) => void;
}

export const InvestigationNotes: React.FC<InvestigationNotesProps> = ({
  notes,
  onChangeNotes,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeNotes(e.target.value);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handleInsertTimestamp = () => {
    soundManager.playClick();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = notes ? `${notes}\n\n[Log ${timeStr}]: ` : `[Log ${timeStr}]: `;
    onChangeNotes(updated);
  };

  const handleClear = () => {
    soundManager.playClick();
    if (window.confirm('Clear all your field observations for this case?')) {
      onChangeNotes('');
    }
  };

  return (
    <div className="rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white overflow-hidden shadow-md flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318] dark:bg-[#111318] bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-[#C9A86A]" />
          <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            Detective’s Field Notebook
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Auto-saved</span>
            </span>
          )}

          <button
            onClick={handleInsertTimestamp}
            className="text-[11px] text-[#A5A7AD] hover:text-[#C9A86A] transition-colors px-2 py-0.5 rounded hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200 cursor-pointer"
          >
            + Timestamp
          </button>

          {notes && (
            <button
              onClick={handleClear}
              title="Clear notebook"
              className="text-[#A5A7AD] hover:text-rose-400 p-1 rounded hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Note Area */}
      <div className="p-4 flex-1">
        <textarea
          value={notes}
          onChange={handleTextChange}
          placeholder="Record contradictions in suspect statements, cipher clues, or deductive hypotheses here. Notes persist automatically across sessions..."
          rows={7}
          className="w-full h-full min-h-[160px] bg-transparent text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 placeholder-[#A5A7AD]/60 focus:outline-none resize-y leading-relaxed font-sans"
        />
      </div>

      <div className="px-4 py-2 border-t border-[#2A2E39]/50 dark:border-[#2A2E39]/50 border-slate-100 bg-[#111318]/40 dark:bg-[#111318]/40 bg-slate-50 text-[11px] text-[#A5A7AD] flex items-center justify-between">
        <span>Tip: Click "Note" on clues or suspects to copy findings directly into this journal.</span>
      </div>
    </div>
  );
};
