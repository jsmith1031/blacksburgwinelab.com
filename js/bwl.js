function fixImage(size, image){
    var height = image.height;
    console.log("Image Size:" & size & "Image height:" & height);

}
function newPage(id){
  var ids = ["main_page", "menu_page", "reservation_page", "region_page", "party_page", "contact_page"];
  var a = document.getElementById("main_page");
  for (i = 0; i < ids.length; i++) {
    var temp = document.getElementById(ids[i]);
    if (temp === id){
      temp.style.display = "block";
      console.log(temp);
    } else {
      temp.style.display = "none";
    }
  }
  console.log(id);
}
/*
function loadingElement() {
    var a = document.getElementById("main_page");
    var b = document.getElementById("menu_page");
    var c = document.getElementById("region_page");
    var d = document.getElementById("reservation_page");
    var e = document.getElementById("party_page");
    if (a.style.display === "none") {
      a.style.dizsplay = "block";
      b.style.display = "none";
      c.style.display = "none";
      d.style.display = "none";
      e.style.display = "none";
    } else {
      a.style.display = "none";
      b.style.display = "block";
      c.style.display = "block";
    }
  }*/
//document.getElementById("imageOne").src = "https://i.redd.it/yw09nlyl9lt31.jpg";
/*
function swap(){
    if(document.getElementById("image").src=="https://i.redd.it/yw09nlyl9lt31.jpg"){
        document.getElementById("image").src="https://i.redd.it/06ozylnfmm521.jpg";
    }else{
        document.getElementById("image").src="https://i.redd.it/yw09nlyl9lt31.jpg";
    }
}



function DisplayImages(picture1){
    document.write("<div class='slideshow'>",
     "<ul>",
       "<li>",
        "<img src=\"", picture1,"\">",          
         "<div>",
            "<a href=\"", picture1, "\" title='Click to see full image' target='_blank'>",
               "<img src=\"", picture1, "\" alt='Item 1' />",
           "</a>",
           "<p>'This is Item 1' </p>",
       "</div></li>",
       "</ul>",
      "</div>");
}
DisplayImages('https://scontent-iad3-1.cdninstagram.com/vp/78306ad799579ebbee6f172219657a71/5E5F1F8B/t51.2885-15/e35/s1080x1080/75225431_104058727653343_3757438024330105046_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=102');
*/