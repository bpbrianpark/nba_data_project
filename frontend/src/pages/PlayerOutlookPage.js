import React, { useState, useEffect } from 'react';
import Select from 'react-select'; 
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Scatterplot } from '../components/graph/Scatterplot';

const PlayerOutlookPage = () => {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedTable, setSelectedTable] = useState('pergame_2024');
    const [filteredData, setFilteredData] = useState({ columns: [], data: [] });
    const [yColumn, setYColumn] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [players, setPlayers] = useState([]); 
    const [tables, setTables] = useState([]); 
    const [error, setError] = useState(null);

    // TODO: add more years, make it less hardcoded
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

    const fetchColumns = async (table_name, year) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_all_columns/${table_name}`);
            if (!response.ok) throw new Error('Failed to fetch columns');
            const { columns } = await response.json();
            setColumns(columns);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchYearlyStats = async (playerId, tablePrefix) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_yearly_stats_all_cols/${playerId}/${tablePrefix}/`);
            if (!response.ok) throw new Error('Failed to fetch yearly stats');
            
            const { stats } = await response.json();
    
            // Extract all columns dynamically from the response
            const allColumns = Array.from(new Set(stats.flatMap(({ data }) => Object.keys(data))));
    
            setFilteredData({
                columns: ['year', ...allColumns], // Include year and all stat columns
                data: stats.map(({ year, data }) => ({
                    year,
                    ...data, // Spread all column data for each year
                })),
            });
        } catch (err) {
            setError(err.message);
        }
    };
       

    useEffect(() => {
        if (selectedPlayer) {
            fetchYearlyStats(selectedPlayer.value, selectedTable.split('_')[0]);
        }
    }, [selectedPlayer, selectedTable]);

    useEffect(() => {
        const yearTables = allTables[selectedYear] || [];
        setTables(yearTables);
        if (yearTables.length > 0) {
            setSelectedTable(yearTables[0].value); 
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedTable) {
            fetchColumns(selectedTable, selectedYear);
        }
    }, [selectedTable, selectedYear]);

    const handlePlayerChange = (selectedOption) => {
        setSelectedPlayer(selectedOption);
    };

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
                        <Button variant='info' size='lg' onClick={() => navigate('/playercomp')}>Player Comp</Button>
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
                    <DataTable
                        selectedTable={selectedTable || []}
                        data={filteredData.data || []}
                        columns={['year', ...(columns)]}
                    />   
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </Col>
                </Row>
            </Col>
        </div>
    );
};

export default PlayerOutlookPage;