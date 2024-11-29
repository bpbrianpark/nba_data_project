import React from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({ data, columns }) => {
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
