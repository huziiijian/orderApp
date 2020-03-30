import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, Message } from 'antd';
import Request from '../../utils/Request';
import style from './index.scss'

const plainOptions = ['9寸', '12寸', '15寸'];
const CheckboxGroup = Checkbox.Group;

export default class NewPizza extends Component {

  formRef = React.createRef();
  state = {
    checkedList: ['12寸'],
    indeterminate: true,
    checkAll: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    // validateFields	得到所有没有验证需求和符合验证得结果
    this.formRef.current.validateFields().then(values => {
      const allSize = this.state.checkedList;
      const { name, des, price, dis } = { ...values };
      let pizzaInfo = { name, des };
      pizzaInfo.options = [];
      if (allSize.length > 0) {//注意不能直接allSize，因为这属于数组对象，是true
        allSize.forEach((item) => {
          let size = parseInt(item);
          // 一定要注意{}!!!不要忘了,要慎用解构的语法，容易出错
          let obj = {size, price, dis};// 注意push里面不要放解构操作，赋值容易被拆分
          obj.price = parseInt(price)
          pizzaInfo.options.push(obj);//因为{{name}}结构不了
        })
        console.log(pizzaInfo)
        Request('/menu.json', {
          method: 'post',
          data: pizzaInfo
        }).then(res => {
          if (res && res.status === 200 && res.data) {
            Message.success('添加成功');
            window.location.href = '/#/menus';// 注意这里没用props
          } else {
            Message.error('添加失败');
          }
        });
      } else {
        Message.error('缺乏商品尺寸信息, 请重新输入');
      }
    }).catch(() => { })
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      // '!!'代表变量null，undefined和''空串都不会执行以下代码
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {

    const required = true;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      colon: false
    };

    return (
      <div>
        <h3>添加新的pizza至菜单售卖</h3>
        <Form ref={this.formRef}>
          {/* 注意一定要给name属性才能双向绑定 */}
          <Form.Item {...formItemLayout} label="品种" name="name" hasFeedback
            rules={[{ required, message: '邮箱不能为空，请输入邮箱账号' }]}>
            <Input />
          </Form.Item>
          <Form.Item {...formItemLayout} label="描述" name="des">
            <Input.TextArea />{/* 直接写也行 */}
          </Form.Item>
          <Form.Item {...formItemLayout} label="尺寸：" >
            &nbsp;
            <CheckboxGroup
              options={plainOptions}
              value={this.state.checkedList}
              onChange={this.onChange}
            /> &nbsp;&nbsp;&nbsp;
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              全选
            </Checkbox>
          </Form.Item>
          <Form.Item {...formItemLayout} label="价格" name="price" hasFeedback
            rules={[{ required, message: '请输入已选择尺寸的售价' }]} >
            <Input />
          </Form.Item>
          <Form.Item {...formItemLayout} label="折扣" name="dis" hasFeedback
            rules={[{ required, message: '请输入对应折扣' }]} >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={this.handleSubmit}
              type="primary"
              className={style.btn}
            >
              添至菜单
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

