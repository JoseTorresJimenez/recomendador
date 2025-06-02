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

export async function addSearchHistory(item: SearchHistoryItem) {
  await addDoc(collection(db, 'searchHistory'), item);
}
