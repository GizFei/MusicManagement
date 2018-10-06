window.onload = function(){
    current_catalog = $("p#catalog").text();
    current_song = $("p#serial").text();
    $.getJSON('/static/songs/songs_data.json', function(d){
        data = d;
        init_song();
    });
    
    $(".fa-step-forward").click(function(){
//        if(parseInt(current_song) == data[current_catalog].length-1){
//            alert("这是最后一首歌。");
//        }else{
//            window.location.href = "/play_" + current_catalog + "_" + String(parseInt(current_song)+1);
//        }
        if(parseInt(current_song) == data[current_catalog].length-1){
            confirm("这是最后一首歌。");
        }else{
            current_song = parseInt(current_song)+1;
            init_song();
            play_song();
        }
    });
    $(".fa-play").click(function(){
        play_song();
    });
    $(".fa-step-backward").click(function(){
//        if(parseInt(current_song) == 0 ){
//            alert("这是第一首歌。");
//        }else{
//            window.location.href = "/play_" + current_catalog + "_" + String(parseInt(current_song-1));
//        }
        if(parseInt(current_song) == 0){
            confirm("这是第一首歌。");
        }else{
            current_song = parseInt(current_song)-1;
            init_song();
            play_song();
        }
    });
    
    audio.addEventListener("ended", function(){
        $(".fa").eq(1).addClass("fa-play").removeClass("fa-pause");
        $(".slider")[0].value = 0;
        $("span#ct")[0].innerHTML = secToTime(0);
        $(".slider").css("background", "#CCC");
        $(".fa-step-forward").click();
    });
    audio.addEventListener("playing", function(){
            audio.addEventListener("timeupdate", function(){
                if(!slider_change){
                    var radio = audio.currentTime / audio.duration;
                    $(".slider")[0].value = parseInt(radio * 400);
                    var color = "linear-gradient(to right, white, white "+ parseInt(radio*100) + "%, #CCC " + parseInt(radio*100) + "%, #CCC)";
                    $(".slider").css("background", color);
                    $("span#ct")[0].innerHTML = secToTime(audio.currentTime);
                    mark_active_lrc(audio.currentTime);
                }
            });
    });
    audio.addEventListener("loadedmetadata", function(){
        $("span#tt")[0].innerHTML = secToTime(audio.duration);
        $("span#ct")[0].innerHTML = secToTime(0);
    });
    
    $(".slider")[0].oninput = function(){
        slider_change = true;
        var radio = parseInt(this.value/400 * 100);
        var color = "linear-gradient(to right, white, white "+ radio + "%, #CCC " + radio + "%, #CCC)";
        $(".slider").css("background", color);
        $("span#ct")[0].innerHTML = secToTime(this.value/400 * audio.duration);
    }

    $(".slider")[0].onchange = function(){
        slider_change = false;
        audio.currentTime = this.value/400 * audio.duration;
        var radio = parseInt(this.value/400 * 100);
        var color = "linear-gradient(to right, white, white "+ radio + "%, #CCC " + radio + "%, #CCC)";
        $(".slider").css("background", color);
        audio.play();
        $(".fa").eq(1).removeClass("fa-play").addClass("fa-pause");
    };
}

var data = null;
var current_catalog, current_song;
var audio = $("audio")[0];
var slider_change = false;
var lrc_time = [];
var current_lyric = 0;

var init_song = function(){
    if(current_catalog == "like" || current_catalog == "Like"){
        var song = data.like[current_song];
        $(".card-text")[0].innerHTML = song.songname;
        $(".singer-text")[0].innerHTML = song.singername;
        $(".card-img-top")[0].src = song.imgurl;
        $("audio")[0].src = song.songurl;
    }else{
        var song = data.dislike[current_song];
        $(".card-text")[0].innerHTML = song.songname;
        $(".singer-text")[0].innerHTML = song.singername;
        $(".card-img-top")[0].src = song.imgurl;
        $("audio")[0].src = song.songurl;
    }
    audio.load();
    init_lyric();
}

var init_lyric = function(){
    current_lyric = 0;
    var songname = data[current_catalog][current_song].songname;
    var requestUrl = "static/songs/" + current_catalog + "/" + songname + "/" + songname + ".txt";
    var orgRU = "static/songs/" + current_catalog + "/" + songname + "/" + songname + "_o.txt";
    $.get(requestUrl, function(data){
        data = data.split("\n");
        //console.log(data);
        var ps = []
        for(var i = 0; i < data.length; i++){
            ps.push("<p class='lead my-1'>"+data[i]+"</p>");
        }
        $("div.lyric")[0].innerHTML = ps.join("");
        $("div.lyric > p").css("transform", "translatey(250px)");
    });
    $.get(orgRU, function(d){
        d = d.split("\n");
        lrc_time = [];
        for(var i = 0; i < d.length; i++){
            var x = d[i].match(/^\[.*\]/)[0];
            lrc_time.push(x);
        }
        //console.log(lrc_time);
    });
}

var mark_active_lrc = function( time ){
    var offset = "[offset:0]";
    var idx = 0;
    for(var i = lrc_time.indexOf(offset)+1; i < lrc_time.length; i++){
        lrc_time[i] = lrc_time[i].replace("[", "").replace("]","");
        var min = parseInt(lrc_time[i].split(":")[0]);
        var sec = parseFloat(lrc_time[i].split(":")[1]);
        var t = min * 60 + sec;
        idx = i;
        //console.log(t);
        if(t > time)
            break;
    }
    if(i == lrc_time.length)
        idx = i;
    idx -= 1;
    //console.log(idx);
    if(idx != current_lyric){
        current_lyric = idx;
//        var ty = 250 - idx * 31;
        $("div.lyric > p").removeClass("active");
        $("div.lyric > p").eq(idx).addClass("active");
        $("div.lyric > p").css("transform", "translatey(" + (-idx*37+250) + "px)");
    }
}

var play_song = function(){
    var elm = $("audio")[0];
    if(elm.paused){
        elm.play();
        $(".fa").eq(1).removeClass("fa-play").addClass("fa-pause");
    }else{
        elm.pause();
        $(".fa").eq(1).addClass("fa-play").removeClass("fa-pause");
    }
}

var secToTime = function( sec ){
    var min = parseInt(sec/60);
    if(min >= 10){
        min = String(min);
    }else{
        min = "0"+String(min);
    }
    var second = parseInt(sec - min * 60);
    if(second >= 10){
        second = String(second);
    }else{
        second = "0"+String(second);
    }
    return (min + ": " + second);
}