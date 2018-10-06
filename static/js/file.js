window.onload = function(){
    $("input")[0].onchange = function(){
        $("p.msg")[0].innerHTML = "";
        if(this.files[0].length == 0){
            $(".filename")[0].innerHTML = "未选择文件";
            return;
        }
        $(".filename")[0].innerHTML = this.files[0].name;
        
        var showreader = new FileReader();
        showreader.onload = function( e ){
            $(".src-img")[0].src = e.target.result;
        }
        showreader.readAsDataURL(this.files[0]);
    }
}