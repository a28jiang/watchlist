import moment from "moment";

export const dateFromNow = (myDate) => {
  const date = moment(myDate).add;
  const today = moment().endOf("day");
  const tomorrow = moment().add(1, "day").endOf("day");

  if (date < today) return "Today";
  if (date < tomorrow) return "Tomorrow";
  else return moment(myDate).fromNow();
};
