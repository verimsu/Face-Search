db = require('./db_connect');
var fs = require('fs')
  , readline = require('readline')
  , EventEmitter = require('events').EventEmitter;


db.query('USE celeba', function (err) {
	if (err) console.log("CANNOT CONNECT TO DATABASE.\n");
});

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : ''
});

connection.query('USE celeba');
var tablec=0;
var relation;

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
        console.log("name of att: "+ name + "  type of att: " + type.type )
        endOfAtt+=1;
      }
      else if (/^@DATA/i.test(chunks[0])) {
        if (section == 'data') {
          return emitter.emit('error', new Error('@DATA found after DATA'));
        }
        section = 'data';
        if(endOfAtt==attName.length){
            module.exports.attnames=attName;
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
            console.log("atributes: "+ attributes)
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

      }
      else {
        if (section == 'data') {
          emitter.emit('data', chunks.join('').replace(/['"]/g, '').split(','));
          console.log(chunks.join('').replace(/['"]/g, ''))
         
          let arr =chunks.join('').replace(/['"]/g, '').split(',')
          arr[0]= "\"" + arr[0] + "\"";
          dataArr.push(arr);
          var query = "INSERT INTO " + relation + " VALUES (" + arr + ");";
          db.query(query, function (err, result)  {
            if(err){
                throw err;
            } else {
                console.log("Ok for datas")
                // res.send(JSON.stringify("OK"));  
            }
        })
          console.log("data:  " + chunks.join('').replace(/['"]/g, '').split(','))
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
    console.log("classes "+ finaltype.oneof)
    module.exports.attributeValues= finaltype.oneof;
    module.exports.relationN= relation;
  }
  else if (/^numeric|^integer|^real|^continuous/i.test(type)) {
    finaltype.type = 'numeric';
  }
  else if (/string/i.test(type)) {
    finaltype.type = 'string';
  }

  return finaltype;
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
  
var folderPath = 'public/files';
var tableName="";


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
      return res.status(200).send(req.file)

    })
	var arfffile = findFileByExt(folderPath, 'arff');
	fs.readFile(arfffile[0], 'utf8' , (err, data) => {
		if (err) {
		  console.error(err)
		  return
		}
        arff(arfffile[0]);     
	  })

	  //tableName= arff.relationN;
	//   console.log("att nameee 1 "+ arff.attnames)
	//   console.log("table: "+tableName)
	  //var query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME =" + "\"" + tableName + "\";";
	  var query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'faces'";
	  let array = [];
	  let valueArray = [];
	  let attArray = [];
	  let attArray1=[];
	  db.query(query, function (err, result)  {
		  if(err){
			  throw err;
		  } else {
			  for(var i = 0; i < result.length; i++)
			  {     
					Object.keys(result[i]).forEach(function(key, a) {
						attArray1.push(Object.values(result[i])[a]);
					});

			   }
		  	 //console.log("att nameee "+ arff.attnames)
			 let t=arff.attnames;
			 //attArray= arff.attnames;
			 let statt= JSON.stringify(t);
			 attArray= statt.split(",");
			 
			 //console.log("att values "+ arff.attributeValues)
			 //let val=[]
			 //val.push(arff.attributeValues);
			 let v=arff.attributeValues;
			 let stval= JSON.stringify(v);
			 valueArray= stval.split(","); //arff.attributeValues
		     console.log("val arr " +valueArray)
			 array.push(attArray);
			 array.push(valueArray);
			 console.log("arrayyyyyy "+JSON.stringify(array))
			 let f=JSON.stringify(array);
			 console.log("simdi " + f[0]+ " " +f[1])
			 res.send(JSON.stringify(array));  
		  }
	  })

});
var upload = multer({ storage: storage }).array('file')


module.exports = arff;

