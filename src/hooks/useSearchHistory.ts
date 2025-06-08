import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query as firestoreQuery,
  orderBy,
  getDocs,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export interface SearchHistoryItem {
  type: 'movie' | 'book';
  query: string;
  filters: Record<string, any>;
  timestamp: number;
}

export function useSearchHistory(filterType?: 'movie' | 'book', filterQuery?: string) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = firestoreQuery(collection(db, 'searchHistory'), orderBy('timestamp', 'desc'));
    if (filterType) {
      q = firestoreQuery(collection(db, 'searchHistory'), where('type', '==', filterType), orderBy('timestamp', 'desc'));
    }
    setLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let items = snapshot.docs.map(doc => doc.data() as SearchHistoryItem);
      if (filterQuery) {
        items = items.filter(item => item.query.toLowerCase().includes(filterQuery.toLowerCase()));
      }
      setHistory(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [filterType, filterQuery]);

  return { history, loading };
}

// Función helper para limpiar undefined values
function cleanFirebaseData(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanFirebaseData).filter(item => item !== null && item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = cleanFirebaseData(value);
      }
    }
    return cleaned;
  }
  
  return obj;
}

export async function addSearchHistory(item: SearchHistoryItem) {
  console.log('🗂️🔥 addSearchHistory called with:', item);
  
  try {
    console.log('🗂️🔥 Firebase db object:', db);
    console.log('🗂️🔥 Attempting to add document to searchHistory collection...');
    
    // Limpiar datos antes de enviar a Firebase
    const cleanedItem = cleanFirebaseData(item);
    console.log('🗂️🔥 Cleaned item (no undefined values):', cleanedItem);
    
    const docRef = await addDoc(collection(db, 'searchHistory'), cleanedItem);
    console.log('🗂️✅ SEARCH HISTORY DOCUMENT ADDED WITH ID:', docRef.id);
    
    return docRef;
  } catch (error) {
    console.error('🗂️❌ ERROR IN addSearchHistory:', error);
    console.error('🗂️❌ Firebase error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Debug function for browser console testing
if (typeof window !== 'undefined') {  (window as any).debugSearchHistory = {
    async testAddHistory() {
      const testItem = {
        type: 'book' as const,
        query: 'Test: Stephen King | Horror',
        filters: {
          authors: ['Stephen King'],
          genre: 'Horror'
          // No incluir campos undefined
        },
        timestamp: Date.now()
      };
      
      console.log('🧪🔥 TESTING SEARCH HISTORY - Adding test item:', testItem);
      
      try {
        await addSearchHistory(testItem);
        console.log('🧪✅ TEST COMPLETED SUCCESSFULLY');
      } catch (error) {
        console.error('🧪❌ TEST FAILED:', error);
      }
    },
    
    async testGetHistory() {
      console.log('🧪🔥 TESTING SEARCH HISTORY - Getting all history');
      
      try {
        const q = firestoreQuery(collection(db, 'searchHistory'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log('🧪✅ HISTORY RETRIEVED:', items);
        return items;
      } catch (error) {
        console.error('🧪❌ FAILED TO GET HISTORY:', error);
      }
    }
  };
}

export async function clearSearchHistory() {
  const q = firestoreQuery(collection(db, 'searchHistory'));
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map(document => 
    deleteDoc(doc(db, 'searchHistory', document.id))
  );
  
  await Promise.all(deletePromises);
}
