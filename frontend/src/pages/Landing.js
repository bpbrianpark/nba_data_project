import React from 'react'
import axios from 'axios';
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Navbar, Container } from 'react-bootstrap';

const Landing = () => {
    const navigate = useNavigate();

    // Create database
    const handleCreateDatabase = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/create_database');
            if (response.status === 200) {
                alert("Database created successfully!");
            }
        } catch (error) {
            console.error("Failed to create database:", error.response?.data || error.message);
            alert("Error creating database: " + (error.response?.data?.message || error.message));
        }
    };

    // Load database
    const handleLoadDatabase = async() => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/scrape_database');
            if (response.status === 200) {
                alert("Database scraped successfully!");
                navigate('/database');
            }
        } catch (error) {
            console.error("Failed to create database:", error.response?.data || error.message);
            alert("Error creating database: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <>
        <Navbar className="px-3 d-flex" style={{backgroundColor: '#DCE8E8'}}>
                <Container>
                </Container>
            </Navbar>
        <div className='landing-container'>
            <Col md={10}>
            <Row>
                <Col md={6} className='p-4'>
                    <h1>Basketball Cerebro</h1>
                    <p classnmae='text-primary'>
                        Find and filter through basketball statistics for the 2023-2024 NBA season!
                    </p>
                    <p className='text-secondary'>
                        More seasons to come
                    </p>
                    <Button variant='info' size='lg' onClick={() => navigate('/database')}>Main Page</Button>
                    <Button variant='info' size='lg' onClick={handleCreateDatabase}>
                        Create Database
                        </Button>
                    <Button variant='info' size='lg' onClick={handleLoadDatabase}>
                        Scrape Database
                    </Button>
                </Col>
            </Row>
            </Col>
        </div>
        </>
    )
}

export default Landing