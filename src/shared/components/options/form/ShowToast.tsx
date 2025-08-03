import React from 'react';

interface Notifications {
  changed?: string;
  [key: string]: any;
}

interface ShowToastProps {
  notifications: Notifications;
  show: boolean;
  setShow: (show: boolean) => void;
}

function ShowToast({ notifications, show, setShow }: ShowToastProps) {
  const field = notifications.changed;
  const value = notifications[field || ''];

  if (!show) return null;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, setShow]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold mb-1">Settings Updated</div>
          <div className="text-sm">
            You have successfully changed <br />
            <mark className="bg-yellow-200 text-black px-1 rounded">
              {field && `${field}: ${value}`}
            </mark>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="ml-4 text-primary-foreground hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ShowToast;
