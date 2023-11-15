var blocks = []; // Store the blocks data from JSON
var currentBlockIndex = 0; // Index of the currently selected block
var offset = 0;

// Load JSON data and create dropdowns
blocks = data

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function formatTime(time) {
    return String(time).padStart(2, "0");
}

function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${formatTime(days)}d ${formatTime(hours % 24)}h ${formatTime(minutes % 60)}m ${formatTime(seconds % 60)}s`;
}

function formatUnixTime(unixTime) {
    const date = new Date(unixTime);
  
    const formattedDate = date.toLocaleString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).replace(" at ", " @ ");
  
    return `Timer until ${formattedDate}`;
  }

function updateCountdown() {
    if (blocks.length > 0) {
        var now = ServerDate.now();
        var schoolStartDate = new Date(blocks[currentBlockIndex].start_date).getTime();
        var timeRemaining = schoolStartDate - now + offset

        // Check if the current countdown has ended
        if (timeRemaining <= 0) {
            // Move to the next block (if available)
            currentBlockIndex++;
            if (currentBlockIndex >= blocks.length) {
                document.getElementById("title").innerHTML = blocks[blocks.length - 1].block;
                document.getElementById("demo").innerText = ((blocks.length > 1) ? "Schedule Ended" : "Countdown Ended");
                document.getElementById("footera").innerHTML = formatUnixTime(new Date(blocks[blocks.length - 1].start_date).getTime());
                clearInterval(countdownInterval);
                /*if ("wakeLock" in navigator) {
                    wakeLock.release().then(() => { wakeLock = null })
                };*/
                return; // No more blocks, stop countdown
            }
            schoolStartDate = new Date(blocks[currentBlockIndex].start_date).getTime();
            timeRemaining = schoolStartDate - now + offset

            // Show "Loading..." while transitioning to the next block
            document.getElementById("title").innerHTML = ((data.length == 1) ? "Countdown" : "Schedule");
            document.getElementById("demo").innerText = "Loading...";
            document.getElementById("footera").innerHTML = "Loading Timer...";
            return;
        }

        // Update countdown display
        document.getElementById("title").innerHTML = blocks[currentBlockIndex].block;
        document.getElementById("demo").innerText = formatDuration(timeRemaining);
        document.getElementById("footera").innerHTML = formatUnixTime(new Date(blocks[currentBlockIndex].start_date).getTime());
    } else {
        // Update countdown display
        document.getElementById("title").innerHTML = "Undefined " + ((data.length == 1) ? "Countdown" : "Schedule");
        document.getElementById("demo").innerText = ((data.length == 1) ? "Countdown" : "Schedule") + " Ended";
        document.getElementById("footera").innerHTML = "Timer until you can't no more";
        clearInterval(countdownInterval);
        return;
    }
}


// Initial countdown update
var countdownInterval = setInterval(updateCountdown, 50);

let wakeLock = null;
if ("wakeLock" in navigator) {
    const requestWakeLock = async () => {
        wakeLock = await navigator.wakeLock.request('screen');
    };

    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });

    requestWakeLock();
}

let zoomed = false;
let locked = false;
new Egg("m", function () {
    if (!zoomed && !locked) {
        locked = true;
        zoomed = true;
        $(".topnav").animate({ top: "-10%" });
        $(".footer").animate({ bottom: "-50px" });
        $("#title").animate({ fontSize: "750%", top: "40%" });
        $("#demo").animate({ fontSize: "750%", top: "65%" }, "", () => locked = false);
    } else if (!locked) {
        locked = true;
        zoomed = false;
        $(".topnav").animate({ top: "1.3%" });
        $(".footer").animate({ bottom: "0px" });
        $("#title").animate({ fontSize: "375%", top: "45%" });
        $("#demo").animate({ fontSize: "375%", top: "58%" }, "", () => locked = false);
    }
}).listen();

new Egg("o", function () {
    var offsetPrompt = prompt("How much offset in milliseconds? (Use + or -)")
    if(offsetPrompt.includes("+") || offsetPrompt.includes("-")) {
        if(offsetPrompt.split("+").length === 2 || offsetPrompt.split("-").length === 2) {
            offset = offset + parseInt(offsetPrompt);
            toastr.success(`Successfuly offset time by ${offsetPrompt} milliseconds!`, "Offset Set");
        } else if(!offsetPrompt.includes("+") && !offsetPrompt.includes("-")) {
            toastr.error("Error setting offset: Not a valid offset.", "Offset Error");
        } else {
            toastr.error("Error setting offset: Not a valid offset.", "Offset Error");
        }
    } else {
        toastr.error("Error setting offset: Not a valid offset.", "Offset Error");
    }
}).listen();
