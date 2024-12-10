export const customStyles = (field, invalid) => ({
  control: (base, state) => ({
    ...base,
    borderColor:
      !field && invalid
        ? "#f33a58"
        : state.isFocused
        ? "var(--primary-color)"
        : "#b3b3b3",
    "&:hover": {
      borderColor: "var(--primary-color)",
    },
    boxShadow: state.isFocused ? "0 0 0 1px var(--primary-color)" : "none",
    minHeight: "40px",
  }),
});
