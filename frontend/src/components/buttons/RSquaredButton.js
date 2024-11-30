import React from 'react';
import { Button } from 'react-bootstrap';

const RSquaredButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} className="mb-3">
                Calculate R^2
            </Button>
    );
};

export default RSquaredButton;
