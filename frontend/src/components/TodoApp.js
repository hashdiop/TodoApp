import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StarBackground from './StarBackground';
import axios from 'axios';
import { 
  FiLogOut, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiLoader,
  FiCheckCircle,
  FiCircle,
  FiList,
  FiCheckSquare,
  FiSquare,
  FiFilter,
  FiCalendar,
  FiClock,
  FiSun,
  FiMoon
} from 'react-icons/fi';

const TodoApp = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'overdue', 'today', 'upcoming'

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement des tâches');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingTodo) {
        const response = await axios.put(`${API_URL}/todos/${editingTodo._id}`, {
          title,
          description,
          dueDate: new Date(dueDate).toISOString()
        });
        setTodos(todos.map(todo => todo._id === editingTodo._id ? response.data : todo));
        setEditingTodo(null);
      } else {
        const response = await axios.post(`${API_URL}/todos`, {
          title,
          description,
          dueDate: new Date(dueDate).toISOString()
        });
        setTodos([response.data, ...todos]);
      }
      setTitle('');
      setDescription('');
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setDueDate(now.toISOString().slice(0, 16));
      setError('');
      setShowForm(false);
    } catch (error) {
      setError('Erreur lors de la sauvegarde de la tâche');
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    if (todo.dueDate) {
      const date = new Date(todo.dueDate);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      setDueDate(date.toISOString().slice(0, 16));
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setDueDate(now.toISOString().slice(0, 16));
    }
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDueDate(now.toISOString().slice(0, 16));
    setShowForm(false);
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${todo._id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => t._id === todo._id ? response.data : t));
    } catch (error) {
      setError('Erreur lors de la mise à jour de la tâche');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError('Erreur lors de la suppression de la tâche');
    }
  };

  // Filter functions
  const filterByStatus = (todo) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'completed') return todo.completed;
    if (statusFilter === 'pending') return !todo.completed;
    return true;
  };

  // Get color based on due date proximity
  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'gray';
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'red'; // Overdue
    if (diffDays === 0) return 'orange'; // Today
    if (diffDays <= 3) return 'yellow'; // Soon (1-3 days)
    return 'green'; // Future
  };

  const filterByDate = (todo) => {
    if (dateFilter === 'all') return true;
    if (!todo.dueDate) return dateFilter === 'no-date';
    
    const now = new Date();
    const due = new Date(todo.dueDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueToday = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    if (dateFilter === 'overdue') {
      return due < now && !todo.completed;
    }
    if (dateFilter === 'today') {
      return dueToday.getTime() === today.getTime();
    }
    if (dateFilter === 'week') {
      return due >= today && due <= weekFromNow;
    }
    if (dateFilter === 'month') {
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      return due >= today && due <= monthFromNow;
    }
    if (dateFilter === 'upcoming') {
      return due > now;
    }
    return true;
  };

  // Apply filters
  const filteredTodos = todos.filter(todo => filterByStatus(todo) && filterByDate(todo));

  // Calculate statistics (based on all todos, not filtered)
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-center animate-fadeIn">
          <div className="relative mb-8">
            <div className="loading-spinner mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiLoader className="text-white text-2xl animate-spin-slow" />
            </div>
          </div>
          <p className="text-white text-xl font-semibold animate-pulse">Chargement de vos tâches...</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0e27]' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
    }`}>
      <StarBackground />
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className={`rounded-2xl shadow-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="animate-slideIn">
            <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Mes Tâches</h1>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Bienvenue, <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{user?.username || 'Utilisateur'}</span> !
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium btn-hover-effect focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDark 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white focus:ring-gray-700'
              }`}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium btn-hover-effect btn-glow focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <FiLogOut className="transition-transform duration-200 group-hover:rotate-12" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className={`rounded-2xl shadow-2xl p-6 animate-scaleIn ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            <FiList className="animate-float" />
            <span>Résumé</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Tasks */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-700 transition-all duration-300">{totalTodos}</p>
                </div>
                <div className="bg-blue-500 rounded-full p-3 hover:rotate-12 transition-transform duration-300">
                  <FiList className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Complétées</p>
                  <p className="text-3xl font-bold text-green-700 transition-all duration-300">{completedTodos}</p>
                </div>
                <div className="bg-green-500 rounded-full p-3 hover:rotate-12 transition-transform duration-300">
                  <FiCheckSquare className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">En attente</p>
                  <p className="text-3xl font-bold text-orange-700 transition-all duration-300">{pendingTodos}</p>
                </div>
                <div className="bg-orange-500 rounded-full p-3 hover:rotate-12 transition-transform duration-300">
                  <FiSquare className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {totalTodos > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progression</span>
                <span className="text-sm font-bold text-purple-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Add Task Button */}
        {!showForm && !editingTodo && (
          <div className="flex justify-center animate-fadeIn">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 btn-hover-effect btn-glow shadow-lg group"
            >
              <FiPlus className="text-xl group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-lg">Ajouter une tâche</span>
            </button>
          </div>
        )}

        {/* Todo Form */}
        {showForm && (
          <div className={`rounded-2xl shadow-2xl p-6 animate-slideIn ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {editingTodo ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-purple-500' 
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
              </div>
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optionnelle)"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none hover:border-purple-300"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <FiClock className="inline mr-2" /> Date et heure d'exécution
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-purple-500' 
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 btn-hover-effect btn-glow group"
                >
                  {editingTodo ? (
                    <>
                      <FiCheck className="group-hover:rotate-12 transition-transform duration-200" />
                      <span>Modifier</span>
                    </>
                  ) : (
                    <>
                      <FiPlus className="group-hover:rotate-90 transition-transform duration-200" />
                      <span>Ajouter</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingTodo) {
                      handleCancelEdit();
                    } else {
                      setShowForm(false);
                      setTitle('');
                      setDescription('');
                      const now = new Date();
                      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                      setDueDate(now.toISOString().slice(0, 16));
                    }
                  }}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 btn-hover-effect group"
                >
                  <FiX className="group-hover:rotate-90 transition-transform duration-200" />
                  <span>Annuler</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Todos List */}
        <div className={`rounded-2xl shadow-2xl p-6 animate-fadeIn ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Liste des tâches <span className="text-purple-600">({filteredTodos.length})</span>
            </h2>
            
            {/* Simplified Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filters */}
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  statusFilter === 'pending'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                En attente
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  statusFilter === 'completed'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Faites
              </button>

              {/* Date Filters */}
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  dateFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Toutes dates
              </button>
              <button
                onClick={() => setDateFilter('overdue')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  dateFilter === 'overdue'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                En retard
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  dateFilter === 'today'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  dateFilter === 'week'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cette semaine
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  dateFilter === 'month'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ce mois
              </button>
            </div>
          </div>

          {todos.length === 0 ? (
            <div className={`text-center py-12 animate-fadeIn ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="animate-float inline-block mb-4">
                <FiList className={`text-6xl ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>
              <p className="text-lg font-medium">Aucune tâche pour le moment.</p>
              <p className="text-sm mt-2">Ajoutez-en une pour commencer !</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className={`text-center py-12 animate-fadeIn ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="animate-float inline-block mb-4">
                <FiFilter className={`text-6xl ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>
              <p className="text-lg font-medium">Aucune tâche ne correspond aux filtres sélectionnés.</p>
              <p className="text-sm mt-2">Essayez de modifier vos filtres !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo, index) => {
                const colorClass = getDueDateColor(todo.dueDate);
                const borderColorClass = {
                  red: 'border-red-400 hover:border-red-500',
                  orange: 'border-orange-400 hover:border-orange-500',
                  yellow: 'border-yellow-400 hover:border-yellow-500',
                  green: 'border-green-400 hover:border-green-500',
                  gray: 'border-gray-300 hover:border-gray-400'
                }[colorClass] || 'border-gray-300';

                return (
                <div
                  key={todo._id}
                  className={`stagger-item p-4 border-l-4 rounded-lg transition-all duration-300 ${
                    todo.completed
                      ? `${isDark ? 'bg-gray-700/50 border-gray-600 opacity-75' : 'bg-gray-50 border-gray-200 opacity-75'} ${borderColorClass}`
                      : `${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white'} ${borderColorClass} hover:shadow-lg hover:scale-[1.01]`
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    borderLeftWidth: '4px'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className="mt-1 text-2xl transition-all duration-300 hover:scale-125 active:scale-95"
                    >
                      {todo.completed ? (
                        <FiCheckCircle className="text-green-500 hover:text-green-600 animate-bounceIn" />
                      ) : (
                        <FiCircle className="text-gray-400 hover:text-purple-500 hover:rotate-90 transition-all duration-300" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-lg transition-all duration-300 ${
                          todo.completed
                            ? 'line-through text-gray-400'
                            : isDark ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p
                          className={`mt-1 text-sm transition-all duration-300 ${
                            todo.completed 
                              ? 'text-gray-400' 
                              : isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {todo.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        {todo.dueDate && (
                          <div className="flex items-center gap-1">
                            <FiClock className={`text-xs ${
                              colorClass === 'red' ? 'text-red-500' :
                              colorClass === 'orange' ? 'text-orange-500' :
                              colorClass === 'yellow' ? 'text-yellow-500' :
                              colorClass === 'green' ? 'text-green-500' :
                              'text-gray-400'
                            }`} />
                            <p className={`text-xs font-medium ${
                              colorClass === 'red' ? 'text-red-600' :
                              colorClass === 'orange' ? 'text-orange-600' :
                              colorClass === 'yellow' ? 'text-yellow-600' :
                              colorClass === 'green' ? 'text-green-600' :
                              'text-gray-500'
                            }`}>
                              {new Date(todo.dueDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">
                          Créé le {new Date(todo.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 btn-hover-effect btn-glow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                        title="Modifier"
                      >
                        <FiEdit2 className="group-hover:rotate-12 transition-transform duration-200" />
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 btn-hover-effect btn-glow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
                        title="Supprimer"
                      >
                        <FiTrash2 className="group-hover:rotate-12 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
