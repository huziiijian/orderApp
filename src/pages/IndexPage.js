import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';

import style from './IndexPage.scss';
import NavBar from './NavBar';//注意是直接引入文件夹
// import Home from './Home';
// import About from './About';
// import Admin from './Admin';
// import Menus from './Menus';
// import Login from './User/Login';
// import Register from './User/Register';

// 引入路由需要的组件
import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute, NoMatchRoute } from '../utils/SubRoutes';


const { Header, Content } = Layout;

function IndexPage(props) {
  //为进行路由优化时，props打印的只是原始信息的history、location、match等路由结构信息
  //优化后可打印所有子路由信息。
  const { routes, app } = props;
  return (
    <Layout className={style.layout}>
      <Header className={style.header} >
        <NavBar {...props} />
      </Header>
      <Content className={style.content}>
        <Switch>
          {/* <Route path="/home" component={Home} />
          <Route path="/menus" component={Menus} />
          <Route path="/admin" component={Admin} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} /> */}
          {routes.map((route, i) => (
            // 调用封装组件
            <SubRoutes key={i} {...route} app={app} />
          ))}
          {/* 重定向 */}
          {/*  
              重定向方式：
              如果路由配置中没有redirect: true（通过循环渲染重定向）
              则默认第一个路由为重定向路由
              <Redirect exact from={"/"} to={routes[0].path} /> 
             */}
          {/* <Redirect to="/home" /> */}
          <RedirectRoute exact={true} from={'/'} routes={routes} />
          {/* 输入的链接不存在时,跳转到NoMatch组件中 */}
          <NoMatchRoute />
        </Switch>
      </Content>
    </Layout>
  );
}


export default connect()(IndexPage);
