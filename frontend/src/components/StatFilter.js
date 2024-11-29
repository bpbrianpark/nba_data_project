import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import ApplyFilterButton from './buttons/ApplyFilterButton';

const StatFilter = ({ filters, onAddFilter, onUpdateFilter, positions, selectedPositions, onPositionChange, onApplyFilters }) => {

    return (
        <>
            <h5>Filters</h5>
            {filters.map((filter, index) => (
                <Row key={index} className="mb-2">
                    <Col md={4}>
                        <Form.Control
                            placeholder="Field (e.g., Assists)"
                            value={filter.field}
                            onChange={(e) => onUpdateFilter(index, 'field', e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Select
                            value={filter.operator}
                            onChange={(e) => onUpdateFilter(index, 'operator', e.target.value)}
                        >
                            <option value=">">{'>'}</option>
                            <option value="<">{'<'}</option>
                            <option value="=">=</option>
                        </Form.Select>
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            placeholder="Value"
                            value={filter.value}
                            onChange={(e) => onUpdateFilter(index, 'value', e.target.value)}
                        />
                    </Col>
                </Row>
            ))}
            <Button variant="secondary" onClick={onAddFilter} className="mb-3">
                Add Filter
            </Button>

            <h5>Positions</h5>
            {positions.map((position) => (
                <Form.Check
                    key={position}
                    type="checkbox"
                    label={position}
                    value={position}
                    checked={selectedPositions.includes(position)}
                    onChange={() => onPositionChange(position)}
                />
            ))}
            <ApplyFilterButton
                onClick={onApplyFilters}
            />
        </>
    );
};

export default StatFilter;
