

const room = 'ROOM1';

export default defineWebSocketHandler({
   open(peer) {
      console.log('WS OPEN:', peer);
      peer.subscribe(room);
      peer.publish(room, `Another user entered ${room}`);
   },
   close(peer) {
      console.log('WS CLOSE: ', peer);
   },
   error(peer, error) {
      console.log('WS ERROR', peer, error);
   },
   message(peer, message) {
      console.log('WS MESSAGE: ', peer, message);
      peer.publish(room, message.text());
   }
})