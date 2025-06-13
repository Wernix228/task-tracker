import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialColumns: WorkItemColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    status: 'backlog',
    items: []
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    status: 'in_progress',
    items: []
  },
  {
    id: 'review',
    title: 'Review',
    status: 'review',
    items: []
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    items: []
  }
];

export function useWorkItems() {
  const [columns, setColumns] = useState<WorkItemColumn[]>(initialColumns);
  const [filters, setFilters] = useState<WorkItemState['filters']>({
    search: '',
    priority: undefined,
    tags: []
  });

  const addWorkItem = useCallback((item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: WorkItem = {
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.status === newItem.status
          ? { ...column, items: [...column.items, newItem] }
          : column
      )
    );
  }, []);

  const updateWorkItem = useCallback((item: WorkItem) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        items: column.items.map(i => 
          i.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : i
        )
      }))
    );
  }, []);

  const moveWorkItem = useCallback((itemId: string, newStatus: WorkItemStatus) => {
    setColumns(prevColumns => {
      const item = prevColumns
        .flatMap(col => col.items)
        .find(i => i.id === itemId);

      if (!item) return prevColumns;

      return prevColumns.map(column => ({
        ...column,
        items: column.status === newStatus
          ? [...column.items, { ...item, status: newStatus, updatedAt: new Date().toISOString() }]
          : column.items.filter(i => i.id !== itemId)
      }));
    });
  }, []);

  const deleteWorkItem = useCallback((itemId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        items: column.items.filter(item => item.id !== itemId)
      }))
    );
  }, []);

  const setSearchFilter = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setPriorityFilter = useCallback((priority?: PriorityLevel) => {
    setFilters(prev => ({ ...prev, priority }));
  }, []);

  const setTagsFilter = useCallback((tags: string[]) => {
    setFilters(prev => ({ ...prev, tags }));
  }, []);

  const getFilteredColumns = useCallback(() => {
    return columns.map(column => ({
      ...column,
      items: column.items.filter(item => {
        const matchesSearch = !filters.search || 
          item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.content.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesPriority = !filters.priority || 
          item.priority === filters.priority;
        
        const matchesTags = !filters.tags?.length || 
          filters.tags.every(tag => item.tags.includes(tag));

        return matchesSearch && matchesPriority && matchesTags;
      })
    }));
  }, [columns, filters]);

  return {
    columns: getFilteredColumns(),
    addWorkItem,
    updateWorkItem,
    moveWorkItem,
    deleteWorkItem,
    setSearchFilter,
    setPriorityFilter,
    setTagsFilter,
    filters
  };
} 