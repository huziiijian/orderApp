import React, { Component } from 'react';
import { Tabs } from 'antd';
import style from './index.scss';
import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoutes';

const { TabPane } = Tabs;

export default class index extends Component {
  // 点击tab切换路由
  handleChangeTab = key => {
    // window.location.href = '/#' + key;
    if (this.props.location.pathname !== key) {
      // key代表当前点击路由连接，利用history.push(key)切换到目标路由
      this.props.history.push(key);
    }
  };
  render() {
    const { routes, app } = this.props;
    return (
      <div className={style.about}>
        <Tabs
          className={style.tabs}
          tabPosition={'left'}
          // 其实就是先点击，再跳转，再样式关联
          activeKey={this.props.location.pathname}
          // 这里的onChange事件是一个切换面板的回调函数，参数为activeKey
          onChange={this.handleChangeTab}
        >
          <TabPane tab="历史订餐" key="/about/history" />
          <TabPane tab="联系我们" key="/about/contact" />
          <TabPane tab="点餐文档" key="/about/orderingguide" />
          <TabPane tab="快递信息" key="/about/delivery" />
        </Tabs>
        <div className={style.routes}>
          {/* 二级路由 */}
          <Switch>
            {routes.map((route, i) => (
              // 调用封装组件
              <SubRoutes key={i} {...route} app={app} />
            ))}
            <RedirectRoute exact={true} from={'/about'} routes={routes} />
          </Switch>
        </div>
      </div>
    );
  }
}
