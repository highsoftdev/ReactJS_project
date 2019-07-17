export const UTILS = {
  logout: function () {
  	  	 localStorage.removeItem("rememberdObject");

    localStorage.removeItem("userObject");
  }
};