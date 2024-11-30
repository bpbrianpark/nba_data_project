import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({ selectedTable, data, columns }) => {
    const [tableData, setTableData] = useState({ columns: [], data: [] });
    const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
    const [error, setError] = useState(null);

    const fetchTableData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_table_data/${selectedTable}`);
            if (!response.ok) {
                throw new Error(`Could not fetch data from ${selectedTable}`);
            }
            const { columns, data } = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Expected 'data' to be an array");
            }
            setTableData({ columns, data });
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setTableData({ columns: [], data: [] });
        }
    };

    useEffect(() => {
        if (selectedTable) {
            fetchTableData();
        }
    }, [selectedTable]);

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

    const sortedData = React.useMemo(() => {
        if (!sortConfig.column || sortConfig.direction === 'none') return tableData.data;

        const sorted = [...tableData.data].sort((a, b) => {
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
    }, [tableData.data, sortConfig]);

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
