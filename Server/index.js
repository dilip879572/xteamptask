const express=require('express');
const cors=require('cors');
const PORT=process.env.PORT || 9000;
const app =express();
const Blog =require('./db/Blog');
const Categary = require('./db/Categary');
require('./db/Config');
const User=require('./db/user');
app.use(express.json())
app.use(cors());

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express') 

  const options={
    definition :{
      openapi :'3.0.0',
      info:{
        title:"Dilip kumar",
        version:"1.0.0"
      },
      servers:[
        {
       url: 'http://localhost:9000/'
        }
      ]
    },
    apis:['./index.js']
  }

  const swaggerSpec = swaggerJSDoc(options)
  app.use('/api-abhi/', swaggerUi.serve,swaggerUi.setup(swaggerSpec))



 /**
   *  @swagger
   *  /:
   *  get:
   *       summary:   AA This api is used to check if get method is working or not
   *       description : This api is used to check if get method is working or not
   *       responses:
   *         200:
   *             description: To  test Get method
   */

 app.get('/',(req,resp)=>{
  resp.send('welcome to mongodb Api')
})


// exceljs
// app.post=async ((req,res)=>{
//   try{
//     const workbook =new excelJS.workbook();
//     const worksheet=workbook.addonesheet("my user");

//     worksheet.columns=[

// {header:"Category_id",key:"Category_id"},
// {header:"Category_Name",key:"Category_Name"},
// {header:"Meta-Title",key:"Meta-Title"},
// {header:"Meta-Description",key:"Meta-Description"},
// {header:"Meta-keywords",key:"Meta-keywords"}

//     ];
//     let counter =1;
//     User.find
//   } catch(erro)
  
// })

app.post('/register', async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject()
    res.send(result);
 
});
//login user 

app.post('/login',async(req,resp)=>{
  if(req.body.password && req.body.email){
    let user = await User.findOne(req.body)
    console.log(user)
    if(user){
      resp.send(user)
    }else{
      resp.send({result:'No data found'})
    }
  }else{
    resp.send({result:'No user Found'})
  }
})

//change user password 
app.get('/show_users',async(req,res)=>{
  let user = await User.find()
  res.send(user)
})
app.post("/show_admin", async (req, resp) => {
  const email = req.body.email;
  if (!email) {
    console.log("invalid email");
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    resp.send({ result: "No Records found" });
    return;
  }

  resp.send(user);
});

app.put("/show_admin/:id", async (req, resp) => {
  let id = req.params.id;
  let o_password = req.body.oldPassword;
  const c_password = req.body.newPassword;
  const user = await User.findOne({ _id: id });
  if (!user) {
    resp.send({ error: "Invalid old password" });
    return;
  }
  else if(user.password == o_password){
      await User.updateOne({ _id: id }, { $set: {password: c_password } });
      resp.send({ success: "Password changed successfully" });
  }
  else{
      resp.send('fegrhtyfng');
  } 
});




// blog post........

app.post('/blog',async(req,res)=>{
  let user = new Blog(req.body)
  let result =await user.save()
  result =await result.toObject()
  res.send(result)
})


// blog get data...
app.get('/show_blog',async(req,res)=>{
  let result = await Blog.find();
 
  res.send(result)
})

/// delete the category 
app.delete('/show_blog/:id',async(req,res)=>{
  let result = await Blog.deleteOne({_id:req.params.id})
  res.send(result)
})


// blog get to prifil data

app.get("/show_blog/:id",async(req,res)=>{
  let result = await Blog.findOne({_id:req.params.id})

  if(result)
  {
    res.send(result)
  }else{
    console.log({result:"No Data Found"})
  }
})

//blog  the data update

app.put('/show_blog/:id', async(req,res)=>{
  let result= await Blog.updateOne({_id:req.params.id},{$set:req.body})
  res.send(result)
})

// category Curd.........

/**
* @swagger
* /category:
*   post:
*     summary: Create a new category
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               category_name:
*                 type: string
*               meta_title:
*                 type: string
*                 format: meta_title
*               meta_description:
*                 type: string
*                 format: meta_description
*               meta_keywords:
*                 type: string
*                 format: meta_keywords
*               price:
*                 type: string
*                 format: price
*               seller:
*                 type: string
*                 format: seller
*             required:
*               - category_name
*               - meta_title
*               - meta_description
*               - meta_keywords
*               - price
*               - seller
*     responses:
*       '200':
*         description: Category created successfully
*       '400':
*         description: Invalid request data
*       '500':
*         description: Internal server error
*/
 


app.post('/category',async(req,res)=>{
  let user=new Categary(req.body)
  let result=await user.save()
  result =await result.toObject()
  res.send(result)
})

// category get ................  




/**
 * @swagger
 * components:
 *   schemas:
 *     category:
 *       type: object
 *       properties:
 *         _id:
 *           type: integer
 *         category_name:
 *           type: string
 *         meta_title:
 *           type: string
 *         meta_description:
 *           type: string
 *         meta_keywords:
 *           type: string
 *         price:
 *           type: number
 *         sealery:
 *           type:  number
 */
/**
 * @swagger
 * /show_category:
 *   get:
 *     summary: Get all categories from MongoDB
 *     description: This API is used to fetch data from MongoDB.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/category'
 */






app.get('/show_category',async(req,res)=>{
  let result = await Categary.find().select('-password');
  res.send (result)
})

/// delete the category 





/**
* @swagger
* /show_category/{id}:
*   delete:
*     summary: Delete category
*     parameters:
*       - name: id
*         in: path
*         description: ID of the category to delete
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               category_name:
*                 type: string
*               meta_title:
*                 type: string
*                 format: meta_title
*               meta_description:
*                 type: string
*                 format: meta_description
*               meta_keywords:
*                 type: string
*                 format: meta_keywords
*               price:
*                 type: string
*                 format: price
*               sealery:
*                 type: string
*                 format: seller
*             required:
*               - category_name
*               - meta_title
*               - meta_description
*               - meta_keywords
*               - price
*               - sealery
*     responses:
*       '200':
*         description: Category deleted successfully
*       '400':
*         description: Invalid request data
*       '500':
*         description: Internal server error
*/

app.delete('/show_category/:id',async(req,res)=>{
  let result = await Categary.deleteOne({_id:req.params.id})
  res.send(result)
})


// category get to prifil data

app.get("/show_category/:id",async(req,res)=>{
  let result = await Categary.findOne({_id:req.params.id})

  if(result)
  {
    res.send(result)
  }else{
    console.log({result:"No Data Found"})
  }
})

//category the data update
// /**
//  * @swagger
//  * /show_category/{id}:
//  * put:
//  *      summary : used to update data to mongodb
//  *      description: This API is used to fetch data from MongoDB.
//  *      
//  */



/**
* @swagger
* /show_category/{id}:
*   put:
*     summary: Update category details
*     parameters:
*       - name: id
*         in: path
*         description: ID of the category to update
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               category_name:
*                 type: string
*               meta_title:
*                 type: string
*                 format: meta_title
*               meta_description:
*                 type: string
*                 format: meta_description
*               meta_keywords:
*                 type: string
*                 format: meta_keywords
*               price:
*                 type: string
*                 format: price
*               sealery:
*                 type: string
*                 format: sealery
*             required:
*               - category_name
*               - meta_title
*               - meta_description
*               - meta_keywords
*               - price
*               - sealery
*     responses:
*       '200':
*         description: Category details updated successfully
*       '400':
*         description: Invalid request data
*       '500':
*         description: Internal server error
*/



app.put('/show_category/:id', async(req,res)=>{
  let result= await Categary.updateOne({_id:req.params.id},{$set:req.body})
  res.send(result)
})



app.get("/search/:key",async(req,resp)=>
{
  let result = await Categary.find({
    "$or":[
        {category_name:{$regex:req.params.key}},
        {meta_title:{$regex:req.params.key}},
        {meta_keywords:{$regex:req.params.key}},
        {meta_description:{$regex:req.params.key}}
    ]
  })
  resp.send(result)

})
app.listen(PORT,(req,res)=>
{
    console.log('server start');
})