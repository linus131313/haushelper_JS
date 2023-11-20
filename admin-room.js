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

var newEvents = {};
var workerColors={};

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

var mitarbeiter_Calender_Select = document.getElementById("worker_cal_select");
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
    getDocs(adminsRef).then((querySnapshot) => {
      querySnapshot.forEach((docx) => {
        if (docx.data().email === user.email) {
          document.getElementById("user_name").innerHTML = docx.data().surname;
          document.getElementById("user_email").innerHTML = docx.data().email;
          companyName = docx.data().company;
          document.getElementById("firma").innerHTML = docx.data().company;
          document.getElementById("vornameProfil").innerHTML =
            docx.data().surname;
          document.getElementById("nachnameProfil").innerHTML =
            docx.data().name;
          document.getElementById("emailProfil").innerHTML = docx.data().email;

          const companiesRef = collection(db, "Companies");
          const companyDoc = doc(companiesRef, docx.data().company);
          const userCollections = collection(companyDoc, "Users");
          const facilityCollections = collection(companyDoc, "Buildings");

          const taskCollection = collection(companyDoc, "Tasks");
          getDocs(taskCollection).then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((taskdoc) => {
                
const { bgColor, textColor } = getRandomColor(taskdoc.data().assignee);

                newEvents[taskdoc.id] = {
                  worker: taskdoc.data().assignee,
                  title: taskdoc.data().title,
                  description: taskdoc.data().description,
                  start: taskdoc.data().issued,
                  end: taskdoc.data().issued,
                  repeat: taskdoc.data().repeat,
                  done: taskdoc.data().done,
                  building: taskdoc.data().building,
                  buildingID: taskdoc.data().buildingID,
                  backgroudColor: bgColor,
                  textColor:  textColor,
                };
              });

              // renderCalendar(newEvents);
            }
          });

          getDocs(facilityCollections).then((querySnapshot) => {
            const userList = document.querySelector("#facilityList");
            var once = true;
            var buttonContainer = document.getElementById("button-container");
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
                    getFirstFileNameInFolder(filePath).then(
                      ({ fileName, modifiedDate }) => {
                        if (fileName) {
                          const desertRef = ref(
                            storage,
                            filePath + "/" + fileName
                          );
                          deleteObject(desertRef).then(() => {});
                        }
                      }
                    );

                    const storageRef = ref(storage, filePath + "/" + file.name);
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
              getDocs(accessCollection).then((querySnapshot) => {
                const firstDocument = querySnapshot.docs[0];
                const existingData = firstDocument.data();
                const address = `${docz.data().address}, (${
                  docz.data().zipcode
                })`;
                if (!querySnapshot.empty) {
                  if (existingData.employeeCalendar[address] != undefined) {
                    defaultOption.text = existingData.employeeCalendar[address];
                  }
                }
              });
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
                      var opt3 = document.createElement("option");
                      opt3.text = docUsers.data().email;                   

                      mitarbeiter_Calender_Select.appendChild(opt2);
                      mitarbeiter_List.appendChild(opt3);
                    }

                    // mitarbeiter_List.appendChild(opt);
                  });
                })
                .catch((error) => {})
                .finally(() => (once = false));

              userInput.addEventListener("change", function () {
                var selectedOption =
                  userInput.options[userInput.selectedIndex].value;
                getDocs(accessCollection).then((querySnapshot) => {
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
                    updateDoc(firstDocument.ref, newData).then(
                      (firstDocument) => {}
                    );
                  } else {
                  }
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
          });
          const companyCollections = collection(companyDoc, "Accesses");
          getDocs(companyCollections).then((querySnapshot) => {
            querySnapshot.forEach((docy) => {
              const dte = new Date(docy.data().canceled * 1000);
              var status = "Aktiv";
              if (dte instanceof Date && !isNaN(dte)) {
                status = "Gekündigt bis zum " + dte.toLocaleString("de-DE");
              }
              document.getElementById("status").innerHTML = status;
              document.getElementById("abo").innerHTML = docy.data().aboName;

              if (docy.data().aboName == "Testpaket") {
                document.getElementById("aboButton").innerHTML = "Upgrade";
                document
                  .getElementById("aboButton")
                  .addEventListener("click", () => {
                    const link = document.getElementById("aboButton");
                    link.href = "https://www.haushelper.de/upgrade-testpaket";
                  });
              }

              document.getElementById("mitarbeiterX").innerHTML =
                docy.data().userAvailable;
              document.getElementById("mitarbeiterY").innerHTML =
                docy.data().userInit;
              // document.getElementById("gebaudeX").innerHTML =
              //   docy.data().facilityAvailable;
              // document.getElementById("gebaudeY").innerHTML =
              //   docy.data().facilityInit;
              const timestamp_purchased = docy.data().purchased;
              const date = new Date(timestamp_purchased.seconds * 1000);
              const dateString = date.toLocaleDateString();
              document.getElementById("date").innerHTML = dateString;
            });
          });
          getDocs(userCollections).then((querySnapshot) => {
            const userList = document.querySelector("#userList");
            querySnapshot.forEach((docw) => {
              const listItem = document.createElement("li");
              listItem.textContent = docw.data().name;
              userList.appendChild(listItem);
            });
          });
        }
      });
    });
    //const uid = user.uid;
    // privateElements.forEach(function (element) {
    //   element.style.display = "initial";
    // });
    // publicElements.forEach(function (element) {
    //   element.style.display = "none";
    // });
  } else {
    window.location.href = "/login";
    // publicElements.forEach(function (element) {
    //   element.style.display = "initial";
    // });
    // privateElements.forEach(function (element) {
    //   element.style.display = "none";
    // });
  }
});


document.getElementById('calendar-tab').addEventListener('click', function () {
  console.log("Klick");
  setTimeout(function () {
    renderCalendar(newEvents);
  }, 500);

});

document.getElementById('aufgaben-tab').addEventListener('click', function () {
  console.log("Klick");
  setTimeout(function () {
    renderCalendar(newEvents);
  }, 500);

});



function renderCalendar(events) {
  let eventList = [];

  for (let id in events) {
    eventList.push({
      title: events[id]["title"],
      id: id,
      
      backgroundColor: events[id]["backgroudColor"],
      borderColor: "white",
      textColor: events[id]["textColor"],
      start: new Date(
        events[id].start.seconds * 1000 + events[id].start.nanoseconds / 1e6
      ),
      end: new Date(
        events[id].start.seconds * 1000 + events[id].start.nanoseconds / 1e6
      ),
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
      const idC = c.el.fcSeg.eventRange.def.publicId;

      const popup = document.getElementById("kalender_popup");
      const taskTitle = events[idC].title;
      const taskDescription = events[idC].description;
      const taskDueDate = events[idC].start;
      const taskWorker = events[idC].worker;
      const taskBuilding = events[idC].building;
      const taskRepeat = events[idC].repeat;
      const taskDone = new Date(events[idC].done.seconds * 1000);
      const january1st2010 = new Date("2010-01-01T00:00:00Z");
      const resultDone =
        taskDone > january1st2010
          ? "Ja, am " + taskDone.toLocaleString()
          : "Nein, noch nicht erledigt.";

      document.getElementById("popup_title").textContent = taskTitle;
      document.getElementById("popup_description").textContent =
        taskDescription;
      document.getElementById("popup_time").textContent = new Date(
        taskDueDate.seconds * 1000
      ).toLocaleString();
      document.getElementById("popup_worker").textContent = taskWorker;
      document.getElementById("popup_done").textContent = resultDone;
      document.getElementById("popup_building").textContent = taskBuilding;
      document.getElementById("popup_repeat").textContent = taskRepeat;

      popup.style.display = "flex";
      popup.style.alignItems = "center";
      popup.style.justifyContent = "center";
    },
  });

  calendar.render();
}

document.getElementById("close_popup").addEventListener("click", function () {
  const popup = document.getElementById("kalender_popup");
  popup.style.display = "none";
});

mitarbeiter_Calender_Select.addEventListener("change", function () {
  const selectedValue = mitarbeiter_Calender_Select.value;
  if (selectedValue == "cal_all") {

    renderCalendar(newEvents);
  } else {
    let workerList = {};



    for (const key in newEvents) {
      const item = newEvents[key];
      if (item.worker === selectedValue) {
        const { bgColor, textColor } = getRandomColor(item.worker);
  
        workerList[key] = {
          backgroundColor: bgColor,
          textColor: textColor,
          worker: selectedValue,
          title: newEvents[key].title,
          description: newEvents[key].description,
          start: newEvents[key].start,
          end: newEvents[key].end,
          repeat: newEvents[key].repeat,
          done: newEvents[key].done,
          building: newEvents[key].building,
          buildingID: newEvents[key].buildingID,
        };
      }
    }
    renderCalendar(workerList);
  }
});


function getRandomColor(worker) {
  if (workerColors.hasOwnProperty(worker)) {
    return workerColors[worker];
  }

  const randomHue = Math.floor(Math.random() * 360); 
  const saturation = 70 + Math.random() * 10; 
  const lightness = 50 + Math.random() * 10; 
  const bgColor = `hsl(${randomHue}, ${saturation}%, ${lightness}%)`;
  const textColor = lightness > 60 ? "#000000" : "#ffffff";

  workerColors[worker]={bgColor,textColor};

  return { bgColor, textColor };
  
}
