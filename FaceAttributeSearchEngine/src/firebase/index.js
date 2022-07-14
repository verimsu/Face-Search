import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFsVmymemetKfG1nq3QCgpRGbe1h8Ma90",
  authDomain: "fir-react-upload-f8edd.firebaseapp.com",
  projectId: "fir-react-upload-f8edd",
  storageBucket: "fir-react-upload-f8edd.appspot.com",
  messagingSenderId: "179044986837",
  appId: "1:179044986837:web:4415ba5e7c13b9ec08d75c",
  measurementId: "G-GDYQVRMZD7"
};

let imagesList = [];
let wantedImg="";

 function listAll(folder, imgid){
  const storageRef = firebase.storage().ref();
  var listRef = storageRef.child(folder);
  listRef
	.listAll()
	
  	.then((res) => {
    		res.prefixes.forEach((folderRef) => {
      		// All the prefixes under listRef.
      		// You may call listAll() recursively on them.
   		 });
    		res.items.forEach((itemRef) => {
      		// All the items under listRef.
          
          itemRef.getDownloadURL().then((url) => {
            console.log("URLL " +url);
            imagesList.push(url);
                      });
     
    		});
       
  }).then().catch((error) => {
    console.log(error);
  });
}



firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {storage, listAll, imagesList, wantedImg, firebase as default };