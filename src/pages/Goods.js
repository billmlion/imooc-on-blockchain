import React from 'react'
import { Row, Col, Badge, Button, Switch, Table, Pagination,Divider, Tag } from 'antd';

import { Link } from 'react-router-dom'
const axios = require('axios').default


class Goods extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            goodsList: [],
            pagination: {},
            loading: false,
        }
        // this.gotoThispage = this.gotoThispage.bind(this);
    }

    componentDidMount() {
        this.fetch()
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

    trick(response) {
        const pagination = { ...this.state.pagination }
        pagination.total = response.data.data.count
        this.setState({
            loading: false,
            goodsList: response.data.data.data,
            pagination
        })
        // console.log(this.state.goodsList);
        // console.log(this.state.count);
        // console.log(this.state.totalPages);
    }

    componentWillUnmount() {

    }

    handleTableChange = (pagination, filters, sorter) => {
        console.log('to page:', pagination.current)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        })
        this.fetch({
            pageSize: pagination.pageSize,
            page: pagination.current
        });

    }

   modDetail = record => {
      
   }

    render() {
        const columns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <span>
                       {record.name} 
                      <Divider type="vertical" />
                       
                      <Link to={`/goodsdetail/${record.name}`}> 修改</Link>
                    </span>
                  ),
            },
            {
                title: '祝福语',
                dataIndex: 'goods_brief',
                key: 'goods_brief',
            },
            {
                title: '数量',
                dataIndex: 'goods_number',
                key: 'goods_number',
            },
        ];
   
        return (
            <Table dataSource={this.state.goodsList} columns={columns}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                // onRow={record => {
                //     return {
                //         onDoubleClick: event => {
                //             console.log(record)
                            
                //             this.modDetail(record)
                //         },
                //         onContextMenu: event => { },
                //         onMouseEnter: event => { }, // 鼠标移入行
                //         onMouseLeave: event => { },
                //     };
                // }}

            />
        )

    }
}

export default Goods