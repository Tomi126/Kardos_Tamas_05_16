const express = require('express');
const fs = require('fs'); //node.js modul, e segítségével lehet fájlokat kezelni (File System)
const app = express();

app.use(express.json());

const USERS_FILE = './users.json';
const RESET_FILE = './reset_users.json';



function readUsers() {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
}


function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}


// összes felhasználó listázása
app.get('/', (req, res) => {
    const users = readUsers();
    res.json(users);
});


// adott felhasználó lekérése
app.get('/users/:id', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id == req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'Felhasználó nem található' });
});


// új felhasználó hozzáadása 
app.post('/ujuser', (req, res) => {
    const users = readUsers();
    const newUser = req.body;
    if (!newUser.id) {
        return res.status(400).json({ message: 'Az id megadása kötelező!' });
    }
    if (users.find(u => u.id == newUser.id)) {
        return res.status(409).json({ message: 'Ez az id már létezik!' });
    }
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});


// felhasználó törlése
app.delete('/delete/:id', (req, res) => {
    let users = readUsers();
    const id = req.params.id;
    const userIndex = users.findIndex(u => u.id == id);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    const deleted = users.splice(userIndex, 1);
    writeUsers(users);
    res.json(deleted[0]);
});


// visszaállítás reset_users.json alapján
app.post('/reset', (req, res) => {
    const resetData = fs.readFileSync(RESET_FILE, 'utf-8');
    fs.writeFileSync(USERS_FILE, resetData);
    res.json({ message: 'Felhasználók visszaállítva' });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);
});
