var isFormValid = true;
$(function() {
  var a = $("#is_foreign").val();
  if (a == "1") {
    $("#emailInput").blur(function() {
      var c = $("#emailInput").val();
      $("#genEmail").remove();
      if (!validateEmail(c)) {
        var b = $("#emailInput").attr("data-message");
        $("#emailInput").after(
          '<label id="genEmail" for="email" generated="true" class="error">' +
            b +
            "</label>"
        );
        setSubmit("disable");
        isFormValid = false;
      } else {
        setSubmit("enable");
      }
      var d = c.toLowerCase();
      var e = $("#ezbooking-email")
        .val()
        .toLowerCase();
      if (e.length > 0) {
        verifEmailConfirm(d, e);
      }
    });
    $("#ezbooking-email").blur(function() {
      var b = $("#emailInput")
        .val()
        .toLowerCase();
      var c = $("#ezbooking-email")
        .val()
        .toLowerCase();
      verifEmailConfirm(b, c);
    });
    $("#number_agdrefInput,#end_date_validityInput").blur(function() {
      $("#genAgdref").remove();
      var c = $("#ezplanning-verification").attr("href");
      var h = $("#number_agdrefInput").val();
      h = h.replace(/\D+/g, "");
      $("#number_agdrefInput").val(h);
      console.log("agdref = " + h.length);
      var b = $("#end_date_validityInput").val();
      var g = h.substring(1, h.length);
      var e = h[0].toUpperCase();
      if (
        (isNaN(h) && e != "F" && h.length >= 10) ||
        (e == "F" && isNaN(g)) ||
        (h.length == 9 && isNaN(h))
      ) {
        var d = $("#number_agdrefInput").attr("data-message");
        $("#number_agdrefInput").after(
          '<label id="genAgdref" for="number_agdrefInput" generated="true" class="error">' +
            d +
            "</label>"
        );
        setSubmit("disable");
        isFormValid = false;
      } else {
        if (h && h.length != 9 && h.length != 10) {
          var f = $("#number_agdrefInput").attr("data-length-message");
          $("#number_agdrefInput").after(
            '<label id="genAgdref" for="number_agdrefInput" generated="true" class="error">' +
              f +
              "</label>"
          );
          setSubmit("disable");
          isFormValid = false;
        } else {
          if (h.length == 10 || h.length == 9) {
            if (b.length > 0) {
              verifAGDREF(h, b, c);
            }
          } else {
            setSubmit("enable");
          }
        }
      }
    });
  }
});
function setSubmit(a) {
  if (a == "enable") {
    $("#nextButton").removeAttr("disabled");
  } else {
    if (a == "disable") {
      $("#nextButton").attr("disabled", "disabled");
    }
  }
}
function verifAGDREF(c, a, b) {
  jQuery.ajax({
    url: b,
    type: "POST",
    data: { number_agdref: c, validity: a },
    beforeSend: function() {
      $("#agdrefLoader").show();
    },
    success: function(g) {
      $("#agdrefLoader").hide();
      if (g) {
        var d = g.split(";");
        var e = d[0];
        var f = d[1];
        if (e && f) {
          $("#genAgdref").remove();
          $("#gendateValidity").remove();
          if (e == "number_agdref") {
            $("#genAgdref").remove();
            $("#number_agdrefInput").after(
              '<label id="genAgdref" for="number_agdrefInput" generated="true" class="error">' +
                f +
                "</label>"
            );
          } else {
            if (e == "end_date_validity") {
              $("#gendateValidity").remove();
              $("#end_date_validityInput").after(
                '<label id="gendateValidity" for="end_date_validityInput" generated="true" class="error">' +
                  f +
                  "</label>"
              );
            }
          }
          setSubmit("disable");
          isFormValid = false;
        } else {
          setSubmit("enable");
        }
      }
    },
    failure: function() {
      console.log("failed! =");
    }
  });
}
function validateEmail(a) {
  var b = new RegExp(
    "^[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$",
    "i"
  );
  if (b.test(a)) {
    return true;
  } else {
    return false;
  }
}
function verifEmailConfirm(a, c) {
  $("#genEmailConf").remove();
  if (a != c) {
    var b = $("#ezbooking-email").attr("data-message");
    $("#ezbooking-email").after(
      '<label id="genEmailConf" for="ezbooking-email" for="email" generated="true" class="error">' +
        b +
        "</label>"
    );
    setSubmit("disable");
    isFormValid = false;
  } else {
    setSubmit("enable");
  }
}
