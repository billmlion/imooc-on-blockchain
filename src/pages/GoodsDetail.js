import React from 'react'
import { Row, Col, Badge, Button, Switch, Table, Pagination } from 'antd';
import { Link } from 'react-router-dom'
const axios = require('axios').default


class GoodsDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.match.params.name
        }
        this.init()
    }

    async init() {
       
        this.setState({
          
        })
    }

    componentDidMount() {
        // this.fetch()
    }


    fetch = (params = {}) => {

        this.setState({ loading: true });
        axios({
            method: 'post',
            url: 'http://localhost:8360/admin/goods',
            // data: {
            //     firstName: 'Fred',
            //     lastName: 'Flintstone'
            // },
            params: { pageSize: 10, ...params },
            headers: {
                'x-nideshop-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1NzQ5NTA2ODl9.M3W8XEoQw0lMuV2x4d8qAPUfCrniwFZ4etVtMSQdjGs'
            }
        }).then(response => this.trick(response)
        )
            .catch(function (error) {
                console.log(error);
            });


    }

   
    componentWillUnmount() {

    }
 

    render() {
        return <Button>{this.state.name}</Button>
    }
}

export default GoodsDetail