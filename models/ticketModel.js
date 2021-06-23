 const mongoose = require('mongoose');
  const ticketSchema=new mongoose.Schema({

//   //name,price ,description,amountofticketLabel
//   //community connected with stripe
  name:{
      type:String,
      required:true
  },
  price:{
      type:Number,
      required:true

  },

  description:{
       type:String,
       

  },

  amountOfTicketAvailable:{
      type:Number,
      required,


  },
  numberOfTicketSold:{

       type:Number
  },
  ticketIsSoldOut:{
    type:Boolean
  },
  initiatedAt:{
      type:Date,
  },

  lastUpdatedAt:{

    type:Date,
    default:Date.now()
  }



   


 })

 const Ticket = mongoose.model('Ticket',ticketSchema);
 module.exports = Ticket;