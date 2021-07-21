const axios = require('axios');

exports.handler = async (event) => {
    // console.log(event);
    try {
        var params = {
            'key': API - KEY, // API key from google developer's account
            'cx': CUSTOMSEARCHID, //Programmable search engine ID
            'q': event.inputTranscript // search query fetched via input event in LEX
        };

        let information = '';
        const customConnect = axios.create({
            baseURL: "https://www.googleapis.com/customsearch",
            timeout: 5000
        });
        await customConnect.get(
            '/v1', {
            params
        })
            .then(function (response) {
                // console.log(response);
                response.data.items.forEach((element, index, array) => {
                    if (element.hasOwnProperty('htmlTitle')) information += element.htmlTitle + '<br />';
                    if (element.hasOwnProperty('displayLink')) information += '<a href=' + element.displayLink + '>Read more<a><br />';
                    if (element.hasOwnProperty('htmlSnippet')) information += element.htmlSnippet + '<br />';
                    if (index == array.length - 1 && information == '') information = 'Sorry could not find what you are looking for.';
                });
            })
            .catch(function (error) {
                information = 'Sorry could not find what you are looking for.';
                // console.log(error);
            });

        // Response format - to send response to LEX bot
        var obj = { 'sessionAttributes': event['sessionAttributes'] };
        var dialogAction = {};
        dialogAction.type = "Close";
        dialogAction.fulfillmentState = "Fulfilled";

        var message = {};
        message.contentType = "PlainText";
        message.content = information;

        dialogAction.message = message;
        obj.dialogAction = dialogAction;

        // console.log(obj);
        return obj;
    }
    catch (error) {
        // console.log(error);
    }
};
