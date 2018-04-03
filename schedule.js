const schedule = require('node-schedule');

function timeSentInfo() {
    schedule.scheduleJob('5 * * * * *',() => {
        console.log('定时任务'+new Date());
    })
};

timeSentInfo();