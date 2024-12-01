import React, { useState, useEffect } from 'react';
import Select from 'react-select'; 
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Scatterplot } from '../components/graph/Scatterplot';

const PlayerPage = () => {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState({ columns: [], data: [] });
    const [xColumn, setXColumn] = useState('');
    const [yColumn, setYColumn] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [players, setPlayers] = useState([]); 
    const [tables, setTables] = useState([]); 
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchPlayers(selectedYear);
    }, [selectedYear]);

    const fetchPlayers = async (year) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_players/${year}`);
            if (!response.ok) throw new Error('Failed to fetch players');
            const { players } = await response.json();
            if (Array.isArray(players)) {
                const playerOptions = players.map((player) => ({
                    value: player.pid,  
                    label: player.name,
                }));
                setPlayers(playerOptions);
            } else {
                throw new Error('Expected an array of players');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };
    
    const fetchPlayerData = async (playerId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_player_stats/${playerId}`);
            if (!response.ok) throw new Error(`Could not fetch data for player: ${playerId}`);
            const { columns, data } = await response.json();
            setTableData({ columns, data });
            setFilteredData({ columns, data });
            setError(null);
            setColumns(columns);
            if (columns.length >= 2) {
                setXColumn(columns[0]);
                setYColumn(columns[1]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const handlePlayerChange = (selectedOption) => {
        setSelectedPlayer(selectedOption);
        if (selectedOption) fetchPlayerData(selectedOption.value);
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
            setFilteredData({ columns, data });
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
    }, [selectedTable, selectedPlayer]);

    return (
        <div className="landing-container">
            <Col md={10}>
                <Row>
                    <Col md={6} className="p-4">
                        <h1>Player Statistics</h1>
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

                        <Select
                            value={selectedPlayer}
                            onChange={handlePlayerChange}
                            options={players}
                            placeholder="Search for a player..."
                            isClearable
                            isSearchable
                            className="mb-3"
                            filterOption={(candidate, input) => 
                                candidate.label && candidate.label.toLowerCase().includes(input.toLowerCase())  // Safeguard against undefined label
                            }
                        />



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

export default PlayerPage;
