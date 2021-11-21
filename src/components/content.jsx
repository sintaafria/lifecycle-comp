import React from 'react';
import { Card, Col, Row, Container, Form, Button } from 'react-bootstrap';
import Loading from './loading';

class Content extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            totalResults: '',
            key: '',
            err: '',
            isLoading: true,
        }
    }

    fetching(q) {
        this.setState({ isLoading: true })

        fetch(`https://newsapi.org/v2/top-headlines?country=id&q=${q}&apiKey=97eded16c9be454d967dcce41964dcb8`)
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.status === 'ok') {
                    this.setState({
                        data: res.articles,
                        totalResults: res.totalResults,
                    });
                } else {
                    throw new Error(res.message);
                }
            })
            .catch(err =>
                this.setState({ err: err }, () => console.log(this.state))
            )
            .finally(() => {
                this.setState({ isLoading: false })
            })
    }

    componentDidMount() {
        this.fetching(this.state.key);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.key !== this.state.key)
    //         this.fetching(this.state.key);
    // }

    render() {
        const form = <div className='mx-5'>
            <Form className="d-flex"  style={{ margin: '20px -45px' }}>
                <Form.Control
                    onChange={e => this.setState({ key: e.target.value })}
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={this.state.key}
                    className="me-2"
                />
                <Button onClick={() => this.fetching(this.state.key)}>Search</Button>
            </Form>
            <Loading isLoading={this.state.isLoading} />
        </div>

        if (this.state.totalResults > 0 && !this.state.isLoading) {
            return (
                <Container >
                    {form}
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {this.state.totalResults > 0 && this.state.data.map((data,i) =>
                            <Col key={i}>
                                <a href={data.url} style={{ textDecoration: 'none', color: 'black' }}>
                                    <Card style={{ width: '16rem' }}>
                                        <Card.Img variant="top" src={data.urlToImage} />
                                        <Card.Body>
                                            <Card.Title>{data.title}</Card.Title>
                                            <p className="card-text text-muted">{data.author} - {data.publishedAt.split("T")[0].split("-")[2]}/
                                                {data.publishedAt.split("T")[0].split("-")[1]}/
                                                {data.publishedAt.split("T")[0].split("-")[0]}</p>
                                            <p className="card-text">{data.description}</p>
                                        </Card.Body>
                                    </Card>
                                </a>
                            </Col>
                        )}
                    </Row>
                </Container>
            )
        }
        if (this.state.totalResults === 0) {
            return (
                <div className="mx-5">
                    {form}
                    <p>search not found</p>
                    <Button onClick={() => {this.fetching(''); this.setState({key: ''})}}>back</Button>
                </div>
            )
        } else {
            return <div className="mx-5">
                {form}
                <p>{this.state.err.message}</p>
            </div>


        }
    }

}

export default Content;