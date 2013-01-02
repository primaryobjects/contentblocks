CommonManager = {
    encodeId: function (id) {
        id = id.replace(/\./g, '_p').replace(/\//g, '_s');

        return id;
    },

    decodeId: function (id) {
        id = id.replace(/_p/g, '.').replace(/_s/g, '/');

        return id;
    }
};
