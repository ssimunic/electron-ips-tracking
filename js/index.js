'use strict'

const ipc = require('electron').ipcRenderer
const request = require('request')

const loadWebsiteButton = document.getElementById('loadWebsiteButton')
const htmlBox = document.getElementById('htmlBox')
const trackingNumberInput = document.getElementById('trackingNumberInput')
const alertCheckbox = document.getElementById('alertCheckbox')
let lastCheckSpan = document.getElementById('lastCheckSpan')

let prevHtml = ''
let checkedTimes = 0
const checkStatus = () => {
    request(`http://ips.posta.hr/IPSWeb_item_events.asp?itemid=${trackingNumberInput.value}&Submit=Submit`, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            // Load elements and HTML properly
            htmlBox.innerHTML = body
            htmlBox.innerHTML = htmlBox.getElementsByTagName('table')[1].innerHTML
            htmlBox.innerHTML = htmlBox.getElementsByTagName('tbody')[1].innerHTML
            htmlBox.getElementsByTagName('img')[0].outerHTML = null
            htmlBox.getElementsByTagName('a')[0].outerHTML = null

            // Set initial previous HTML
            if (checkedTimes == 0) {
                prevHtml = body
            }

            // Alert if state changes
            if (alertCheckbox.checked && body != prevHtml) {
                prevHtml = body
                ipc.send('alert-change-dialog')
            }

            checkedTimes++

            // Update last checked time
            let date = new Date()
            lastCheckSpan.innerHTML = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (${checkedTimes} times total)`
        }
    })
}

const startTracking = () => {
    checkStatus()
    // Check every 15 minutes
    setInterval(checkStatus, 1000*60*15)
}

const init = () => {
    loadWebsiteButton.addEventListener('click', startTracking)

    ipc.on('next-request', (event) => {
      checkStatus()
    })
}

init()
