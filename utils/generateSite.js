import Cookies from "js-cookie";

export const generateSite = (formData) => {
  const { firstName, lastName, favourite1, favourite2, favourite3 } = formData;
  Cookies.set("netlifyPersonalise", JSON.stringify(formData));
};
