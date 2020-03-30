import React, { Component } from 'react';
import { Link, Switch } from 'dva/router';
import styles from './TabPane.scss';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoutes';

export default class index extends Component {
  render() {
    const { routes, app } = this.props;
    return (
      <div className={styles.tabpane}>
        <p className={styles.title}>联系我们</p>
        <div className={styles.content}>
          {/* link最后渲染成a标签，所以直接给a标签设置属性 */}
          <Link to="/about/contact/phone">电话</Link>
          <Link to="/about/contact/address">地址</Link>
        </div>

        <div className={styles.info}>
          {/* 三级路由 */}
          {/* switch解决route唯一渲染问题 */}
          <Switch>
            {routes.map((route, i) => (
              // 调用封装组件
              <SubRoutes key={i} {...route} app={app} />
            ))}

            <RedirectRoute
              exact={true}
              // 则默认第一个路由为重定向路由
              from={'/about/contact'}
              routes={routes}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
