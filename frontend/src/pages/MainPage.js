import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Navbar, Container } from 'react-bootstrap';

const MainPage = () => {
    const navigate = useNavigate();
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
                    <h1>Basketball Cerebo</h1>
                    <p classnmae='text-primary'>
                        Find and filter through basketball statistics for the 2023-2024 NBA season!
                    </p>
                    <p className='text-secondary'>
                        More seasons to come
                    </p>
                    <Button variant='info' size='lg' onClick={() => navigate('/database')}>Create Database</Button>
                </Col>
            </Row>
            </Col>
        </div>
        </>
    )
}

export default MainPage