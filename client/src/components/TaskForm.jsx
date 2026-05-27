import { useEffect, useState } from 'react';

const empty = { title: '', description: '' };

// Used both for creating a new task and editing an existing one. When `initial`
// is provided the form switches into edit mode.
export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initial ? { title: initial.title, description: initial.description } : empty);
    setError('');
  }, [initial]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ ...form, title: form.title.trim() });
      if (!initial) {
        setForm(empty);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{initial ? 'Edit task' : 'Add a task'}</h2>
      {error && <div className="alert">{error}</div>}

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="What needs to be done?"
        maxLength={160}
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Add some details (optional)"
        rows={3}
      />

      <div className="task-form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {initial ? 'Update task' : 'Add task'}
        </button>
        {initial && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
