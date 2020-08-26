// A way to instantiate the await method
function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function destroyPopup(popup) {
    popup.classList.remove("open");
    // wait for one second to do its works
    await wait(1000);
    // remove the popup entirely
    popup.remove();
    popup = null;
}

function ask(options) {
    // Options object will have an attribute 
    // with the questions
    // and a question for a cancel button
    return new Promise(async function(resolve) {
        // first we need to create a popup with all the fields in it
        // creating an element with this way so that we can add eventListener
        const popup = document.createElement('form');
        popup.classList.add('popup');
        // Using backticks for the html elements
        // insert the popup into the form
        popup.insertAdjacentHTML('afterbegin',
            `<fieldset>
            <label>${options.title}</label>
            <input type="itext" name="input"> 
            <button type="submit">Submit</button>
        </fieldset>
        `);
        console.log(popup);
        // check if they want a cancel button 
        if (options.cancel) {
            const skipButton = document.createElement('button');
            skipButton.type = "button";
            skipButton.textContent = "cancel";
            popup.firstElementChild.appendChild(skipButton);
            // we use firstElementChild but not firstChild bec firstElementChild is a key word to grab an element. FirstChild is to grab a node( )
            // TODO: listen for a click on that cancel button
            skipButton.addEventListener("click", () => {
                    resolve(null);
                    destroyPopup(popup);
                },
                // This will allow the addEventListener run just once
                { once: true });
        }
        popup.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                console.log('submitevent');
                resolve(e.target.input.value);
            }, { once: true });
        // listen for the submit button on the inputs
        //  when sm does submit it, resolve the data that was in the input box
        // insert that popup into the DOM
        document.body.appendChild(popup);
        await wait(50);
        popup.classList.add('open');
        // setTimeout(function () {
        //     popup.classList.add('open');
        // }, 10);
    });
}
async function askQuestion(e) {
    const button = e.currentTarget;
    const cancel = 'cancel' in button.dataset;
    const answer = await ask({
        title: button.dataset.question,
        cancel,
    });
    console.log(answer);
}
// select all the buttons
const buttons = document.querySelectorAll('[data-question]');
buttons.forEach(button => button.addEventListener("click", askQuestion));
console.log(buttons);
const questions = [
    { title: 'what is your name?' },
    { title: 'what is your age?', cancel: true },
    { title: 'what is your cars name?' },
];
async function askMap(array, callback) {
    const results = [];
    for (const item of array) {
        results.push(await callback(item));
    }
    return results;
}
async function go() {
    const answers = await askMap(questions, ask)
    console.log(answers);
}
go();