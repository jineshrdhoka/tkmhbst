
$(document).ready(function () {
  $.getJSON("data.json", function (data) {
    var rows = "";
    data.forEach(function (item) {
      rows += "<tr>";
      rows += "<td>" + item.Date + "</td>";
      rows += "<td>" + item.name + "</td>";
      rows += "<td>" + item.gotra + "</td>";
      rows += "<td>" + item.phone + "</td>";
      rows += "<td>" + item.whatsapp + "</td>";
      rows += "<td>" + item.native + "</td>";
      rows += "<td>" + item.dob + "</td>";
      rows += "<td>" + item.email + "</td>";
      rows += "<td>" + item.blood + "</td>";
      rows += "<td>" + item.qualification + "</td>";
      rows += "<td>" + item.father_fname + " " + item.father_lname + "</td>";
      rows += "<td>" + item.mother_fname + " " + item.mother_lname + "</td>";
      rows += "<td>" + item.h_address + "</td>";
      rows += "<td>" + item.city + "</td>";
      rows += "<td>" + item.state + "</td>";
      rows += "<td>" + item.pincode + "</td>";
      rows += "<td>" + item.kishoremandal + "</td>";
      rows += "</tr>";
    });
    $("#directory tbody").html(rows);
    $("#directory").DataTable();
  });
});
