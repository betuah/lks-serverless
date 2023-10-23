import { defineStore } from "pinia";

const websocket_url = `${import.meta.env.VITE_WEBSOCKET_URL}`;

export const useWebsocket = defineStore("websocketStore", {
   state: () => ({
      socket: null,
      isConnected: false,
      connectionId: null,
      message: "",
   }),
   actions: {
      connect() {
         if (this.socket == null) {
            this.socket = new WebSocket(websocket_url);
         }

         this.socket.onopen = () => {
            console.log("Websocket connection open")
            this.isConnected = true;

            this.getConnectionId()
         }

         this.socket.onmessage = (event) => {
            try {
               const data = JSON.parse(event.data)

               if (data.connectionId) {
                  this.connectionId = data.connectionId

                  if (data.status) {
                     this.message = data.status
                  }
               } else {
                  console.log('Received message:', data)
               }
            } catch (e) {
               console.log('Received message:', event.data)
            }
         }
   
         this.socket.onclose = () => {
            console.log('WebSocket connection closed')
         }
      },
      getConnectionId() {
         const rawMessage = {
            action: "getConnectionId",
         }
         this.socket.send(JSON.stringify(rawMessage))
      },
      privateMessage(message, targetId) {
         if (this.socket && this.isConnected) {
            const rawMessage = {
               action: "sendMessage",
               message,
               targetId,
            }
            this.socket.send(JSON.stringify(rawMessage))
         }
      },
      broadcastMessage(message) {
         if (this.socket && this.isConnected) {
            const rawMessage = {
               action: "broadcastMessage",
               message,
            }
            this.socket.send(JSON.stringify(rawMessage))
         }
      },

      disconnect() {
         if (this.isConnected) {
            this.isConnected = false;
            this.connectionId = null;
            this.socket.close()
         }
      }
   },
});
