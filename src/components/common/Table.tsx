import React from 'react';
import '../../styles/components/Table.css';

interface Column<T> {
  header: string;
  key: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface PaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

function Table<T>({
  columns,
  data,
  pagination,
  onPageChange,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick
}: TableProps<T>) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.lastPage, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pageNumbers.push(
        <button 
          key="first" 
          onClick={() => onPageChange(1)} 
          className="pagination-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="dots1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button 
          key={i} 
          onClick={() => onPageChange(i)} 
          className={`pagination-button ${pagination.currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < pagination.lastPage) {
      if (endPage < pagination.lastPage - 1) {
        pageNumbers.push(<span key="dots2" className="pagination-ellipsis">...</span>);
      }
      pageNumbers.push(
        <button 
          key="last" 
          onClick={() => onPageChange(pagination.lastPage)} 
          className="pagination-button"
        >
          {pagination.lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="table-container">
      {isLoading ? (
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} style={{ width: column.width }}>
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr 
                      key={keyExtractor(item)} 
                      onClick={() => onRowClick && onRowClick(item)}
                      className={onRowClick ? 'clickable-row' : ''}
                    >
                      {columns.map((column) => (
                        <td key={`${keyExtractor(item)}-${column.key}`}>
                          {column.render
                            ? column.render(item)
                            : (item as any)[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="empty-message">
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.total > 0 && (
            <div className="table-pagination">
              <div className="pagination-info">
                Showing {pagination.perPage * (pagination.currentPage - 1) + 1} to{' '}
                {Math.min(pagination.perPage * pagination.currentPage, pagination.total)} of{' '}
                {pagination.total} entries
              </div>

              <div className="pagination-controls">
                <button
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="pagination-button prev"
                >
                  Previous
                </button>

                {renderPageNumbers()}

                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.lastPage}
                  className="pagination-button next"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Table; 