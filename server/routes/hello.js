import express from 'express'
const route=express.Router()

route.get('/',(req,res)=>{
    res.send('hello world, welcome to cotraveller')
})

export default route