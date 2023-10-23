import { defineStore } from "pinia";

export const useNotifStore = defineStore("notifStore", {
   state: () => ({
      type: "", // Alert or Toast
      message: "",
      status: "", // Success, warning, error, info
      visible: false,
   }),
   actions: {
      setAlert(status, message, show) {
         this.type = "alert";
         this.status = status;
         this.message = message;
         this.visible = show;
      },
      setSnackbar(status, message, show) {
         this.type = "snackbar";
         this.status = status;
         this.message = message;
         this.visible = show;
      },
      hide() {
         this.visible = false;
      },
   },
});
