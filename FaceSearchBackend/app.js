var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const axios = require('axios');
var cors= require('cors');
var multer = require('multer')
//const mysql = require("mysql");
var app = express();
db = require('./db_connect'),
mysql = require('mysql');
/////const fs = require('fs');
//const arff = require('./arff');
//////////////////////////////////////////var arff = require('./arff');
var folderPath = 'public/files';
const fsPromises = require('fs').promises 
// For ES syntax: import { promises as fsPromises } from 'fs'
//var tableName="";
var fs = require('fs')
  , readline = require('readline')
  , EventEmitter = require('events').EventEmitter;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let relation;
let attnames;
let attributeValues;
let imageid;

if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath, { recursive: true });
}

function findFileByExt(folderPath, ext) 
{
    var files = fs.readdirSync(folderPath);
    var result = [];
   
    files.forEach( 
        function (file) {
            var newbase = path.join(folderPath,file);
            if ( fs.statSync(newbase).isDirectory() ){
                result = findFileByExt(newbase,ext,fs.readdirSync(newbase),result);
            } else             {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext ){
                    result.push(newbase);
                } 
            }
        }
    )
    return result;
}

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	cb(null, 'public/files')
  },
  filename: function (req, file, cb) {
	cb(null, Date.now() + '-' +file.originalname )
  }
})
app.post('/faces/api/v1/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
		   readArffFile()
      return res.status(200).send(req.file)

    })
	
	
})
async function readArffFile() {
	await sleep(500);
	var arfffile = findFileByExt(folderPath, 'arff');
	console.log("fileeee", arfffile[0])
	arff(arfffile[0]); 
	deleteDir()
}

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }
async function deleteDir() {
	const directory = folderPath
	  
	// await fsPromises.rmdir(directory, {
	//   recursive: true
	// })
	fs.readdir(directory, (err, files) => {
		if (err) throw err;
	  
		for (const file of files) {
		  fs.unlink(path.join(directory, file), err => {
			if (err) throw err;
		  });
		}
	  });
  }
//var upload = multer({ storage: storage }).array('file')
var upload = multer({ storage: storage }).single('file')

db.query('USE celeba', function (err) {
	if (err) console.log("CANNOT CONNECT TO DATABASE.\n");
});

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : ''
});

connection.query('USE celeba');


app.get("/faces/api/v1", (req, res)=>{

	let array = [];
	let statt= JSON.stringify(attnames);
	attArray= statt.split(",");
	for (var i=0; i<attArray.length; i++){
		// console.log("length "+attArray.length)
		// console.log("i element "+attArray[i])
        let a=[];
		if(i==0)
		{   
			attArray[i]= attArray[i].substr(2, attArray[i].length-3)
		}
		else if(i==attArray.length-1){
			attArray[i]= attArray[i].substr(1, attArray[i].length-3)
		}
		else{
			attArray[i]= attArray[i].substr(1, attArray[i].length-2)
		}
	  
		//console.log("final value array " + attArray)
	}
	//attArray= attnames;
	//console.log("attnames  " + attnames)
	//console.log("att values "+ arff.attributeValues)
	//let val=[]
	//val.push(arff.attributeValues);
	//let v=arff.attributeValues;
	let stval= JSON.stringify(attributeValues);
	//console.log("attvalues  " + attributeValues)
	valueArray= stval.split(","); //arff.attributeValues
	//valueArray= attributeValues;
	
	for (var i=0; i<valueArray.length; i++){
		// console.log("length "+valueArray.length)
		// console.log("i element "+valueArray[i])

		if(i==0)
		{   if(valueArray[i].substr(2,1)=="-")
			{valueArray[i]= valueArray[i].substr(2,2)}
			else
			valueArray[i]= valueArray[i].substr(2,1)
		}
		else if(i==valueArray.length-1){
			if(valueArray[i].substr(1,1)=="-")
			valueArray[i]= valueArray[i].substr(1,2)
			else
			valueArray[i]= valueArray[i].substr(1,1)
		}
	    else{
			if(valueArray[i].substr(1,1)=="-")
			valueArray[i]= valueArray[i].substr(1,2)
			else
			valueArray[i]= valueArray[i].substr(1,1)
		}
		//console.log("final value array " + valueArray)
	}
	// console.log("val arr " +valueArray)
	// console.log("att arr " +attArray[0])
	array.push(attArray);
	array.push(valueArray);
	// console.log("aaar"+ array + "ar0 "+ array[0]+ "arr1 "+ array[1])
	// console.log("arrayyyyyy "+JSON.stringify(array))
	//let f=JSON.stringify(array);
	//console.log("simdi " + f[0]+ " " +f[1])
	res.send(JSON.stringify(array));  
  })


  app.get('/faces/api/v1/search/:id', (req, res) => {
    let attval=[]
	var query = "SELECT * FROM "+ relation + " t WHERE t." + imageid + "=" + "\""+ req.params.id+ "\"" ;
	   db.query(query, function (err, result)  {
		if(err){
			throw err;
		} else {
			for(var i = 0; i < result.length; i++)
			{     
				  Object.keys(result[i]).forEach(function(key, a) {
					  if(Object.keys(result[i])[a]!= imageid){
					  attval.push( Object.keys(result[i])[a] + "=" +Object.values(result[i])[a]);
					  }
				  });

			 }
			 res.send(JSON.stringify(attval));  
		}
	
	})
  
})


app.put('/faces/api/v1/search/:id', (req, res) => {

	var query = "UPDATE " + relation + " SET " 
	let list= req.body;
	req.body.forEach(element => {
		let elementArr = element.split("'")
		
		query+= elementArr[0];
		console.log(list[list.length-1]);
		if(element != list[list.length-1]){
			query+= ",";
		}
		else{
			query+= " WHERE " + imageid + "= "+ "\"" + req.params.id + "\"";
		}

	   });
	   console.log(query);
	   db.query(query, function (err, result)  {
		if(err){
			throw err;
		} else {
			res.send(JSON.stringify("OK"));  
		}
	
	})
  
})


function queryResults(query, res) {
	db.query(query, 
		function (err, result)  {
			if(err){
				throw err;
			} else {
				var objs = [];
				for (var i = 0;i < result.length; i++) {
					objs.push(result[i]);
				}
				res.send(JSON.stringify(objs));            
			}
		});
}

app.post('/faces/api/v1/search', (req, res)=>{
   let list = req.body;
   console.log("bodyy " +req.body)
   var query = "SELECT t." + imageid + " FROM "+ relation + " t WHERE t.";
   Number(a=0);
   req.body.forEach(element => {
	let elementArr = element.split("'")
    if(a==0){
      query+= elementArr[0];
      a++;
    }
    else if(a!=0)
      query+= " AND " + "t." + elementArr[0];
   });
   queryResults(query, res);
  
 })

 
 // catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function arff(input) {
  var is;
  var emitter = new EventEmitter();
  var section;

  if (typeof input === 'string') {
    is = fs.createReadStream(input);
  }
  // input is a readable stream
  else if (input.readable) {
    is = input;
  }
  else {
    process.nextTick(function() {
      emitter.emit('error', new Error('Unknown input:'+input));
    });
  }
  
 

  var endOfAtt=0;
  let attName=[];
  let attType=[];
  let dataArr=[];
  //var writeStream = fs.createWriteStream('/dev/null');
  var handlers = {
    line: function(line) {
      if (!section) section = 'header';

      var chunks = line.trim().split(/[\s]+/);
   
      // skip blank lines and comments
      if (chunks.length === 1 && chunks[0] === '') return;
      else if (/^%/.test(chunks[0])) {
        return;
      }
      // relation name
      else if (/^@RELATION/i.test(chunks[0])) {
        if (section !== 'header') {
          return emitter.emit('error', new Error('@RELATION found outside of header'));
        }
        emitter.emit('relation', chunks[1])
        relation= chunks[1];
        //module.exports.relationN= relation;
        
        console.log("relation: " + relation)
      }
      // attribute spec
      else if (/^@ATTRIBUTE/i.test(chunks[0])) {
        if (section != 'header') {
          return emitter.emit('error', new Error('@ATTRIBUTE found outside of header section'));
        }
        var name = chunks[1].replace(/['"]|:$/g, '');
        var type = parseAttributeType(chunks.slice(2).join(' '));
        emitter.emit('attribute', name, type);
        attName.push(name);
        attType.push(type.type);
        if(type.type == 'string'){
          imageid = name;
          console.log("img id ", imageid)
        }
       // console.log("name of att: "+ name + "  type of att: " + type.type )
        endOfAtt+=1;
      }
      else if (/^@DATA/i.test(chunks[0])) {
        if (section == 'data') {
          return emitter.emit('error', new Error('@DATA found after DATA'));
        }
        section = 'data';
        if(endOfAtt==attName.length){
            attnames=attName;
            var attributes;
            for(var i=0; i< attName.length ; i++){
                if(attType[i]=='string'){
                    attType[i]= "VARCHAR(100) NULL"
                    if(i!= attName.length-1){
                        attType[i]+= ", "
                    }
                }
                else if(attType[i]== 'nominal'){
                    attType[i]= "INT NULL"
                    if(i!= attName.length-1){
                        attType[i]+= ", "
                    }
                   // module.exports.attributeValues= type.oneof;
                }
                else if(attType[i]=='numeric'){
                    attType[i]= "INT NULL"
                    if(i!= attName.length-1){
                        attType[i]+= ", "
                    }
                }
                attributes+= attName[i] + " " + attType[i];
            }
            //console.log("atributes: "+ attributes)
            var query1 = "DROP TABLE IF EXISTS " + relation;
          
            db.query(query1, function (err, result)  {
              if(err){
                //"error in deleting prev table"
                throw err;
              } else {
               
              }
            
            })
            var query= "CREATE TABLE IF NOT EXISTS " + relation + " (" + attributes + ")";
            //var query= "CREATE TABLE IF NOT EXISTS " + "face"+ tablec.toString()+  " (" + attributes + ")";
            //tablec++;
            db.query(query, function (err, result)  {
                    if(err){
                        throw err;
                    } else {
                            console.log("OK");  
                    }
                
                })
            }
            endOfAtt++;
			var query2 = "ALTER TABLE " + relation + " CHANGE IF EXISTS undefined" + imageid + " " + imageid + " VARCHAR(100)";
			db.query(query2, function (err, result)  {
			 if(err){
				 throw err;
			 } else {
				  console.log("OK")
			 }
		 
			})

      }
      else {
        if (section == 'data') {
          emitter.emit('data', chunks.join('').replace(/['"]/g, '').split(','));
         // console.log(chunks.join('').replace(/['"]/g, ''))
         
          let arr =chunks.join('').replace(/['"]/g, '').split(',')
          arr[0]= "\"" + arr[0] + "\"";
          dataArr.push(arr);
          var query = "INSERT INTO " + relation + " VALUES (" + arr + ");";
          db.query(query, function (err, result)  {
            if(err){
                throw err;
            } else {
                //console.log("Ok for datas")
                // res.send(JSON.stringify("OK"));  
            }
        })
	
         // console.log("data:  " + chunks.join('').replace(/['"]/g, '').split(','))
        }

      }
    },
    end: function() {
      emitter.emit('end');
      //writeStream.end();
    },
    error: function(err) {
      emitter.emit('error', err);
    }
  }

  lines = readline.createInterface({
    input: is,
    //output: writeStream
  });
  lines.on('line', handlers.line);
  lines.on('error', handlers.error);
  lines.on('close', handlers.end);

  return emitter;

}

function parseAttributeType(type) {
  var finaltype = { type: type};
  var parts;

  if (/^date/i.test(type)) {
    parts = type.split(/[\s]+/);
    var format = "yyyy-MM-dd'T'HH:mm:ss";
    if (parts.length > 1) {
      format = parts[1];
    }
    finaltype = {
      type: 'date',
      format: format
    }
  }
  else if (parts=type.match(/^{([^}]*)}$/)) {
    finaltype.type = 'nominal';
    finaltype.oneof = parts[1].replace(/[\s'"]/g, '').split(/,/);
    //console.log("classes "+ finaltype.oneof)
    attributeValues= finaltype.oneof;   
  }
  else if (/^numeric|^integer|^real|^continuous/i.test(type)) {
    finaltype.type = 'numeric';
  }
  else if (/string/i.test(type)) {
    finaltype.type = 'string';
  }

  return finaltype;
}

module.exports = app;
