var data = []

function filter(search) {
    return data.filter(streamer => {
        var name = streamer.channel.name
        return name.toLowerCase().includes(search.toLowerCase());
    })
}

function updateView(stuff) {
    var hNodesOff = "";
    var hNodesOn = "";
    var $twitchDiv = $("#twitchDiv");

    for (var i = 0; i < stuff.length; i++) {
        var streamer = stuff[i];

        if (streamer.stream) {
            var preview = streamer.stream.preview.medium;
            var status = streamer.stream.channel.status;
            var onName = streamer.stream.channel.display_name;
            if (status.length > 32) {
                status = status.slice(0, 33);
                status += "..."
            }
            hNodesOn = "<div class='onarea'><a href='https://www.twitch.tv/" + streamer[name] + "' target='_blank'><img src='" + preview + "' id='onlogo'><span class='twitchTitle'>" + onName +
                "</span></a><span class='line' id='onp'>online</span><p id='pstatus'>" + status + "</p></div>";
            $twitchDiv.prepend(hNodesOn);
        } else {
            hNodesOff = "<div class='offarea'><a href='https://www.twitch.tv/" + streamer.channel.name + "' target='_blank'><img src='" +
                streamer.channel.logo + "' id='offlogo'><span class='twitchTitle'>" + streamer.channel.display_name +
                "</span><span class='line' id='poff'>offline</span></div>";
            $twitchDiv.append(hNodesOff);
        }
        $(".offarea:last").after($(".closedarea"));
    }
    console.log(data)
}

function loadTwitch() {
    var search = $('input').val();
    var tCha = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "medrybw", "noobs2ninjas", "food", "brunofin", "comster404"];
    var tUrl = "https://api.twitch.tv/kraken/streams/";
    var cId = "?client_id=7l3od9sx1rsri9b30l2p9ddxibl0bk0";
    var $twitchDiv = $("#twitchDiv");
    var hNodesClosed = "";
    var closedLogo = "https://www.rulistings.com/Content/PlaceholderIcons/tv_placeholder.png"
    if (search) {
        tCha = tCha.filter(streamer => streamer.toLowerCase().includes(search.toLowerCase()));
    }
    $.map(tCha, function(val, ind) {
        $.getJSON(tUrl + val + cId, function(result) {
            if (result.stream === null) { // result.stream
                $.getJSON("https://api.twitch.tv/kraken/channels/" + val + cId, function(response) {
                    var streamer = {
                        stream: null,
                        channel: response
                    }
                    data.push(streamer);
                    updateView([streamer]);
                })
            } else {
                var streamer = {
                    stream: result.stream,
                    channel: result.stream.channel
                }
                data.push(streamer);
                updateView([streamer])
            }

        }).fail(function() {
            hNodesClosed = "<div class='closedarea'><a href='https://www.twitch.tv/" + val + "' target='_blank'><img src='" + closedLogo + "' id='closedlogo'><span class='twitchTitle'>" + val +
                "</span><span class='line' id='pclosed'>channel closed</span></div>";
            $twitchDiv.append(hNodesClosed);
        })
    })
}
loadTwitch();
$("#all").click(function() {
    $(".onarea").show();
    $(".offarea").show();
    $(".closedarea").show();
})
$("#on").click(function() {
    $(".offarea").hide();
    $(".onarea").show();
    $(".closedarea").hide();
})
$("#off").click(function() {
    $(".onarea").hide();
    $(".offarea").show();
    $(".closedarea").show();
})

$("#twitchSearch").on("input", function() {
    $("#twitchDiv").empty();
    var search = $(this).val()
    updateView(filter(search));
});
