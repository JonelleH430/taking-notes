let noteTitle;
let noteText;
let noteIdCounter = 1;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let localNotes;


if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

const deleteLocalNote = (id) => {
  localNotes.splice(id -1, 1);
}

const saveLocalNote = (note) => {
  localNotes.push(note);
}


const show = elem => {
  elem.style.display = 'inline';
};


const hide = elem => {
  elem.style.display = 'none';
};


let activeNote = {};

async function getNotes() {
  const response = await fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response;
}

async function saveNote(note) {

  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
  return response
}

async function deleteNote(id) {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response
}

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote)
  saveLocalNote(newNote)
  renderNoteList()
  renderActiveNote()

};


const handleNoteDelete = e => {
  
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId)
  deleteLocalNote(noteId)
  renderNoteList();
  renderActiveNote();

};


const handleNoteView = e => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};


const handleNewNoteView = e => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};


const renderNoteList = async () => {
  noteIdCounter = 1;
  if (!localNotes) {
    localNotes = await getNotes().then(notes => notes.json().then(jsonNotes => jsonNotes))
  }

  if (window.location.pathname === '/notes') {
    noteList.forEach(el => (el.innerHTML = ''));
  }

  let noteListItems = [];

  
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (localNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  localNotes.forEach(note => {
    
    note.id = noteIdCounter;
    noteIdCounter++;
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach(note => noteList[0].append(note));
  }
};


const getAndRenderNotes = () => getNotes().then(renderNoteList)




if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

renderNoteList();