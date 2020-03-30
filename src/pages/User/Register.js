import React, { Component } from 'react';
import Logo from '../../assets/icon.png';
import { email_reg, pwd_reg } from '../../utils/Regexp.js';
import Request from '../../utils/Request';
import style from './account.scss';
import { Form, Input, Button } from 'antd';

export default class index extends Component {

  state = {
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  formRef = React.createRef();//实例化表单

  // 自定义表单校验规则
  validatorForm = (rule, value) => {
    if (value && rule.pattern && !value.match(rule.pattern)) {
      return Promise.reject(rule.message);
    }
    return Promise.resolve();
  };

  // 自定义校验两次密码是否一致
  validatorPwd = (rule, value) => {
    if (value !== this.formRef.current.getFieldValue('password')) {
      return Promise.reject(rule.message);
    }
    return Promise.resolve();
  };

  // 注册
  handleSubmit = e => {
    e.preventDefault();
    // validateFields	得到所有没有验证需求和符合验证得结果
    this.formRef.current.validateFields().then(values => {
      const { email, password } = values;
      // 发起网络请求
      Request('/users.json', {
        method: 'post',//覆盖默认get方法
        data: { email, password }
      }).then(res => {
        if (res.status === 200 && res.data) {
          // 注册后跳转登录页面
          this.props.history.push('/login');
        }
      });
    }).catch(() => { })
  };


  render() {
    return (
      <div className={style.account}>
        <img src={Logo} alt="my logo" className={style.logo} />
        <Form ref={this.formRef}
        // initialValues={this.state.initialValues}
        >
          <Form.Item label="邮箱" name="email" hasFeedback
            rules={[{ required: true, message: '邮箱不能为空，请输入邮箱账号' },
            //  {type: 'email', message: '请输入正确的邮箱格式'}
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
          <Form.Item label="确认密码" name="confirmPassword" hasFeedback
            rules={[
              {
                required: true,
                message: '密码不能为空，请输入密码！'
              },
              // ({ getFieldValue }) => ({
              //   validator(rule, value) {
              //     if (!value || getFieldValue('password') === value) {
              //       return Promise.resolve();
              //     }
              //     return Promise.reject('两次输入的密码不一致！');
              //   },
              // })
              {
                validator: this.validatorPwd,
                message: '两次输入的密码不一致！'
              }
            ]}>
            <Input.Password placeholder="请再次确认密码" />
          </Form.Item>
          {/* 注意这里的样式添加是""形式，因为防止被css loader编译" */}
          <Button className={style.btn} onClick={this.handleSubmit} type="primary">
              注册
          </Button>
        </Form>
      </div>
    );
  }
}













