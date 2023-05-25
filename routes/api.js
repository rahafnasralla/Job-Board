const express = require('express')
const router = express.Router()
const db = require('../connection')


//get all jobs
router.get('/jobs',(req,res,next)=> {
    db.query('SELECT * FROM jobListings',(err,results,fields)=> {
        if(!err) {
             res.json(results)
        }
        else res.json(err);
    }) 
})
//get one job

router.get("/job/:id", (req, res, next) => {
    let sql = `SELECT * FROM jobListings WHERE id= ${req.params.id}`;
    if(req.params.id!==undefined)  {
    db.query(sql, (err, result) => {
      if (err) res.json(err); 
      else {
      res.json(result)
      }
    });
       }
    else next()
  });


  //filter by company
  router.get("/companyjobs/:company", (req, res, next) => {
    let sql = `SELECT * FROM jobListings WHERE company= '${req.params.company}'`;
    if(req.params.company!==undefined)  {
    db.query(sql, (err, result) => {
      if (err) res.json(err); 
      else {
      res.json(result)
      }
    });
       }
    else next()
  });


  //filter by location
  router.get("/joblocation/:location", (req, res, next) => {
    let sql = `SELECT * FROM jobListings WHERE location= '${req.params.location}'`;
    if(req.params.location!==undefined)  {
    db.query(sql, (err, result) => {
      if (err) res.json(err); 
      else {
      res.json(result)
      }
    });
       }
    else next()
  });

  //filter by title
  router.get("/jobtitle/:title", (req, res, next) => {
    let sql = `SELECT * FROM jobListings WHERE title= '${req.params.title}'`;
    if(req.params.title!==undefined)  {
    db.query(sql, (err, result) => {
      if (err) res.json(err); 
      else {
      res.json(result)
      }
    });
       }
    else next()
  });


//add new job
router.post("/addjob", (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }
  let data = [req.body.title,req.body.description,req.body.requirements,req.body.salary,req.body.company,req.body.location]
  let sql = `INSERT INTO jobListings (title,description,requirements,salary,company,location) VALUES(?,?,?,?,?,?)`;
  db.query(sql,data,(err,results,fields)=>{
    !err ? res.json(results) : res.json(err)
  })
});

//update job
router.put("/updatejob/:id", (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }
  let data=[req.body.description,req.body.requirements,req.body.salary];
  let sql = `UPDATE jobListings SET description= ?, requirements =? , salary=? WHERE id=${req.params.id}`;
  db.query(sql,data, (err, result,fields) => {
    !err ? res.json(result) : res.json(err)
  });
});

//delete job
router.delete("/deletejob/:id", (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }
  let sql = `DELETE FROM jobListings WHERE id=${req.params.id}`;
  db.query(sql, (err, result) => {
    !err ? res.json(result) : res.json(err)
  });
});


module.exports = router
