import React from 'react';
import { Button } from 'react-bootstrap';

const LoadTableButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} className="mb-3">
                Load Table
            </Button>
    );
};

export default LoadTableButton
