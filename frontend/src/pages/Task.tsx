import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, decodeJWT, type Task } from '../utils/api';
import TaskModal from '../components/TaskModal';

interface TaskPageProps {
    onLogout: () => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('User');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string>('');

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) {
            onLogout();
            navigate('/login', { replace: true });
            return;
        }
        // Decode JWT to get username and user_id
        const payload = decodeJWT(accessToken);
        if (payload) {
            setUsername(payload.username || 'User');
        }
        fetchTasks();
    }, [accessToken, onLogout, navigate]);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiRequest<Task[]>('GET', '/api/tasks/', null, accessToken);
            setTasks(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData: Partial<Task>) => {
        setModalError('');
        setModalLoading(true);
        try {
            const newTaskData = {
                ...taskData,
                description: "",
                completed: false,
            };
            await apiRequest<Task>('POST', '/api/tasks/', newTaskData, accessToken);
            fetchTasks();
            setShowAddModal(false);
        } catch (err: any) {
            setModalError(err.message || 'Failed to add task.');
        } finally {
            setModalLoading(false);
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

    const handleSaveEditedTask = async (updatedData: Partial<Task>) => {
        setModalError('');
        setModalLoading(true);
        console.log(updatedData);
        const taskSchema = {
                        ...tasks.find(task => task.task_id === editingTask?.task_id),
                        title: updatedData.title,
                        due_date: updatedData.due_date
                    }
        if (!editingTask) return;
        try {
            await apiRequest<Task>('PUT', `/api/tasks/${editingTask.task_id}`, taskSchema, accessToken);
            fetchTasks();
            setEditingTask(null);
        } catch (err: any) {
            setModalError(err.message || 'Failed to save edited task.');
        } finally {
            setModalLoading(false);
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

    const sortByDueDateAsc = (a: Task, b: Task) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    };
    const pendingTasks = tasks.filter(task => !task.completed).sort(sortByDueDateAsc);
    const completedTasks = tasks.filter(task => task.completed).sort(sortByDueDateAsc);

    return (
        <div className="min-h-screen w-screen fixed inset-0 bg-gray-100 font-inter overflow-auto">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-3 mb-6" style={{ backgroundColor: '#F4D387' }}>
                <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-800 tracking-wide">HELLO, {username.toUpperCase()} :D</span>
                </div>
                <div className="flex-1 flex justify-center">
                    <span className="text-2xl font-extrabold tracking-widest">
                        <span className="text-w"> W</span>
                    <span>HAT </span>
                    <span className='text-t'>T</span>
                    <span>O </span>
                    <span className='text-d'>D</span>
                    <span>O?</span>
                    </span>
                </div>
                <div>
                    <button
                        onClick={onLogout}
                        className="bg-white text-pink-600 hover:bg-pink-500 hover:text-white font-bold py-2 px-6 rounded-xl transition duration-200 ease-in-out"
                    >
                        SIGN OUT
                    </button>
                </div>
            </nav>

            {/* Unified Card Container */}
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col gap-8">
                {/* Add New To-Do Button */}
                <button
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-105 text-lg mb-2"
                    onClick={() => setShowAddModal(true)}
                >
                    + NEW TO DO
                </button>

                {loading && <p className="text-center text-gray-600 text-lg">Loading tasks...</p>}
                {error && !loading && <p className="text-red-500 text-center text-lg">{error}</p>}

                <div className="flex items-center">
                    <span className="text-xs font-bold text-o tracking-wide mr-3 whitespace-nowrap">WHAT TO DO</span>
                    <div className="flex-1 border-t" style={{ borderColor: '#E0E0E0', borderWidth: 1 }}></div>
                </div>
                <div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full rounded-xl">
                            <thead>
                                <tr>
                                    <th className="pl-7 pr-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white rounded-tl-xl"></th>
                                    <th className="pl-0 pr-8 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white">TASK NAME</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white">DUE</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white rounded-tr-xl"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {pendingTasks.length === 0 && !loading && !error ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            No pending tasks.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingTasks.map((task) => (
                                        <tr key={task.task_id}>
                                            <td className="pl-7 pr-4 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-pink-600 rounded"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleComplete(task.task_id, task.completed)}
                                                />
                                            </td>
                                            <td className="pl-0 pr-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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

                {/* Section Header: COMPLETE */}
                <div className="flex items-center">
                    <span className="text-xs font-bold text-o tracking-wide mr-3 whitespace-nowrap">COMPLETE</span>
                    <div className="flex-1 border-t" style={{ borderColor: '#E0E0E0', borderWidth: 1 }}></div>
                </div>
                <div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full rounded-xl">
                            <thead>
                                <tr>
                                    <th className="pl-7 pr-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white rounded-tl-xl"></th>
                                    <th className="pl-0 pr-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white">TASK NAME</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white">DUE</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white rounded-tr-xl"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {completedTasks.length === 0 && !loading && !error ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            No completed tasks.
                                        </td>
                                    </tr>
                                ) : (
                                    completedTasks.map((task) => (
                                        <tr key={task.task_id} className="line-through text-gray-500">
                                            <td className="pl-7 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-pink-600 rounded"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleComplete(task.task_id, task.completed)}
                                                />
                                            </td>
                                            <td className="pl-0 pr-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {task.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            </div>

            {/* Add Modal */}
            <TaskModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddTask}
                mode="add"
                loading={modalLoading}
                error={modalError}
            />

            {/* Edit Modal */}
            {editingTask && (
                <TaskModal
                    open={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSaveEditedTask}
                    initialTask={editingTask}
                    mode="edit"
                    loading={modalLoading}
                    error={modalError}
                />
            )}
        </div>
    );
};

export default TaskPage;
