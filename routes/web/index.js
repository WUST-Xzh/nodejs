var express = require('express');
var router = express.Router();

const moment = require('moment')
const AccountModel = require('../../models/model');

let chechLogin = (req, res, next)=>{
  if(!req.session.username){
    return res.redirect('/login')
  }
  next()
}

//记账本列表
router.get('/account', chechLogin, async (req, res, next) => {
  
  let accounts = []
  await AccountModel.find().sort({time: -1}).then(res=>{
    accounts = res
  })
  res.render('list', { accounts });
});


//添加记录
router.get('/account/add', chechLogin, function(req, res, next) {
  res.render('add');
});


//新增记录
router.post('/account', async (req, res, next) => {
  await AccountModel.create({
    ...req.body,
    //修改 time 属性的值
    time: moment(req.body.time).toDate()
  }).then( result => {
    res.render('success', {msg: '添加成功哦~~~', url: '/account'});
  })
});

//删除记录
router.get('/account/:id', chechLogin,  async (req, res) => {
  let id = req.params.id
  await AccountModel.deleteOne({_id: id})
  res.send('删除成功')
})

module.exports = router;
