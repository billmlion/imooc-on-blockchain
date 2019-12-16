import React, { Component } from 'react';
import 'antd/dist/antd.css'
import { Button, Layout} from 'antd'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Header from './components/Header';
import Create from './pages/Create';
import Course from './pages/Course';
import Detail from './pages/Detail';
import Goods from './pages/Goods';
import GoodsDetail from './pages/GoodsDetail';

const { Footer, Sider, Content } = Layout;

// const Course = () => <span>课程</span>
// const Goods = () => <span>课程</span>
const Qa = () => <span>问答区</span>


class App extends Component {

  render() {
    return (
      <BrowserRouter className="App">
        <Layout className="layout">
          <Header></Header>
          <Content>
            <Route path="/" exact component={Course}></Route>
            <Route path="/qa"  component={Qa}></Route>
            <Route path="/create"  component={Create}></Route>
            <Route path="/detail/:address"  component={Detail}></Route>
            <Route path="/goods"  component={Goods}></Route>
            <Route path="/goodsdetail/:name"  component={GoodsDetail}></Route>

          </Content>
          <Footer>底部</Footer>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
