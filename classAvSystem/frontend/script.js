const BASE = "http://localhost:5001";

// ============================
// INIT (PAGE BASED)
// ============================
document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname;

    // ✅ LOGIN PAGE AUTO REDIRECT FIX
    if (path.includes("login.html")) {
        const role = localStorage.getItem("role");

        if (role === "admin") {
            window.location.href = "admin.html";
        } else if (role === "teacher") {
            window.location.href = "dashboard.html";
        }
    }

    // ✅ DASHBOARD PAGE INIT
    if (path.includes("dashboard.html")) {
        generateBlocks();
        generateFloors();
        updateRooms();
        loadHistory();
    }

    // ✅ ADMIN PAGE INIT
    if (path.includes("admin.html")) {
        loadAdmin();
    }
});


// ============================
// LOGIN
// ============================
function login(){
    const name = document.getElementById("userName").value;
    const role = document.getElementById("roleSelect").value;

    if(!name){
        alert("Enter name");
        return;
    }

    // ✅ clear old data first (IMPORTANT FIX)
    localStorage.clear();

    localStorage.setItem("name", name);
    localStorage.setItem("role", role);

    if(role === "admin"){
        window.location.href = "admin.html";
    } else {
        window.location.href = "dashboard.html";
    }
}


// ============================
// BLOCKS
// ============================
function generateBlocks(){
    const b = document.getElementById("blockSelect");
    if(!b) return;

    b.innerHTML = "";
    ["P","R","H","A","U"].forEach(x=>{
        b.innerHTML += `<option value="${x}">${x}</option>`;
    });
}


// ============================
// FLOORS
// ============================
function generateFloors(){
    const f = document.getElementById("floorSelect");
    if(!f) return;

    f.innerHTML = "";
    for(let i=1;i<=5;i++){
        f.innerHTML += `<option value="${i}">${i}</option>`;
    }
}


// ============================
// ROOMS
// ============================
function updateRooms(){
    const r = document.getElementById("roomSelect");
    const b = document.getElementById("blockSelect");
    const f = document.getElementById("floorSelect");

    if(!r || !b || !f) return;

    r.innerHTML="";
    for(let i=1;i<=10;i++){
        r.innerHTML += `<option value="${b.value}-${f.value}-${i}">
            ${b.value}-${f.value}-${i}
        </option>`;
    }
}


// ============================
// CHANGE LISTENER
// ============================
document.addEventListener("change", (e)=>{
    if(e.target.id === "blockSelect" || e.target.id === "floorSelect"){
        updateRooms();
    }
});


// ============================
// BOOK ROOM
// ============================
async function bookRoom(){

    const data = {
        block: document.getElementById("blockSelect").value,
        floor: document.getElementById("floorSelect").value,
        room: document.getElementById("roomSelect").value,
        date: document.getElementById("bookingDate").value,
        timeSlot: document.getElementById("timeSlot").value,
        teacher: localStorage.getItem("name")
    };

    if(!data.date){
        alert("Select date");
        return;
    }

    try {
        const res = await fetch(`${BASE}/api/bookings/add`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });

        const result = await res.json();

        alert(result.success ? "✅ Booked Successfully" : result.message);

        loadHistory();

    } catch (err) {
        alert("❌ Server error");
    }
}


// ============================
// HISTORY (TEACHER)
// ============================
async function loadHistory(){
    const h = document.getElementById("historySection");
    if(!h) return;

    try {
        const res = await fetch(`${BASE}/api/bookings`);
        const data = await res.json();

        if(data.length === 0){
            h.innerHTML = "<p>No bookings yet</p>";
            return;
        }

        h.innerHTML = data.map(b => `
            <div style="background:#e2e8f0; padding:10px; margin:5px; border-radius:6px;">
                ${b.room} | ${b.date} | ${b.timeSlot}
            </div>
        `).join("");

    } catch {
        h.innerHTML = "<p>Error loading data</p>";
    }
}


// ============================
// ADMIN VIEW
// ============================
async function loadAdmin(){
    const a = document.getElementById("adminHistory");
    if(!a) return;

    try {
        const res = await fetch(`${BASE}/api/bookings`);
        const data = await res.json();

        if(data.length === 0){
            a.innerHTML = "<p>No bookings found</p>";
            return;
        }

        a.innerHTML = data.map(b => `
            <div style="background:#f1f5f9; padding:10px; margin:5px; border-radius:6px;">
                <b>Room:</b> ${b.room}<br>
                <b>Date:</b> ${b.date}<br>
                <b>Time:</b> ${b.timeSlot}<br>
                <b>Teacher:</b> ${b.teacher}
            </div>
        `).join("");

    } catch {
        a.innerHTML = "<p>Error loading admin data</p>";
    }
}


// ============================
// LOGOUT
// ============================
function logout(){
    localStorage.clear();
    window.location.href = "login.html";
}