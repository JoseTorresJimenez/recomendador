import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

interface FirebaseStatusProps {
  show?: boolean;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ show = process.env.NODE_ENV === 'development' }) => {
  const [status, setStatus] = useState({
    isConnected: false,
    lastError: null as string | null,
    historyCount: 0,
    lastUpdate: new Date(),
  });

  useEffect(() => {
    if (!show) return;

    const checkStatus = async () => {
      try {
        // Test Firebase connection
        const testCollection = await import('firebase/firestore').then(({ collection, getDocs }) => 
          getDocs(collection(db, 'searchHistory'))
        );
        
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          lastError: null,
          historyCount: testCollection.size,
          lastUpdate: new Date(),
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          lastError: error instanceof Error ? error.message : 'Unknown error',
          lastUpdate: new Date(),
        }));
      }
    };

    // Check immediately and then every 30 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-white border border-white/20 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${status.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className="font-semibold">Firebase Status</span>
      </div>
      
      <div className="space-y-1 text-gray-300">
        <div>🔗 Connected: {status.isConnected ? 'Yes' : 'No'}</div>
        <div>📚 History Items: {status.historyCount}</div>
        <div>🕒 Last Check: {status.lastUpdate.toLocaleTimeString()}</div>
        {status.lastError && (
          <div className="text-red-300 text-xs mt-2 break-words">
            ❌ Error: {status.lastError}
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-white/20">
        <button
          onClick={() => {
            if (typeof (window as any).debugSearchHistory !== 'undefined') {
              (window as any).debugSearchHistory.testAddHistory();
            }
          }}
          className="text-blue-400 hover:text-blue-300 text-xs underline"
        >
          🧪 Test Add History
        </button>
      </div>
    </div>
  );
};
