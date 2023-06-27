import musicDb from './music-db/music-db.js';

const listId = "listSongs";
//const songs = [];

const buttonRef = document.getElementById("add-button");

// Creates a div for outputting messages to the user.
const form = document.getElementById('song-add-form');

// Opens the database.
musicDb.open()
  .then(() => {
    document.getElementById('add-button').disabled = false;
    musicDb.getAll()
    .then((results) => {
      results.forEach(result => {
        displayItemInList(result, listId)
      });
    })
  })
  .catch((error) => {

    // Display the error message.
    const ribbon = document.createElement('div');
    ribbon.className = 'error-ribbon';
    ribbon.innerText = error;
    //const header = document.getElementsByTagName('header')[0];
    const header = document.getElementsByClassName('header');
    header.appendChild(ribbon);
  });

buttonRef.addEventListener("click", function() {
    
    var messageDiv = (document.getElementById("message-div"));
    if (messageDiv){
        messageDiv.remove();
    }
    const title = document.getElementById("song-title").value;
    const artist = document.getElementById("song-artist").value;
    const likes = 0;
    // Validates the user input.
    const invalidMessages = [];
    if (!title) {
      invalidMessages.push('The title field is required.');
    }

    if (!artist) {
      invalidMessages.push('The artist field is required.');
    }

    if (invalidMessages.length > 0) {
        
        const description = invalidMessages.join('<br>');
        displayFailureMessage('Invalid data!', description);
        return;
    }
    document.getElementById(listId).innerHTML = '';
      // Adds the song to the database.
    musicDb.add(title, artist, likes)
    .then((song) => {
      displaySuccessMessage('Song added successfully!');
       musicDb.getAll()
       .then((results) => {
         results.forEach(result => {
          displayItemInList(result, listId)
         });
       })
      // Clears the user input.
      clearControls();
    })
    .catch((error) => {
      displayFailureMessage('Failed to add song!', error);
    });
    
}, false);

/**
 * Displays a successful message.
 */
function displaySuccessMessage(message) {
  var messageOutput = document.createElement('div');
  messageOutput.id = "message-div";
  form.insertBefore(messageOutput, form.firstChild);
  messageOutput.innerHTML = `
    <div class='song-add-success'>
      ${message}
    </div>
  `;
}
/**
 * Displays an error message.
 */
function displayFailureMessage(message, description) {
  var messageOutput = document.createElement('div');
  messageOutput.id = "message-div";
  form.insertBefore(messageOutput, form.firstChild);
  messageOutput.innerHTML = `
    <div class='song-failure'>
      ${message}
      <span>${description}</span>
    </div>
  `;
}
/**
 * Clear controls
 */
function clearControls(){
  document.getElementById("song-title").value = "";
  document.getElementById("song-artist").value = "";
}

// function displaySuccessMessage(message) {
//   messageOutput.innerHTML = `
//     <div class='song-add-success'>
//       ${message}
//     </div>
//   `;
// }

/**
 * Displays an error message.
 */
// function displayFailureMessage(message, description) {
//   messageOutput.innerHTML = `
//     <div class='song-failure'>
//       ${message}
//       <span>${description}</span>
//     </div>
//   `;
// }

// region Helper Functions for Song
function displayItemInList(song, listId) {
    const itemNode = document.createElement('li');

    //create title, likes parent div
    var titleWithLikesNode = document.createElement('div');
    titleWithLikesNode.className = "titleLikesDiv";

    //create title div
    var nameNode = document.createElement('div');
    nameNode.className = "titleDiv";
    nameNode.appendChild(document.createTextNode(song.title));

    //create likes div
    var span = document.createElement('span');
    span.style = 'font-size: 1.6rem;';
    span.innerHTML = song.likes;
    var likesNode = document.createElement('div');
    likesNode.className = "likesDiv";
    likesNode.appendChild(document.createTextNode( `Likes : `));
    likesNode.appendChild(span);

    titleWithLikesNode.appendChild(nameNode);
    titleWithLikesNode.appendChild(likesNode);

    itemNode.appendChild(titleWithLikesNode);
    //create delete and update buttons div
    var buttonsNode = document.createElement('div');
    buttonsNode.className = "buttonsDiv";
    renderRemoveButton(song, buttonsNode, itemNode);
    renderUpdateLikesButton(song, buttonsNode, span);
    itemNode.appendChild(buttonsNode);

    var artistNode = document.createElement('div');
    artistNode.className = "artistDiv";
    artistNode.appendChild(document.createTextNode(song.artist));
    
    nameNode.appendChild(artistNode);

    document.getElementById(listId).appendChild(itemNode);
}
// endregion

/**
 * Renders the Update like button.
 */
function renderUpdateLikesButton(song, elemSong, elemLikesLabel) {
  const buttonUpdate = document.createElement('button');
  buttonUpdate.innerText = '+1 Like';
  buttonUpdate.className = 'update';
  elemSong.append(buttonUpdate);

  buttonUpdate.addEventListener('click', () => {
    song.likes = song.likes + 1;

    musicDb.update(song)
      .then(() => {
        elemLikesLabel.innerText = song.likes ;
      })
      .catch((error) => {
        displayFailureMessage('Failed to update', error);
      });
  });
}

/**
 * Renders the Remove button.
 */
function renderRemoveButton(song, elemSong, elemList) {
  const buttonRemove = document.createElement('button');
  buttonRemove.innerText = 'Remove';
  buttonRemove.className = 'remove';
  elemSong.append(buttonRemove);

  buttonRemove.addEventListener('click', () => {
    musicDb.delete(song.id)
      .then(() => {
        elemList.remove();
      })
      .catch((error) => {
        displayFailureMessage('Failed to remove', error);
      });
  });
}

//region Service worker registration

//console.log('navigator',navigator)
if ('serviceWorker' in navigator){
  navigator.serviceWorker.register('/service-worker.js', { scope : '/'})
    .then(function(registration){
      //  console.log('Register Success : ' , registration)
    })
    .catch(function(error){
      console.log('Registration Failed : ', error)
    })
}
else{
    console.log('Service workers are not supported.')
}

//end region

// /**
//  * Load Posts
//  */
// function loadPosts(){
//   fetch('https://jsonplaceholder.typicode.com/posts')
//   .then(response => response.json())
//   .then(json => renderPosts(json));
// }

// /**
//  * Render loaded posts 
//  */
// function renderPosts(posts)
// {
//   const output = document.getElementById('post-output')
//   output.innerHTML = '';

//   const topPosts= posts.slice(0,10);
//   topPosts.forEach(post => {
//       output.innerHTML += `
//       <div class = 'post-item'>
//       <h3>${post.title}<h3>
//       <div class = 'text'> ${post.body}
//       </div>
//       `;
//   });
// }
// /**
//  * Display a message when offline
//  */
// function renderOffline(){
//   const output = document.getElementById('post-output');
//   output.innerHTML = `
//     <div class = 'offline-message'>
//     <h3>No internet connection</h3>
//     <p>Please, check your connection and try again later.</p>
//     </div>`
//     ;
// }
window.addEventListener('online',function(){
  console.log('You are online!');
  //renderPosts();
})

window.addEventListener('offline',function(){
  console.log('Oh no, you lost your connection.');
  //renderOffline();
})