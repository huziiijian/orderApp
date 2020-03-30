import React, { Component } from 'react'
import { Table, Button, Row, Col } from 'antd';
import style from './index.scss';
import Request from '../../utils/Request';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';


export default class index extends Component {// 表格优化，嵌套表

  state = {
    cart: [],
    menus: {}
  };

  // 钩子函数
  componentDidMount() {
    this.getMenusData();
  }

  // 获取菜单列表的数据
  getMenusData = () => {
    Request('/menu.json').then(res => {
      if (res && res.status === 200 && res.data) {
        this.setState({
          menus: res.data
        });
      }
    });
  };

  // 渲染菜单栏,返回一个二级嵌套的商品展示表格
  renderMenusTable = () => {

    const handleAddMenus = record => {
      // 这里一定要注意对象赋值需要重新开辟地址!!!让新对象拥有新引用地址。
      // 如果是直接赋值 cart = this.state.cart的话，只是改变引用指向，react不认为虚拟dom改变了，
      // 虽然console的结果没问题，但dom不会重新渲染
      let cart = [...this.state.cart];
      // 通过商品唯一key找到index，确定添加的是哪一种商品
      const index = cart.findIndex(item => item.key === record.key);
      // 有该商品存在，通过index找到对应商品信息，将{添加的商品信息(count新值覆盖后)}替换原先的cart
      index >= 0 ? cart.splice(index, 1, { ...cart[index], count: cart[index].count + 1 })
        : (cart = [...cart, { ...record, count: 1 }]);// 没有添加的商品，则直接改变cart
      this.setState({ cart });
    };

    const viewComments = record => {
      console.log(record);
    }

    // mock接口传递来的数据
    // const originPizzaInfo = {
    //   1: { name: "榴莲披萨", des: '榴莲披萨榴莲披萨榴莲披萨', sales: 30, rate: '86%', options: [{ size: 9, price: 36, dis: '10%' }, { size: 12, price: 52, dis: '15%' }, { size: 15, price: 78, dis: '20%' }] },
    //   2: { name: "芒果披萨", des: "芒果披萨芒果披萨芒果披萨", sales: 20, rate: '82%', options: [{ size: 9, price: 28, dis: '10%' }, { size: 12, price: 36, dis: '15%' }, { size: 15, price: 54, dis: '20%' }] },
    //   3: { name: "起司披萨1", des: "起司披萨1起司披萨1起司披萨1", sales: 34, rate: '80%', options: [{ size: 9, price: 24, dis: '10%' }, { size: 12, price: 32, dis: '15%' }, { size: 15, price: 44, dis: '20%' }] },
    //   4: { name: "起司披萨2", des: "起司披萨2起司披萨2起司披萨2", sales: 34, rate: '80%', options: [{ size: 9, price: 24, dis: '10%' }, { size: 12, price: 32, dis: '15%' }, { size: 15, price: 44, dis: '20%' }] },
    //   5: { name: "起司披萨3", des: "起司披萨3起司披萨3起司披萨3", sales: 34, rate: '80%', options: [{ size: 9, price: 24, dis: '10%' }, { size: 12, price: 32, dis: '15%' }, { size: 15, price: 44, dis: '20%' }] }
    // }

    // 真实的从管理请求来的接口数据,不包含销量、好评度和客户评价等信息。
    const originPizzaInfo = this.state.menus;

    // 对接口传来的数据进行处理
    // 1.主表的最终数据pizzaInfo和初步子表pizzaItems数据
    const pizzaInfo = [];
    const pizzaItems = [];
    for (const key in originPizzaInfo) {
      let item = originPizzaInfo[key];
      pizzaInfo.push({//需要遍历的数据，key值最好不要省略
        key: item.name,
        name: item.name,
        sales: item.sales,
        rate: item.rate,
        des: item.des
      });
      item.options.forEach((ele, index) => {
        // 子表数据，key要注意保值唯一
        pizzaItems.push({ ...ele, key: key + '-' + index, name: item.name });
      });
    }
    // 2.主表的columns数据
    const pizzaInfoColumns = [
      {
        title: '披萨种类', dataIndex: 'name', key: 'name', colSpan: 1, align: "center",
        render: text => {
          return {
            children: <strong>{text}</strong>,
            props: {
              colSpan: 1
            }
          };
        }
      },
      {
        title: '披萨简介', dataIndex: 'des', key: 'des', colSpan: 4, align: "center",
        render: text => {
          return {
            children: <span className="des" >{text}</span>,
            props: {
              colSpan: 4,
              textwrap: 'word-break'
            }
          };
        }
      },
      {
        title: '销量', dataIndex: 'sales', key: 'sales', colSpan: 1, align: "center",
        render: text => {
          return {
            children: <strong>{text}</strong>,
            props: {
              colSpan: 1
            }
          };
        }
      },
      {
        title: '好评度', dataIndex: 'rate', key: 'rate', colSpan: 1, align: "center",
        render: text => {
          return {
            children: <strong>{text}</strong>,
            props: {
              colSpan: 1
            }
          };
        }
      },
      {
        title: '客户评价', key: 'action', colSpan: 2, align: "center",
        render: (text, record) => {
          return {
            children: <Button className="view-btn" onClick={() => viewComments(record)}>
              浏览评价信息</Button>,
            props: {
              colSpan: 2
            }
          };
        }
      },
    ];

    // 子表处理
    // 注意expandedRowRender不能改变其命名
    const expandedRowRender = ({ name }) => {//第一个参数是主表的record
      // 构建子表最终data数据，根据子表的name来划分对应columns
      const data = [];
      for (const key in pizzaItems) {
        if (pizzaItems[key].name === name) {
          data.push(pizzaItems[key]);
        }
      }
      const columns = [
        {
          title: '尺寸', dataIndex: 'size', key: 'size', colSpan: 1, align: "center",
          render: text => {
            return {
              children: <span>{text}</span>,
              props: {
                colSpan: 1
              }
            };
          }
        },
        {
          title: '单价', dataIndex: 'price', key: 'price', colSpan: 1, align: "center",
          render: text => {
            return {
              children: <span>{text}</span>,
              props: {
                colSpan: 1
              }
            };
          }
        },
        {
          title: '折扣', dataIndex: 'dis', key: 'dis', colSpan: 1, align: "center",
          render: text => {
            return {
              children: <span>{text}</span>,
              props: {
                colSpan: 1
              }
            };
          }
        },
        {
          title: '加入', key: 'action', colSpan: 2, align: "center",
          render: (text, record) => {
            return {
              children: (
                <Button className="add-btn" onClick={() => handleAddMenus(record)}>
                  <PlusOutlined />
                </Button>
              ),
              props: {
                align: "center",
                colSpan: 2
              }
            }
          }
        }
      ];
      return <Table className="sonTable" columns={columns} dataSource={data} pagination={false} />;
    }

    return (
      <Table
        columns={pizzaInfoColumns}
        expandable={{ expandedRowRender }}
        dataSource={pizzaInfo}
      />
    );
  }

  // 渲染购物车，返回一个普通表格
  renderCartTable() {
    const columns = [
      {
        key: 'count', title: '数量', dataIndex: 'count', align: "center",
        render: (text, record) => (
          <span>
            <Button
              onClick={() => handleDecrease(record)}
              className={style['cart-btn']}
            >
              <MinusOutlined />
            </Button>
            <span>{record.count}</span>
            <Button
              onClick={() => handleIncrease(record)}
              className={style['cart-btn']}
            >
              <PlusOutlined />
            </Button>
          </span>
        )
      },
      {
        key: 'name', title: '菜单', dataIndex: 'name', align: "center",
      },
      {
        key: 'size', title: '尺寸', dataIndex: 'size', align: "center",
      },
      {
        key: 'price', title: '折后价', dataIndex: 'price', render: (text, record) => {
          const { count, dis, price } = record;
          const allPrice = count * (100 - parseInt(dis)) / 100 * price;
          return <span>{allPrice.toFixed(2)}</span>
        }
      }
    ];

    const handleDecrease = record => {
      // 这里一定要注意对象赋值需要重新开辟地址!!!让新对象拥有新引用地址。
      // 如果是直接赋值 cart = this.state.cart的话，只是改变引用指向，react不认为虚拟dom改变了，
      // 虽然console的结果没问题，但dom不会重新渲染
      let cart = [...this.state.cart];
      const index = cart.findIndex(item => item.key === record.key);// 获取当前点击的数据的下标
      const current = cart[index];// 当前点击的数据对象
      if (current.count <= 1) {// 数量小于等于1时, 购物车的商品移除掉 否则商品数量减1
        cart.splice(index, 1);
      } else {
        cart.splice(index, 1, {// 不删除数据，只是对count属性重新赋值
          ...current,
          count: current.count - 1
        });
      }
      this.setState({// 更新状态，但删除不会触发样式改变
        cart
      });
    };

    const handleIncrease = record => {
      let cart = [...this.state.cart];
      const index = cart.findIndex(item => item.key === record.key);
      const current = cart[index];
      cart.splice(index, 1, {
        ...current,
        count: current.count + 1
      });
      this.setState({
        cart
      });
    };

    return (
      <Table
        pagination={false}
        className="menus-table cart"
        dataSource={this.state.cart}
        columns={columns}
        locale={{
          emptyText: '购物车没有任何商品'
        }}
      />
    );
  }

  render() {
    const totalPrice = this.state.cart.reduce(
      (total, item) => (total += item.price * item.count * (100 - parseInt(item.dis)) / 100),
      0
    );
    return (
      <Row>
        {/* 渲染菜单栏 */}
        <Col sm={24} md={15}>{this.renderMenusTable()}</Col>
        <Col md={2}></Col>
        {/* 渲染购物车 */}
        <Col sm={24} md={7}>{this.renderCartTable()}
          <p className={style['total-price']}>总价: {totalPrice.toFixed(2)}</p>
          <Button type="primary" className={style['submit-btn']}>
            提交
          </Button>
        </Col>
      </Row>)
  }
}
