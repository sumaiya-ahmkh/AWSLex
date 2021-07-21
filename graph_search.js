const axios = require('axios');
exports.handler = async (event) => {
    // console.log(event);
    try {
        var params = {
            'query': event.inputTranscript,// search query fetched via input event in LEX
            'limit': 10,
            'indent': true,
            'key': API - KEY,// API key from google developer's account
        };

        let information = '';
        const customConnect = axios.create({
            baseURL: "https://kgsearch.googleapis.com/v1",
            timeout: 5000
        });
        await customConnect.get(
            '/entities:search', {
            params
        })
            .then(function (response) {
                // console.log(response);
                // console.log(JSON.stringify(response.data.itemListElement));
                response.data.itemListElement.forEach((element, index, array) => {
                    if (element.hasOwnProperty('result') && element.result.hasOwnProperty('detailedDescription') && element.result.detailedDescription) {
                        if (element.result.detailedDescription.hasOwnProperty('articleBody')) information += element.result.detailedDescription.articleBody + '<br />';
                        if (element.result.detailedDescription.hasOwnProperty('url')) information += '<a href=' + element.result.detailedDescription.url + '>Read more<a><br />';
                    }

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
