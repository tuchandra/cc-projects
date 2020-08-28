window.addEventListener("DOMContentLoaded", main);

function addToQueue(levelPlusCredits) {
    // Get the adoptable ID of the page we are on
    let adoptID = window.location.href.split("id=")[1];
    let setURL = `https://www.clickcritters.com/clickexchange.php?act=choose&adoptID=${adoptID}`;
    let adoptable = {
        adoptID: adoptID,
        levelPlusCredits: levelPlusCredits,
    }
    console.log(adoptable);

    // If localStorage empty, create a new item
    let key = "cc-ce-queue"
    let queue = window.localStorage.getItem(key);
    if (queue === null) {
        if (window.confirm("Your queue is empty. We need to set this adoptable as active in the CE.")) {
            window.open(setURL);
            window.localStorage.setItem(key, JSON.stringify([adoptable]));
        }
    }

    // Get what's there, add new element to the back
    else {
        let newQueue = JSON.parse(queue)
        newQueue.push(adoptable);
        console.log(newQueue);
        window.localStorage.setItem(key, JSON.stringify(newQueue));
        window.alert("Added to queue!")
    }

    console.log(window.localStorage.getItem(key));
}

function numberOfAdoptablesInQueue() {
    let key = "cc-ce-queue"
    let queue = window.localStorage.getItem(key);
    if (queue === null) {
        return 0;
    } else {
        return JSON.parse(queue).length;
    }

}

function emptyQueue() {
    if (window.confirm("Are you sure you want to clear your queue? This cannot be undone!")) {
        window.localStorage.removeItem("cc-ce-queue");
        console.log("Clearing queue");
    }
}

function main() {
    // This is the body of the page, it's a <center> tag
    let body = document.getElementById("megaContent").firstChild;

    // The first table in the body is where the HTML and BBCodes
    // are displayed. We want to insert above that.
    for (child of body.children) {
        if (child.tagName === "TABLE") {
            break;
        }
    }
    let tableToInsertBefore = child;

    // Create the new HTML
    let template = document.createElement("template");
    let s = (
        `<div style="width:70%; border: 1px solid black; padding: 10px 0 10px 0; margin: 10px; position: relative;">
        <h1>Add to your CE queue</h1>
        <span style="width:80%; display:block;">
        Here, you can add this adoptable to your CE queue. 
        Choose a preset number of levels + credits, or enter your own.
        </span>
        <br>
        <span style="width:80%; display:block;">
        You currently have <b>${numberOfAdoptablesInQueue()} adoptables</b> in your queue.
        </span>
        <br>
        
        <input type="submit" class="queue-35" value="L+C = 35">
        <input type="submit" class="queue-110" value="L+C = 110">
        <input type="submit" class="queue-220" value="L+C = 220">
        <br><br>
        <input type="text" id="queue-custom">
        <input type="submit" class="queue-custom" value="Submit custom">
        <br><br>
        <input type="submit" class="queue-clear" value="Clear your queue">
        </div>`
    );
    template.innerHTML = s;
    newHTML = template.content.firstChild;

    body.insertBefore(newHTML, tableToInsertBefore);

    // Add the click listeners
    body.getElementsByClassName("queue-35")[0].addEventListener("click", () => addToQueue(35));
    body.getElementsByClassName("queue-110")[0].addEventListener("click", () => addToQueue(110));
    body.getElementsByClassName("queue-220")[0].addEventListener("click", () => addToQueue(220));
    body.getElementsByClassName("queue-custom")[0].addEventListener("click", () => addToQueue(parseInt(document.getElementById("queue-custom").value)));
    body.getElementsByClassName("queue-clear")[0].addEventListener("click", () => emptyQueue());

}

