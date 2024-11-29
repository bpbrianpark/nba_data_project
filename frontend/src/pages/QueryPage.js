import React, { useState, useEffect } from 'react';
import { Row, Col, Navbar, Container, Form } from 'react-bootstrap';
import StatFilter from '../components/StatFilter';
import DataTable from '../components/DataTable';
import TableSelector from '../components/TableSelector';
import LoadTableButton from '../components/buttons/LoadTableButton';

const QueryPage = () => {
    const [selectedTable, setSelectedTable] = useState(['pergame_2024']);
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);

    const allPositions = ['PG', 'SG', 'SF', 'PF', 'C'];

    const fetchTableData = async (tableName) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_table_data/${tableName}`);
            if (!response.ok) {
                throw new Error(`Error fetching data for ${tableName}`);
            }
            const data = await response.json();
            setTableData(data);
            setFilteredData(data);
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
        let filtered = tableData;

        filters.forEach(({ field, operator, value }) => {
            if (field && value) {
                filtered = filtered.filter((row) => {
                    const rowValue = parseFloat(row[field]);
                    const filterValue = parseFloat(value);

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

        setFilteredData(filtered);
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

                            <TableSelector
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                className="mb-3"
                            />

                            <LoadTableButton
                            onClick={fetchTableData}/>

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
                                    data={filteredData}
                                    columns={filteredData.length > 0 ? Object.keys(filteredData[0]) : []}
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
