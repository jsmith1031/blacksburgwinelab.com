function fixImage(size, image){
    var height = image.height;
    console.log("Image Size:" & size & "Image height:" & height);

}
function newPage(id){
  var ids = ["main_page", "food_page", "reservation_page", "wine_page", "party_page", "contact_page"];
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
function checkDate(TempDate){
  var inputDate = new Date(TempDate);
  var today = new Date();
  var valid_Date = true;
  if(inputDate < today){
    valid_Date = false;
  }
  return valid_Date;
}
function submitReservation(){
  try{
    var name = document.getElementById("name").value;
    
    var email = document.getElementById("email").value;
    
    var phone = document.getElementById("phone").value;
    
    var party = document.getElementById("size").value;
    
    var date = document.getElementById("date").value;
    console.log(date);
    if(checkDate(date) === false){
      alert("Please enter a date in the future");
    }else{
      alert("Reservation placed for " + name + " on " + date);
    }
  }catch(TypeError){
    alert("Please fill out all of the forms");
    console.log(" Name ", name, " Email ", email, " Phone ", phone, " Seats ", party, " Date ", date);
  }
}
function resturantOpen(time, date){
  var inputDate = new Date(date);
  var day = inputDate.getDay();
  var inputTime = new Date();
  var pieces = time.split(':');
  inputTime.setHours(parseInt(pieces[0]),parseInt(pieces[1]), 0);
  //var opentimes = [new Date(10:00:00), new Date(16:00:00), new Date(20:00:00)];
  //var closetimes = [new Date(21:00:00), new Date()];
  if (day === 6){
    var opentime = new Date();
    opentime.setHours(10,00,0);
    var closetime = new Date();
    closetime.setHours(21,00,0);
    console.log(time, inputTime, opentime, closetime);
    if((inputTime >= opentime) & (inputTime <= closetime)){
      return true;
    }else{
      return false;
    }
  }else if (day >= 0 & day < 4){
    var opentime = new Date();
    opentime.setHours(16,00,0);
    var closetime = new Date();
    closetime.setHours(22,00,0);
    console.log(time, inputTime, opentime, closetime);
    if((inputTime >= opentime) & (inputTime <= closetime)){
      return true;
    }else{
      return false;
    }
  }else{
    var opentime = new Date();
    opentime.setHours(12,00,0);
    var closetime = new Date();
    closetime.setHours(23,00,0);
    console.log(time, inputTime, opentime, closetime);
    if((inputTime >= opentime) & (inputTime <= closetime)){
      return true;
    }else{
      return false;
    }
  }
  return true;
}
function regularReservation(){
  try{
    var name = document.getElementById("res_name").value;
    var email = document.getElementById("res_email").value;
    var phone = document.getElementById("res_phone").value;
    var party = document.getElementById("res_size").value;
    var date = document.getElementById("res_date").value;
    var time = document.getElementById("res_time").value;
    if(checkDate(date) === false){
      alert("Please enter a date in the future");
    }else if(resturantOpen(time, date) === false){
      alert("Make sure the reservation time is set for when the resturant is open");
    }else{
      alert("Reservation placed for " + name + " on " + date + " at " + time);
    }
  }catch(TypeError){
    alert("Please fill out all of the forms");
    console.log(" Name ", name, " Email ", email, " Phone ", phone, " Seats ", party, " Date ", date, " Time ", time);
  }
}