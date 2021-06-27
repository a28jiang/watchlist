import useMediaQuery from "@material-ui/core/useMediaQuery";

export const MedAndUp = ({ children }) => {
  const matches = useMediaQuery("(min-width:800px)");
  return matches && children;
};
