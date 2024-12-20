import React, { useState, useEffect } from 'react';
import Select from 'react-select'; 
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Scatterplot } from '../components/graph/Scatterplot';

const PlayerCompPage = () => {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [filteredDataPlayers, setFilteredDataPlayers] = useState({ columns: [], data: [] });
    const [graphFilteredData, setGraphFilteredData] = useState({ columns: [], data: [] });
    const [yColumn, setYColumn] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
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
            const playerOptions = players.map((player) => ({
                value: player.pid,  
                label: player.name,
            }));
            setPlayers(playerOptions);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchColumns = async (table_name) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_all_columns/${table_name}`);
            if (!response.ok) throw new Error('Failed to fetch columns');
            const { columns } = await response.json();
            setColumns(columns);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchOneYearStats = async (playerIds, tablePrefix) => {
    try {
        const statsData = {};
        const originalOrder = []; 

        for (const playerId of playerIds) {
            const response = await fetch(
                `http://127.0.0.1:5000/get_yearly_stats_all_cols/${playerId}/${tablePrefix}/`
            );
            if (!response.ok) throw new Error('Failed to fetch yearly stats');

            const { stats } = await response.json();
            const playerName = players.find((p) => p.value === playerId)?.label || `Player ${playerId}`;

            // Initialize player data
            statsData[playerName] = {};

            stats.forEach(({ data }) => {
                Object.entries(data).forEach(([stat, value]) => {
                    if (!originalOrder.includes(stat)) {
                        originalOrder.push(stat); 
                    }
                    statsData[playerName][stat] = value; 
                });
            });
        }

        const formattedData = originalOrder.map((stat) => {
            const row = { stat }; 
            playerIds.forEach((playerId) => {
                const playerName = players.find((p) => p.value === playerId)?.label || `Player ${playerId}`;
                row[playerName] = statsData[playerName]?.[stat] || '-'; 
            });
            return row;
        });
        console.log("Filtered Data:", filteredDataPlayers.data);
        setFilteredDataPlayers({
            columns: ['stat', ...playerIds.map((id) => players.find((p) => p.value === id)?.label || `Player ${id}`)],
            data: formattedData,
        });
    } catch (err) {
        setError(err.message);
    }
};

const fetchYearlyStats = async (playerIds, tablePrefix, colName) => {
    try {
        const statsData = {}; // To store stats for all players across all years

        for (const playerId of playerIds) {
            const response = await fetch(
                `http://127.0.0.1:5000/get_yearly_stats/${playerId}/${tablePrefix}/${colName}`
            );
            if (!response.ok) throw new Error('Failed to fetch yearly stats');

            const { stats } = await response.json();
            const playerName = players.find((p) => p.value === playerId)?.label || `Player ${playerId}`;

            // Store stats for this player
            statsData[playerName] = stats.map(({ year, value }) => ({
                year: parseInt(year, 10),
                value: parseFloat(value), // Parse value as a float
            }));
        }

        // Flatten data into a format suitable for the scatterplot
        const scatterplotData = [];
        Object.entries(statsData).forEach(([playerName, yearlyStats]) => {
            yearlyStats.forEach(({ year, value }) => {
                scatterplotData.push({
                    x: year, // Year on the X-axis
                    y: value, // Selected stat (Y-axis)
                    group: playerName, // Group by player name
                    name: playerName, // Display player name on hover
                });
            });
        });

        setGraphFilteredData(scatterplotData); // Save data for the scatterplot
    } catch (err) {
        setError(err.message);
    }
};


useEffect(() => {
    // Ensure both selectedPlayers and yColumn are set before fetching stats
    if (selectedPlayers.length > 0 && yColumn) {
        fetchYearlyStats(selectedPlayers.map((p) => p.value), selectedTable.split('_')[0], yColumn);
    }
}, [selectedPlayers, selectedTable, yColumn]); // Only re-run when either of these dependencies change


    

    useEffect(() => {
        if (selectedPlayers.length > 0) {
            fetchOneYearStats(selectedPlayers.map((p) => p.value), selectedTable.split('_')[0]);
        }
    }, [selectedPlayers, selectedTable]);

    useEffect(() => {
        const yearTables = allTables[selectedYear] || [];
        setTables(yearTables);
        if (yearTables.length > 0) {
            setSelectedTable(yearTables[0].value); 
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedTable) {
            fetchColumns(selectedTable);
        }
    }, [selectedTable]);

    const handlePlayerChange = (selectedOptions) => {
        setSelectedPlayers(selectedOptions || []);
    };

    return (
        <div className="landing-container">
            <Col md={10}>
                <Row>
                    <Col md={6} className="p-4">
                        <h1>Player Comparison</h1>
                        <Button variant="info" size="lg" onClick={() => navigate('/database')}>Main Page</Button>
                        <Button variant="info" size="lg" onClick={() => navigate('/query')}>Query</Button>
                        <Button variant="info" size="lg" onClick={() => navigate('/graph')}>Graph</Button>
                        <Button variant="info" size="lg" onClick={() => navigate('/playerpage')}>Player</Button>
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
                            value={selectedPlayers}
                            onChange={handlePlayerChange}
                            options={players}
                            placeholder="Search for players..."
                            isClearable
                            isMulti
                            isSearchable
                            className="mb-3"
                        />
                        <Form.Select
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                            className="mb-3"
                        >
                            {tables.map((table) => (
                                <option key={table.value} value={table.value}>
                                    {table.label}
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
                        {yColumn && selectedPlayers.length > 0 && graphFilteredData.length > 0 && (
                        <Scatterplot
                            width={700}
                            height={500}
                            data={graphFilteredData}
                            xAxisLabel="Year"
                            yAxisLabel={yColumn}
                            integerTicks={true}
                            showLines={true}
                            regressionOption={false}
                        />
                    )}


                        <DataTable
                            selectedTable={selectedTable || []}
                            data={filteredDataPlayers.data || []}
                            columns={filteredDataPlayers.columns || []}
                        />
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </Col>
                </Row>
            </Col>
        </div>
    );
};

export default PlayerCompPage;