const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./controller/user')
const intern = require('./controller/company')
const admin = require('./controller/admin')
const app = express();
const PORT = 8001;



app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use('/uploads' ,express.static('uploads'))
app.use('/resume' ,express.static('resume'))

app.listen(PORT, () => {
  console.log(`Server is running on port http://192.168.1.80:8000`);
});

mongoose.connect("mongodb://192.168.1.200:27017/jobportal", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(()=>{
    console.log(`mongodb is connected`)
})






app.get('/',(req: any, res: { send: (arg0: { msg: string; }) => void; })=>{
  res.send({msg:"My api up and running succesfully"})
})

app.use('/api/user', user)
app.use('/api/company', intern)
app.use('/api/admin',admin)


