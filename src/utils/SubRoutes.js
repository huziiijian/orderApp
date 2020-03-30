import React from 'react';
import { Route, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import { connect } from 'dva';
import NoMatch from '../components/NoMatch';
// import NoMatch from '../components/NoMatch';

// method 1:
// export default function SubRoutes(Props) {
//   const Component = Props.RouteConfig.component;
//   const routes = Props.RouteConfig.routes;
//   return (
//     <Route
//       render={props => <Component {...props} routes={routes} />}
//     />
//   );
// }

// method 2:
// userInfo通过connect拿到
function SubRoutes({ routes, component, app, model, isAuthority, userInfo }) {
  //react组件名首字母必须大写
  return (
    <Route
      component={dynamicCom(
        app,
        model,
        component,
        routes,
        isAuthority,
        userInfo
      )}
    />
  );
}

// 重定向封装组件
export function RedirectRoute({ routes, from, exact }) {
  const routeR = routes.filter(item => {
    return item.redirect;
  });
  // 判断每个路由信息是否存在redirect属性，存在返回对应路径，如果不存在返回第一个子路由路径
  const to = routeR.length ? routeR[0].path : routes[0].path;
  return <Redirect exact={exact} from={from} to={to} />;
}

// NoMatchRoute
export function NoMatchRoute({ status = 404 }) {
  return <Route render={props => <NoMatch {...props} status={status} />} />;
}

// 解决动态加载路由组件的方法
const dynamicCom = (app, models, component, routes, isAuthority, userInfo ) =>
// 注意不含{}
  dynamic({
    app,//dva实例化所得，确定models要挂载的具体实例
    models: () => models,//model相当于vue的vuex，包含了数据流所有控制
    component: () =>//component方法返回一个Promise函数，Promise函数里返回组件对象
    // 注意不含{}
      component().then(res => {
        // 代表私有化的路由不能访问，会重定向到登陆界面
        if (isAuthority) {
          if (!localStorage.key || !localStorage.email) {
            return () => <Redirect to="/login" />;
          }
        }
        const Component = res.default || res;
        //因为要传递属性，所以注意这里return的是一个函数而不是直接return组件，相当于render内的写法
        return props => <Component {...props} app={app} routes={routes} />;
      })
  });
  
  
  //通过models/global的state统一管理登录状态
  export default connect(({ global }) => ({
    //拿到userInfo
    userInfo: global.userInfo
  }))(SubRoutes);

















