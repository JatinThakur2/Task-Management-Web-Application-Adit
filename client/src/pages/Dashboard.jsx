import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';

const PAGE_SIZE = 6;

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (editing) setShowForm(true);
  }, [editing]);

  // Debounce the search box so we are not firing a request on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  // Reset to the first page whenever the filter or search term changes.
  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks', {
        params: {
          status: filter,
          search: debouncedSearch || undefined,
          page,
          limit: PAGE_SIZE,
        },
      });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  const createTask = async (data) => {
    await api.post('/tasks', data);
    setPage(1);
    setShowForm(false);
    await fetchTasks();
  };

  const updateTask = async (data) => {
    await api.put(`/tasks/${editing._id}`, data);
    setEditing(null);
    setShowForm(false);
    await fetchTasks();
  };

  const toggleTask = async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed';
    await api.put(`/tasks/${task._id}`, { status });
    await fetchTasks();
  };

  const deleteTask = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${task._id}`);
    // Step back a page if we just removed the last item on it.
    if (tasks.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      await fetchTasks();
    }
  };

  return (
    <div className="dashboard">
      {showForm ? (
        <TaskForm
          initial={editing}
          onSubmit={editing ? updateTask : createTask}
          onCancel={handleCancel}
        />
      ) : (
        <div className="add-task-bar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add Task
          </button>
        </div>
      )}

      <section className="task-panel">
        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />

        {error && <div className="alert">{error}</div>}

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={toggleTask}
          onEdit={setEditing}
          onDelete={deleteTask}
        />

        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="muted">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
