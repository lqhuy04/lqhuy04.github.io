// Mock connections data
let connections = JSON.parse(localStorage.getItem('connections')) || [
    { id: 1, mentorId: 1, menteeId: 2, status: 'pending' }
];

// DOM Elements
const usersList = document.getElementById('users-list');
const filterRole = document.getElementById('filter-role');
const filterSkills = document.getElementById('filter-skills');
const applyFiltersBtn = document.getElementById('apply-filters');

// Load users for discovery
function loadUsers() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const currentProfile = profiles.find(p => p.userId === currentUser.id);
    if (!currentProfile) {
        window.location.href = 'profile.html';
        return;
    }
    
    // Filter users based on role (mentors for mentees and vice versa)
    let filteredUsers = users.filter(u => u.id !== currentUser.id);
    let filteredProfiles = profiles.filter(p => p.userId !== currentUser.id);
    
    // Apply role filter
    const roleFilter = filterRole.value;
    if (roleFilter) {
        filteredProfiles = filteredProfiles.filter(p => p.role === roleFilter);
    }
    
    // Apply skills filter
    const skillsFilter = filterSkills.value.toLowerCase();
    if (skillsFilter) {
        filteredProfiles = filteredProfiles.filter(p => 
            p.skills.some(skill => skill.toLowerCase().includes(skillsFilter)) ||
            p.interests.some(interest => interest.toLowerCase().includes(skillsFilter))
        );
    }
    
    // Display results
    usersList.innerHTML = '';
    
    filteredProfiles.forEach(profile => {
        const user = users.find(u => u.id === profile.userId);
        if (!user) return;
        
        const connection = connections.find(c => 
            (c.mentorId === currentUser.id && c.menteeId === user.id) ||
            (c.menteeId === currentUser.id && c.mentorId === user.id)
        );
        
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        let connectBtnText = 'Connect';
        let connectBtnDisabled = false;
        
        if (connection) {
            if (connection.status === 'pending') {
                if ((currentProfile.role === 'mentor' && connection.mentorId === currentUser.id) ||
                    (currentProfile.role === 'mentee' && connection.menteeId === currentUser.id)) {
                    connectBtnText = 'Request Sent';
                    connectBtnDisabled = true;
                } else {
                    connectBtnText = 'Respond to Request';
                }
            } else if (connection.status === 'accepted') {
                connectBtnText = 'Connected';
                connectBtnDisabled = true;
            }
        }
        
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <span class="role">${profile.role}</span>
            <div class="skills">
                ${[...profile.skills, ...profile.interests].map(item => 
                    `<span class="skill">${item}</span>`
                ).join('')}
            </div>
            <p class="bio">${profile.bio || 'No bio provided'}</p>
            <button class="connect-btn btn" 
                    data-user-id="${user.id}" 
                    ${connectBtnDisabled ? 'disabled' : ''}>
                ${connectBtnText}
            </button>
        `;
        
        usersList.appendChild(userCard);
    });
    
    // Add event listeners to connect buttons
    document.querySelectorAll('.connect-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetUserId = parseInt(this.getAttribute('data-user-id'));
            handleConnection(currentUser.id, targetUserId);
        });
    });
}

// Handle connection request
function handleConnection(currentUserId, targetUserId) {
    const currentProfile = profiles.find(p => p.userId === currentUserId);
    const targetProfile = profiles.find(p => p.userId === targetUserId);
    
    if (!currentProfile || !targetProfile) return;
    
    // Check if connection already exists
    const existingConnection = connections.find(c => 
        (c.mentorId === currentUserId && c.menteeId === targetUserId) ||
        (c.mentorId === targetUserId && c.menteeId === currentUserId)
    );
    
    if (existingConnection) {
        // If current user is the mentor in a pending request, they can't accept their own request
        if (existingConnection.status === 'pending' && 
            existingConnection.mentorId === targetUserId && 
            existingConnection.menteeId === currentUserId) {
            // Accept the request
            existingConnection.status = 'accepted';
            localStorage.setItem('connections', JSON.stringify(connections));
            alert('Connection accepted!');
            loadUsers();
        }
    } else {
        // Create new connection
        let newConnection;
        
        if (currentProfile.role === 'mentor' && targetProfile.role === 'mentee') {
            newConnection = {
                id: connections.length + 1,
                mentorId: currentUserId,
                menteeId: targetUserId,
                status: 'pending'
            };
        } else if (currentProfile.role === 'mentee' && targetProfile.role === 'mentor') {
            newConnection = {
                id: connections.length + 1,
                mentorId: targetUserId,
                menteeId: currentUserId,
                status: 'pending'
            };
        } else {
            alert('You can only connect with someone in the opposite role');
            return;
        }
        
        connections.push(newConnection);
        localStorage.setItem('connections', JSON.stringify(connections));
        alert('Connection request sent!');
        loadUsers();
    }
}

// Event Listeners
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', loadUsers);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadUsers);