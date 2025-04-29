// Mock profile data
let profiles = JSON.parse(localStorage.getItem('profiles')) || [
    { 
        userId: 1, 
        role: 'mentor', 
        skills: ['JavaScript', 'HTML', 'CSS'], 
        interests: [], 
        bio: 'Frontend developer with 5 years of experience' 
    },
    { 
        userId: 2, 
        role: 'mentee', 
        skills: [], 
        interests: ['Web Development', 'UI/UX'], 
        bio: 'Aspiring web developer looking for guidance' 
    }
];

// DOM Elements
const profileForm = document.getElementById('profile-form');
const roleSelect = document.getElementById('role');
const skillsInput = document.getElementById('skills-input');
const skillsTags = document.getElementById('skills-tags');
const interestsInput = document.getElementById('interests-input');
const interestsTags = document.getElementById('interests-tags');
const bioTextarea = document.getElementById('bio');
const profileMessage = document.getElementById('profile-message');

// Current user profile
let currentProfile = null;

// Initialize profile page
function initProfilePage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Find existing profile
    currentProfile = profiles.find(p => p.userId === currentUser.id);
    
    if (currentProfile) {
        // Populate form with existing profile data
        roleSelect.value = currentProfile.role;
        bioTextarea.value = currentProfile.bio;
        
        // Add skills tags
        currentProfile.skills.forEach(skill => {
            addTag(skill, skillsTags);
        });
        
        // Add interests tags
        currentProfile.interests.forEach(interest => {
            addTag(interest, interestsTags);
        });
    }
}

// Add tag to a container
function addTag(text, container) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        ${text}
        <button type="button">&times;</button>
    `;
    
    // Add remove functionality
    tag.querySelector('button').addEventListener('click', () => {
        tag.remove();
    });
    
    container.appendChild(tag);
}

// Get tags from a container
function getTags(container) {
    return Array.from(container.querySelectorAll('.tag'))
        .map(tag => tag.textContent.trim().replace('×', ''));
}

// Event Listeners
if (skillsInput) {
    skillsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = this.value.trim();
            if (value) {
                addTag(value, skillsTags);
                this.value = '';
            }
        }
    });
}

if (interestsInput) {
    interestsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = this.value.trim();
            if (value) {
                addTag(value, interestsTags);
                this.value = '';
            }
        }
    });
}

if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        const profileData = {
            userId: currentUser.id,
            role: roleSelect.value,
            skills: getTags(skillsTags),
            interests: getTags(interestsTags),
            bio: bioTextarea.value
        };
        
        // Update or create profile
        if (currentProfile) {
            const index = profiles.findIndex(p => p.userId === currentUser.id);
            profiles[index] = profileData;
        } else {
            profiles.push(profileData);
            currentProfile = profileData;
        }
        
        localStorage.setItem('profiles', JSON.stringify(profiles));
        
        profileMessage.textContent = 'Profile saved successfully!';
        profileMessage.style.color = 'green';
        
        setTimeout(() => {
            profileMessage.textContent = '';
        }, 3000);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfilePage);