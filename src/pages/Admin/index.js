import React, { Component } from 'react'
import style from './index.scss'
import { Table, Button, Row, Col, Message } from 'antd';
import Request from '../../utils/Request';
import { DeleteOutlined } from '@ant-design/icons'
import NewPizza from './NewPizza';

export default class index extends Component {

  state = {
    menus: []
  };

  // 钩子函数
  componentDidMount() {
    this.getMenusData();
  }

  // 获取菜单列表的数据
  getMenusData = () => {
    Request('/menu.json').then(res => {
      if (res && res.status === 200 && res.data) {
        const { data } = res;
        this.setState(() => {
          let menus = [];// const定义的数组push可以但重新赋值不行
          for (const key in data) {
            let menu = {};
            menu.key = key;
            menu.name = data[key].name;
            data[key].options.forEach((option) => {
              if(!!option){// 注意删除后可能会报错，写法要先判断一下option的存在
              const { dis, price, size } = option;
              menu = { ...menu, dis, price, size };
              menus.push(menu);
              }
            })
          }
          return { menus };
        });
      }
    });
  };

  renderNewPizza = () => {
    return <NewPizza />;
  }

  renderMenuTable = () => {

    // mock接口传递来的数据
    // const dataSource =
    //   [
    //     { key: 1, size: 12, name: '榴莲披萨', price: 20, dis: "90%" },
    //     { key: 2, size: 15, name: '起司披萨', price: 20, dis: "90%" }
    //   ];

    // 真实的从管理请求来的接口数据
    const dataSource = this.state.menus;

    const columns = [
      {
        key: 'name',
        title: '品种',
        dataIndex: 'name',
        colSpan: 1,
        align: "center",
      },
      {
        key: 'size',
        title: '尺寸',
        dataIndex: 'size',
        colSpan: 1,
        align: "center",
      },
      {
        key: 'price',
        title: '价格',
        dataIndex: 'price',
        colSpan: 1,
        align: "center",
      },
      {
        key: 'dis',
        title: '折扣',
        dataIndex: 'dis',
        colSpan: 1,
        align: "center",
      },
      {
        key: 'action',
        title: '删除',
        colSpan: 1,
        align: "center",
        render: (text) => (
          <Button
            // 对action而言，text和record是一致的
            onClick={() => handleDelete(text)}
            className={style['del-btn']}
          >
            <DeleteOutlined />
          </Button>
        )
      }
    ];

    const handleDelete = text => {
      let Index = 0;
      Request(`/menu/${text.key}/options.json`).then((res) => {
        res.data.forEach((item, i) => {
          if(!!item && text.size === item.size){
            Index = i;
          }
        }) 
      })
      Request(`/menu/${text.key}/options/${Index}/${text.size}.json`, {
        method: 'delete'
      }).then(res => {
        if (res && res.status === 200) {
          Message.success('删除成功');
          window.location.href = '/#/menus';
        } else {
          Message.error('删除失败');
        }
      });
    };

    return (
      <Table
        pagination={false}
        className="menus-table"
        dataSource={dataSource}
        columns={columns}
        locale={{
          emptyText: '菜单没有任何商品'
        }}
      />
    );
  }

  render() {
    return (
      <Row className={style.admin}>
        <Col sm={24} md={16} className={style.left}>
          {this.renderNewPizza()}
        </Col>
        <Col sm={24} md={8} className={style.right}>
          <h3>菜单</h3>
          {this.renderMenuTable()}
        </Col>
      </Row>
    );
  }
}
