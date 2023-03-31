
const low  =require('lowdb')

const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')

//获取db对象
const db = low(adapter)

//初始化数据
db.defaults({ posts:[], user:[]}).write()

//写入数据
db.get('posts').push({id:1 }).write()

