import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';

const MainPage = () => {
    const navigate = useNavigate();

    const [selectedYear, setSelectedYear] = useState('2024'); 
    const [selectedTable, setSelectedTable] = useState('pergame_2024'); 
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]); 
    const allTables = {
        2024: [
            { value: 'pergame_2024', label: 'Per Game' },
            { value: 'per36_2024', label: 'Per 36' },
            { value: 'per100_2024', label: 'Per 100 Possessions' },
            { value: 'advanced_2024', label: 'Advanced' },
            { value: 'pbp_2024', label: 'Play-by-Play' },
            { value: 'shooting_2024', label: 'Shooting' },
            { value: 'adj_shooting_2024', label: 'Adjusted Shooting' },
        ],
        2023: [
            { value: 'pergame_2023', label: 'Per Game' },
            { value: 'per36_2023', label: 'Per 36' },
            { value: 'per100_2023', label: 'Per 100 Possessions' },
            { value: 'advanced_2023', label: 'Advanced' },
            { value: 'pbp_2023', label: 'Play-by-Play' },
            { value: 'shooting_2023', label: 'Shooting' },
            { value: 'adj_shooting_2023', label: 'Adjusted Shooting' },
        ],
        2022: [
            { value: 'pergame_2022', label: 'Per Game' },
            { value: 'per36_2022', label: 'Per 36' },
            { value: 'per100_2022', label: 'Per 100 Possessions' },
            { value: 'advanced_2022', label: 'Advanced' },
            { value: 'pbp_2022', label: 'Play-by-Play' },
            { value: 'shooting_2022', label: 'Shooting' },
            { value: 'adj_shooting_2022', label: 'Adjusted Shooting' },
        ]
    };

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
        const yearTables = allTables[selectedYear] || [];
        setTables(yearTables);
        if (yearTables.length > 0) {
            setSelectedTable(yearTables[0].value); 
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchTableData(selectedTable);
    }, [selectedTable]);

    return (
        <>
            <div className="landing-container">
                <Col md={10}>
                    <Row>
                        <Col md={6} className="p-4">
                            <h1>Basketball Cerebro</h1>
                            <p className="text-primary">
                                Find and filter through basketball statistics for multiple NBA seasons!
                            </p>
                            <p className="text-secondary">More seasons to come</p>
                            <Button variant="info" size="lg" onClick={() => navigate('/database')}>Main Page</Button>
                            <Button variant="info" size="lg" onClick={() => navigate('/query')}>Query</Button>
                            <Button variant="info" size="lg" onClick={() => navigate('/graph')}>Graph</Button>

                            <Form.Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="mb-3"
                            >
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </Form.Select>
                            <Form.Select
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                className="mb-3"
                                disabled={tables.length === 0} 
                            >
                                {tables.map((table) => (
                                    <option key={table.value} value={table.value}>
                                        {table.label}
                                    </option>
                                ))}
                            </Form.Select>

                            {error && <p className="text-danger mt-3">{error}</p>}
                            <DataTable
                                selectedTable={selectedTable || []}
                                data={tableData.data || []}
                                columns={tableData.columns || []}
                            />
                        </Col>
                    </Row>
                </Col>
            </div>
        </>
    );
};

export default MainPage;
