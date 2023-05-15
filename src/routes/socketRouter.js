import express from 'express';

const socketRouter = express.Router();

socketRouter.get('/',async(req,res)=>{
    res.render('socket',{})
})

export default socketRouter;


