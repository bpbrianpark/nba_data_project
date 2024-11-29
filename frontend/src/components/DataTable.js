import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({ selectedTable, data, columns }) => {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);

    const fetchTableData = async (tableName) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_table_data/${selectedTable}`);
            if (!response.ok) {
                throw new Error(`Error fetching data for ${selectedTable}`);
            }
            const data = await response.json();
            setTableData(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setTableData([]);
        }
    };

    useEffect(() => {
        fetchTableData(selectedTable);
    }, [selectedTable]);


    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
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

