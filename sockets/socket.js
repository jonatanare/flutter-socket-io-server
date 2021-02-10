const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Tamalitos' ));
bands.addBand( new Band( 'Groupers' ));
bands.addBand( new Band( 'Carnes S. Javi' ));
bands.addBand( new Band( 'Herbivoros' ));


// Mensajes de sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!', payload);

        io.emit('mensaje', { admin: 'Nuevo Mensaje'});
    });

    client.on('vote-band', (payload) => {
        //console.log(payload);
        bands.voteBand( payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-band', bands.getBands());
    })

    /*client.on('emitir-mensaje', ( payload ) => {
        //console.log(payload);
        //io.emit('nuevo-mensaje', payload); // emite a todos!
        client.broadcast.emit('nuevo-mensaje', payload );
    });*/
});