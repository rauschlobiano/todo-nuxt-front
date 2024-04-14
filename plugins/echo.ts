import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// declare global {
//   interface Window {
//     Pusher:any;
//     Echo:any;
//   }
// }

export default defineNuxtPlugin(() => {
  // window.Pusher = Pusher
  // window.Echo = new Echo({
  //   broadcaster: 'pusher',
  //   key: 'd6f4222c2fc83590e257',
  //   wsHost: 'localhost',
  //   wsPort: 8000,
  //   cluster: 'ap1',
  //   forceTLS: false
  // })
})