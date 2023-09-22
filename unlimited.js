import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWhH4qYxVx2NWYUNnkY7rfviGEelwg7oQ",
  authDomain: "haushelper-12f14.firebaseapp.com",
  projectId: "haushelper-12f14",
  storageBucket: "haushelper-12f14.appspot.com",
  messagingSenderId: "945052022593",
  appId: "1:945052022593:web:e6889785d166df5e0653c0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let signUpForm = document.getElementById("signup-form");

function validateEmail(email) {
  const res = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return res.test(String(email).toLowerCase());
}

if (typeof signUpForm !== null) {
  signUpForm.addEventListener("submit", handleSignUp, true);
}

//handle signUp
function handleSignUp(e) {
  e.preventDefault();
  e.stopPropagation();

  const email = document.getElementById("iEmail").value;
  const password = document.getElementById("iPasswort").value;
  const password2 = document.getElementById("iPasswort2").value;

  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  if (!validateEmail(email)) {
    document.getElementById("emailError").style.height = "30px";
    document.getElementById("emailError").style.color = "red";
    return;
  } else {
    document.getElementById("emailError").style.height = "0px";
    document.getElementById("emailError").style.color = "transparent";
  }

  if (password != password2) {
    document.getElementById("passwordError").style.height = "30px";
    document.getElementById("passwordError").style.color = "red";

    document.getElementById("passwordError2").style.height = "30px";
    document.getElementById("passwordError2").style.color = "red";
    return;
  } else {
    document.getElementById("passwordError").style.height = "0px";
    document.getElementById("passwordError").style.color = "transparent";

    document.getElementById("passwordError2").style.height = "0px";
    document.getElementById("passwordError2").style.color = "transparent";
  }

  if (password.length >= 6) {
    document.getElementById("passwordError3").style.height = "0px";
    document.getElementById("passwordError3").style.color = "transparent";

    document.getElementById("passwordError4").style.height = "0px";
    document.getElementById("passwordError4").style.color = "transparent";
  } else {
    document.getElementById("passwordError3").style.height = "30px";
    document.getElementById("passwordError3").style.color = "red";

    document.getElementById("passwordError4").style.height = "30px";
    document.getElementById("passwordError4").style.color = "red";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in

      const user = userCredential.user;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          const clientReference = "cus_" + Date.now();
          const newDocumentData2 = {
            abo: "4",
            aboName: "Unlimited",
            facilityAvailable: "10000",
            facilityInit: "10000",
            purchased: new Date(),
            userAvailable: "10000",
            userInit: "10000",
            clientRef: clientReference,
          };

          const companiesDocRef = doc(
            collection(db, "Companies"),
            document.getElementById("iFirma").value
          );
          const docSnap = getDoc(companiesDocRef);

          getDoc(companiesDocRef).then((docSnap) => {
            if (docSnap.exists()) {
              document.getElementById("companyError").style.height = "30px";
              document.getElementById("companyError").style.color = "red";

              deleteUser(auth.currentUser)
                .then(() => {})
                .catch((error) => {});

              return;
            } else {
              document.getElementById("companyError").style.height = "0px";
              document.getElementById("companyError").style.color =
                "transparent";

              document.getElementById("successMessage1").style.width = "100%";
              document.getElementById("successText").style.color = "white";

              sendEmailVerification(auth.currentUser)
                .then(() => {})
                .catch((error) => {});

              setDoc(companiesDocRef, {});

              const newSubcollectionRef = collection(
                companiesDocRef,
                "Accesses"
              );

              addDoc(newSubcollectionRef, newDocumentData2);

              const newDocumentData = {
                company: document.getElementById("iFirma").value,
                email: document.getElementById("iEmail").value,
                name: document.getElementById("iName").value,
                //phone:document.getElementById('iPhone').value,
                surname: document.getElementById("iVorname").value,

                plz: document.getElementById("iPLZ").value,
                hausnummer: document.getElementById("iHausnummer").value,
                strasse: document.getElementById("iStrasse").value,
                ort: document.getElementById("iOrt").value,
              };

              const adminsRef = collection(db, "Admins");
              addDoc(adminsRef, newDocumentData);

              window.location.href =
                "https://buy.stripe.com/7sIbJD04J1v0fYsfZ0?client_reference_id=" +
                clientReference;
            }
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          var errorText = document.getElementById("signup-error-message");

          errorText.innerHTML = errorMessage;
        });
    })
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode === "auth/email-already-in-use") {
        document.getElementById("emailInUseError").style.height = "30px";
        document.getElementById("emailInUseError").style.color = "red";
      } else {
        document.getElementById("emailInUseError").style.height = "0px";
        document.getElementById("emailInUseError").style.color = "transparent";
      }
      return;
    });
}
