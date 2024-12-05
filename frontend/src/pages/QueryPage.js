import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Navbar, Container, Form } from 'react-bootstrap';
import StatFilter from '../components/StatFilter';
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';
import { allTables, allPositions } from '../constants';

const QueryPage = () => {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('2024'); 
    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [tableData, setTableData] = useState({ columns: [], data: [] });
    const [filteredData, setFilteredData] = useState({ columns: [], data: [] });
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [tables, setTables] = useState([]); 

    const fetchTableData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_table_data/${selectedTable}`);
            if (!response.ok) {
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
        const yearTables = allTables[selectedYear] || [];
        setTables(yearTables);
        if (yearTables.length > 0) {
            setSelectedTable(yearTables[0].value); 
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchTableData(selectedTable);
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
        let filtered = [...tableData.data]; 
        filters.forEach(({ field, operator, value }) => {
            if (field && value) {
                filtered = filtered.filter((row) => {
                    const rowValue = row[field];
                    const filterValue = isNaN(value) ? value.toString() : parseFloat(value);
    
                    if (typeof rowValue === "undefined") {
                        return false;
                    }
    
                    const numericRowValue = isNaN(rowValue) ? rowValue.toString() : parseFloat(rowValue);
                    switch (operator) {
                        case ">":
                            return numericRowValue > filterValue;
                        case "<":
                            return numericRowValue < filterValue;
                        case "=":
                            return numericRowValue === filterValue;
                        default:
                            return false;
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
                                    selectedTable={selectedTable}
                                    data={filteredData.data}
                                    columns={filteredData.columns}
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
