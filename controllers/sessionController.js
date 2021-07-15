const catchAsync = require("../utils/catchAsync");
const Session = require("../models/sessionModel");


exports.getParticularSession=catchAsync(async(req,res,next)=>{


     const session=await Session.findById(req.params.id);
     console.log(session);

     res.status(200).json({

  status:"SUCCESS",

    data:{

        session
    }

     })


})