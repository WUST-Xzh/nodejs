var express = require('express');
var router = express.Router();
const userModel = require('../../models/userModel')

const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  await userModel.findOne({username: username, password: password}).then(result=>{
    console.log(result)
    if(result !== null) {
      let token = jwt.sign({
        username: result.username,
        _id: result._id
      }, 'secret', {
        expiresIn: 60 * 60 * 24 * 7
      });
      console.log(token)
      res.json({
        code: '2002',
        msg: '登录成功',
        data: token
      })
    } else {
      return res.json({
        code: '2002',
        msg: '用户名或密码错误',
        data: null
      })
    }
  }) 
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('success',{ msg: '退出成功', url:'/login' })
  })
})

module.exports = router;
