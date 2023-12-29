$(document).ready(function () {
    $('#logout').click(function () {
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('token'); 
        localStorage.removeItem('userEmail'); 
        location.href = '/Evaluationtask/index.html'
      }
    });
  });