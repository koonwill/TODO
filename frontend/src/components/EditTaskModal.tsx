/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import type { Task } from '../utils/api'; // Import Task interface

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onSave: (taskId: string, updatedData: Partial<Task>) => Promise<void>;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
    const [taskName, setTaskName] = useState<string>(task.title);
    const [dueDate, setDueDate] = useState<string>(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSave = async () => {
        setError('');
        setLoading(true);
        try {
            const updatedTask: Partial<Task> = {
                title: taskName,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
            };
            await onSave(task.task_id, updatedTask);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save task.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-pink-600 mb-2">WHAT TO DO?</h3>
                    <h4 className="text-xl font-semibold text-gray-800">EDIT TO DO</h4>
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">TASK NAME</label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">DUE DATE</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {/* Calendar icon - using SVG for simplicity */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105 mt-6"
                    disabled={loading}
                >
                    {loading ? 'SAVING...' : 'CONFIRM'}
                </button>
            </div>
        </div>
    );
};

export default EditTaskModal;
