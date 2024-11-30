import React, { useState, useEffect, useMemo } from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({ selectedTable, data, columns }) => {
    const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });

    const handleColumnClick = (column) => {
        if (sortConfig.column === column) {
            const newDirection =
                sortConfig.direction === 'asc'
                    ? 'desc'
                    : sortConfig.direction === 'desc'
                    ? 'none'
                    : 'asc';
            setSortConfig({ column, direction: newDirection });
        } else {
            setSortConfig({ column, direction: 'asc' });
        }
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.column || sortConfig.direction === 'none') return data;

        const sorted = [...data].sort((a, b) => {
            const aValue = isNaN(a[sortConfig.column])
                ? a[sortConfig.column]
                : parseFloat(a[sortConfig.column]);
            const bValue = isNaN(b[sortConfig.column])
                ? b[sortConfig.column]
                : parseFloat(b[sortConfig.column]);

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [data, sortConfig]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col} onClick={() => handleColumnClick(col)}>
                            {col}
                            {sortConfig.column === col && sortConfig.direction !== 'none' && (
                                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row, index) => (
                    <tr key={index}>
                        {columns.map((col, idx) => (
                            <td key={idx}>{row[col]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default DataTable;
