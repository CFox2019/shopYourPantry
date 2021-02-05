$(document).ready(function () {
    var ingredients = [];
    var storedIngredients = JSON.parse(localStorage.getItem("ingredients"));
    var missedList = [];
    function initIngredients() {
        storedIngredients = JSON.parse(localStorage.getItem("ingredients"));
        if (storedIngredients != null) {
            ingredients = storedIngredients;
            writeIngredients();
        } else if (storedIngredients === null) {

        };
    };

    function clearCol3() {
        $("#recip-ing").text("");
        $("#youtube-results").text("");
    };

    function writeIngredients() {
        $("#ing-here").text("");
        for (i = 0; i < ingredients.length; i++) {
            var ingHere = $("#ing-here");
            var ingDiv = $("<div>");
            var ingCard = $("<p>").text(ingredients[i]);
            ingCard.attr("class", "box ing-card");
            ingDiv.append(ingCard);
            ingHere.prepend(ingDiv);
        };
    };
    
    $("#ing-button").on("click", function () {
        if ($("#ing-input").val() != "") {
            ingredients.push($("#ing-input").val());
            $("#ing-input").val("");
            localStorage.setItem("ingredients", JSON.stringify(ingredients));
            writeIngredients();
        } else if ($("#ing-input").val() === "") {

        };
    });
    
    $("#recip-button").on("click", function () {
        var spoonURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + ingredients + "&ranking=2&apiKey=83b505ff599e49239f3310bad1407b22";
        $.ajax({
            url: spoonURL,
            method: "GET"
        }).then(function (res) {
            $("#col-2").attr("class", "column");
            for (i = 0; i < 5; i++) {
                var recipeCard = $("<div>");
                let recipeName = res[i].title;
                let recipeImgURL = res[i].image;
                var pName = $("<p>").text(recipeName);
                pName.attr("class", "title-text");
                recipeCard.attr("class", "box recipe-card");
                recipeCard.attr("id", i);
                recipeCard.append(pName);
                recipeCard.append($("<img>").attr("src", recipeImgURL));
                $("#col-2").prepend(recipeCard);
            };
            $(document).on("click", ".recipe-card", function () {
                var recipeNumb = $(this).attr("id");
                for (i = 0; i < res[recipeNumb].missedIngredients.length; i++) {
                    missedList.push(res[recipeNumb].missedIngredients[i]);
                };
                for (i = 0; i < missedList.length; i++) {
                    var missedID = missedList[i].id;
                    var missedAmount = missedList[i].amount;
                    var missedUnit = missedList[i].unit;
                    var priceURL = "https://api.spoonacular.com/food/ingredients/" + missedID + "/information?amount=" + missedAmount + "&unit=" + missedUnit + "&apiKey=83b505ff599e49239f3310bad1407b22";
                    $.ajax({
                        url: priceURL,
                        method: "GET"
                    }).then(function (res) {
                        var recipIng = $("#recip-ing");
                        var missedDiv = $("<div>");
                        var missedCard = $("<p>").text(res.originalName + " $" + ((res.estimatedCost.value) / 100).toFixed(2));
                        missedCard.attr("class", "box missed-card");
                        missedDiv.append(missedCard);
                        recipIng.prepend(missedDiv);
                    });
                };
            });
        });
    });

    $("#clear-results-button").on("click", function () {
        localStorage.removeItem("ingredients");
        ingredients = [];
        $("#ing-here").text("");
        initIngredients();
    });

    $(document).on("click", ".recipe-card", function () {
        clearCol3();
        let recipeName = $(this).text();
        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/search",
            method: "GET",
            data: {
                key: "AIzaSyBwUYS50KQBBjTpXf3LI20SO3rfcyQdYHE",
                q: recipeName,
                part: "snippet",
                type: "video"
            }
        }).then(function (response) {
            $("#recipe-ing-youtube-container").attr("class", "column");
            $("#video-buttons").attr("class", "buttons");
            var n = 0;
            function writeVideo() {
                $("#youtube-results").text("");
                let vidTitle = response.items[n].snippet.title;
                let vidTitleDiv = $("<h4>").text(vidTitle);
                let vidIcon = response.items[n].snippet.thumbnails.default.url;
                let vidID = response.items[n].id.videoId;
                let vidLink = "https://youtube.com/watch?v=" + vidID;
                let vidIconDiv = $("<a>").attr("href", vidLink);
                vidIconDiv.append($("<img>").attr("src", vidIcon));
                $("#youtube-results").append(vidIconDiv, vidTitleDiv);
            };
            writeVideo();
            $("#back-button").on("click", function () {
                if (n > 0) {
                    n--;
                    writeVideo();
                } else if (n === 0) {

                };
            });
            $("#next-button").on("click", function () {
                if (n < 4) {
                    n++;
                    writeVideo();
                } else if (n === 4) {

                };
            });
        });
    });
    initIngredients();
});