import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, decodeJWT, type Task } from '../utils/api';
import EditTaskModal from '../components/EditTaskModal';

interface TaskPageProps {
    onLogout: () => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ onLogout }) => {
    const [username, setUsername] = useState<string>('User');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        if (!accessToken) {
            onLogout();
            return;
        }
        // Decode JWT to get username and user_id
        const payload = decodeJWT(accessToken);
        if (payload) {
            setUsername(payload.username || 'User');
        }
        fetchTasks();
    }, [accessToken, onLogout]);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiRequest<Task[]>('GET', '/api/tasks/', null, accessToken);
            console.log(data);
            setTasks(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tasks.');
            console.error('Fetch tasks error:', err);
            if (err.message && err.message.includes('Could not validate credentials')) {
                onLogout(); // Token expired or invalid, force logout
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!newTaskTitle.trim()) {
            setError('Task title cannot be empty.');
            return;
        }

        try {
            const newTaskData = {
                title: newTaskTitle,
                description: "",
                completed: false,
                due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
            };
            await apiRequest<Task>('POST', '/api/tasks/', newTaskData, accessToken);
            setNewTaskTitle('');
            setNewTaskDueDate('');
            fetchTasks();
        } catch (err: any) {
            setError(err.message || 'Failed to add task.');
        }
    };

    const handleToggleComplete = async (taskId: string, currentCompleted: boolean) => {
        setError('');
        try {
            const taskSchema = {
                ...tasks.find(task => task.task_id === taskId),
                completed: !currentCompleted,
            }
            await apiRequest<Task>('PUT', `/api/tasks/${taskId}`, taskSchema, accessToken);
            fetchTasks();
        } catch (err: any) {
            setError(err.message || 'Failed to update task status.');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        setError('');
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await apiRequest<void>('DELETE', `/api/tasks/${taskId}`, null, accessToken);
                fetchTasks();
            } catch (err: any) {
                setError(err.message || 'Failed to delete task.');
            }
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleSaveEditedTask = async (taskId: string, updatedData: Partial<Task>) => {
        setError('');
        try {
            await apiRequest<Task>('PUT', `/api/tasks/${taskId}`, updatedData, accessToken);
            fetchTasks();
            setEditingTask(null);
        } catch (err: any) {
            setError(err.message || 'Failed to save edited task.');
            throw err;
        }
    };

    const getTaskStatus = (dueDate: string | null, completed: boolean) => {
        if (!dueDate || completed) return null;
        const now = new Date();
        const due = new Date(dueDate);
        if (due < now) {
            return <span className="text-red-500 font-semibold ml-2">OVERDUE</span>;
        }
        return null;
    };

    const formatDueDate = (dateString: string | null) => {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).toUpperCase();
    };

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="min-h-screen bg-gray-100 font-inter p-4">
            {/* Header */}
            <header className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">HELLO, {username.toUpperCase()} :</h1>
                <h2 className="text-2xl font-extrabold text-pink-600">WHAT TO DO?</h2>
                <button
                    onClick={onLogout} // This will trigger the logout logic in App.tsx
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-105"
                >
                    SIGN OUT
                </button>
            </header>

            {/* Add New To-Do */}
            <form onSubmit={handleAddTask} className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        className="flex-grow shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="New to do"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        className="shadow appearance-none border rounded-xl py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                    >
                        <span className="text-2xl mr-2">+</span> NEW TO DO
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </form>

            {loading && <p className="text-center text-gray-600 text-lg">Loading tasks...</p>}
            {error && !loading && <p className="text-red-500 text-center text-lg">{error}</p>}

            {/* Pending Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">WHAT TO DO</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TASK NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DUE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingTasks.length === 0 && !loading && !error ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No pending tasks.
                                    </td>
                                </tr>
                            ) : (
                                pendingTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-pink-600 rounded"
                                                checked={task.completed}
                                                onChange={() => handleToggleComplete(task.task_id, task.completed)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {task.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDueDate(task.due_date)} {getTaskStatus(task.due_date, task.completed)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="text-gray-600 hover:text-pink-600 mx-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="text-gray-600 hover:text-red-600 mx-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">COMPLETE</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TASK NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DUE</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {completedTasks.length === 0 && !loading && !error ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No completed tasks.
                                    </td>
                                </tr>
                            ) : (
                                completedTasks.map((task) => (
                                    <tr key={task.task_id} className="line-through text-gray-500">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-pink-600 rounded"
                                                checked={task.completed}
                                                onChange={() => handleToggleComplete(task.task_id, task.completed)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {task.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {formatDueDate(task.due_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="text-gray-400 cursor-not-allowed mx-2"
                                                disabled
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.task_id)}
                                                className="text-gray-600 hover:text-red-600 mx-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSaveEditedTask}
                />
            )}
        </div>
    );
};

export default TaskPage;
