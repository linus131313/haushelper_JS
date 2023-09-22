
    document.getElementById("errorMessage").style.display = "none";

    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js';
    import { getFirestore, collection, doc, setDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js';



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
    
    
    








    let signInForm = document.getElementById('wf-form-signin-form');


    if (typeof (signInForm) !== null) {
        signInForm.addEventListener('submit', handleSignIn, true)
    } else { };




    //handle signIn

    function handleSignIn(e) {
        e.preventDefault();
        e.stopPropagation();

        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;








        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('user logged in: ' + user.email);


                const adminsRef = collection(db, 'Admins');
                var isAdmin = false;


                // check if user is admin
                getDocs(adminsRef)
                    .then((querySnapshot) => {
                        // Iteration über die Dokumente
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, " => ", doc.data());
                            console.log(doc.data().email);
                            console.log(email);
                            if (doc.data().email === email) {
                                isAdmin = true;
                                console.log("User ist Admin");
                                window.location.href = "/adminroom"
                            } else {
                                console.log("User ist kein Admin");
                            }
                        });
                                        //logout again because user is no admin
                              if(!isAdmin){
    document.getElementById("errorMessage").style.display = "block";
                                    console.log("User wird wieder ausgeloggt, weil er kein Admin ist");
                                handleSignOut();
                              }
                          
                    })
                    .catch((error) => {
                        console.error("Fehler beim Abrufen der Dokumente: ", error);
                    });




   

               


                // ...
            })
            .catch((error) => {
    document.getElementById("errorMessage").style.display = "block";

                const errorCode = error.code;
                const errorMessage = error.message;
                var errorText = document.getElementById('signin-error-message');
                console.log(errorMessage);
                errorText.innerHTML = errorMessage;

            });
    }



    function handleSignOut() {
        signOut(auth).then(() => {
            console.log('user signed out')
            // Sign-out successful.
        }).catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            // An error happened.
        });

    }




    onAuthStateChanged(auth, (user) => {
        let publicElements = document.querySelectorAll("[data-onlogin='hide']");
        let privateElements = document.querySelectorAll("[data-onlogin='show']");

        if (user) {
            // User is signed in, see docs for a list of available properties			

            const uid = user.uid;

            privateElements.forEach(function (element) {
                element.style.display = "initial";
            });

            publicElements.forEach(function (element) {
                element.style.display = "none";
            });

            console.log(`The current user's UID is equal to ${uid}`);
            // ...
        } else {
            // User is signed out
            publicElements.forEach(function (element) {
                element.style.display = "initial";
            });
            console.log(`User is logged out`);

            privateElements.forEach(function (element) {
                element.style.display = "none";
            });
        }
    });

