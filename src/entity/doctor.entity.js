const typeorm = require('typeorm');


const Doctor = new typeorm.EntitySchema({
    name: 'Doctor',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: false,
        }
    },
    relations: {
        timeSlots: {
            target: 'TimeSlot',
            type: 'one-to-many',
        }
    }
})

module.exports = Doctor;