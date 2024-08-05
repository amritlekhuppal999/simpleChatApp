/*
    GLOBAL definition of certain functions for FRONT-END
*/

// READ PAGE URL and query Parameters

    function getQueryParameter(parameter){
        return urlParamObject(getPageURL()).get(parameter);
    }

    function getPageURL(){      // Get Page URL
        return new URL(window.location.href);
    }
    function urlParamObject(url){       //GET URL PARAM OBJECT
        return new URLSearchParams(url.search);
    }
    
    //OLD
    // function getQueryParameter(parameter){
    //     const url = new URL(window.location.href);

    //     // Create a URLSearchParams object
    //     const params = new URLSearchParams(url.search);

    //     return params.get(parameter);
    // }
// READ PAGE URL and query Parameters END



function currentTime(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
    // console.log(formattedTime);
}


