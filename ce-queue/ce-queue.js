window.addEventListener("DOMContentLoaded", main);

function getFirstAdoptableInQueue() {
    // Get the first adoptable in the queue
    // Return fast if the queue is empty to avoid performance overhead

    let key = "cc-ce-queue";
    let queue = window.localStorage.getItem(key);
    if (queue === null) {
        return;
    }

    return JSON.parse(queue)[0];
}

function getQueueLength() {
    // Get the number of adoptables in the queue
    // If queue is empty, return 0

    let key = "cc-ce-queue";
    let queue = window.localStorage.getItem(key);
    if (queue === null) {
        return 0;
    }
    return JSON.parse(queue).length;
}

function setNextAdoptableInQueue() {
    // Remove first adoptable from queue, set the next in the CE

    let key = "cc-ce-queue";
    let queue = JSON.parse(window.localStorage.getItem(key));
    let _currentAdopt = queue.shift();

    // Handle end of queue
    if (queue.length === 0) {
        window.alert("Your queue is empty! We'll keep CEing this adoptable.");
        window.localStorage.removeItem(key)
        return;
    }

    let { adoptID, levelPlusCredits } = queue[0];
    if (window.confirm("Do you want to move on to the next adoptable in your queue?")) {
        let setURL = `https://www.clickcritters.com/clickexchange.php?act=choose&adoptID=${adoptID}`;
        window.open(setURL);
        window.localStorage.setItem(key, JSON.stringify(queue));
    }

    console.log("New queue: ", window.localStorage.getItem(key));
}

function getCurrentLevelPlusCredits() {
    // Get the current amount of level + credits

    let prizeHeader = document.getElementsByTagName("H1")[1];
    let textNode = prizeHeader.nextSibling;
    let levelPlusCredits = textNode.textContent.split(" ")[7];
    return parseInt(levelPlusCredits); q
}

function addLengthOfQueueToPage(target, length) {
    // Add the length of the queue to the page

    let body = document.getElementsByTagName("CENTER")[0];
    let prizeHeader = document.getElementsByTagName("H1")[1];
    let lineBreak = prizeHeader.nextSibling.nextSibling.nextSibling.nextSibling;

    let template = document.createElement("template");
    let s = (
        `<span>
        <br><br>
        This adoptable's target is level + credits = ${target}. 
        <br>
        You have ${length} adoptables in the queue.
        </span>
        `
    );
    template.innerHTML = s;
    newHTML = template.content.firstChild;

    body.insertBefore(newHTML, lineBreak);

}


function main() {
    console.log("Hello from the CE queue extension!");

    // Short circuit if queue is empty
    const queueLength = getQueueLength();
    if (queueLength === 0) {
        console.log("No thoughts; queue empty.")
        return;
    }

    // Get adoptable at the top of the queue
    const currentAdoptable = getFirstAdoptableInQueue();
    let target = currentAdoptable.levelPlusCredits;

    // Add to page
    addLengthOfQueueToPage(target, queueLength);

    // Get current number of level + credits
    let currentLPC = getCurrentLevelPlusCredits();
    if (currentLPC >= target) {
        console.log("Reached target level+credits");
        setNextAdoptableInQueue();
    }
}

