const BASE = "http://localhost:5001";

document.addEventListener("DOMContentLoaded", () => {
    generateBlocks();
    generateFloors();
    updateRooms();
    loadHistory();
    loadAdmin();
});

function login(){
    const name = document.getElementById("userName").value;
    const role = document.getElementById("roleSelect").value;

    localStorage.setItem("name", name);
    localStorage.setItem("role", role);

    if(role==="admin"){
        window.location="admin.html";
    } else {
        window.location="dashboard.html";
    }
}

function generateBlocks(){
    const b = document.getElementById("blockSelect");
    if(!b) return;
    ["P","R","H","A","U"].forEach(x=>{
        b.innerHTML += `<option>${x}</option>`;
    });
}

function generateFloors(){
    const f = document.getElementById("floorSelect");
    if(!f) return;
    for(let i=1;i<=5;i++){
        f.innerHTML += `<option>${i}</option>`;
    }
}

function updateRooms(){
    const r = document.getElementById("roomSelect");
    const b = document.getElementById("blockSelect");
    const f = document.getElementById("floorSelect");
    if(!r || !b || !f) return;

    r.innerHTML="";
    for(let i=1;i<=10;i++){
        r.innerHTML += `<option>${b.value}-${f.value}-${i}</option>`;
    }
}

async function bookRoom(){
    const data = {
        block: document.getElementById("blockSelect").value,
        floor: document.getElementById("floorSelect").value,
        room: document.getElementById("roomSelect").value,
        date: document.getElementById("bookingDate").value,
        timeSlot: document.getElementById("timeSlot").value,
        teacher: localStorage.getItem("name")
    };

    await fetch(`${BASE}/api/bookings/add`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });

    loadHistory();
}

async function loadHistory(){
    const h = document.getElementById("historySection");
    if(!h) return;

    const res = await fetch(`${BASE}/api/bookings`);
    const data = await res.json();

    h.innerHTML = data.map(b=>`<p>${b.room} ${b.date}</p>`).join("");
}

// ============================
// ADMIN DATA
// ============================
async function loadAdmin(){
    const a = document.getElementById("adminHistory");
    if(!a) return;

    const res = await fetch(`${BASE}/api/bookings`);
    const data = await res.json();

    a.innerHTML = data.map(b=>`<p>${b.room} ${b.teacher}</p>`).join("");
}


// ============================
// LOGOUT FUNCTION ✅ ADD HERE
// ============================
function logout(){
    localStorage.clear();
    window.location.href = "login.html";
}