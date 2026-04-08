const BASE = "http://localhost:5000";

/* =========================
   DOM ELEMENTS
========================= */
const blockSelect = document.getElementById("blockSelect");
const floorSelect = document.getElementById("floorSelect");
const roomSelect = document.getElementById("roomSelect");
const bookingDate = document.getElementById("bookingDate");
const timeSlot = document.getElementById("timeSlot");
const historySection = document.getElementById("historySection");
const userNameInput = document.getElementById("userName");
const roleSelect = document.getElementById("roleSelect");

/* =========================
   INIT (ON PAGE LOAD)
========================= */
document.addEventListener("DOMContentLoaded", () => {

    // Only run if dashboard elements exist
    if (blockSelect && floorSelect) {
        generateBlocks();
        generateFloors();
        updateRooms();
        loadHistory();
    }
});

/* =========================
   LOGIN FUNCTION
========================= */
async function login(){
    const name = userNameInput.value;
    const role = roleSelect.value;

    const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name, role })
    });

    const user = await res.json();

    if(!user || !user.name){
        alert("Login failed!");
        return;
    }

    localStorage.setItem("userName", user.name);
    localStorage.setItem("role", user.role);

    if(user.role === "admin"){
        window.location.href = "admin.html";
    } else {
        window.location.href = "dashboard.html";
    }
}

/* =========================
   BLOCKS
========================= */
function generateBlocks(){
    blockSelect.innerHTML = "";
    ["A","B","C","D","E"].forEach(b=>{
        blockSelect.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

/* =========================
   FLOORS
========================= */
function generateFloors(){
    floorSelect.innerHTML = "";
    for(let i=1;i<=5;i++){
        floorSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
}

/* =========================
   ROOMS
========================= */
function updateRooms(){
    if(!blockSelect || !floorSelect || !roomSelect) return;

    roomSelect.innerHTML = "";

    let b = blockSelect.value;
    let f = floorSelect.value;

    for(let i=1;i<=10;i++){
        roomSelect.innerHTML += `<option value="${b}-${f}-${i}">
            ${b}-${f}-${i}
        </option>`;
    }
}

/* listeners */
if (blockSelect && floorSelect) {
    blockSelect.addEventListener("change", updateRooms);
    floorSelect.addEventListener("change", updateRooms);
}

/* =========================
   BOOK ROOM
========================= */
async function bookRoom(){
    const data = {
        block: blockSelect.value,
        floor: floorSelect.value,
        room: roomSelect.value,
        date: bookingDate.value,
        timeSlot: timeSlot.value,
        teacher: localStorage.getItem("userName") || "User"
    };

    const res = await fetch(`${BASE}/api/bookings/add`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });

    const result = await res.json();

    // ✅ ALERT (optional)
    alert(result.success ? "Booked Successfully!" : result.message);

    // ✅ STATUS MESSAGE (THIS IS WHAT YOU ASKED)
    document.getElementById("statusMessage").innerText = result.success
        ? "Booked Successfully!"
        : result.message;

    // reload history
    loadHistory();
}

/* =========================
   HISTORY
========================= */
async function loadHistory(){
    if(!historySection) return;

    const res = await fetch(`${BASE}/api/bookings`);
    const data = await res.json();

    historySection.innerHTML = data.map(b => `
        <div class="item">
            ${b.block}-${b.floor}-${b.room} | ${b.date} | ${b.timeSlot}
        </div>
    `).join("");
}

/* =========================
   LOGOUT
========================= */
function logout(){
    localStorage.clear();
    window.location.href = "login.html";
}