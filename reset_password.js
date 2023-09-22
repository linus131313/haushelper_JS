
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js';
    import { getAuth, sendPasswordResetEmail} from 'https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js';



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

    let pwForm = document.getElementById('wf-form-pw-form');

    if (typeof (pwForm) !== null) {
        pwForm.addEventListener('submit', handleSendMailPassword, true)
    } else { };

    function handleSendMailPassword(e) {
        e.preventDefault();
        e.stopPropagation();

        const email = document.getElementById('forgot-email').value;
     sendPasswordResetEmail(auth,email)
        .then(() => {
          alert("Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.");
        })
        .catch((error) => {
          alert("Fehler beim Senden der E-Mail: " + error.message);
        });

}

