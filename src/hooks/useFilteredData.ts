import { useMemo } from 'react';
import { Experiment, Filters } from '../types';

export function useFilteredData(data: Experiment[], filters: Filters): Experiment[] {
  return useMemo(() => {
    return data.filter(exp => {
      if (filters.dateFrom && exp.date < filters.dateFrom) return false;
      if (filters.dateTo && exp.date > filters.dateTo) return false;
      if (filters.experimentType !== 'All' && exp.experimentType !== filters.experimentType) return false;
      if (filters.instrument !== 'All' && exp.instrument !== filters.instrument) return false;
      if (filters.status !== 'All' && exp.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !exp.name.toLowerCase().includes(q) &&
          !exp.id.toLowerCase().includes(q) &&
          !exp.operator.toLowerCase().includes(q) &&
          !exp.experimentType.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [data, filters]);
}
