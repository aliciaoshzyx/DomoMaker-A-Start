const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer($("#csrfValue").val());
       
    });
    
    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
    console.log("handleDelete");
    $("#domoMessage").animate({width:'hide'}, 350);
    //not doing this properly 
    sendAjax('POST', $(`#${e.target.id}`).attr("action"), $(`#${e.target.id}`).serialize(), function(){
        
    });
    loadDomosFromServer($("#dcsrf").val());
    return false;
};

const DomoForm = (props) => {
    console.log(props);
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label id="colorLabel" htmlFor="favoriteColor">Favorite Color: </label>
            <input id="domoFavoriteColor" type="text" name="favoriteColor" placeholder="Favorite Color"/>
            <input type="hidden" id="csrfValue" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    )
};

const DomoList = function(props) {
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        let idString = `${domo.name}deleteDomoForm` ;
        idString = idString.replace(/\s+/g, '');
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
                <h3 className="domoFavoriteColor">Favorite Color: {domo.favoriteColor} </h3>
                <form id= {idString}
                onSubmit={handleDelete} 
                name="deleteDomoForm"
                action="/deleteDomo"
                method="POST">
                    <input type="hidden" name="domoID" value ={domo._id}/>
                    <input type="hidden" id="dcsrf" name="_csrf" value={props.csrf}/>
                    <input id="deleteSubmit" type="submit" value="Delete Domo"/>
                </form>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    console.log("loadDomos");
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrf}/>, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf}/>, document.querySelector("#domos")
    );
    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};



$(document).ready(function() {
    getToken();
});