var nodemailer = require('nodemailer');
var email = "hexart637@gmail.com"

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: 'zetk dsdm imvx keoa'
  }
});
var mailOptions = {
    from: email,
    to: "pinnukoushikp@gmail.com",
    subject: 'Item Bid Successful',
    html: `<h1>hi helo</h1>`  }
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
    }
  });  

var x = /[a-z][#@$%]/.test("abcd")
console.log(x);