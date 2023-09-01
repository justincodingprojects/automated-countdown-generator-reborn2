var currentBlock;

Date.prototype.formatDate = function () {
    return `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear()}`;
};

Date.prototype.formatTime = function () {
    return `${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`;
};

function calculateCountdown(startTime) {
    const now = Date.now();
    return startTime - now;
}

function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${addTrailingZero(days)}d ${addTrailingZero(hours % 24)}h ${addTrailingZero(minutes % 60)}m ${addTrailingZero(seconds % 60)}s`;
}

function updateCountdownDisplay(block, countdown) {
    document.getElementById("title").innerHTML = block;
    document.title = `${block} - Auto. Countdown Generator | Justin Coding Projects`;
    document.getElementById("demo").innerHTML = countdown;
}

function startCountdown(startTime, block) {
    return setInterval(function () {
        const countdown = calculateCountdown(startTime);
        const formattedCountdown = countdown > 0 ? formatDuration(countdown) : "Countdown Ended";
        updateCountdownDisplay(block, formattedCountdown);

        if (countdown <= 0) {
            clearInterval(currentBlock.interval);
        }
    }, 50);
}

function addTrailingZero(number) {
    return (number < 10 ? "0" : "") + number;
}

blockData.forEach((blockItem) => {
    const blockStartTime = new Date(blockItem.start_date).getTime();
    currentBlock = { block: blockItem.block, interval: startCountdown(blockStartTime, blockItem.block) };
});

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
        $(".footer").animate({ top: "110%" });
        $("#title").animate({ fontSize: "750%", top: "40%" });
        $("#demo").animate({ fontSize: "750%", top: "65%" }, "", () => locked = false);
    } else if (!locked) {
        locked = true;
        zoomed = false;
        $(".topnav").animate({ top: "1.3%" });
        $(".footer").animate({ top: "93.3%" });
        $("#title").animate({ fontSize: "375%", top: "45%" });
        $("#demo").animate({ fontSize: "375%", top: "58%" }, "", () => locked = false);
    }
}).listen();
