import express from 'express'
const route=express.Router()

route.get('/',(req,res)=>{
    res.success(200,'hello world, welcome to cotraveller')
})

export default route