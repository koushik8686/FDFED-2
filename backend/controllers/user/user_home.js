const usermodel =  require("../../models/usermodel")
const {itemmodel} =  require("../../models/itemmodel")

async function render_user_home (req, res) { 
  console.log("received request" , req.params.email);
  
   await usermodel.findOne({_id:req.params.email}).then((result)=>{
    itemmodel.find().then((arr)=>{
      var data = {
          user:result,
          id:req.params.email,
          items:arr
      }
      return res.status(200).send({ message: "Data Fetched Successfully" , data: data});
    })
    })
  }

module.exports= render_user_home