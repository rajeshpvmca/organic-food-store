// Auth Guard
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) window.location.href = 'login.html';

// Populate navbar
document.getElementById('navUserName').textContent = user.name;
document.getElementById('navUserEmail').textContent = user.email;
document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();

// Show role badge & correct nav
const role = user.role || 'Customer';
document.getElementById('roleBadge').textContent = role;
document.getElementById('navCustomer').style.display = role === 'Customer' ? '' : 'none';
document.getElementById('navPartner').style.display    = role === 'Partner'    ? '' : 'none';
document.getElementById('navAdmin').style.display    = role === 'Admin'    ? '' : 'none';

// Signout
document.getElementById('signoutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('dashPage');
    window.location.href = 'index.html';
});

// Active link & iframe navigation
const frame = document.getElementById('dashFrame');
const links = document.querySelectorAll('.sidebar-nav a');

// Define default pages for each role
const roleDefaults = {
    'Customer': 'home',
    'Partner': 'tasks',
    'Admin': 'adminOverview'
};

// Restore last page
const lastPage = sessionStorage.getItem('dashPage') || roleDefaults[role];
frame.src = 'dashboard/' + lastPage + '.html';
links.forEach(a => {
    a.classList.toggle('active', a.dataset.page === lastPage);
});

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        const href = link.getAttribute('href');

        // Redirect to index only if it's truly a placeholder link
        if (!page || href === "#" || href === "") {
            window.location.href = 'index.html';
            return;
        }

        // Update the iframe source to the link's href
        frame.src = href;
        sessionStorage.setItem('dashPage', page);
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        if (window.innerWidth < 992) closeSidebar();
    });
});

// Mobile sidebar toggle
const sidebar = document.getElementById('dashSidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);

// Pass user to iframe pages via postMessage when frame loads
frame.addEventListener('load', () => {
    try {
        frame.contentWindow.postMessage({ type: 'DASH_USER', user }, '*');
    } catch(e) {}
});
