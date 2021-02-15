const puppeteer  = require('puppeteer');
const fs = require('fs');
const config = require('./config.json');
const cookies = require('./cookies.json');

(async() =>{
    /* Start up puppeter and create a new page*/
    let browser  = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    /* Check if we have a previously saved session */
    if(Object.keys(cookies).length){
        /* Set the saved cookies in the puppeter browser page */
        await page.setCookie(...cookies);

        /* Go to facebook */
        await  page.goto('http://www.facebok.com/', {waitUntil: 'networkidle2'});
        
    }else{
        /* Go to facebook login page */
        await  page.goto('http://www.facebok.com/login/', {waitUntil: 'networkidle0'});

        /* Write in username and password */
        await page.type('#email', config.username,{delay:30});
        await page.type('#pass', config.password,{delay:30});

        /* Click login button */
        await page.click('#loginbutton');

        /* Wait for navigation to finish*/
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.waitFor(15000);

        /*Check if logged in */
        try{
            await page.waitFor('[data-click="profile-icon"]');
        }catch(error){
            console.log('Failed to login.');
            process.exit(0);
        }

        /* Get the current browser page session */
        let currentCookies = await page.cookies();

        /*Create a cookie file (if not already  created) to hold the session*/
        fs.writeFileSync('./cookies.json',  JSON.stringify(currentCookies));
    }
})();
