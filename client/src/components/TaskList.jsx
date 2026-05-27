import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {
  if (loading) {
    return <p className="muted centered">Loading tasks…</p>;
  }

  if (tasks.length === 0) {
    return <p className="muted centered">No tasks here yet. Add one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
