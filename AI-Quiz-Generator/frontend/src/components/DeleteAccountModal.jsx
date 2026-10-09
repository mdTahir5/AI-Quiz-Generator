import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }
    setIsDeleting(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete account.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#111726] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Permanent action</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Are you sure you want to delete your account? All your quiz attempts, rating history, scores, and subject analytics will be permanently erased from MySQL.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
            Type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:border-red-500 focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mb-3 bg-red-50 dark:bg-red-950/40 p-2 rounded border border-red-200 dark:border-red-800/40">
            {error}
          </p>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium flex items-center justify-center space-x-2 transition shadow-lg shadow-red-900/30"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
