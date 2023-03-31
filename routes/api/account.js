var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')

const moment = require('moment')
const AccountModel = require('../../models/model');

const checkToken = (req,res,next)=>{
  let token = req.get('token')
  if (token){
    jwt.verify(token, 'secret', (err, data)=>{
      console.log(data)
    })
  }
  next()
}

//记账本列表
router.get('/account', checkToken, async (req, res, next) => {
  
  
  let accounts = []
  await AccountModel.find().sort({time: -1}).then(res=>{
    accounts = res
  })
  // res.render('list', { accounts });
  res.json({
    code: '0000',
    msg: '读取成功',
    data: accounts
  })
});


//新增记录
router.post('/account', checkToken, async (req, res, next) => {
  await AccountModel.create({
    ...req.body,
    //修改 time 属性的值
    time: moment(req.body.time).toDate()
  }).then( result => {
    
    res.json({
      code: '0000',
      msg: '添加成功',
      data: result
    })
  })
});

//删除记录
router.delete('/account/:id',checkToken, async (req, res) => {
  let id = req.params.id
  await AccountModel.deleteOne({_id: id}).then(result=>{
    res.json({
      code: '0000',
      msg: '删除成功',
      data: result
    })
  })
})

module.exports = router;
