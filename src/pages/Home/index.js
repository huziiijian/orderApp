import React from 'react';
// import { connect } from 'dva';
import style from './index.scss';

export default function index(props) {
  return (
    <div className={style.home}>
      <div className={style.background}>
        <h1>ShoppingDemo</h1>
        <h2>通过对商品选择，实现对数据增删改查!</h2>
        <p>{props.text}</p>
      </div>
    </div>
  );
}

// 关联home.js(model) 和 当前的组件index.js(home 组件)
// export default connect(({ home }) => ({ ...home }))(index);
