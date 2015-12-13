$(init)

function init(){
  ajaxCall('http://localhost:3000/api', 'get')
}

function printFunction(data, sort){
  var ol = $('#programList')
  var i = 0;

  var array = data.content;

  function SortByName(a, b){
    var aValue = a.network.toLowerCase();
    var bValue = b.network.toLowerCase(); 
    return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
  }

  array.sort(SortByName); 

  for(i;i<data.content.length;i++){
    ol.append(
      "<li>" + 
      "<p>" + data.content[i].network + "<p>" +
      "<p>" + data.content[i].title + "<p>" +
      "<a href='" + data.content[i].url + "'target='_blank'>" + 
      "<img src='" + data.content[i].image + "'>" + "</a>" +
    
      "</li>"  
      )
  }

}





function ajaxCall(url, method){
  $.ajax({
    url: url,
    method: method
  }).done(function(data) {
    printFunction(data)
  });
}