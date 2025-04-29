const mockApi = {
    getUsers: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(JSON.parse(localStorage.getItem('users')) || []);
            }, 500);
        });
    },
    
    getUser: (id) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                resolve(users.find(u => u.id === id));
            }, 500);
        });
    },
    
    getProfiles: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(JSON.parse(localStorage.getItem('profiles')) || []);
            }, 500);
        });
    },
    
    getProfile: (userId) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
                resolve(profiles.find(p => p.userId === userId));
            }, 500);
        });
    },
    
    saveProfile: (profileData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
                const index = profiles.findIndex(p => p.userId === profileData.userId);
                
                if (index >= 0) {
                    profiles[index] = profileData;
                } else {
                    profiles.push(profileData);
                }
                
                localStorage.setItem('profiles', JSON.stringify(profiles));
                resolve(profileData);
            }, 500);
        });
    },
    
    getConnections: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(JSON.parse(localStorage.getItem('connections')) || []);
            }, 500);
        });
    },
    
    createConnection: (connectionData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                let connections = JSON.parse(localStorage.getItem('connections')) || [];
                connectionData.id = connections.length + 1;
                connections.push(connectionData);
                localStorage.setItem('connections', JSON.stringify(connections));
                resolve(connectionData);
            }, 500);
        });
    },
    
    updateConnection: (id, updates) => {
        return new Promise(resolve => {
            setTimeout(() => {
                let connections = JSON.parse(localStorage.getItem('connections')) || [];
                const index = connections.findIndex(c => c.id === id);
                
                if (index >= 0) {
                    connections[index] = { ...connections[index], ...updates };
                    localStorage.setItem('connections', JSON.stringify(connections));
                    resolve(connections[index]);
                } else {
                    resolve(null);
                }
            }, 500);
        });
    }
};
