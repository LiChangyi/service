/**
 * 因为不会暴露注册接口，所以需要调用脚本进行注册
 */

import { prompt, QuestionCollection } from 'inquirer';

import { addPayload } from '@/router/user/paramsValidate';
import models from '@/models';
import mongodb from '@/lib/mongodb';
import { Connection } from 'mongoose';

const questions: QuestionCollection = [
  {
    type: 'list',
    message: '请选择用户类型：',
    name: 'role',
    choices: [
      'admin',
      'user',
    ],
    default: 'user',
  },
  {
    type: 'input',
    message: '请输入用户名：',
    name: 'username',
  },
  {
    type: 'input',
    message: '请输入用户昵称：',
    name: 'nickname',
  },
  {
    type: 'password',
    message: '请输入登录密码:',
    name: 'password',
  },
];

const init = async () => {
  // 因为需要操作数据库，先连接数据库
  const connection: Connection = await mongodb();
  try {
    const {
      role, username, nickname, password,
    } = await prompt(questions);
    // 校验输入是否合规
    const { error } = addPayload.validate({ username, nickname, password });
    if (error) {
      throw error;
    }

    // 查看 username 是否重复
    const exist = await models.user.findOne({ username });
    if (exist) {
      throw Error('用户名重复');
    }

    // 写库
    await models.user.create({
      username,
      password,
      nickname,
      role,
    });
    console.log(`添加用户 ${nickname} 成功!`);
  } catch (err) {
    console.log(err);
  }
  await connection.close();
};

init();
