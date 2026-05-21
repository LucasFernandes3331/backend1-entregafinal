const AdoptionManager = require('../managers/AdoptionManager');
const am = new AdoptionManager();

module.exports = {
    list: async () => await am.getAdoptions(),
    getById: async (id) => await am.getAdoptionById(id),
    create: async (data) => await am.createAdoption(data),
    update: async (id, data) => await am.updateAdoption(id, data),
    remove: async (id) => await am.deleteAdoption(id)
};
