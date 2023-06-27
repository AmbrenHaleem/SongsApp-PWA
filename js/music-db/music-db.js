// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
/**
 * MusicDB Interface using Firebase Firestore
 */
class MusicDB {
  constructor() {
    this.storeName = 'SongList';
    this.isAvailable = false;
    this.db = null;
  }

  /**
   * Opens the database.
   */
  open() {
    return new Promise((resolve, reject) => {
      try {

        // Your web app's Firebase configuration
        // const firebaseConfig = {
        //   apiKey: "AIzaSyCNf4TL5HfQYnWBgwtmlRVakhxGhBgEfeg",
        //   authDomain: "games-app-5498c.firebaseapp.com",
        //   projectId: "games-app-5498c",
        //   storageBucket: "games-app-5498c.appspot.com",
        //   messagingSenderId: "17358048537",
        //   appId: "1:17358048537:web:f0fc4c7aa07d4b63aa4988"
        // };
        const firebaseConfig = {
            apiKey: "AIzaSyCHTWYhfK7ozTslX9WyzhkvWQvesLBsV0o",
            authDomain: "music-app-e015b.firebaseapp.com",
            projectId: "music-app-e015b",
            storageBucket: "music-app-e015b.appspot.com",
            messagingSenderId: "647763110692",
            appId: "1:647763110692:web:ec0e53952b7a093259e1b1"
          };
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Initialize Cloud Firestore and get a reference to the service
        this.db = getFirestore(app);
        if (this.db) {
          this.isAvailable = true;
          resolve();
        }
        else {
          reject('The database is not available.');
        }
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Adds a new song to the database.
   */
  add(title, artist, likes) {

    // Creates the song object to be added.
    const song = {
      title: title,
      artist: artist,
      likes: likes
    };

    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {
        // Connects to the Firebase collection.
        const dbCollection = collection(this.db, this.storeName);

        // Includes the new object to the collection.
        addDoc(dbCollection, song)
          .then(() => {
            resolve(song);
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
  * Retrieves a specific song.
  */
  get(id) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Get the document reference.
        const docRef = doc(this.db, this.storeName, id);

        // Retrives the document.
        getDoc(docRef)
          .then((docSnap) => {
            const data = docSnap.data();
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Retrieves all songs from the database.
   */
  getAll() {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Connects to the Firebase collection.
        const dbCollection = collection(this.db, this.storeName);

        // Gets the date form the collection.
        getDocs(dbCollection)
          .then((querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              result.push({
                ...data,
                id: doc.id
              });
            });

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });

      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Retrieves the songs based on a given genre.
   */
  getByTitle(title) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Connects to the Firebase collection.
        const dbCollection = collection(this.db, this.storeName);

        // Creates a query for the collection.
        const dbQuery = query(dbCollection, where('title', '==', title));

        // Gets the date from the query.
        getDocs(dbQuery)
          .then((querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              result.push({
                ...data,
                id: doc.id
              });
            });

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });

      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Updates an entry in the database.
   */
  update(updatedSong) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Get the document reference.
        const docRef = doc(this.db, this.storeName, updatedSong.id);

        // Updates the document.
        updateDoc(docRef, {
          likes: updatedSong.likes
        })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }

  /**
   * Removes an entry from the database.
   */
  delete(songId) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject('The database is not available.');
        return;
      }

      try {

        // Get the document reference.
        const docRef = doc(this.db, this.storeName, songId);

        // Deletes the document.
        deleteDoc(docRef)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
      catch (error) {
        reject(error.message);
      }
    });
  }
}

export default new MusicDB();
