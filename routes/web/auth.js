var express = require('express');
var router = express.Router();
const userModel = require('../../models/userModel')

router.get('/reg', (req, res) => {
  res.render('reg')
})

router.post('/reg', async (req, res) => {
  await userModel.create(req.body).then( result => {
    res.render('success',{ msg: '注册成功', url:'/login' })
  })
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  await userModel.findOne({username: username, password: password}).then(result=>{
    if(result !== null) {
      req.session.username = result.username
      req.session.password = result.password
      res.render('success',{ msg: '登录成功', url:'/login' })
    } else {
      res.render('success',{ msg: '用户不存在', url:'/login' })
    }
  }) 
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('success',{ msg: '退出成功', url:'/login' })
  })
})

module.exports = router;
