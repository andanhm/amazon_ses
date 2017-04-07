'use strict';
var appPackage = require('../package.json');

/**
 * To format date time to desired format :- '20 Feb 2013 @ 3:46 PM'
 */
function getLogDate() {
    var currentTime = new Date(),
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        date = currentTime.getDate() + ' ' + month[currentTime.getMonth()] + ' ' + currentTime.getFullYear(),
        suffix = 'AM',
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes();

    minutes = (minutes < 10) ? '0' + minutes : minutes;
    if (hours >= 12) {
        suffix = 'PM';
        hours = hours - 12;
    }
    if (hours === 0) {
        hours = 12;
    }
    return date + ' @ ' + hours + ':' + minutes + ' ' + suffix;
}

/**
 * Function to format text which needs to be written in the text file
 *
 * @param  {String} errorCode Unique error code for identification
 * @param  {String} source From where the error occurred
 * @param  {String} methodName Method / Function name
 * @param  {String} statement Error message
 * @param  {String} description Detail description of the error message
 * @param  {String} reference Reference of error
 */
function enterErrorLog(errorCode, source, methodName, statement, description, reference) {
    var serverName = require('os').hostname(),
        appName = appPackage.name,
        appVersion = appPackage.version,
        logDate = getLogDate();
    var errLog = '\n\n';
    errLog += '** ' + logDate + '\n';
    errLog += 'errorCode= '+ errorCode + '\n';
    errLog += 'Server=' + serverName + '\n';
    errLog += 'Application=' + appName + '\n';
    errLog += 'Source=' + source + '\n';
    errLog += 'Method=' + methodName + '\n';
    errLog += 'Statement=' + statement + '\n';
    errLog += 'Description=' + description + '\n';
    errLog += 'Reference=' + reference + '\n';
    errLog += 'Version=' + appVersion + '\n';

    console.error(errLog); // eslint-disable-line
}

module.exports = {
    enterErrorLog: enterErrorLog
};