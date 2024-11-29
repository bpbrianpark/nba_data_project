import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Navbar, Container, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import BarGraph from '../components/graph/BarGraph';
import { Scatterplot } from '../components/graph/Scatterplot';
import LoadTableButton from '../components/buttons/LoadTableButton';
import { data } from '../components/graph/data';

const GraphPage = () => {
    const navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);

    // Get the data from a specified table
    const fetchTableData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_table_data/${selectedTable}`);
            if (!response.ok) {
                throw new Error(`Could not fetch data from ${selectedTable}`);
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

    return (
        <>
            <div className="landing-container">
                <Col md={10}>
                    <Row>
                        <Col md={6} className="p-4">
                            <h1>Graph Page</h1>
                            <Button variant='info' size='lg' onClick={() => navigate('/database')}>Query</Button>
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

                            <LoadTableButton
                            onClick={fetchTableData}/>

                            <div className="dataCard"><Scatterplot width={700} height={500} data={data} /></div>

                            {error ? (
                                <p className="text-danger mt-3">{error}</p>
                            ) : (
                                <DataTable
                                    data={tableData}
                                    columns={tableData.length > 0 ? Object.keys(tableData[0]) : []}
                                />
                            )}
                        </Col>
                    </Row>
                </Col>
            </div>
        </>
    );
};

export default GraphPage;
