
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';
    import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js';
    import { getFirestore, collection, doc, setDoc, getDocs, getDoc, limit, query, updateDoc,  addDoc, } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js';
    import { getStorage, ref, uploadBytes, getMetadata, deleteObject, listAll } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBWhH4qYxVx2NWYUNnkY7rfviGEelwg7oQ",
  authDomain: "haushelper-12f14.firebaseapp.com",
  projectId: "haushelper-12f14",
  storageBucket: "haushelper-12f14.appspot.com",
  messagingSenderId: "945052022593",
  appId: "1:945052022593:web:e6889785d166df5e0653c0"
 };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

      
    let signOutButton = document.getElementById('signout-button');

    if (typeof signOutButton !== null) {
        signOutButton.addEventListener('click', handleSignOut);
    } else { }
    
function handleSignOut() {
signOut(auth).then(() => {
}).catch((error) => {
const errorMessage = error.message;});
}

onAuthStateChanged(auth, (user) => {

 if (user) {
 const adminsRef = collection(db, 'Admins');
getDocs(adminsRef)
  .then((querySnapshot) => {
    querySnapshot.forEach((docx) => {
      if (docx.data().email === user.email) {
        
        
         const companiesRef = collection(db, "Companies");
 const companyDoc = doc(companiesRef, docx.data().company);
  const companyCollections = collection(companyDoc, "Accesses");
 getDocs(companyCollections).then((querySnapshot) => {
querySnapshot.forEach((docy) => {

console.log(docy.data().aboName);
if(docy.data().aboName != "Testpaket"){
window.location.href = "/adminroom"
}else{
const companiesDocRef = doc(collection(db, 'Companies'),docx.data().company ); 
const accessCollection = collection(companiesDocRef, "Accesses");

document.getElementById("linkBasic").addEventListener('click', () => {


const clientReference = "cus_"+Date.now();

getDocs(accessCollection)
.then((querySnapshot) => {

if (!querySnapshot.empty) {
const firstDocument = querySnapshot.docs[0];
const userData = firstDocument.data();
const userAvailable = parseInt(userData.userAvailable, 10);
const userInit = parseInt(userData.userInit, 10);
const diff = userInit - userAvailable;
const newuserAvailable= (5 - diff).toString();

const facAvailable = parseInt(userData.facilityAvailable, 10);
const facInit = parseInt(userData.facilityInit, 10);
const facdiff = facInit - facAvailable;
const newfacAvailable= (5 - facdiff).toString();

const newData = {
 abo: "2",
 aboName: "Basic",
 facilityAvailable: newfacAvailable,
 facilityInit: "5",
                        purchased: new Date(),
                        userAvailable: newuserAvailable,
                        userInit: "5",
                        clientRef: clientReference,
};

updateDoc(firstDocument.ref, newData).then(() => {}).catch((error) => {});
}})
.catch((error) => {
});

                    
const link1 = document.getElementById("linkBasic");
link1.href ="https://buy.stripe.com/00gdRL8Bfc9EaE8eUU?client_reference_id="+clientReference;

});

document.getElementById("linkPremium").addEventListener('click', () => {

const clientReference = "cus_"+Date.now();

getDocs(accessCollection)
.then((querySnapshot) => {

if (!querySnapshot.empty) {
const firstDocument = querySnapshot.docs[0];
const userData = firstDocument.data();
const userAvailable = parseInt(userData.userAvailable, 10);
const userInit = parseInt(userData.userInit, 10);
const diff = userInit - userAvailable;
const newuserAvailable= (10 - diff).toString();

const facAvailable = parseInt(userData.facilityAvailable, 10);
const facInit = parseInt(userData.facilityInit, 10);
const facdiff = facInit - facAvailable;
const newfacAvailable= (10 - facdiff).toString();

const newData = {
 abo: "2",
 aboName: "Premium",
 facilityAvailable: newfacAvailable,
 facilityInit: "10",
                        purchased: new Date(),
                        userAvailable: newuserAvailable,
                        userInit: "10",
                        clientRef: clientReference,
};

updateDoc(firstDocument.ref, newData).then(() => {}).catch((error) => {});
}})
.catch((error) => {
});

const link2 = document.getElementById("linkPremium");
link2.href = "https://buy.stripe.com/4gwfZT8Bf6PkaE84gh?client_reference_id="+clientReference;
});

document.getElementById("linkUnlimited").addEventListener('click', () => {

const clientReference = "cus_"+Date.now();

getDocs(accessCollection)
.then((querySnapshot) => {

if (!querySnapshot.empty) {
const firstDocument = querySnapshot.docs[0];

const newData = {
 abo: "4",
 aboName: "Unlimited",
 facilityAvailable: "10000",
 facilityInit: "10000",
                        purchased: new Date(),
                        userAvailable: "10000",
                        userInit: "10000",
                        clientRef: clientReference,
};

updateDoc(firstDocument.ref, newData).then(() => {}).catch((error) => {});
}})
.catch((error) => {
});

const link3 = document.getElementById("linkUnlimited");
link3.href = "https://buy.stripe.com/7sIbJD04J1v0fYsfZ0?client_reference_id="+clientReference;
 });


                                }



                            })
                        });
                    }
                })
            })
  .catch((error) => {
    console.error('Fehler beim Abrufen der Daten:', error);
  });
  
  

 
 }
 else{window.location.href = "/login"}
 }
 )

