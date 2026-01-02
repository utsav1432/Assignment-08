import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // ⭐⭐ USE YOUR CORRECT BACKEND URL ⭐⭐
  const API_URL = 'https://assignment-07-092q.onrender.com/api/tasks';

  const fetchTasks = async () => {
    setLoading(true);
    console.log('Fetching tasks from:', API_URL);
    
    try {
      const response = await axios.get(API_URL);
      console.log('Tasks received:', response.data);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Cannot connect to backend. Please check console.');
    }
    
    setLoading(false);
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    console.log('Creating task with data:', { title, description });
    
    await axios.post(API_URL, {
      data: { 
        title: title.trim(), 
        description: description.trim(),
        completed: false 
      }
    });

    // Reset form and refresh tasks
    setTitle('');
    setDescription('');
    fetchTasks();
    alert('Task created successfully!');
  };

  // Update task
  const handleUpdateTask = async (taskId) => {
    if (!editTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    console.log('Updating task:', taskId, { editTitle, editDescription });
    
    await axios.put(`${API_URL}/${taskId}`, {
      data: { 
        title: editTitle.trim(), 
        description: editDescription.trim() 
      }
    });

    setEditTaskId(null);
    fetchTasks();
    alert('Task updated successfully!');
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId, currentStatus) => {
    console.log('Toggling task:', taskId, 'from', currentStatus, 'to', !currentStatus);
    
    await axios.put(`${API_URL}/${taskId}`, {
      data: { completed: !currentStatus }
    });
    fetchTasks();
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log('Deleting task:', taskId);
      
      await axios.delete(`${API_URL}/${taskId}`);
      fetchTasks();
      alert('Task deleted successfully!');
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Apply filter
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      return task.title.toLowerCase().includes(searchLower) || 
             task.description.toLowerCase().includes(searchLower);
    }
    
    return true;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-2">
          📝 To-Do List Application
        </h1>
        <p className="text-center text-gray-300">
          Backend: <span className="font-bold">https://assignment-07-092q.onrender.com</span>
        </p>
        <div className="mt-4 text-center text-sm text-gray-300">
          <p className='mb-2'>API URL: {API_URL}</p>
          <p>Tasks loaded: {totalTasks}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Add Task Form */}
          <div className="md:col-span-1">

            {/* Statistics Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalTasks}</div>
                  <div className="text-gray-600">Total Tasks</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">{pendingTasks}</div>
                  <div className="text-gray-600">Pending</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </div>
                  <div className="text-gray-600">Progress</div>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Add New Task</h2>
              
              <form onSubmit={handleCreateTask}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-bold">Title :</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    required
                    minLength="3"
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum 3 characters</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-bold">Description :</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description (optional)"
                    rows="3"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700"
                >
                  Add Task
                </button>
              </form>
            </div>

            
          </div>

          {/* Right Column - Task List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              
              {/* Controls Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Task List ({totalTasks} tasks)
                </h2>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchTasks}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search tasks..."
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">Loading tasks from backend...</p>
                  <p className="text-sm text-gray-500 mt-2">From: {API_URL}</p>
                </div>
              ) : (
                <>
                  {/* No Tasks Message */}
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">📋</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {search ? 'No matching tasks found' : 'No tasks yet'}
                      </h3>
                      <p className="text-gray-500">
                        {search ? 'Try a different search term' : 'Add your first task to get started!'}
                      </p>
                    </div>
                  ) : (
                    /* Task List */
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <div 
                          key={task._id} 
                          className={`bg-gray-50 rounded-lg p-4 border ${task.completed ? 'border-green-200' : 'border-gray-200'} hover:shadow-md transition-all`}
                        >
                          
                          {/* Edit Mode */}
                          {editTaskId === task._id ? (
                            <div className="space-y-4">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Task title"
                              />
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Task description"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateTask(task._id)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* View Mode */
                            <>
                              <div className="flex items-start gap-3">
                                {/* Completion Checkbox */}
                                <button
                                  onClick={() => handleToggleComplete(task._id, task.completed)}
                                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'} hover:border-green-500`}
                                  title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                >
                                  {task.completed && (
                                    <span className="text-white text-sm">✓</span>
                                  )}
                                </button>
                                
                                {/* Task Content */}
                                <div className="flex-1">
                                  <h3 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEdit(task)}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              
                              {/* Status and Date */}
                              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                <span className="text-sm text-gray-500">
                                  Created: {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                                <span className={`px-3 py-1 text-xs rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {task.completed ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Features Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-gray-800 mb-2">CRUD Operations</h3>
                <p className="text-sm text-gray-600">Create, Read, Update, Delete tasks</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-gray-800 mb-2">Status Updates</h3>
                <p className="text-sm text-gray-600">Mark tasks as complete/incomplete</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-gray-800 mb-2">Search & Filter</h3>
                <p className="text-sm text-gray-600">Find and filter tasks easily</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 max-w-6xl mx-auto text-center text-gray-300 text-sm">
        <p>Backend successfully connected to: {API_URL}</p>
        <p className="mt-1">&copy; All Rights are Reserved || By Utsav Rathod</p>
      </footer>
    </div>
  );
}

export default App;