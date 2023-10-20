import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
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

//calendar task dictionary
var newEvents = {};

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
    .then(() => {})
    .catch((error) => {
      const errorMessage = error.message;
    });
}

let GForm = document.getElementById("geb_form");
let AForm = document.getElementById("task_form");

var companyName;

var mitarbeiter_List = document.getElementById("mitarbeiter_select");
var gebaude_List = document.getElementById("gebaude_select");
const gebaudeDictionary = {};

if (typeof GForm !== null) {
  GForm.addEventListener("submit", handleGForm, true);
}

if (typeof AForm !== null) {
  AForm.addEventListener("submit", handleAForm, true);
}

function handleGForm(e) {
  e.preventDefault();
  e.stopPropagation();

  const street = document.getElementById("str_geb").value;
  const plz = document.getElementById("plz_geb").value;
  const location = document.getElementById("standort_geb").value;

  const companiesDocRef = doc(collection(db, "Companies"), companyName);

  const newDocumentData2 = {
    address: street,
    city: location,
    zipcode: plz,
    counterelectricity: "0",
    countergas: "0",
    counterwater: "0",
    information: "[[]]",
  };

  const newSubcollectionRef = collection(companiesDocRef, "Buildings");
  addDoc(newSubcollectionRef, newDocumentData2);
}

function handleAForm(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("Aform");

  const titel_task = document.getElementById("titel_task").value;
  const beschreibung_task = document.getElementById("beschreibung_task").value;
  const time_task = document.getElementById("time_task").value;
  const time_end = document.getElementById("time_end").value;
  const checked = document.querySelector("input[type=radio]:checked").value;

  var mitarbeiterOption =
    mitarbeiter_List.options[mitarbeiter_List.selectedIndex].value;

  var gebaudeOption = gebaude_List.options[gebaude_List.selectedIndex].value;
  const house = gebaudeDictionary[gebaudeOption];
  const formatted_gebaude = house.address + "," + " (" + house.zipcode + ")";
  const companiesDocRef = doc(collection(db, "Companies"), companyName);

  const newSubcollectionRef = collection(companiesDocRef, "Tasks");
  if (checked == "einmalig") {
    const newDocumentData = {
      assignee: mitarbeiterOption,
      description: beschreibung_task,
      title: titel_task,
      issued: new Date(time_task),
      building: formatted_gebaude,
      buildingID: house.id,
      done: new Date("2000-01-01T01:00:00+01:00"),
      repeat: checked,
    };
    addDoc(newSubcollectionRef, newDocumentData);
  }
  if (checked == "täglich") {
    var currentDate = new Date(time_task);
    const endDate = new Date(time_end);

    while (currentDate <= endDate) {
      console.log(currentDate.toDateString());

      const newDocumentData = {
        assignee: mitarbeiterOption,
        description: beschreibung_task,
        title: titel_task,
        issued: new Date(currentDate),
        building: formatted_gebaude,
        buildingID: house.id,
        done: new Date("2000-01-01T01:00:00+01:00"),
        repeat: checked,
      };
      addDoc(newSubcollectionRef, newDocumentData);

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  if (checked == "wöchentlich") {
    var currentDate = new Date(time_task);
    const endDate = new Date(time_end);

    while (currentDate <= endDate) {
      console.log(currentDate.toDateString());

      const newDocumentData = {
        assignee: mitarbeiterOption,
        description: beschreibung_task,
        title: titel_task,
        issued: new Date(currentDate),
        building: formatted_gebaude,
        buildingID: house.id,
        done: new Date("2000-01-01T01:00:00+01:00"),
        repeat: checked,
      };
      addDoc(newSubcollectionRef, newDocumentData);
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }
  if (checked == "monatlich") {
    var currentDate = new Date(time_task);
    const endDate = new Date(time_end);

    while (currentDate <= endDate) {
      console.log(currentDate.toDateString());

      const newDocumentData = {
        assignee: mitarbeiterOption,
        description: beschreibung_task,
        title: titel_task,
        issued: new Date(currentDate),
        building: formatted_gebaude,
        buildingID: house.id,
        done: new Date("2000-01-01T01:00:00+01:00"),
        repeat: checked,
      };
      addDoc(newSubcollectionRef, newDocumentData);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
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
            companyName = docx.data().company;
            document.getElementById("firma").innerHTML = docx.data().company;
            document.getElementById("vornameProfil").innerHTML =
              docx.data().surname;
            document.getElementById("nachnameProfil").innerHTML =
              docx.data().name;
            document.getElementById("emailProfil").innerHTML =
              docx.data().email;

            const companiesRef = collection(db, "Companies");
            const companyDoc = doc(companiesRef, docx.data().company);
            const userCollections = collection(companyDoc, "Users");
            const facilityCollections = collection(companyDoc, "Buildings");

            //Tasks für Kalender anlegen
            const taskCollection = collection(companyDoc, "Tasks");
            getDocs(taskCollection)
              .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                  querySnapshot.forEach((taskdoc) => {
                    newEvents[taskdoc.id] = {
                      "worker": taskdoc.data().assignee,
                      "title": taskdoc.data().title,
                      "description": taskdoc.data().description,
                      "start": taskdoc.data().issued,
                      "end": taskdoc.data().issued,
                      "repeat": taskdoc.data().repeat,
                      "done": taskdoc.data().done,
                      "building": taskdoc.data().building,
                      "buildingID": taskdoc.data().buildingID,
                    };
                  });

                  console.log(newEvents);
                  renderCalendar(newEvents);
                }
              })
              .catch((error) => {
                console.log(error.message);
              });

            getDocs(facilityCollections)
              .then((querySnapshot) => {
                const userList = document.querySelector("#facilityList");
                var once = true;
                var buttonContainer =
                  document.getElementById("button-container");
                querySnapshot.forEach((docz) => {
                  var opt3 = document.createElement("option");
                  const addressString =
                    docz.data().address +
                    ", " +
                    docz.data().zipcode +
                    " " +
                    docz.data().city;
                  opt3.text = addressString;
                  gebaude_List.appendChild(opt3);

                  const subDictionary = {
                    address: docz.data().address,
                    zipcode: docz.data().zipcode,
                    city: docz.data().city,
                    id: docz.id,
                  };

                  gebaudeDictionary[addressString] = subDictionary;

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
                                .then(() => {})
                                .catch((error) => {});
                            }
                          })
                          .catch((error) => {});

                        const storageRef = ref(
                          storage,
                          filePath + "/" + file.name
                        );
                        uploadBytes(storageRef, file);
                        location.reload();
                      } catch (error) {}
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
                      const address = `${docz.data().address}, (${
                        docz.data().zipcode
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
                    .catch((error) => {});
                  userInput.appendChild(defaultOption);

                  getDocs(userCollections)
                    .then((querySnapshot) => {
                      querySnapshot.forEach((docUsers) => {
                        var opt = document.createElement("option");
                        opt.text = docUsers.data().email;
                        userInput.appendChild(opt);

                        if (once) {
                          var opt2 = document.createElement("option");
                          opt2.text = docUsers.data().email;
                          mitarbeiter_List.appendChild(opt2);
                        }

                        // mitarbeiter_List.appendChild(opt);
                      });
                    })
                    .catch((error) => {})
                    .finally(() => (once = false));

                  userInput.addEventListener("change", function () {
                    var selectedOption =
                      userInput.options[userInput.selectedIndex].value;
                    getDocs(accessCollection)
                      .then((querySnapshot) => {
                        const firstDocument = querySnapshot.docs[0];
                        const existingData = firstDocument.data();
                        const address = `${docz.data().address}, (${
                          docz.data().zipcode
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
                            .then((firstDocument) => {})
                            .catch((error) => {});
                        } else {
                        }
                      })
                      .catch((error) => {});
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
              .catch((error) => {});
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
              .catch((error) => {});
            getDocs(userCollections)
              .then((querySnapshot) => {
                const userList = document.querySelector("#userList");
                querySnapshot.forEach((docw) => {
                  const listItem = document.createElement("li");
                  listItem.textContent = docw.data().name;
                  userList.appendChild(listItem);
                });
              })
              .catch((error) => {});
          } else {
          }
        });
      })
      .catch((error) => {});
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

function renderCalendar(events) {
  
  console.log("Rendering: " + events);
  document.addEventListener("DOMContentLoaded", function () {
    var eventList = [];
    for (let id in events) {
      eventList.push({
        title: events[id]["title"],
        id: id,
        backgroundColor: "orange",
        borderColor: "white",
        start: events[id]["start"],
        end: events[id]["end"],
        allDay: false,
      });
    }
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "timeGridWeek",
      nowIndicator: true,
      eventLimit: true,
      views: {
        agenda: {
          eventLimit: 4,
        },
      },

      allDayText: "Ganztägig",
      initialDate: new Date(),
      locale: "de",
      events: eventList,

      buttonText: {
        today: "Heute",
        month: "Monat",
        week: "Woche",
        day: "Tag",
      },
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      timeFormat: "h:mm",
      eventClick: function (c, jsEvent, view) {
        //c.id
        console.log(c);
      },
    });
    calendar.render();
  });
}
