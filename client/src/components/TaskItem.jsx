export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const completed = task.status === 'completed';

  return (
    <li className={`task-item ${completed ? 'is-completed' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(task)}
        />
        <span className="checkmark" />
      </label>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <span className={`badge ${completed ? 'badge-done' : 'badge-pending'}`}>
          {completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
