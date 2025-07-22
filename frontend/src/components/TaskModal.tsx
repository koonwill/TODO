import React, { useState, useEffect } from 'react';
import type { Task } from '../utils/api';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<void>;
  initialTask?: Partial<Task>;
  mode: 'add' | 'edit';
  loading?: boolean;
  error?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, initialTask = {}, mode, loading = false, error = '' }) => {
  const [taskName, setTaskName] = useState<string>(initialTask.title || '');
  const [dueDate, setDueDate] = useState<string>(initialTask.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '');
  const [localError, setLocalError] = useState<string>('');

  useEffect(() => {
    setTaskName(initialTask.title || '');
    setDueDate(initialTask.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '');
    setLocalError('');
  }, [open]);

  const handleSave = async () => {
    setLocalError('');
    if (!taskName.trim()) {
      setLocalError('Task name cannot be empty.');
      return;
    }
    try {
      await onSave({ title: taskName, due_date: dueDate ? new Date(dueDate).toISOString() : null });
    } catch (err: any) {
      setLocalError(err.message || 'Failed to save task.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2"><span className="text-2xl font-extrabold tracking-widest">
                        <span className="text-w"> W</span>
                    <span>HAT </span>
                    <span className='text-t'>T</span>
                    <span>O </span>
                    <span className='text-d'>D</span>
                    <span className='text-o'>O?</span>
                    </span></h3>
          <h4 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? 'NEW TO DO' : 'EDIT TO DO'}
          </h4>
        </div>
        {(localError || error) && <p className="text-red-500 text-sm text-center mb-4">{localError || error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">TASK NAME</label>
            <input
              type="text"
              className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">DUE DATE</label>
            <div className="relative">
              <input
                type="date"
                className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 mt-6"
          disabled={loading}
        >
          {loading ? (mode === 'add' ? 'ADDING...' : 'SAVING...') : (mode === 'add' ? 'ADD WHAT TO DO' : 'CONFIRM')}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
