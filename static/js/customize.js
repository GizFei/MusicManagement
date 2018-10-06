window.onload = function(){
	"use strict";
    getListenBtns();
    showSongs("like", 0);
    $("[data-toggle='popover']").popover();
    $(".nav-item").click(function(){
        if(this.id == "like"){
            $("li#like a").addClass("active");
            $("li#dislike a").removeClass("active");
            showSongs("like", 0);
        }else{
            $("li#like a").removeClass("active");
            $("li#dislike a").addClass("active");
            showSongs("dislike", 0);
        }
    });
    $(".icon-play").click(function(){
        play_song(parseInt(this.getAttribute("data-index")));
    });
    
    $("audio").each(function(idx, elm){
        elm.addEventListener("ended", function(){
            $(".icon-play").eq(idx).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
            elm.removeEventListener("timeupdate");
            $(".song-time")[idx].innerHTML = secToTime(elm.duration);
        });
        elm.addEventListener("playing", function(){
            elm.addEventListener("timeupdate", function(){
                $(".song-time")[idx].innerHTML = secToTime(elm.currentTime);
            });
        });
        elm.addEventListener("loadedmetadata", function(){
            $(".song-time")[idx].innerHTML = secToTime(elm.duration);
        });
    });
    $(".btn-listen").click(function(){
        var url = "/play_" + this.getAttribute("data-song");
        window.location.href = url;
    });
};

window.onscroll = function(){
    if(pageYOffset > $("#song-content")[0].offsetTop){
        $("#nav-catalog").show();
    }else{
        $("#nav-catalog").hide();
    }
}

var current_catalog = "like";
var current_page = 0;   // from 0
var max_page = 1;
var data = null;

var getCardTexts = function(){
    var cardTexts = document.getElementsByClassName("card-text");
    return cardTexts;
}

var getListenBtns = function(){
    var listenBtns = document.getElementsByClassName("btn-listen");
//    for(var i = 0; i < listenBtns.length; i++){
//        listenBtns[i].innerHTML = "listen";
//    }
    return listenBtns;
}

var getImgs = function(){
    var imgs = document.getElementsByClassName("card-img-top");
    return imgs;
}

var getCards = function(){
    var cards = $(".p-3");
    // var cards = $(".song-card");
    return cards;
}

var initPagination = function(len){
    var pagination = $("#pagination")[0].innerHTML;
    var lis = Array();
    var pages = parseInt(len/9 + 1);
    max_page = pages;
    lis.push('<li class="page-item" id="prev"> <a class="page-link" href="javascript:;"> <span>«</span> <span class="sr-only">Previous</span> </a> </li>')
    for(var i = 0; i < pages; i++){
        lis.push('<li class="page-item" id="' + i + '"> <a class="page-link" href="javascript:;">' + (i+1) + '</a> </li>');
    }
    lis.push('<li class="page-item" id="next"> <a class="page-link" href="javascript:;"> <span>»</span> <span class="sr-only">Next</span> </a> </li>');
    //var page = pagination.replace(/\{lis\}/g, lis.join(""));
    $("#pagination")[0].innerHTML = lis.join("");
    $(".page-item").click(function(){
        if(this.id == "prev"){
            showSongs(current_catalog, current_page-1);
        }else if(this.id == "next"){
            showSongs(current_catalog, current_page+1);
        }else{
            var page = parseInt(this.id);
            //console.log(page);
            showSongs(current_catalog, page);
        } 
    });
}

var currentPage = function( pn ){
    if(pn < 0){
        pn = 0;
    }
    if( pn > max_page-1){
        pn = max_page-1;
    }
    current_page = pn;
    $(".page-item").each(function(index){
        if(index == pn+1){
            $(this).addClass("current");
        }else{
            $(this).removeClass("current");
        }
    });
}

// 根据index（页数）加载歌曲的封面和歌名
//var showSongs = function(catalog, index){
//    var imgs = getImgs();
//    var texts = getCardTexts();
//    var cards = getCards();
//    current_catalog = catalog;
//    
//    var requestURL = "static/songs/songs_data.json";
//    var request = new XMLHttpRequest();
//    request.open("GET", requestURL);
//    request.responseType = "json";
//    request.send();
//    request.onload = function(){
//        var data = request.response;
//        //console.log(data.like);
//        // 类别为Like
//        if(catalog == "like" || catalog == "Like"){
//            var like_data = data.like;
//            initPagination(like_data.length);
//            currentPage(index);
//            for(var i = 0; i < imgs.length; i++){
//                var data_idx = current_page * 9 + i;
//                /* 加载图片和文字 */
//                if(data_idx > like_data.length-1){
//                    cards[i].style.display = "none";
//                }else{
//                    cards[i].style.display = "block";
//                    imgs[i].src = like_data[data_idx].imgurl;
//                    texts[i].innerHTML = like_data[data_idx].songname;
//                    $(".singer-text")[i].innerHTML = like_data[data_idx].singername;
//                    $(".song-time")[i].innerHTML = secToTime(like_data[data_idx].songtime);
//                    $("audio")[i].src = like_data[data_idx].musicurl;
//                    $(".icon-play").eq(i).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
//                    $("audio")[i].load();
//                }
//            }
//        }else{ // 类别为Dislike
//            var dislike_data = data.dislike;
//            initPagination(dislike_data.length);
//            currentPage(index);
//            for(var i = 0; i < imgs.length; i++){
//                var data_idx = current_page * 9 + i;
//                /* 加载图片和文字 */
//                if(data_idx > dislike_data.length-1){
//                    cards[i].style.display = "none";
//                }else{
//                    cards[i].style.display = "block";
//                    imgs[i].src = dislike_data[data_idx].imgurl;
//                    texts[i].innerHTML = dislike_data[data_idx].songname;
//                    $(".singer-text")[i].innerHTML = dislike_data[data_idx].singername;
//                    $(".song-time")[i].innerHTML = secToTime(dislike_data[data_idx].songtime);
//                    $("audio")[i].src = dislike_data[data_idx].musicurl;
//                    $(".icon-play").eq(i).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
//                    $("audio")[i].load();
//                }
//            }
//        }
//    };
//}

var showSongs = function(catalog, index){
    if( data == null ){
//        console.log("data is null");
//        var requestURL = "static/songs/songs_data.json";
//        var request = new XMLHttpRequest();
//        request.open("GET", requestURL);
//        request.responseType = "json";
//        request.send();
//        request.onload = function(){
//            data = request.response;
//            console.log(data);
//            _ss();
//        };
        $.getJSON('static/songs/songs_data.json', function(d){
            data = d;
            _ss(catalog, index);
        })
    }else{
        _ss(catalog, index);
    }
}
    
var _ss = function(catalog, index){
    var imgs = getImgs();
    var texts = getCardTexts();
    var cards = getCards();
    current_catalog = catalog;
    
    if(catalog == "like" || catalog == "Like"){
            //console.log(data.like);
            // 类别为Like
            var like_data = data.like;
            initPagination(like_data.length);
            currentPage(index);
            for(var i = 0; i < imgs.length; i++){
                var data_idx = current_page * 9 + i;
                /* 加载图片和文字 */
                if(data_idx > like_data.length-1){
                    cards[i].style.display = "none";
                }else{
                    cards[i].style.display = "block";
                    imgs[i].src = like_data[data_idx].imgurl;
                    texts[i].innerHTML = like_data[data_idx].songname;
                    $(".singer-text")[i].innerHTML = like_data[data_idx].singername;
                    $(".song-time")[i].innerHTML = secToTime(like_data[data_idx].songtime);
                    $("audio")[i].src = like_data[data_idx].songurl;
                    $(".icon-play").eq(i).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
                    var ds = "like_" + like_data[data_idx].serial;
                    $(".btn-listen")[i].setAttribute("data-song", ds);
                    $("audio")[i].load();
                }
            }
        }else{ // 类别为Dislike
            var dislike_data = data.dislike;
            initPagination(dislike_data.length);
            currentPage(index);
            for(var i = 0; i < imgs.length; i++){
                var data_idx = current_page * 9 + i;
                /* 加载图片和文字 */
                if(data_idx > dislike_data.length-1){
                    cards[i].style.display = "none";
                }else{
                    cards[i].style.display = "block";
                    imgs[i].src = dislike_data[data_idx].imgurl;
                    texts[i].innerHTML = dislike_data[data_idx].songname;
                    $(".singer-text")[i].innerHTML = dislike_data[data_idx].singername;
                    $(".song-time")[i].innerHTML = secToTime(dislike_data[data_idx].songtime);
                    $("audio")[i].src = dislike_data[data_idx].songurl;
                    $(".icon-play").eq(i).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
                    var ds = "dislike_" + dislike_data[data_idx].serial;
                    $(".btn-listen")[i].setAttribute("data-song", ds);
                    $("audio")[i].load();
                }
            }
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

// idx: 0-8
var play_song = function( idx ){
    $("audio").each(function( index, element ){
        if(idx == index){
           if(element.paused){
            //console.log("play");
                element.play();
                $(".icon-play").eq(index).addClass("fa-pause-circle-o").removeClass("fa-play-circle-o");
            }else{
            //console.log("pause");
                element.pause();
                $(".icon-play").eq(index).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
            }
        }else{
            element.load();
            $(".icon-play").eq(index).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
        }
    });
//    var audio = $("audio")[idx];
//    if(audio.paused){
//        //console.log("play");
//        audio.play();
//        $(".icon-play").eq(idx).addClass("fa-pause-circle-o").removeClass("fa-play-circle-o");
//    }else{
//        //console.log("pause");
//        audio.pause();
//        $(".icon-play").eq(idx).removeClass("fa-pause-circle-o").addClass("fa-play-circle-o");
//    }
}












