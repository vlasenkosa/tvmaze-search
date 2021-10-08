import React, {useEffect, useState} from 'react';

import block from 'bem-cn';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import TvMazeApi from '../../components/apis/tvmazeApi';

import './search-series-page.css';

const cn = block('search-series-page');
const api = new TvMazeApi();

const SearchSeriesPage = () => {
    const [seriesList, setSeriesList] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSeriesSearching, searchSeries] = useState(false)

    const handleChangeSearchQuery = (event) => {
        const query = event?.target?.value;

        if (!query) {
            setSeriesList([]);
        }

        setSearchQuery(event?.target?.value)
    };

    useEffect(() => {
        setSeriesList([])
        searchSeries(true);
        if (!!searchQuery) {
            api.Search(searchQuery)
                .then((data) => {
                    setSeriesList(data)
                    searchSeries(false);
                })
        } else {
            setSeriesList([])
            searchSeries(false);
        }
    }, [searchQuery])

    return (
        <Container fluid="sm">
            <Row>
                <Col>
                    <FormControl
                        type="text"
                        placeholder="Search series"
                        value={searchQuery}
                        onChange={ handleChangeSearchQuery }
                    />
                </Col>
            </Row>
            {
                isSeriesSearching && (
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status" className={ cn('spinner') }>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                )
            }
            {
                seriesList?.length === 0 && !isSeriesSearching && !searchQuery && (
                    <h4 className={ cn('empty-search') }>Enter your query to start search</h4>
                )
            }
            {
                seriesList?.length === 0 && !isSeriesSearching && !!searchQuery && (
                    <h4 className={ cn('empty-series') }>Pardon us, but no series</h4>
                )
            }
            {
                seriesList.length > 0 && (
                    seriesList.map((series) => (
                        <Card className={ cn('card') } key={ series?.show?.id }>
                            <Card.Body>
                                <Row>
                                    <Col  xs={12} sm={3}>
                                        <Card.Img variant="top" src={ series?.show?.image?.medium } />
                                    </Col>
                                    <Col xs={12} sm={9}>
                                        <Row>
                                            <Col>
                                                <Card.Title>{ series?.show?.name }</Card.Title>
                                            </Col>
                                            <Col style={{ textAlign: 'right' }}>
                                                <Card.Text>
                                                    <Badge pill bg="primary">{ `Rating: ${series?.show?.rating?.average || 'no ratings'}` }</Badge>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Card.Text dangerouslySetInnerHTML={{__html: series?.show?.summary}}/>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                )
            }
        </Container>
    );
};

export default SearchSeriesPage;