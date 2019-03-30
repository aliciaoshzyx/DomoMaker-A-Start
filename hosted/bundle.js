"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer($("#csrfValue").val());
    });

    return false;
};

var handleDelete = function handleDelete(e) {
    e.preventDefault();
    console.log("handleDelete");
    $("#domoMessage").animate({ width: 'hide' }, 350);
    //not doing this properly 
    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {});
    loadDomosFromServer($("#dcsrf").val());
    return false;
};

var DomoForm = function DomoForm(props) {
    console.log(props);
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { id: "colorLabel", htmlFor: "favoriteColor" },
            "Favorite Color: "
        ),
        React.createElement("input", { id: "domoFavoriteColor", type: "text", name: "favoriteColor", placeholder: "Favorite Color" }),
        React.createElement("input", { type: "hidden", id: "csrfValue", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos Yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        var idString = domo.name + "deleteDomoForm";
        idString = idString.replace(/\s+/g, '');
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoFavoriteColor" },
                "Favorite Color: ",
                domo.favoriteColor,
                " "
            ),
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleDelete,
                    name: "deleteDomoForm",
                    action: "/deleteDomo",
                    method: "POST" },
                React.createElement("input", { type: "hidden", name: "domoID", value: domo._id }),
                React.createElement("input", { type: "hidden", id: "dcsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "deleteSubmit", type: "submit", value: "Delete Domo" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
    console.log("loadDomos");
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));
    loadDomosFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
