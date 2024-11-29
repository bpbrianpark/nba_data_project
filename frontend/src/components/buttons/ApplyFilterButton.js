import React from 'react';
import { Button } from 'react-bootstrap';

const ApplyFilterButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} className="mb-3">
                Apply Filters
            </Button>
    );
};

export default ApplyFilterButton;
