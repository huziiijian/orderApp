import React, { Component } from 'react';
import Logo from '../../assets/icon.png';
import { email_reg, pwd_reg } from '../../utils/Regexp.js';
import { connect } from 'dva';
import Request from '../../utils/Request';
import style from './account.scss';
import { Form, Input, Button, Message } from 'antd';

@connect()
export default class index extends Component {

  formRef = React.createRef();

  // 自定义表单校验规则
  validatorForm = (rule, value) => {
    if (value && rule.pattern && !value.match(rule.pattern)) {
      return Promise.reject(rule.message);
    }
    return Promise.resolve();
  };

  // 登录
  handleSubmit = e => {
    e.preventDefault();
    // validateFields	触发表单验证
    this.formRef.current.validateFields().then(values => {
      const { email, password } = values;
      // 请求注册信息
      Request('/users.json').then(res => {
        const { data, status } = res;
        if (status === 200 && data) {
          let users = [];
          for (const key in data) {
            // console.log(data[key]);
            users.push({
              ...data[key],
              key
            });
          }
          // 账户密码匹配
          users = users.filter(user => {
            return user.password === password && user.email === email;
          });
          // 匹配成功，返回正确email和password
          if (users && users.length) {
            localStorage.setItem('email', users[0].email);
            localStorage.setItem('key', users[0].key);
            // 存储到models里
            this.props
              .dispatch({
                type: 'global/setUserInfo',
                payload: users[0]
              })
              .then(() => {
                // 页面跳转
                this.props.history.push('/');
              });
          } else {
            Message.error('邮箱或密码错误, 请重新输入');
          }
        }
      });
    }).catch(() => {})
  };

  render() {
    return (
      <div className={style.account}>
        <img src={Logo} alt="my logo" className={style.logo} />
        <Form className="account-form" ref={this.formRef} >
          <Form.Item label="邮箱" name="email" hasFeedback
            rules={[{ required: true, message: '邮箱不能为空，请输入邮箱账号' },
            {
              pattern: email_reg,
              validator: this.validatorForm,
              message: '请输入正确的邮箱格式'
            }
            ]}>
            <Input placeholder="请输入正确的邮箱格式" />
          </Form.Item>
          <Form.Item label="密码" name="password" hasFeedback
            rules={[{ required: true, message: '密码不能为空，请输入密码' },
            {
              pattern: pwd_reg,
              validator: this.validatorForm,
              message: '请输入正确的密码格式：6-16位字母、数字或特殊字符 _-.'
            }]}>
            <Input.Password placeholder="请输入正确的密码格式：6-16位字母、数字或特殊字符 _-." />
          </Form.Item>
          {/* 注意这里的样式添加是""形式，因为防止被css loader编译" */}
          <Button className={style.btn} onClick={this.handleSubmit} type="primary">
            登录
          </Button>
        </Form>
      </div>
    );
  }
}













