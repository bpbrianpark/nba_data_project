import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Navbar, Container, Form } from 'react-bootstrap';
import StatFilter from '../components/StatFilter';
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';

const QueryPage = () => {
    const navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [tableData, setTableData] = useState({ columns: [], data: [] });
    const [filteredData, setFilteredData] = useState({ columns: [], data: [] });
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);

    const allPositions = ['PG', 'SG', 'SF', 'PF', 'C'];

    const fetchTableData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_table_data/${selectedTable}`);
            if (!response.ok) {
                console.log("Could not fetch the data for this.");
                console.log('http://127.0.0.1:5000/get_table_data/${selectedTable}');
                throw new Error(`Error fetching data for ${selectedTable}`);
            }
            const { columns, data } = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Expected 'data' to be an array");
            }
            const table = { columns, data };
            setTableData(table);
            setFilteredData(table); 
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setTableData({ columns: [], data: [] });
            setFilteredData({ columns: [], data: [] });
        }
    };

    useEffect(() => {
        fetchTableData();
    }, [selectedTable]);

    const addFilter = () => {
        setFilters([...filters, { field: '', operator: '>', value: '' }]);
    };

    const updateFilter = (index, key, value) => {
        const newFilters = [...filters];
        newFilters[index][key] = value;
        setFilters(newFilters);
    };

    const handlePositionChange = (position) => {
        setSelectedPositions((prevPositions) =>
            prevPositions.includes(position)
                ? prevPositions.filter((pos) => pos !== position)
                : [...prevPositions, position]
        );
    };

    const applyFilters = () => {
        let filtered = tableData.data;

        filters.forEach(({ field, operator, value }) => {
            if (field && value) {
                filtered = filtered.filter((row) => {
                    const rowValue = parseFloat(row[field]);
                    const filterValue = parseFloat(value);
                    if (isNaN(rowValue) || isNaN(filterValue)) {
                        return false; 
                    }
                    switch (operator) {
                        case '>':
                            return rowValue > filterValue;
                        case '<':
                            return rowValue < filterValue;
                        case '=':
                            return rowValue === filterValue;
                        default:
                            return true;
                    }
                });
            }
        });

        if (selectedPositions.length > 0) {
            filtered = filtered.filter((row) => selectedPositions.includes(row.pos));
        }
        setFilteredData({ columns: tableData.columns, data: filtered });
    };

    return (
        <>
            <Navbar className="px-3 d-flex" style={{ backgroundColor: '#DCE8E8' }}>
                <Container>
                    <h3>Basketball Cerebro</h3>
                </Container>
            </Navbar>
            <div className="landing-container">
                <Col md={10}>
                    <Row>
                        <Col md={6} className="p-4">
                            <h1>Basketball Cerebro</h1>
                            <p className="text-primary">
                                Find and filter through basketball statistics for the 2023-2024 NBA season!
                            </p>
                            <p className="text-secondary">More seasons to come</p>
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

                            <StatFilter
                                filters={filters}
                                onAddFilter={addFilter}
                                onUpdateFilter={updateFilter}
                                positions={allPositions}
                                selectedPositions={selectedPositions}
                                onPositionChange={handlePositionChange}
                                onApplyFilters={applyFilters}
                            />

                            {error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <DataTable
                                    data={filteredData.data || []}
                                    columns={filteredData.columns || []}
                                />
                            )}
                        </Col>
                    </Row>
                </Col>
            </div>
        </>
    );
};

export default QueryPage;
