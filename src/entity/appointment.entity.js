const typeorm = require('typeorm');


const Appointment = new typeorm.EntitySchema({
    name: 'Appointment',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        patientName: {
            type: 'varchar',
            nullable: false,
        },
        patientEmail: {
            type: 'varchar',
            nullable: false,
        },
        date: {
            type: 'varchar',
            nullable: false,
        },
        timeSlotId: {
            type: 'int',
            nullable: false,
        }
    },
    relations: {
        timeSlot: {
            target: "TimeSlot",
            type: 'many-to-one',
            joinColumn: 'timeSlotId'
        },
    }
})

module.exports = Appointment;