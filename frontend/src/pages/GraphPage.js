import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Scatterplot } from '../components/graph/Scatterplot';
import LoadTableButton from '../components/buttons/LoadTableButton';

const GraphPage = () => {
    const navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [xColumn, setXColumn] = useState('');
    const [yColumn, setYColumn] = useState('');
    const [columns, setColumns] = useState([]); 

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
            setTableData({ columns, data});
            setError(null);
            const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
            setColumns(columnNames);
            if (columnNames.length >= 2) {
                setXColumn(columnNames[0]);
                setYColumn(columnNames[1]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            setTableData([]);
            setColumns([]);
        }
    };

    useEffect(() => {
        fetchTableData(); 
    }, [selectedTable]);

    return (
        <div className="landing-container">
            <Col md={10}>
                <Row>
                    <Col md={6} className="p-4">
                        <h1>Graph Page</h1>
                        <Button variant='info' size='lg' onClick={() => navigate('/database')}>Main Page</Button>
                        <Button variant='info' size='lg' onClick={() => navigate('/query')}>Query</Button>
                        <Button variant='info' size='lg' onClick={() => navigate('/graph')}>Graph</Button>

                        <Form.Select
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                            className="mb-3"
                        >
                            <option value="pergame_2024">Per Game</option>
                            <option value="per36_2024">Per 36</option>
                            <option value="per100_2024">Per 100 Possessions</option>
                            <option value="advanced_2024">Advanced</option>
                            <option value="pbp_2024">Play-by-Play</option>
                            <option value="shooting_2024">Shooting</option>
                            <option value="adj_shooting_2024">Adjusted Shooting</option>
                        </Form.Select>

                        <Form.Label>X-Axis:</Form.Label>
                        <Form.Select
                            value={xColumn}
                            onChange={(e) => setXColumn(e.target.value)}
                            className="mb-3"
                        >
                            {columns.map((col) => (
                                <option key={col} value={col}>
                                    {col}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Label>Y-Axis:</Form.Label>
                        <Form.Select
                            value={yColumn}
                            onChange={(e) => setYColumn(e.target.value)}
                            className="mb-3"
                        >
                            {columns.map((col) => (
                                <option key={col} value={col}>
                                    {col}
                                </option>
                            ))}
                        </Form.Select>

                        <LoadTableButton onClick={fetchTableData} />

                        <div className="dataCard">
                            {xColumn && yColumn && (
                                <Scatterplot
                                    width={700}
                                    height={500}
                                    data={tableData.data
                                        .filter((row) => row[xColumn] && row[yColumn])
                                        .map((row) => ({
                                            x: parseFloat(row[xColumn]),
                                            y: parseFloat(row[yColumn]),
                                            group: row.pos || 'N/A', 
                                            name: row.name,
                                        }))}
                                    xAxisLabel={xColumn}
                                    yAxisLabel={yColumn}
                                />
                            )}
                        </div>

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
    );
};

export default GraphPage;