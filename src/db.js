const typeorm = require('typeorm');
const root = require('./paths.js');
const Clinic = require('./entity/clinic.entity.js');
const Doctor = require('./entity/doctor.entity.js');
const TimeSlot = require('./entity/timeslot.entity.js');
const Appointment = require('./entity/appointment.entity.js');
const moment = require('moment');


const dataSource = new typeorm.DataSource({
    type: "sqlite",
    database: `${root}/data/line.sqlite`,
    entities: [ Doctor, Clinic, TimeSlot, Appointment],
    synchronize: true,
    // logging: true
})

async function initDB(){
    try{
        await dataSource.initialize()
        console.log('Database initialized')
    } catch(e) {
        console.error("Error during Data Source initialization", err)
        return
    }
    if(await dataSource.getRepository(Doctor).count()){
        return
    }
    // else add data
    const doctorsData = [
        {
            name: 'Dagdara Finchey'
        },
        {
            name: 'Romanda Cassin'
        }
    ]
    const doctors = await dataSource.getRepository(Doctor).save(doctorsData);
    const clinicsData = [
        {
            name: 'Deven Ride',
            address: 'Two Rivers, Caemlyn'
        },
        {
            name: 'Taren Ferry',
            address: 'Two Rivers, Caemlyn'
        },
    ]
    const clinics = await dataSource.getRepository(Clinic).save(clinicsData);
    const timeSlotData = [
        {
            doctorId: doctors[0].id,
            clinicId: clinics[0].id,
            slotStart: '10:00'
        },
        {
            doctorId: doctors[0].id,
            clinicId: clinics[1].id,
            slotStart: '11:00'
        },
        {
            doctorId: doctors[1].id,
            clinicId: clinics[0].id,
            slotStart: '11:00'
        },
        {
            doctorId: doctors[1].id,
            clinicId: clinics[1].id,
            slotStart: '10:00'
        }
    ]
    const timeSlots = await dataSource.getRepository(TimeSlot).save(timeSlotData);
    const appointmentsData = [
        {
            patientName: 'Wit Congar',
            patientEmail: 'wit.congar@tworivers.wot',
            date: moment().format('YYYY-MM-DD'),
            timeSlotId: timeSlots[0].id
        },
        {
            patientName: 'Alsbet Luhhan',
            patientEmail: 'alsbet.luhhan@tworivers.wot',
            date: moment().add(1, 'day').format('YYYY-MM-DD'),
            timeSlotId: timeSlots[0].id
        },
    ]
    await dataSource.getRepository(Appointment).save(appointmentsData);
    console.log('Database populated')
}

initDB()

module.exports = dataSource;