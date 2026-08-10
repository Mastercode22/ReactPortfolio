import React from 'react';

const AdminTable = ({ columns, data, onEdit, onDelete, isLoading, emptyMessage = 'No data found' }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="animate-pulse flex flex-col">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-slate-100 dark:border-white/5 last:border-0">
              {columns.map((_, colIndex) => (
                <div key={colIndex} className="h-6 bg-slate-100 dark:bg-white/5 rounded-md flex-1"></div>
              ))}
              <div className="h-6 w-16 bg-slate-100 dark:bg-white/5 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-xl">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">{emptyMessage}</h3>
        <p className="text-slate-500 dark:text-[#CBD5E1]">Click the add button above to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-[#CBD5E1] text-sm uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-medium whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-slate-800 dark:text-[#F8FAFC]">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
