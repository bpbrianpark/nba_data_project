import React from 'react';
import { Form } from 'react-bootstrap';

const TableSelector = ({value, onChange, className}) => {
    return (
        <Form.Select
        >
            <option value="pergame_2024">Per Game</option>
            <option value="per36_2024">Per 36</option>
            <option value="per100_2024">Per 100 Possessions</option>
            <option value="advanced_2024">Advanced</option>
            <option value="pbp_2024">Play-by-Play</option>
            <option value="shooting_2024">Shooting</option>
            <option value="adj_shooting_2024">Adjusted Shooting</option>
        </Form.Select>
    );
};

export default TableSelector;
