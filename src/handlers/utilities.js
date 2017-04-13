'use strict';
/**
 * Extract the name and email from a string
 *  
 * If unable to extract the email address returns passed parameter string
 * 
 * @param  {String} email User email address
 * @returns {String} Returns the only email address 
 */
function extractor(email) {
    var RegExp = /(?:"?([A-Z][^<"]+)"?\s*)?<?([^>\s]+)/g;
    var match = [];

    while ((match = RegExp.exec(email)) != null) {
        if (match) {
            var extractedEmail = match[2];
            if (extractedEmail && extractedEmail.includes('@')) {
                return extractedEmail;
            }
        }
    }
    return email;
}