import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Scatterplot } from '../components/graph/Scatterplot';
import LoadTableButton from '../components/buttons/LoadTableButton';
import StatFilter from '../components/StatFilter';

const GraphPage = () => {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('2024'); 
    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [xColumn, setXColumn] = useState('');
    const [yColumn, setYColumn] = useState('');
    const [columns, setColumns] = useState([]); 
    const [filteredData, setFilteredData] = useState({columns: [], data: []})
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [filters, setFilters] = useState([]);
    const [tables, setTables] = useState([]); 

    const allPositions = ['PG', 'SG', 'SF', 'PF', 'C'];
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
            setTableData({ columns, data});
            setFilteredData({ columns, data});
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
        <div className="landing-container">
            <Col md={10}>
                <Row>
                    <Col md={6} className="p-4">
                        <h1>Graph Page</h1>
                        <Button variant='info' size='lg' onClick={() => navigate('/database')}>Main Page</Button>
                        <Button variant='info' size='lg' onClick={() => navigate('/query')}>Query</Button>
                        <Button variant='info' size='lg' onClick={() => navigate('/graph')}>Graph</Button>
                        <Button variant='info' size='lg' onClick={() => navigate('/playerpage')}>Player</Button>

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

                        <StatFilter
                                filters={filters}
                                onAddFilter={addFilter}
                                onUpdateFilter={updateFilter}
                                positions={allPositions}
                                selectedPositions={selectedPositions}
                                onPositionChange={handlePositionChange}
                                onApplyFilters={applyFilters}
                            />

                        <div className="dataCard">
                            {xColumn && yColumn && (
                                <Scatterplot
                                    width={700}
                                    height={500}
                                    data={filteredData.data
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
                            data={filteredData.data || []}
                            columns={tableData.columns || []}
                        />
                    </Col>
                </Row>
            </Col>
        </div>
    );
};

export default GraphPage;