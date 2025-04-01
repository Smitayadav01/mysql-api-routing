const {faker} =require("@faker-js/faker");
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");

const port=8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view-engine","ejs");
app.set("views",path.join(__dirname,"views"));

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"Delta_app",
    password:"Smit@2022",
})

let getRandomUser=()=>{
    return[
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
    ]
}

app.get("/",(req,res)=>{
    let q=`SELECT COUNT(*) FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count=result[0]['COUNT(*)'];
            res.render("home.ejs",{count});
        });
    }
    catch(err){
            console.log(err);
            res.send("SOme error in DB");
        }
    
        
})

app.get("/users",(req,res)=>{
    let q=`SELECT * FROM user`;
    try{
        connection.query(q,(err,users)=>{
            if(err) throw err;
            res.render("show.ejs",{users});
        });
    } catch(err){
        console.log("Some error in DB");
    }
})

app.get("/users/:id/edit",(req,res)=>{
    let {id} =req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            let user=results[0];
            res.render("edit.ejs",{user});
        });
    } catch(err){
        console.log("Some error in DB");
    }
})

app.patch("/users/:id",(req,res)=>{
    let {id} =req.params;
    let{password:formpass, name:newname} =req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            let user=results[0];
            if(formpass != user.password){
                res.send("WRONG");
            } else{
                let q2=`UPDATE user SET name='${newname}' WHERE id='${id}'`;
                connection.query(q2,(err,results)=>{
                    if(err) throw err;
                    res.render("/users");
                })
            }
            
        });
    } catch(err){
        console.log("Some error in DB");
    }

})
app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`);
})



