const usermodel = require('../../models/usermodel');
const {itemmodel} = require('../../models/itemmodel');

class LikedController {
   getLikedItems(req , res) {
    usermodel.findById(req.params.id).then((usermodel) => {
      if (!usermodel) return res.status(404).send({message: 'User not found'});
      
      res.status(200).json(usermodel.liked);
    })}
  
    addlikedItems(req , res) {
        usermodel.findById(req.params.userid).then((user)=>{
            itemmodel.findById(req.params.itemid).then((item)=>{
                if(!user ||!item) return res.status(404).send({message: 'User or Item not found'});
                user.liked.push(item);
                user.save();
                res.status(200).json({message:"Added to Liked items"})
            })
        })
    }

    deleteLikedItems(req , res) {
        usermodel.findById(req.params.userid).then((user)=>{
            itemmodel.findById(req.params.itemid).then((item)=>{
                if(!user ||!item) return res.status(404).send({message: 'User or Item not found'});
                user.liked = user.liked.filter(i => i._id.toString()!== item._id.toString());
                user.save();
                res.status(200).json({message:"Deleted from Liked items"})
            })
        })
    }
   }

   module.exports =  LikedController;