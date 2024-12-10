import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, X } from 'lucide-react';

export default function SaveNotification({ show, message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
      <Alert className="bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
              {message}
            </AlertDescription>
          </div>
          <button 
            onClick={onClose}
            className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Alert>
    </div>
  );
}