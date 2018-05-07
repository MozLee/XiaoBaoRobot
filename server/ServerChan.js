const puppeteer = require('puppeteer');
let sckey = require('../keys/serverChan')


async function login(url) {
    const browser = await puppeteer.launch({
        headless:true,
        args:['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(sckey.loginUrl+url+')');
    await browser.close();
}
async function logout() {
    const browser = await puppeteer.launch({
        headless:true,
        args:['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(sckey.logoutUrl);
    await browser.close();
}
async function err() {
    const browser = await puppeteer.launch({
        headless:true,
        args:['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(sckey.errUrl);
    await browser.close();
}

module.exports={
    login,
    logout,
    err
}