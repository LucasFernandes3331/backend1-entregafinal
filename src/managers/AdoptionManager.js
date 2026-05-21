class AdoptionManager {
    constructor() {
        if (!AdoptionManager.store) {
            AdoptionManager.store = [];
        }
    }

    async getAdoptions() {
        return AdoptionManager.store;
    }

    async getAdoptionById(id) {
        return AdoptionManager.store.find(item => item._id === id) || null;
    }

    async createAdoption(data) {
        const adoption = {
            _id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            petName: data.petName,
            adopterName: data.adopterName,
            type: data.type || 'desconocido',
            status: 'pending',
            createdAt: new Date()
        };
        AdoptionManager.store.push(adoption);
        return adoption;
    }

    async updateAdoption(id, data) {
        const adoption = await this.getAdoptionById(id);
        if (!adoption) {
            return null;
        }

        Object.assign(adoption, data);
        return adoption;
    }

    async deleteAdoption(id) {
        const index = AdoptionManager.store.findIndex(item => item._id === id);
        if (index === -1) {
            return null;
        }

        return AdoptionManager.store.splice(index, 1)[0];
    }

    static clearStore() {
        AdoptionManager.store = [];
    }
}

module.exports = AdoptionManager;
