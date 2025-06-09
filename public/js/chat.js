const socket = io();
document.querySelector('form').onsubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('m');
  socket.emit('chat message', input.value);
  input.value = '';
  return false;
};
socket.on('chat message', function(msg){
  const li = document.createElement('li');
  li.textContent = msg;
  document.getElementById('messages').appendChild(li);
});
