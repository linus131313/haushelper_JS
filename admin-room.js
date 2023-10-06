import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  limit,
  query,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  deleteObject,
  listAll,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js";

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
const storage = getStorage(app);

let signOutButton = document.getElementById("signout-button");

if (typeof signOutButton !== null) {
  signOutButton.addEventListener("click", handleSignOut);
} else {
}

async function getFirstFileNameInFolder(folderPath) {
  try {
    const folderRef = ref(storage, folderPath);
    const { items } = await listAll(folderRef);

    if (items && items.length > 0) {
      const firstFileRef = items[0];
      const firstFileName = firstFileRef.name;
      const firstFileMetadata = await getMetadata(firstFileRef);
      const firstFileModifiedTimestamp = firstFileMetadata.updated;
      const formattedModifiedDate = new Date(
        firstFileModifiedTimestamp
      ).toLocaleString("de-DE");
      return { fileName: firstFileName, modifiedDate: formattedModifiedDate };
    } else {
      return null;
    }
  } catch (error) {

    throw error;
  }
}
function handleSignOut() {
  signOut(auth)
    .then(() => { })
    .catch((error) => {
      const errorMessage = error.message;
    });
}


let signUpForm = document.getElementById("geb_form");



if (typeof signUpForm !== null) {
  signUpForm.addEventListener("submit", handleForm, true);
} 

function handleForm(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("form");
}

onAuthStateChanged(auth, (user) => {
  let publicElements = document.querySelectorAll("[data-onlogin='hide']");
  let privateElements = document.querySelectorAll("[data-onlogin='show']");
  if (user) {
    const adminsRef = collection(db, "Admins");
    getDocs(adminsRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((docx) => {
          if (docx.data().email === user.email) {
            document.getElementById("user_name").innerHTML =
              docx.data().surname;
            document.getElementById("user_email").innerHTML = docx.data().email;
            document.getElementById("firma").innerHTML = docx.data().company;
            document.getElementById("vornameProfil").innerHTML =
              docx.data().surname;
            document.getElementById("nachnameProfil").innerHTML =
              docx.data().name;
            document.getElementById("emailProfil").innerHTML =
              docx.data().email;
            //document.getElementById("telProfil").innerHTML = docx.data().phone;
            const companiesRef = collection(db, "Companies");
            const companyDoc = doc(companiesRef, docx.data().company);
            const userCollections = collection(companyDoc, "Users");
            const facilityCollections = collection(companyDoc, "Buildings");
            getDocs(facilityCollections)
              .then((querySnapshot) => {
                const userList = document.querySelector("#facilityList");
                var buttonContainer =
                  document.getElementById("button-container");
                querySnapshot.forEach((docz) => {
                  var button = document.createElement("button");
                  button.textContent =
                    docz.data().address +
                    ", " +
                    docz.data().zipcode +
                    " " +
                    docz.data().city +
                    "  ";
                  const filePath =
                    docx.data().company +
                    "/" +
                    docz.data().address +
                    ", (" +
                    docz.data().zipcode +
                    ")/Calendar";

                  var fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = ".ics";

                  const label = document.createElement("label");
                  const label2 = document.createElement("label");

                  getFirstFileNameInFolder(filePath)
                    .then(({ fileName, modifiedDate }) => {
                      if (fileName) {
                        label.textContent = fileName;
                        label2.textContent = "  Vom: " + modifiedDate;
                      } else {
                        label.textContent = "Kein Abfuhrplan hochgeladen.";
                      }
                    })
                    .catch((error) => {
                      label.textContent = "Kein Abfuhrplan hochgeladen.";
                    });
                  fileInput.addEventListener("change", function () {
                    var file = fileInput.files[0];
                    if (file.type !== "text/calendar") {
                      alert("Bitte laden Sie nur .ics-Dateien hoch!");
                      fileInput.value = "";
                    } else {
                      try {
                        getFirstFileNameInFolder(filePath)
                          .then(({ fileName, modifiedDate }) => {
                            if (fileName) {
                              const desertRef = ref(
                                storage,
                                filePath + "/" + fileName
                              );
                              deleteObject(desertRef)
                                .then(() => { })
                                .catch((error) => { });
                            }
                          })
                          .catch((error) => { });

                        const storageRef = ref(
                          storage,
                          filePath + "/" + file.name
                        );
                        uploadBytes(storageRef, file);
                        location.reload();
                      } catch (error) { }
                    }
                  });

                  const inputWrapper = document.createElement("div");
                  inputWrapper.classList.add("input-wrapper");
                  inputWrapper.appendChild(fileInput);
                  inputWrapper.appendChild(label);
                  inputWrapper.appendChild(label2);
                  button.appendChild(inputWrapper);

                  var userInput = document.createElement("select");
                  var defaultOption = document.createElement("option");
                  defaultOption.text = "Mitarbeiter auswählen";
                  defaultOption.disabled = true;
                  defaultOption.selected = true;
                  const accessCollection = collection(companyDoc, "Accesses");
                  getDocs(accessCollection)
                    .then((querySnapshot) => {
                      const firstDocument = querySnapshot.docs[0];
                      const existingData = firstDocument.data();
                      const address = `${docz.data().address}, (${docz.data().zipcode
                        })`;
                      if (!querySnapshot.empty) {
                        if (
                          existingData.employeeCalendar[address] != undefined
                        ) {
                          defaultOption.text =
                            existingData.employeeCalendar[address];
                        }
                      }
                    })
                    .catch((error) => { });
                  userInput.appendChild(defaultOption);
                  getDocs(userCollections)
                    .then((querySnapshot) => {
                      querySnapshot.forEach((docUsers) => {
                        var opt = document.createElement("option");
                        opt.text = docUsers.data().email;
                        userInput.appendChild(opt);
                      });
                    })
                    .catch((error) => { });
                  userInput.addEventListener("change", function () {
                    var selectedOption =
                      userInput.options[userInput.selectedIndex].value;
                    getDocs(accessCollection)
                      .then((querySnapshot) => {
                        const firstDocument = querySnapshot.docs[0];
                        const existingData = firstDocument.data();
                        const address = `${docz.data().address}, (${docz.data().zipcode
                          })`;
                        if (!querySnapshot.empty) {
                          const newData = {
                            ...existingData,
                            employeeCalendar: {
                              ...existingData.employeeCalendar,
                              [address]: selectedOption,
                            },
                          };
                          updateDoc(firstDocument.ref, newData)
                            .then((firstDocument) => { })
                            .catch((error) => {

                            });
                        } else {

                        }
                      })
                      .catch((error) => {

                      });
                  });
                  button.appendChild(userInput);
                  buttonContainer.appendChild(button);
                  const listItem = document.createElement("li");
                  listItem.textContent =
                    docz.data().address +
                    ", " +
                    docz.data().zipcode +
                    " " +
                    docz.data().city;
                  userList.appendChild(listItem);
                });
              })
              .catch((error) => { });
            const companyCollections = collection(companyDoc, "Accesses");
            getDocs(companyCollections)
              .then((querySnapshot) => {
                querySnapshot.forEach((docy) => {
                  const dte = new Date(docy.data().canceled * 1000);
                  var status = "Aktiv";
                  if (dte instanceof Date && !isNaN(dte)) {
                    status = "Gekündigt bis zum " + dte.toLocaleString("de-DE");
                  }
                  document.getElementById("status").innerHTML = status;
                  document.getElementById("abo").innerHTML =
                    docy.data().aboName;

                  if (docy.data().aboName == "Testpaket") {
                    document.getElementById("aboButton").innerHTML = "Upgrade";
                    document
                      .getElementById("aboButton")
                      .addEventListener("click", () => {
                        const link = document.getElementById("aboButton");
                        link.href =
                          "https://www.haushelper.de/upgrade-testpaket";
                      });
                  }

                  document.getElementById("mitarbeiterX").innerHTML =
                    docy.data().userAvailable;
                  document.getElementById("mitarbeiterY").innerHTML =
                    docy.data().userInit;
                  document.getElementById("gebaudeX").innerHTML =
                    docy.data().facilityAvailable;
                  document.getElementById("gebaudeY").innerHTML =
                    docy.data().facilityInit;
                  const timestamp_purchased = docy.data().purchased;
                  const date = new Date(timestamp_purchased.seconds * 1000);
                  const dateString = date.toLocaleDateString();
                  document.getElementById("date").innerHTML = dateString;
                });
              })
              .catch((error) => {

              });
            getDocs(userCollections)
              .then((querySnapshot) => {
                const userList = document.querySelector("#userList");
                querySnapshot.forEach((docw) => {
                  const listItem = document.createElement("li");
                  listItem.textContent = docw.data().name;
                  userList.appendChild(listItem);
                });
              })
              .catch((error) => {

              });
          } else {
          }
        });
      })
      .catch((error) => {

      });
    const uid = user.uid;
    privateElements.forEach(function (element) {
      element.style.display = "initial";
    });
    publicElements.forEach(function (element) {
      element.style.display = "none";
    });
  } else {
    window.location.href = "/login";
    publicElements.forEach(function (element) {
      element.style.display = "initial";
    });
    privateElements.forEach(function (element) {
      element.style.display = "none";
    });
  }
});
