import { useNotification } from '../context/NotificationContext.jsx';

/**
 * Global toast stack — mounted once in App.jsx so notifications raised
 * anywhere in the app are visible everywhere.
 */
export default function Notification() {
  const { notifications } = useNotification() ?? { notifications: [] };

  if (!notifications.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`toast toast-${n.type}`}
          role={n.type === 'error' ? 'alert' : 'status'}
        >
          <span aria-hidden="true">{n.type === 'error' ? '⚠️' : '✅'}</span>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
